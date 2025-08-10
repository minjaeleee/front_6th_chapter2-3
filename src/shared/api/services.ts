import {
  Comment,
  CreateComment,
  Post,
  UpdateComment,
  UpdatePost,
  User,
} from '../../stores/types';
import { API_ENDPOINTS } from './endpoints';
import { apiClient } from './httpClient';

export const postsApi = {
  async getPosts(limit: number, skip: number) {
    const url = `${API_ENDPOINTS.POSTS.LIST}?limit=${limit}&skip=${skip}`;
    return apiClient.get<{ posts: Post[]; total: number }>(url);
  },

  async addPost(post: Omit<Post, 'id' | 'author' | 'reactions'>) {
    return apiClient.post<Post>(API_ENDPOINTS.POSTS.ADD, post);
  },

  async updatePost(id: number, post: UpdatePost) {
    return apiClient.put<Post>(API_ENDPOINTS.POSTS.UPDATE(id), post);
  },

  async deletePost(id: number) {
    return apiClient.delete<void>(API_ENDPOINTS.POSTS.DELETE(id));
  },

  async searchPosts(query: string) {
    return apiClient.get<{ posts: Post[]; total: number }>(
      API_ENDPOINTS.POSTS.SEARCH(query)
    );
  },

  async getPostsByTag(tag: string) {
    return apiClient.get<{ posts: Post[]; total: number }>(
      API_ENDPOINTS.POSTS.BY_TAG(tag)
    );
  },

  async getTags() {
    return apiClient.get<string[]>(API_ENDPOINTS.POSTS.TAGS);
  },
};

export const usersApi = {
  async getUser(id: number) {
    return apiClient.get<User>(API_ENDPOINTS.USERS.GET(id));
  },

  async getUsersList() {
    return apiClient.get<User[]>(API_ENDPOINTS.USERS.LIST);
  },
};

export const commentsApi = {
  async getCommentsByPost(postId: number) {
    return apiClient.get<Comment[]>(API_ENDPOINTS.COMMENTS.BY_POST(postId));
  },

  async addComment(comment: CreateComment) {
    return apiClient.post<Comment>(API_ENDPOINTS.COMMENTS.ADD, comment);
  },

  async updateComment(id: number, comment: UpdateComment) {
    return apiClient.put<Comment>(API_ENDPOINTS.COMMENTS.UPDATE(id), comment);
  },

  /*    *
   * 댓글 삭제
   */
  async deleteComment(id: number) {
    return apiClient.delete<void>(API_ENDPOINTS.COMMENTS.DELETE(id));
  },
};
