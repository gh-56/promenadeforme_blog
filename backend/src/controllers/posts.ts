import { Request, Response, NextFunction } from 'express';
import Post from '../schemas/post.js';
import { Types } from 'mongoose';
import { deleteImageFile } from '../services/file.service.js';
import CustomError from '../utils/customError.js';
import Image from '../schemas/image.js';
import Category from '../schemas/category.js';

const defaultPostImage = 'default-post-image.webp';

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
        hash: 'default-post-image-hash',
      });
      if (defaultImage) {
        imageIds.push(defaultImage._id);
      } else {
        defaultImage = new Image({
          hash: 'default-post-image-hash',
          url: `${process.env.GCLOUD_STORAGE_IMAGE_URL}/${process.env.GCLOUD_STORAGE_BUCKET}/${defaultPostImage}`,
          referenceCount: 999,
        });

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
      .populate({
        path: 'author',
        select: '-password -username -bio',
        populate: { path: 'profileImage', select: 'url' },
      })
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
      .populate({
        path: 'author',
        select: '-password -username -bio',
        populate: { path: 'profileImage', select: 'url' },
      })
      .populate('images', 'url')
      .exec();
    const totalPosts = await Post.countDocuments({ status: 'published' });

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
      .populate({
        path: 'author',
        select: '-password -username -bio',
        populate: { path: 'profileImage', select: 'url' },
      })
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
    .populate({
      path: 'author',
      select: '-password -username -bio',
      populate: { path: 'profileImage', select: 'url' },
    })
    .populate('images', 'url')
    .exec();

  const totalPosts = await Post.countDocuments({
    author: userId,
    status: 'published',
  });

  res.status(200).json({
    posts: userPosts,
    totalPosts,
    currentPage: page,
    totalPages: Math.ceil(totalPosts / limit),
  });
};

export const getPostsByCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { categoryName } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const category = await Category.findOne({ name: categoryName });
    if (!category) {
      return next(new CustomError('해당 카테고리를 찾을 수 없습니다.', 404));
    }

    const filter = { category: category._id, status: 'published' };

    const totalPosts = await Post.countDocuments(filter);
    const totalPages = Math.ceil(totalPosts / limit);

    const posts = await Post.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('category', 'name')
      .populate({
        path: 'author',
        select: '-password -username -bio',
        populate: { path: 'profileImage', select: 'url' },
      })
      .populate('images', 'url')
      .exec();

    res.status(200).json({
      posts,
      totalPosts,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { title, content, category, images, tags, deletedImages } = req.body;
    const userId = req.user!.userId;

    if (!title || !content || !category) {
      return next(new CustomError('필수 입력 항목이 누락되었습니다.', 400));
    }

    const postToUpdate = await Post.findOne({ _id: id, author: userId });
    if (!postToUpdate) {
      return next(
        new CustomError('게시글을 찾을 수 없거나 수정 권한이 없습니다.', 404),
      );
    }

    if (images.length < 1) {
      const defaultImage = await Image.findOne({
        hash: 'default-post-image-hash',
      });
      if (defaultImage) {
        images.push(defaultImage._id);
      }
    }

    if (deletedImages && deletedImages.length > 0) {
      await deleteImageFile(deletedImages);
    }

    postToUpdate.title = title;
    postToUpdate.content = content;
    postToUpdate.category = category;
    postToUpdate.images = images;
    postToUpdate.tags = tags;

    const updatedPost = await postToUpdate.save();

    await updatedPost.populate([
      { path: 'category', select: 'name' },
      {
        path: 'author',
        select: '-password -username -bio',
        populate: { path: 'profileImage', select: 'url' },
      },
      { path: 'images', select: 'url' },
    ]);
    // const updatedPost = await Post.findByIdAndUpdate(
    //   { _id: id, author: userId },
    //   {
    //     title,
    //     content,
    //     category,
    //     images,
    //     tags,
    //     updatedAt: new Date(Date.now()),
    //   },
    //   { new: true, runValidators: true },
    // )
    //   .populate('category', 'name')
    //   .populate({
    //     path: 'author',
    //     select: '-password -username -bio',
    //     populate: { path: 'profileImage', select: 'url' },
    //   })
    //   .populate('images', 'url')
    //   .exec();

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
    .populate({
      path: 'author',
      select: '-password -username -bio',
      populate: { path: 'profileImage', select: 'url' },
    })
    .populate('images', 'url')
    .exec();

  if (!draftPosts) {
    return next(new CustomError('임시 저장 된 게시글이 없습니다.', 404));
  }

  res.status(200).json(draftPosts);
};
