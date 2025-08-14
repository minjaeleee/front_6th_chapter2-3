import { create } from 'zustand';

import { Comment } from '../../../entities/comment';

interface CommentDialogsState {
  showAddDialog: boolean;
  showEditDialog: boolean;
  selectedComment: Comment | null;
  postId: number | null;
}

interface CommentDialogsActions {
  openAddDialog: (postId: number) => void;
  closeAddDialog: () => void;
  openEditDialog: (comment: Comment, postId: number) => void;
  closeEditDialog: () => void;
  setSelectedComment: (comment: Comment | null) => void;
}

export const useCommentDialogs = create<CommentDialogsState & CommentDialogsActions>()((set) => ({
  showAddDialog: false,
  showEditDialog: false,
  selectedComment: null,
  postId: null,

  openAddDialog: (postId: number) => set({ 
    showAddDialog: true,
    postId,
    selectedComment: null 
  }),

  closeAddDialog: () => set({ 
    showAddDialog: false,
    postId: null,
    selectedComment: null 
  }),

  openEditDialog: (comment: Comment, postId: number) => set({ 
    showEditDialog: true,
    selectedComment: comment,
    postId 
  }),

  closeEditDialog: () => set({ 
    showEditDialog: false,
    selectedComment: null,
    postId: null 
  }),

  setSelectedComment: (comment: Comment | null) => set({ selectedComment: comment }),
}));