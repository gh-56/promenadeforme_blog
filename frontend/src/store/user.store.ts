import { create } from 'zustand';
import axios from 'axios';
import type { UserProfile } from '../types/interface';
import { fetchLogout } from '../api/users';

interface UserStore {
  isLoggedIn: boolean;
  user: UserProfile | null;
  login: (user: UserProfile) => void;
  logout: () => void;
  init: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  isLoggedIn: false,
  user: null,
  login: (user) => {
    set({ isLoggedIn: true, user });
  },
  logout: async () => {
    try {
      await fetchLogout();
    } catch (error) {
      console.error('로그아웃 실패: ', error);
    } finally {
      set({ isLoggedIn: false, user: null });
    }
  },
  init: async () => {
    try {
      const response = await axios.get<UserProfile>('/api/users/me');
      set({ isLoggedIn: true, user: response.data });
    } catch (error) {
      set({ isLoggedIn: false, user: null });
    }
  },
}));
