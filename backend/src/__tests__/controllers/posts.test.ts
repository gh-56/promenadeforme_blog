import { Request, Response, NextFunction } from 'express';
import Post from '../../schemas/post.js';
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} from '../../controllers/posts.js';

afterEach(() => {
  jest.restoreAllMocks();
});
describe('createPost', () => {
  describe('제목, 내용, 카테고리 정보 중 하나라도 넘어오지 않았다면 400 상태코드를 반환한다', () => {
    test('제목 없이 글을 생성하려는 경우', async () => {
      const req = {
        body: {
          title: '',
          content: 'test content',
          category: 'test category',
          images: ['test'],
          tags: ['test'],
        },
        user: {
          userId: '1',
        },
      } as Request;
      const res = {} as Response;
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      const next = jest.fn() as NextFunction;

      const mockSave = jest.spyOn(Post.prototype, 'save').mockResolvedValue({});

      await createPost(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(mockSave).not.toHaveBeenCalledTimes(1);
    });

    test('내용과 카테고리 없이 글을 생성하려는 경우', async () => {
      const req = {
        body: {
          title: 'test title',
          content: '',
          category: '',
          images: ['test'],
          tags: ['test'],
        },
        user: {
          userId: '1',
        },
      } as Request;
      const res = {} as Response;
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      const next = jest.fn() as NextFunction;

      const mockSave = jest.spyOn(Post.prototype, 'save').mockResolvedValue({});

      await createPost(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(mockSave).not.toHaveBeenCalledTimes(1);
    });
  });

  test('글 작성에 성공하면 201 상태코드를 반환한다', async () => {
    const req = {
      body: {
        title: 'test title',
        content: 'test content',
        category: 'test category',
        images: ['test'],
        tags: ['test'],
      },
      user: {
        userId: '1',
      },
    } as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    const next = jest.fn() as NextFunction;

    const mockSave = jest.spyOn(Post.prototype, 'save').mockResolvedValue({});

    await createPost(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(mockSave).toHaveBeenCalledTimes(1);
  });

  test('글 작성 도중에 오류가 발생한 경우', async () => {
    const req = {
      body: {
        title: 'test title',
        content: 'test content',
        category: 'test category',
        images: ['test'],
        tags: ['test'],
      },
      user: {
        userId: '1',
      },
    } as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    const next = jest.fn() as NextFunction;

    const mockSave = jest
      .spyOn(Post.prototype, 'save')
      .mockRejectedValue(new Error('DB 연결 오류'));

    await createPost(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(mockSave).toHaveBeenCalledTimes(1);
  });
});

describe('getPosts', () => {
  test('게시글이 없거나 게시글의 길이가 0인 경우, 빈 배열과 200 상태코드를 반환한다', async () => {
    const req = {
      body: {
        title: 'test title',
        content: 'test content',
        category: 'test category',
        images: ['test'],
        tags: ['test'],
      },
      user: {
        userId: '1',
      },
    } as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    const next = jest.fn() as NextFunction;

    jest.spyOn(Post, 'find').mockResolvedValue([]);

    await getPosts(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  test('게시글을 성공적으로 모두 불러오면 200 상태코드를 반환한다', async () => {
    const req = {
      body: {
        title: 'test title',
        content: 'test content',
        category: 'test category',
        images: ['test'],
        tags: ['test'],
      },
      user: {
        userId: '1',
      },
    } as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    const next = jest.fn() as NextFunction;

    jest.spyOn(Post, 'find').mockResolvedValue([
      {
        title: 'test title',
        content: 'test content',
        category: 'test category',
        images: ['test'],
        tags: ['test'],
      },
    ]);

    await getPosts(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      expect.objectContaining({
        title: 'test title',
      }),
    ]);
  });

  test('게시글을 불러오는 도중 에러가 발생한 경우', async () => {
    const req = {
      body: {
        title: 'test title',
        content: 'test content',
        category: 'test category',
        images: ['test'],
        tags: ['test'],
      },
      user: {
        userId: '1',
      },
    } as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    const next = jest.fn() as NextFunction;

    jest.spyOn(Post, 'find').mockRejectedValue(new Error('DB 연결 오류'));

    await getPosts(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});

describe('getPostById', () => {
  test('찾는 게시글이 없다면 404 상태코드를 반환한다', async () => {
    const req = {
      body: {
        title: 'test title',
        content: 'test content',
        category: 'test category',
        images: ['test'],
        tags: ['test'],
      },
      params: {
        id: '1',
      } as any,
      user: {
        userId: '1',
      },
    } as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    const next = jest.fn() as NextFunction;

    jest.spyOn(Post, 'findById').mockResolvedValue(null);

    await getPostById(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('게시글을 성공적으로 불러오면 200 상태코드를 반환한다', async () => {
    const req = {
      body: {
        title: 'test title',
        content: 'test content',
        category: 'test category',
        images: ['test'],
        tags: ['test'],
      },
      params: {
        id: '1',
      } as any,
      user: {
        userId: '1',
      },
    } as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    const next = jest.fn() as NextFunction;

    jest.spyOn(Post, 'findById').mockResolvedValue({
      title: 'test title',
      content: 'test content',
      category: 'test category',
      images: ['test'],
      tags: ['test'],
    });

    await getPostById(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      title: 'test title',
      content: 'test content',
      category: 'test category',
      images: ['test'],
      tags: ['test'],
    });
  });

  test('게시글을 불러오는 도중 에러가 발생한 경우', async () => {
    const req = {
      body: {
        title: 'test title',
        content: 'test content',
        category: 'test category',
        images: ['test'],
        tags: ['test'],
      },
      params: {
        id: '1',
      } as any,
      user: {
        userId: '1',
      },
    } as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    const next = jest.fn() as NextFunction;

    jest.spyOn(Post, 'findById').mockRejectedValue(new Error('DB 연결 오류'));

    await getPostById(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});

describe('updatePost', () => {
  test('수정으로 보낸 내용 중 필수 입력 항목이 비어있을 경우 400 상태코드를 반환한다', async () => {
    const req = {
      body: {
        title: '',
        content: 'test content',
        category: 'test category',
        images: ['test'],
        tags: ['test'],
      },
      params: {
        id: '1',
      } as any,
      user: {
        userId: '1',
      },
    } as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    const next = jest.fn() as NextFunction;

    const mockFind = jest
      .spyOn(Post, 'findByIdAndUpdate')
      .mockResolvedValue({});

    await updatePost(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(mockFind).not.toHaveBeenCalledTimes(1);
  });

  test('수정할 게시글을 찾을 수 없으면 404 상태코드를 반환한다', async () => {
    const req = {
      body: {
        title: 'updated content',
        content: 'test content',
        category: 'test category',
        images: ['test'],
        tags: ['test'],
      },
      params: {
        id: '1',
      } as any,
      user: {
        userId: '1',
      },
    } as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    const next = jest.fn() as NextFunction;

    const mockFind = jest
      .spyOn(Post, 'findByIdAndUpdate')
      .mockResolvedValue(null);

    jest.spyOn(Post, 'findById').mockResolvedValue(null);

    await updatePost(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('수정 권한이 없을 경우 403 상태코드를 반환한다', async () => {
    const req = {
      body: {
        title: 'updated content',
        content: 'test content',
        category: 'test category',
        images: ['test'],
        tags: ['test'],
      },
      params: {
        id: '1',
      } as any,
      user: {
        userId: '1',
      },
    } as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    const next = jest.fn() as NextFunction;

    const mockFind = jest
      .spyOn(Post, 'findByIdAndUpdate')
      .mockResolvedValue(null);

    jest.spyOn(Post, 'findById').mockResolvedValue({
      title: 'updated content',
      content: 'test content',
      category: 'test category',
      images: ['test'],
      tags: ['test'],
      author: '2',
    });

    await updatePost(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  test('게시글을 성공적으로 수정했다면 200 상태코드를 반환한다', async () => {
    const req = {
      body: {
        title: 'updated title',
        content: 'test content',
        category: 'test category',
        images: ['test'],
        tags: ['test'],
      },
      params: {
        id: '1',
      } as any,
      user: {
        userId: '1',
      },
    } as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    const next = jest.fn() as NextFunction;

    jest.spyOn(Post, 'findById').mockResolvedValue({
      title: 'updated title',
      content: 'test content',
      category: 'test category',
      images: ['test'],
      tags: ['test'],
      author: '1',
    });
    const mockFind = jest.spyOn(Post, 'findByIdAndUpdate').mockResolvedValue({
      title: 'updated title',
      content: 'test content',
      category: 'test category',
      images: ['test'],
      tags: ['test'],
      author: '1',
    });

    await updatePost(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: '게시글이 성공적으로 수정되었습니다.',
      post: expect.objectContaining({
        title: 'updated title',
      }),
    });
    expect(mockFind).toHaveBeenCalledTimes(1);
  });

  test('게시글 수정 도중 에러가 발생한 경우', async () => {
    const req = {
      body: {
        title: 'updated title',
        content: 'test content',
        category: 'test category',
        images: ['test'],
        tags: ['test'],
      },
      params: {
        id: '1',
      } as any,
      user: {
        userId: '1',
      },
    } as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    const next = jest.fn() as NextFunction;

    jest.spyOn(Post, 'findById').mockResolvedValue({
      title: 'updated title',
      content: 'test content',
      category: 'test category',
      images: ['test'],
      tags: ['test'],
      author: '1',
    });
    const mockFind = jest
      .spyOn(Post, 'findByIdAndUpdate')
      .mockRejectedValue(new Error('DB 연결 오류'));
    await updatePost(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(mockFind).toHaveBeenCalledTimes(1);
  });
});

describe('deletePost', () => {
  test('삭제할 게시글을 찾을 수 없으면 404 상태코드를 반환한다', async () => {
    const req = {
      params: {
        id: '1',
      } as any,
      user: {
        userId: '1',
      },
    } as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    const next = jest.fn() as NextFunction;

    const mockFind = jest
      .spyOn(Post, 'findByIdAndDelete')
      .mockResolvedValue(null);

    jest.spyOn(Post, 'findById').mockResolvedValue(null);

    await deletePost(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(mockFind).toHaveBeenCalledTimes(1);
  });

  test('삭제 요청 아이디와 게시글의 아이디가 다른 경우 403 상태코드를 반환한다', async () => {
    const req = {
      params: {
        id: '1',
      } as any,
      user: {
        userId: '1',
      },
    } as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    const next = jest.fn() as NextFunction;

    const mockFind = jest
      .spyOn(Post, 'findByIdAndDelete')
      .mockResolvedValue(null);

    jest.spyOn(Post, 'findById').mockResolvedValue({
      author: '2',
    });

    await deletePost(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(mockFind).toHaveBeenCalledTimes(1);
  });

  test('게시글이 성공적으로 삭제되면 200 상태코드를 반환한다', async () => {
    const req = {
      params: {
        id: '1',
      } as any,
      user: {
        userId: '1',
      },
    } as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    const next = jest.fn() as NextFunction;

    const mockFind = jest
      .spyOn(Post, 'findByIdAndDelete')
      .mockResolvedValue({});

    jest.spyOn(Post, 'findById').mockResolvedValue({});

    await deletePost(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(mockFind).toHaveBeenCalledTimes(1);
  });

  test('게시글 삭제 도중 에러가 발생한 경우', async () => {
    const req = {
      params: {
        id: '1',
      } as any,
      user: {
        userId: '1',
      },
    } as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    const next = jest.fn() as NextFunction;

    const mockFind = jest
      .spyOn(Post, 'findByIdAndDelete')
      .mockRejectedValue(new Error('DB 연결 오류'));

    jest.spyOn(Post, 'findById').mockResolvedValue({});

    await deletePost(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(mockFind).toHaveBeenCalledTimes(1);
  });
});
