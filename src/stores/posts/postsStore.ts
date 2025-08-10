import { create } from 'zustand';

import { CreatePost, Post, UpdatePost } from '../types';

interface PostsState {
  posts: Post[];
  total: number;
  loading: boolean;
  error: string | null;
  skip: number;
  limit: number;

  // Actions
  fetchPosts: (skip: number, limit: number) => Promise<void>;
  addPost: (post: CreatePost) => Promise<void>;
  updatePost: (id: number, post: UpdatePost) => Promise<void>;
  deletePost: (id: number) => Promise<void>;
  searchPosts: (query: string) => Promise<void>;
  fetchPostsByTag: (tag: string) => Promise<void>;
  setPosts: (posts: Post[]) => void;
  setTotal: (total: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSkip: (skip: number) => void;
  setLimit: (limit: number) => void;
}

export const usePostsStore = create<PostsState>((set, get) => ({
  posts: [],
  total: 0,
  loading: false,
  error: null,
  skip: 0,
  limit: 10,

  fetchPosts: async (skip: number, limit: number) => {
    set({ loading: true, error: null });
    try {
      let postsData;
      let usersData;

      const postsResponse = await fetch(
        `/api/posts?limit=${limit}&skip=${skip}`
      );
      postsData = await postsResponse.json();

      const usersResponse = await fetch(
        '/api/users?limit=0&select=username,image'
      );
      usersData = await usersResponse.json();

      const postsWithUsers = postsData.posts.map((post: Post) => ({
        ...post,
        author: usersData.users.find((user: any) => user.id === post.userId),
      }));

      set({ posts: postsWithUsers, total: postsData.total, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      console.error('게시물 가져오기 오류:', error);
    }
  },

  addPost: async (post: CreatePost) => {
    try {
      const response = await fetch('/api/posts/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      });
      const data = await response.json();
      const { posts } = get();
      set({ posts: [data, ...posts] });
    } catch (error: any) {
      set({ error: error.message });
      console.error('게시물 추가 오류:', error);
    }
  },

  updatePost: async (id: number, post: UpdatePost) => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      });
      const data = await response.json();
      const { posts } = get();
      set({
        posts: posts.map(p => (p.id === data.id ? data : p)),
      });
    } catch (error: any) {
      set({ error: error.message });
      console.error('게시물 업데이트 오류:', error);
    }
  },

  deletePost: async (id: number) => {
    try {
      await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });
      const { posts } = get();
      set({ posts: posts.filter(post => post.id !== id) });
    } catch (error: any) {
      set({ error: error.message });
      console.error('게시물 삭제 오류:', error);
    }
  },

  searchPosts: async (query: string) => {
    if (!query) {
      const { skip, limit } = get();
      get().fetchPosts(skip, limit);
      return;
    }

    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/posts/search?q=${query}`);
      const data = await response.json();
      set({ posts: data.posts, total: data.total, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      console.error('게시물 검색 오류:', error);
    }
  },

  fetchPostsByTag: async (tag: string) => {
    if (!tag || tag === 'all') {
      const { skip, limit } = get();
      get().fetchPosts(skip, limit);
      return;
    }

    set({ loading: true, error: null });
    try {
      const [postsResponse, usersResponse] = await Promise.all([
        fetch(`/api/posts/tag/${tag}`),
        fetch('/api/users?limit=0&select=username,image'),
      ]);

      const postsData = await postsResponse.json();
      const usersData = await usersResponse.json();

      const postsWithUsers = postsData.posts.map((post: Post) => ({
        ...post,
        author: usersData.users.find((user: any) => user.id === post.userId),
      }));

      set({ posts: postsWithUsers, total: postsData.total, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      console.error('태그별 게시물 가져오기 오류:', error);
    }
  },

  setPosts: (posts: Post[]) => set({ posts }),
  setTotal: (total: number) => set({ total }),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
  setSkip: (skip: number) => set({ skip }),
  setLimit: (limit: number) => set({ limit }),
}));
