import { Request, Response, NextFunction } from 'express';
import Post from '../schemas/post.js';

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 클라이언트에서 넘어온 정보들을 req.body에서 가져오기
    const { title, content, images, thumbnail, tags, author } = req.body;

    // 새로운 포스트 생성
    const newPost = new Post({
      title,
      content,
      images,
      thumbnail,
      tags,
      author,
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
