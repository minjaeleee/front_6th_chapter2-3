import React from 'react';

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Textarea,
} from '../../../shared/ui';
import { useCommentsStore, useUIStore } from '../../../stores';

interface CommentFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  submitText: string;
}

const CommentForm: React.FC<CommentFormProps> = ({
  isOpen,
  onOpenChange,
  title,
  submitText,
}) => {
  const { addComment, updateComment } = useCommentsStore();
  const {
    newComment,
    selectedComment,
    setNewComment,
    setSelectedComment,
    setShowAddCommentDialog,
    setShowEditCommentDialog,
    resetNewComment,
  } = useUIStore();

  const handleSubmit = async () => {
    if (title.includes('수정')) {
      // 수정 모드
      if (selectedComment) {
        await updateComment(selectedComment.id, { body: selectedComment.body });
        setShowEditCommentDialog(false);
      }
    } else {
      // 추가 모드
      await addComment(newComment);
      setShowAddCommentDialog(false);
      resetNewComment();
    }
  };

  const handleChange = (value: string) => {
    if (title.includes('수정')) {
      // 수정 모드
      setSelectedComment(
        selectedComment ? { ...selectedComment, body: value } : null
      );
    } else {
      // 추가 모드
      setNewComment({ ...newComment, body: value });
    }
  };

  const currentValue = title.includes('수정')
    ? selectedComment?.body || ''
    : newComment.body;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <Textarea
            placeholder='댓글 내용'
            value={currentValue}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              handleChange(e.target.value)
            }
          />
          <Button onClick={handleSubmit}>{submitText}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentForm;
