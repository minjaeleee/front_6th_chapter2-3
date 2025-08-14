import { create } from 'zustand';

import { CreatePost, postApi } from '../../../entities/post';

interface AddPostState {
  loading: boolean;
  error: string | null;

  addPost: (post: CreatePost) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAddPost = create<AddPostState>(set => ({
  loading: false,
  error: null,

  addPost: async (post: CreatePost) => {
    set({ loading: true, error: null });
    try {
      const newPost = await postApi.addPost(post);

      return newPost;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      console.error('게시물 추가 오류:', error);
      throw error;
    }
  },

  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
}));
