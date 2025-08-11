// 공통 타입 정의

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  tags?: string[];
  reactions?: {
    likes: number;
    dislikes: number;
  };
  author?: any; // User 타입은 entities/user에서 import
}

export interface Tag {
  url: string;
  slug: string;
}

export interface CreatePost {
  title: string;
  body: string;
  userId: number;
}

export interface UpdatePost {
  title: string;
  body: string;
}

export interface SearchFilters {
  skip: number;
  limit: number;
  searchQuery: string;
  sortBy: string;
  sortOrder: string;
  selectedTag: string;
}
