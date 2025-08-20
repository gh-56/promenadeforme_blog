// 포스트 응답 전용 유저 정보
export interface PostAuthorResponse {
  _id: string;
  nickname: string;
  profileImage: string;
  createdAt: string;
  updatedAt: string;
}

// 포스트 응답 전용 카테고리 정보
export interface PostCategoryResponse {
  _id: string;
  name: string;
}

// 포스트 응답 전용 이미지 정보
export interface PostImageResponse {
  _id: string;
  url: string;
}

// 포스트 생성 및 수정 요청
export interface PostRequest {
  title: string;
  content: string;
  category: string;
  images?: string[];
  tags?: string[];
}

// 포스트 응답
export interface PostResponse {
  _id: string;
  title: string;
  content: string;
  category: PostCategoryResponse;
  author: PostAuthorResponse;
  images?: PostImageResponse[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

// 전체 게시글 응답
export interface GetAllPostResponse {
  posts: PostResponse[];
  totalPosts: number;
  currentPage: number;
  totalPages: number;
}
