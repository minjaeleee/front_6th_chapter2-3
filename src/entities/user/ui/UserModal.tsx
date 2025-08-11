import React from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../shared/ui';
import { useUIStore, useUsersStore } from '../../../stores';

const UserModal: React.FC = () => {
  const { showUserModal, setShowUserModal } = useUIStore();
  const { selectedUser } = useUsersStore();

  return (
    <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>사용자 정보</DialogTitle>
        </DialogHeader>
        {selectedUser && (
          <div className='space-y-4'>
            <img
              src={selectedUser.image}
              alt={selectedUser.username}
              className='mx-auto h-24 w-24 rounded-full'
            />
            <h3 className='text-center text-xl font-semibold'>
              {selectedUser.username}
            </h3>
            <div className='space-y-2'>
              <p>
                <strong>이름:</strong> {selectedUser.firstName}{' '}
                {selectedUser.lastName}
              </p>
              <p>
                <strong>나이:</strong> {selectedUser.age}
              </p>
              <p>
                <strong>이메일:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>전화번호:</strong> {selectedUser.phone}
              </p>
              <p>
                <strong>주소:</strong> {selectedUser.address?.address},{' '}
                {selectedUser.address?.city}, {selectedUser.address?.state}
              </p>
              <p>
                <strong>직장:</strong> {selectedUser.company?.name} -{' '}
                {selectedUser.company?.title}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserModal;
