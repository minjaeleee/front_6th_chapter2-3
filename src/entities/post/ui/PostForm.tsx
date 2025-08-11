import React from 'react';

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Textarea,
} from '../../../shared/ui';
import { usePostsStore, useUIStore } from '../../../stores';
import { UpdatePost } from '../model';

interface PostFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'add' | 'edit';
}

const PostForm: React.FC<PostFormProps> = ({ isOpen, onOpenChange, mode }) => {
  const { newPost, selectedPost, setNewPost, setSelectedPost, resetNewPost } =
    useUIStore();
  const { addPost, updatePost } = usePostsStore();

  const handleSubmit = async () => {
    if (mode === 'add') {
      await addPost(newPost);
      onOpenChange(false);
      resetNewPost();
    } else if (mode === 'edit' && selectedPost) {
      const updateData: UpdatePost = {
        title: selectedPost.title,
        body: selectedPost.body,
      };
      await updatePost(selectedPost.id, updateData);
      onOpenChange(false);
    }
  };

  const handleTitleChange = (value: string) => {
    if (mode === 'add') {
      setNewPost({ ...newPost, title: value });
    } else if (mode === 'edit' && selectedPost) {
      setSelectedPost({ ...selectedPost, title: value });
    }
  };

  const handleBodyChange = (value: string) => {
    if (mode === 'add') {
      setNewPost({ ...newPost, body: value });
    } else if (mode === 'edit' && selectedPost) {
      setSelectedPost({ ...selectedPost, body: value });
    }
  };

  const handleUserIdChange = (value: string) => {
    if (mode === 'add') {
      setNewPost({ ...newPost, userId: Number(value) });
    }
  };

  const currentTitle =
    mode === 'add' ? newPost.title : selectedPost?.title || '';
  const currentBody = mode === 'add' ? newPost.body : selectedPost?.body || '';
  const currentUserId = mode === 'add' ? newPost.userId : undefined;
  const submitText = mode === 'add' ? '게시물 추가' : '게시물 업데이트';
  const title = mode === 'add' ? '새 게시물 추가' : '게시물 수정';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <Input
            placeholder='제목'
            value={currentTitle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleTitleChange(e.target.value)
            }
          />
          <Textarea
            rows={30}
            placeholder='내용'
            value={currentBody}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              handleBodyChange(e.target.value)
            }
          />
          {mode === 'add' && (
            <Input
              type='number'
              placeholder='사용자 ID'
              value={currentUserId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleUserIdChange(e.target.value)
              }
            />
          )}
          <Button onClick={handleSubmit}>{submitText}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostForm;
