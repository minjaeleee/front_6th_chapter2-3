import { Plus, Search } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

import React, { useEffect } from 'react';

import { CommentForm } from '../entities/comment';
import { Post, PostDetail, PostForm, PostTable } from '../entities/post';
import { User, UserModal } from '../entities/user';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../shared';
import { useCommentsStore } from '../stores';
import { usePostsStore } from '../stores/posts';
import { useSearchStore } from '../stores/search';
import { useUIStore } from '../stores/ui';
import { useUsersStore } from '../stores/users';

const PostsManager = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const { fetchComments } = useCommentsStore();

  const {
    total,
    loading,
    skip,
    limit,
    fetchPosts,
    searchPosts,
    fetchPostsByTag,
    setSkip,
    setLimit,
  } = usePostsStore();

  const {
    searchQuery,
    sortBy,
    sortOrder,
    selectedTag,
    tags,
    setSearchQuery,
    setSortBy,
    setSortOrder,
    setSelectedTag,
    fetchTags,
  } = useSearchStore();

  const {
    showAddDialog,
    showEditDialog,
    showAddCommentDialog,
    showEditCommentDialog,
    showUserModal,
    setShowAddDialog,
    setShowEditDialog,
    setShowAddCommentDialog,
    setShowEditCommentDialog,
    setShowUserModal,
    setSelectedPost,
    setShowPostDetailDialog,
  } = useUIStore();

  const { selectedUser, fetchUser, setSelectedUser } = useUsersStore();

  // URL 업데이트 함수
  const updateURL = () => {
    const params = new URLSearchParams();
    if (skip) params.set('skip', skip.toString());
    if (limit) params.set('limit', limit.toString());
    if (searchQuery) params.set('search', searchQuery);
    if (sortBy) params.set('sortBy', sortBy);
    if (sortOrder) params.set('sortOrder', sortOrder);
    if (selectedTag) params.set('tag', selectedTag);
    navigate(`?${params.toString()}`);
  };

  // 게시물 상세 보기
  const openPostDetail = (post: Post) => {
    setSelectedPost(post);
    fetchComments(post.id);
    setShowPostDetailDialog(true);
  };

  // 사용자 모달 열기
  const openUserModal = async (user: User) => {
    await fetchUser(user.id);
    setShowUserModal(true);
  };

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    if (selectedTag) {
      fetchPostsByTag(selectedTag);
    } else {
      fetchPosts(skip, limit);
    }
    updateURL();
  }, [skip, limit, sortBy, sortOrder, selectedTag]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const newSkip = parseInt(params.get('skip') || '0');
    const newLimit = parseInt(params.get('limit') || '10');
    setSkip(newSkip);
    setLimit(newLimit);
    setSearchQuery(params.get('search') || '');
    setSortBy(params.get('sortBy') || '');
    setSortOrder(params.get('sortOrder') || 'asc');
    setSelectedTag(params.get('tag') || '');
  }, [location.search]);

  return (
    <Card className='mx-auto w-full max-w-6xl'>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          <span>게시물 관리자</span>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className='mr-2 h-4 w-4' />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col gap-4'>
          {/* 검색 및 필터 컨트롤 */}
          <div className='flex gap-4'>
            <div className='flex-1'>
              <div className='relative'>
                <Search className='text-muted-foreground absolute left-2 top-2.5 h-4 w-4' />
                <Input
                  placeholder='게시물 검색...'
                  className='pl-8'
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchQuery(e.target.value)
                  }
                  onKeyPress={(e: React.KeyboardEvent) =>
                    e.key === 'Enter' && searchPosts(searchQuery)
                  }
                />
              </div>
            </div>
            <Select
              value={selectedTag}
              onValueChange={value => {
                setSelectedTag(value);
                fetchPostsByTag(value);
                updateURL();
              }}
            >
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='태그 선택' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>모든 태그</SelectItem>
                {tags.map(tag => (
                  <SelectItem key={tag.url} value={tag.slug}>
                    {tag.slug}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='정렬 기준' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='none'>없음</SelectItem>
                <SelectItem value='id'>ID</SelectItem>
                <SelectItem value='title'>제목</SelectItem>
                <SelectItem value='reactions'>반응</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='정렬 순서' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='asc'>오름차순</SelectItem>
                <SelectItem value='desc'>내림차순</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 게시물 테이블 */}
          {loading ? (
            <div className='flex justify-center p-4'>로딩 중...</div>
          ) : (
            <PostTable
              onOpenPostDetail={openPostDetail}
              onOpenUserModal={openUserModal}
            />
          )}

          {/* 페이지네이션 */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <span>표시</span>
              <Select
                value={limit.toString()}
                onValueChange={value => setLimit(Number(value))}
              >
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='10' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='10'>10</SelectItem>
                  <SelectItem value='20'>20</SelectItem>
                  <SelectItem value='30'>30</SelectItem>
                </SelectContent>
              </Select>
              <span>항목</span>
            </div>
            <div className='flex gap-2'>
              <Button
                disabled={skip === 0}
                onClick={() => setSkip(Math.max(0, skip - limit))}
              >
                이전
              </Button>
              <Button
                disabled={skip + limit >= total}
                onClick={() => setSkip(skip + limit)}
              >
                다음
              </Button>
            </div>
          </div>
        </div>
      </CardContent>

      {/* 게시물 추가/수정 폼 */}
      <PostForm
        isOpen={showAddDialog}
        onOpenChange={setShowAddDialog}
        mode='add'
      />
      <PostForm
        isOpen={showEditDialog}
        onOpenChange={setShowEditDialog}
        mode='edit'
      />

      {/* 댓글 추가 대화상자 */}
      <CommentForm
        isOpen={showAddCommentDialog}
        onOpenChange={setShowAddCommentDialog}
        title='새 댓글 추가'
        submitText='댓글 추가'
      />

      {/* 댓글 수정 대화상자 */}
      <CommentForm
        isOpen={showEditCommentDialog}
        onOpenChange={setShowEditCommentDialog}
        title='댓글 수정'
        submitText='댓글 업데이트'
      />

      {/* 게시물 상세 보기 */}
      <PostDetail />

      {/* 사용자 모달 */}
      <UserModal />
    </Card>
  );
};

export default PostsManager;
