import { useLocation, useNavigate } from 'react-router-dom';

import { useEffect } from 'react';

import { CommentForm } from '../entities/comment';
import { Post, PostDetail, PostForm, PostTable } from '../entities/post';
import { UserModal } from '../entities/user';
import {
  PostsManagerControls,
  PostsManagerHeader,
  PostsManagerPagination,
} from '../features/post-management/ui';
import { Card, CardContent } from '../shared';
import { useCommentsStore } from '../stores';
import { usePostsStore } from '../stores/posts';
import { useSearchStore } from '../stores/search';
import { useUIStore } from '../stores/ui';

const PostsManager = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
    setShowAddDialog,
    setShowEditDialog,
    setShowAddCommentDialog,
    setShowEditCommentDialog,
    setSelectedPost,
    setShowPostDetailDialog,
  } = useUIStore();

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
      <PostsManagerHeader onAddPost={() => setShowAddDialog(true)} />
      <CardContent>
        <div className='flex flex-col gap-4'>
          {/* 검색 및 필터 컨트롤 */}
          <PostsManagerControls
            searchQuery={searchQuery}
            sortBy={sortBy}
            sortOrder={sortOrder}
            selectedTag={selectedTag}
            tags={tags}
            onSearchChange={setSearchQuery}
            onSortByChange={setSortBy}
            onSortOrderChange={setSortOrder}
            onTagChange={(tag: string) => {
              setSelectedTag(tag);
              fetchPostsByTag(tag);
              updateURL();
            }}
            onSearch={searchPosts}
          />

          {/* 게시물 테이블 */}
          {loading ? (
            <div className='flex justify-center p-4'>로딩 중...</div>
          ) : (
            <PostTable onOpenPostDetail={openPostDetail} />
          )}

          {/* 페이지네이션 */}
          <PostsManagerPagination
            limit={limit}
            skip={skip}
            total={total}
            onLimitChange={setLimit}
            onSkipChange={setSkip}
          />
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
