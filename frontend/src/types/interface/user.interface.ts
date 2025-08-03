export interface JoinFormData {
  username: string;
  email: string;
  password: string;
  nickname: string;
  profileImage?: string;
  bio?: string;
}

export interface JoinResponse {
  message: string;
  user: {
    _id: string;
    username: string;
    email: string;
    nickname: string;
    profileImage?: string;
    bio?: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: {
    email: string;
    nickname: string;
  };
  token: string;
}
