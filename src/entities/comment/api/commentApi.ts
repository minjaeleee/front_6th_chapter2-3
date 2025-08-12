import { Comment, CreateComment, UpdateComment } from '../model';

export const commentApi = {
  async getCommentsByPost(postId: number): Promise<{ comments: Comment[] }> {
    const response = await fetch(`/api/comments/post/${postId}`);
    return response.json();
  },

  async addComment(comment: CreateComment): Promise<Comment> {
    const response = await fetch('/api/comments/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(comment),
    });
    return response.json();
  },

  async updateComment(id: number, comment: UpdateComment): Promise<Comment> {
    const response = await fetch(`/api/comments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: comment.body }),
    });
    return response.json();
  },

  async deleteComment(id: number): Promise<void> {
    await fetch(`/api/comments/${id}`, {
      method: 'DELETE',
    });
  },

  async likeComment(id: number): Promise<Comment> {
    const response = await fetch(`/api/comments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        likes: 1,
      }),
    });
    return response.json();
  },
};
