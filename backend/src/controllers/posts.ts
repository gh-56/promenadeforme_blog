import { Request, Response, NextFunction } from 'express';
import Post from '../schemas/post.js';

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 클라이언트에서 넘어온 정보들을 req.body에서 가져오기
    const { title, content, category, images, tags } = req.body;
    const userId = req.user!.userId;

    if (!title || !content || !category) {
      return res
        .status(400)
        .json({ message: '필수 입력 항목이 누락되었습니다.' });
    }

    // 새로운 포스트 생성
    const newPost = new Post({
      title,
      content,
      category,
      images,
      tags,
      author: userId,
    });

    // DB에 저장하기
    await newPost.save();

    // 클라이언트에게 응답
    res.status(201).json({
      message: '새로운 포스트가 생성되었습니다.',
      post: newPost,
    });
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const posts = await Post.find({});
    if (!posts || posts.length === 0) {
      res.status(200).json([]);
    }
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

export const getPostById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: '포스트를 찾을 수 없습니다.' });
    }
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { title, content, category, images, tags } = req.body;
    const userId = req.user!.userId;

    if (!title || !content || !category) {
      return res
        .status(400)
        .json({ message: '필수 입력 항목이 누락되었습니다.' });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      { _id: id, author: userId },
      {
        title,
        content,
        category,
        images,
        tags,
      },
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      const postExists = await Post.findById(id);
      if (!postExists) {
        return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
      } else {
        return res.status(403).json({ message: '수정 권한이 없습니다.' });
      }
    }

    res.status(200).json({
      message: '게시글이 성공적으로 수정되었습니다.',
      post: updatedPost,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
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
        return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
      } else {
        return res.status(403).json({ message: '삭제 권한이 없습니다.' });
      }
    }

    res.status(200).json({ message: '게시글이 성공적으로 삭제되었습니다.' });
  } catch (error) {
    next(error);
  }
};
