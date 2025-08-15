import React from 'react';

import { PostForm } from '../../../entities/post';
import { usePostCrud, usePostDialogs, usePostForm } from '../model';

interface PostFormManagerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'add' | 'edit';
}

const PostFormManager: React.FC<PostFormManagerProps> = ({
  isOpen,
  onOpenChange,
  mode,
}) => {
  const { addPost, updatePost } = usePostCrud();
  const { selectedPost, setSelectedPost } = usePostDialogs();
  const { newPost, setNewPost, resetNewPost } = usePostForm();

  const handleSubmit = async () => {
    if (mode === 'add') {
      await addPost(newPost);
      resetNewPost();
    } else if (mode === 'edit' && selectedPost) {
      await updatePost(selectedPost.id, {
        title: selectedPost.title,
        body: selectedPost.body,
      });
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

  const currentTitle = mode === 'add' ? newPost.title : selectedPost?.title || '';
  const currentBody = mode === 'add' ? newPost.body : selectedPost?.body || '';
  const currentUserId = mode === 'add' ? newPost.userId : undefined;

  return (
    <PostForm
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      mode={mode}
      title={currentTitle}
      body={currentBody}
      userId={currentUserId}
      onTitleChange={handleTitleChange}
      onBodyChange={handleBodyChange}
      onUserIdChange={mode === 'add' ? handleUserIdChange : undefined}
      onSubmit={handleSubmit}
    />
  );
};

export default PostFormManager;