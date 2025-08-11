import { create } from 'zustand';

import { Tag } from '../../entities/post';

export interface SearchFilters {
  skip: number;
  limit: number;
  searchQuery: string;
  sortBy: string;
  sortOrder: string;
  selectedTag: string;
}

interface SearchState {
  searchQuery: string;
  sortBy: string;
  sortOrder: string;
  selectedTag: string;
  tags: Tag[];
  loading: boolean;
  error: string | null;

  // Actions
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (sortOrder: string) => void;
  setSelectedTag: (tag: string) => void;
  fetchTags: () => Promise<void>;
  setTags: (tags: Tag[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useSearchStore = create<SearchState>(set => ({
  searchQuery: '',
  sortBy: '',
  sortOrder: 'asc',
  selectedTag: '',
  tags: [],
  loading: false,
  error: null,

  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setSortBy: (sortBy: string) => set({ sortBy }),
  setSortOrder: (sortOrder: string) => set({ sortOrder }),
  setSelectedTag: (tag: string) => set({ selectedTag: tag }),

  fetchTags: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/posts/tags');
      const data = await response.json();
      set({ tags: data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      console.error('태그 가져오기 오류:', error);
    }
  },

  setTags: (tags: Tag[]) => set({ tags }),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
}));
