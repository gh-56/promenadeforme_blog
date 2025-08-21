import { create } from 'zustand';
import type { UserProfile, UserResponse } from '../types/interface';
import { fetchGetProfile, fetchLogout } from '../api/users';

interface UserStore {
  isLoggedIn: boolean;
  accessToken: string | null;
  user: UserProfile | null;
  isInitialized: boolean;
  login: (token: string, user: UserProfile) => void;
  logout: () => void;
  init: () => Promise<void>;
  setAccessToken: (token: string) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  isLoggedIn: false,
  accessToken: null,
  user: null,
  isInitialized: false,

  login: (token, user) => {
    set({ isLoggedIn: true, accessToken: token, user });
  },

  logout: async () => {
    try {
      await fetchLogout();
    } catch (error) {
      console.error('로그아웃 실패: ', error);
    } finally {
      set({ isLoggedIn: false, user: null, accessToken: null });
    }
  },

  setAccessToken(token) {
    set({ accessToken: token });
  },

  init: async () => {
    try {
      const response: UserResponse = await fetchGetProfile();
      const { user, accessToken } = response;
      set({ isLoggedIn: true, user, accessToken, isInitialized: true });
    } catch (error) {
      set({ isLoggedIn: false, user: null, accessToken: null, isInitialized: true });
    }
  },
}));
