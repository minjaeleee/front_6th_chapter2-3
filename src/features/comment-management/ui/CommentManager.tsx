import React, { useEffect } from 'react';

import { CommentItem } from '../../../entities/comment';
import { Button } from '../../../shared/ui';
import { useCommentDialogs, useCommentManagement } from '../model';

interface CommentManagerProps {
  postId: number;
}

const CommentManager: React.FC<CommentManagerProps> = ({ postId }) => {
  const {
    fetchComments,
    getCommentsForPost,
    deleteComment,
    likeComment,
    loading,
  } = useCommentManagement();

  const { openAddDialog, openEditDialog } = useCommentDialogs();

  const comments = getCommentsForPost(postId);

  useEffect(() => {
    fetchComments(postId);
  }, [fetchComments, postId]);

  const handleAddComment = () => {
    openAddDialog(postId);
  };

  const handleEditComment = (comment: any) => {
    openEditDialog(comment, postId);
  };

  const handleDeleteComment = async (
    commentId: number,
    postIdParam: number
  ) => {
    if (window.confirm('이 댓글을 삭제하시겠습니까?')) {
      try {
        await deleteComment(commentId, postIdParam);
      } catch (error) {
        console.error('댓글 삭제 실패:', error);
      }
    }
  };

  const handleLikeComment = async (commentId: number, postIdParam: number) => {
    try {
      await likeComment(commentId, postIdParam);
    } catch (error) {
      console.error('댓글 좋아요 실패:', error);
    }
  };

  if (loading && comments.length === 0) {
    return <div className='p-4 text-center'>댓글을 불러오는 중...</div>;
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold'>댓글 ({comments.length})</h3>
        <Button onClick={handleAddComment}>댓글 추가</Button>
      </div>

      <div className='space-y-2'>
        {comments.length > 0 ? (
          comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} postId={postId} />
          ))
        ) : (
          <div className='py-4 text-center text-gray-500'>댓글이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default CommentManager;
