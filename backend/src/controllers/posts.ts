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
