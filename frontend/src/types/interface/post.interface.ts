export interface PostFormData {
  title: string;
  content: string;
  category: string;
  images?: string[];
  tags?: string[];
  author: string;
}

export interface Post extends PostFormData {
  _id: string;
  commentsCount: number;
  createdAt: Date;
}
