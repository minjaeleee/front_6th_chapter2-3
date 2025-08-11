import { create } from 'zustand';

import { UserProfileData } from '../../features/user-profile/model';
import { usersApi } from '../../shared/api';

interface UserProfileState {
  selectedUser: UserProfileData | null;
  loading: boolean;
  error: string | null;
  showUserModal: boolean;

  openUserProfile: (user: UserProfileData) => Promise<void>;
  closeUserProfile: () => void;
  setShowUserModal: (show: boolean) => void;
}

export const useUserProfileStore = create<UserProfileState>(set => ({
  selectedUser: null,
  loading: false,
  error: null,
  showUserModal: false,

  openUserProfile: async (user: UserProfileData) => {
    set({ loading: true, error: null });
    try {
      // 사용자 상세 정보를 가져옵니다 (필요한 경우)
      const userData = await usersApi.getUser(user.id);
      set({
        selectedUser: userData.data,
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
