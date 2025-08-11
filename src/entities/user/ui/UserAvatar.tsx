import React from 'react';

import { useUserProfileStore } from '../../../stores/user-profile';
import { User } from '../model';

interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
  showUsername?: boolean;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  size = 'md',
  showUsername = true,
}) => {
  const { openUserProfile } = useUserProfileStore();

  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-16 w-16',
  };

  const handleClick = () => {
    openUserProfile(user);
  };

  return (
    <div
      className='flex cursor-pointer items-center space-x-2'
      onClick={handleClick}
    >
      <img
        src={user.image}
        alt={user.username}
        className={`${sizeClasses[size]} rounded-full`}
      />
      {showUsername && <span>{user.username}</span>}
    </div>
  );
};

export default UserAvatar;
