export interface CategoryRequest {
  name: string;
}

export interface CategoryResponse {
  _id: string;
  name: string;
  author: string;
  createdAt: string;
}
