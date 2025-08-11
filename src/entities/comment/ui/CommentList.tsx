import { Plus } from 'lucide-react';

import { Button } from '../../../shared/ui';
import { useCommentsStore, useUIStore } from '../../../stores';
import { Comment } from '../model';
import CommentItem from './CommentItem';

const CommentList = () => {
  const { setNewComment, setShowAddCommentDialog } = useUIStore();
  const { comments } = useCommentsStore();
  const { selectedPost } = useUIStore();
  const postComments = comments[selectedPost.id] || [];
  const postId = selectedPost.id;

  const handleAddComment = () => {
    setNewComment({ body: '', postId, userId: 1 });
    setShowAddCommentDialog(true);
  };

  return (
    <div className='mt-2'>
      <div className='mb-2 flex items-center justify-between'>
        <h3 className='text-sm font-semibold'>댓글</h3>
        <Button size='sm' onClick={handleAddComment}>
          <Plus className='mr-1 h-3 w-3' />
          댓글 추가
        </Button>
      </div>
      <div className='space-y-1'>
        {postComments?.map((comment: Comment) => (
          <CommentItem key={comment.id} comment={comment} postId={postId} />
        ))}
      </div>
    </div>
  );
};

export default CommentList;
