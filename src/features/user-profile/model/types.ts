import { User } from '../../../entities/user';

export type UserProfileData = User;

export interface UserProfileState {
  selectedUser: UserProfileData | null;
  loading: boolean;
  error: string | null;
}

export interface UserProfileActions {
  openUserProfile: (user: UserProfileData) => Promise<void>;
  closeUserProfile: () => void;
}
