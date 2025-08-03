import { create } from 'zustand';

interface UserStore {
  isLoggedIn: boolean;
  user: { nickname: string; email: string } | null;
  token: string | null;
  login: (user: { nickname: string; email: string }, token: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  isLoggedIn: false,
  user: null,
  token: null,
  login: (user, token) => {
    localStorage.setItem('token', token);
    set({ isLoggedIn: true, user, token });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ isLoggedIn: false, user: null, token: null });
  },
}));
