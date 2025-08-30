import { Request, Response, NextFunction } from 'express';
import Post from '../schemas/post.js';
import { Types } from 'mongoose';
import { deleteImageFile, saveImageFile } from '../services/file.service.js';
import CustomError from '../utils/customError.js';
import Image from '../schemas/image.js';

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // 클라이언트에서 넘어온 정보들을 req.body에서 가져오기
    const { title, content, category, images, tags, status } = req.body;
    const userId = req.user!.userId;

    if (!title || !content || !category) {
      return next(new CustomError('필수 입력 항목이 누락되었습니다.', 400));
    }

    const imageIds: Types.ObjectId[] = [];
    if (images && images.length > 0) {
      for (const image of images) {
        imageIds.push(image);
      }
    } else {
      let defaultImage;
      defaultImage = await Image.findOne({
        url: 'http://localhost:4000/images/default-post-image.jpg',
      });
      if (defaultImage) {
        imageIds.push(defaultImage._id);
      } else {
        defaultImage = new Image({ author: userId });
        await defaultImage.save();
        imageIds.push(defaultImage._id);
      }
    }

    // 새로운 포스트 생성
    const newPost = new Post({
      title,
      content,
      category,
      images: imageIds,
      tags,
      author: userId,
      status,
      expireAt:
        status === 'draft'
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          : null,
    });

    // DB에 저장하기
    await newPost.save();

    const populatedPost = await Post.findById(newPost._id)
      .populate('category', 'name')
      .populate('author', '-password -username -bio')
      .populate('images', 'url')
      .exec();

    if (!populatedPost) {
      return next(new CustomError('게시글을 찾을 수 없습니다.', 404));
    }

    // 클라이언트에게 응답
    res.status(201).json(populatedPost);
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({})
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('category', 'name')
      .populate('author', '-password -username -bio')
      .populate('images', 'url')
      .exec();

    const totalPosts = await Post.countDocuments();

    res.status(200).json({
      posts,
      totalPosts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
    });
  } catch (error) {
    next(error);
  }
};

export const getPostById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id)
      .populate('category', 'name')
      .populate('author', '-password -username -bio')
      .populate('images', 'url')
      .exec();

    if (!post) {
      return next(new CustomError('포스트를 찾을 수 없습니다.', 404));
    }

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

export const getPostByUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user!.userId;
  const page = parseInt(req.query.page as string) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const userPosts = await Post.find({ author: userId })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .populate('category', 'name')
    .populate('author', '-password -username -bio')
    .populate('images', 'url')
    .exec();

  const totalPosts = await Post.countDocuments({ author: userId });

  res.status(200).json({
    posts: userPosts,
    totalPosts,
    currentPage: page,
    totalPages: Math.ceil(totalPosts / limit),
  });
};

export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { title, content, category, images, tags } = req.body;
    const userId = req.user!.userId;

    if (!title || !content || !category) {
      return next(new CustomError('필수 입력 항목이 누락되었습니다.', 400));
    }

    const existPostById = await Post.findById(id);
    if (!existPostById) {
      return next(new CustomError('게시글을 찾을 수 없습니다.', 404));
    }

    const existPostByAuthor = await Post.findOne({ _id: id, author: userId });
    if (!existPostByAuthor) {
      return next(new CustomError('수정 권한이 없습니다.', 403));
    }

    const imageIds: Types.ObjectId[] = [];
    if (images && images.length > 0) {
      for (const image of images) {
        imageIds.push(image._id);
      }
    } else {
      let defaultImage;
      defaultImage = await Image.findOne({
        url: 'http://localhost:4000/images/default-post-image.jpg',
      });
      if (defaultImage) {
        imageIds.push(defaultImage._id);
      } else {
        defaultImage = new Image({ author: userId });
        await defaultImage.save();
        imageIds.push(defaultImage._id);
      }
    }

    const updatedPost = await Post.findByIdAndUpdate(
      { _id: id, author: userId },
      {
        title,
        content,
        category,
        images: imageIds,
        tags,
        updatedAt: new Date(Date.now()),
      },
      { new: true, runValidators: true },
    )
      .populate('category', 'name')
      .populate('author', '-password -username -bio')
      .populate('images', 'url')
      .exec();

    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    const deletedPost = await Post.findByIdAndDelete({
      _id: id,
      author: userId,
    });

    if (!deletedPost) {
      const postExists = await Post.findById(id);
      if (!postExists) {
        return next(new CustomError('게시글을 찾을 수 없습니다.', 404));
      } else {
        return next(new CustomError('삭제 권한이 없습니다.', 403));
      }
    }

    const imageToDelete = deletedPost.images;
    if (imageToDelete && imageToDelete.length > 0) {
      await deleteImageFile(imageToDelete);
    }

    // 응답 본문 없이 204 No Content
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const getDraftPosts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user!.userId;

  const draftPosts = await Post.find({ author: userId, status: 'draft' })
    .sort({ createdAt: -1 })
    .populate('category', 'name')
    .populate('author', '-password -username -bio')
    .populate('images', 'url')
    .exec();

  if (!draftPosts) {
    return next(new CustomError('임시 저장 된 게시글이 없습니다.', 404));
  }

  res.status(200).json(draftPosts);
};
