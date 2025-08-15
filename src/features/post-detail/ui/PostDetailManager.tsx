import React from 'react';

import { PostDetail } from '../../../entities/post';
import { CommentManager } from '../../comment-management';
import { usePostSearch } from '../../post-search';
import { usePostDetail } from '../model';

const PostDetailManager: React.FC = () => {
  const {
    showPostDetailDialog,
    setShowPostDetailDialog,
    selectedPost,
  } = usePostDetail();
  
  const { searchQuery } = usePostSearch();

  return (
    <PostDetail
      isOpen={showPostDetailDialog}
      onOpenChange={setShowPostDetailDialog}
      post={selectedPost}
      searchQuery={searchQuery}
    >
      {selectedPost && <CommentManager postId={selectedPost.id} />}
    </PostDetail>
  );
};

export default PostDetailManager;