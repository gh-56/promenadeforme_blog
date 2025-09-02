// 회원가입 요청
export interface RegisterRequest {
  username: string;
  email: string;
  nickname: string;
  password: string;
  profileImage?: string;
  bio?: string;
}

// 회원가입 응답
export interface RegisterResponse {
  username: string;
  email: string;
  nickname: string;
  profileImage: string;
  bio: string;
  createdAt: string;
  updatedAt: string;
}

// 로그인 요청
export interface LoginRequest {
  email: string;
  password: string;
}

// 로그인 응답 (토큰 포함)
export interface UserResponse {
  user: UserProfile;
  accessToken: string;
}

// access 토큰 재발급
export interface RefreshResponse {
  accessToken: string;
}

// 상태 관리용 프로필 정보 응답
export interface UserProfile {
  _id: string;
  username: string;
  nickname: string;
  email: string;
  profileImage: {
    _id: string;
    url: string;
  };
  bio: string;
}
