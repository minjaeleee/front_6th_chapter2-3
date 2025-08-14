import { create } from 'zustand';

import { userApi, User } from '../../entities/user';

interface UserProfileState {
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
  showUserModal: boolean;

  openUserProfile: (user: User) => Promise<void>;
  closeUserProfile: () => void;
  setShowUserModal: (show: boolean) => void;
}

export const useUserProfileStore = create<UserProfileState>(set => ({
  selectedUser: null,
  loading: false,
  error: null,
  showUserModal: false,

  openUserProfile: async (user: User) => {
    set({ loading: true, error: null });
    try {
      // 사용자 상세 정보를 가져옵니다 (필요한 경우)
      const userData = await userApi.getUser(user.id);
      set({
        selectedUser: userData,
        loading: false,
        showUserModal: true,
      });
    } catch (error: any) {
      set({
        error: error.message,
        loading: false,
      });
      console.error('사용자 프로필 열기 오류:', error);
    }
  },

  closeUserProfile: () => {
    set({
      selectedUser: null,
      showUserModal: false,
      error: null,
    });
  },

  setShowUserModal: (show: boolean) => {
    set({ showUserModal: show });
  },
}));
