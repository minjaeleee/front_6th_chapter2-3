import React from 'react';

import { highlightText } from '../../../shared/lib';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../shared/ui';
import { useSearchStore, useUIStore } from '../../../stores';
import { CommentManager } from '../../../features/comment-management';

const PostDetail: React.FC = () => {
  const { showPostDetailDialog, setShowPostDetailDialog, selectedPost } =
    useUIStore();
  const { searchQuery } = useSearchStore();

  return (
    <Dialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog}>
      <DialogContent className='max-w-3xl'>
        <DialogHeader>
          <DialogTitle>
            {highlightText(selectedPost?.title || '', searchQuery)}
          </DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <p>{highlightText(selectedPost?.body || '', searchQuery)}</p>
          {selectedPost && <CommentManager postId={selectedPost.id} />}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostDetail;
