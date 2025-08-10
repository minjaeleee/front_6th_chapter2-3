import { create } from 'zustand';

import { CreateComment, CreatePost } from '../types';

interface UIState {
  // Dialog states
  showAddDialog: boolean;
  showEditDialog: boolean;
  showAddCommentDialog: boolean;
  showEditCommentDialog: boolean;
  showPostDetailDialog: boolean;
  showUserModal: boolean;

  // Form states
  newPost: CreatePost;
  newComment: CreateComment;
  selectedPost: any;
  selectedComment: any;

  // Actions
  setShowAddDialog: (show: boolean) => void;
  setShowEditDialog: (show: boolean) => void;
  setShowAddCommentDialog: (show: boolean) => void;
  setShowEditCommentDialog: (show: boolean) => void;
  setShowPostDetailDialog: (show: boolean) => void;
  setShowUserModal: (show: boolean) => void;

  setNewPost: (post: CreatePost) => void;
  setNewComment: (comment: CreateComment) => void;
  setSelectedPost: (post: any) => void;
  setSelectedComment: (comment: any) => void;

  resetNewPost: () => void;
  resetNewComment: () => void;
}

export const useUIStore = create<UIState>(set => ({
  // Dialog states
  showAddDialog: false,
  showEditDialog: false,
  showAddCommentDialog: false,
  showEditCommentDialog: false,
  showPostDetailDialog: false,
  showUserModal: false,

  // Form states
  newPost: { title: '', body: '', userId: 1 },
  newComment: { body: '', postId: null, userId: 1 },
  selectedPost: null,
  selectedComment: null,

  // Actions
  setShowAddDialog: (show: boolean) => set({ showAddDialog: show }),
  setShowEditDialog: (show: boolean) => set({ showEditDialog: show }),
  setShowAddCommentDialog: (show: boolean) =>
    set({ showAddCommentDialog: show }),
  setShowEditCommentDialog: (show: boolean) =>
    set({ showEditCommentDialog: show }),
  setShowPostDetailDialog: (show: boolean) =>
    set({ showPostDetailDialog: show }),
  setShowUserModal: (show: boolean) => set({ showUserModal: show }),

  setNewPost: (post: CreatePost) => set({ newPost: post }),
  setNewComment: (comment: CreateComment) => set({ newComment: comment }),
  setSelectedPost: (post: any) => set({ selectedPost: post }),
  setSelectedComment: (comment: any) => set({ selectedComment: comment }),

  resetNewPost: () => set({ newPost: { title: '', body: '', userId: 1 } }),
  resetNewComment: () =>
    set({ newComment: { body: '', postId: null, userId: 1 } }),
}));
