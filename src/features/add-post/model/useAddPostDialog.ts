import { create } from 'zustand';

interface AddPostDialogState {
  showAddDialog: boolean;

  setShowAddDialog: (show: boolean) => void;
  openAddDialog: () => void;
  closeAddDialog: () => void;
}

export const useAddPostDialog = create<AddPostDialogState>((set) => ({
  showAddDialog: false,

  setShowAddDialog: (show: boolean) => set({ showAddDialog: show }),

  openAddDialog: () => set({ showAddDialog: true }),

  closeAddDialog: () => set({ showAddDialog: false }),
}));