import { CreatePost, Post, UpdatePost } from '../../../entities/post';

export interface PostWithUser extends Post {
  author: any;
}

export interface PostManagementState {
  posts: PostWithUser[];
  total: number;
  loading: boolean;
  error: string | null;
  skip: number;
  limit: number;
}

export interface PostManagementActions {
  fetchPosts: (skip: number, limit: number) => Promise<void>;
  addPost: (post: CreatePost) => Promise<void>;
  updatePost: (id: number, post: UpdatePost) => Promise<void>;
  deletePost: (id: number) => Promise<void>;
  searchPosts: (query: string) => Promise<void>;
  fetchPostsByTag: (tag: string) => Promise<void>;
  setPosts: (posts: PostWithUser[]) => void;
  setTotal: (total: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSkip: (skip: number) => void;
  setLimit: (limit: number) => void;
}
