import { CreatePost, Post, UpdatePost } from '../model';

export const postApi = {
  async getPosts(
    limit: number,
    skip: number
  ): Promise<{ posts: Post[]; total: number }> {
    const response = await fetch(`/api/posts?limit=${limit}&skip=${skip}`);
    return response.json();
  },

  async addPost(post: CreatePost): Promise<Post> {
    const response = await fetch('/api/posts/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
    });
    return response.json();
  },

  async updatePost(id: number, post: UpdatePost): Promise<Post> {
    const response = await fetch(`/api/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
    });
    return response.json();
  },

  async deletePost(id: number): Promise<void> {
    await fetch(`/api/posts/${id}`, {
      method: 'DELETE',
    });
  },

  async searchPosts(query: string): Promise<{ posts: Post[]; total: number }> {
    const response = await fetch(`/api/posts/search?q=${query}`);
    return response.json();
  },

  async getPostsByTag(tag: string): Promise<{ posts: Post[]; total: number }> {
    const response = await fetch(`/api/posts/tag/${tag}`);
    return response.json();
  },
};
