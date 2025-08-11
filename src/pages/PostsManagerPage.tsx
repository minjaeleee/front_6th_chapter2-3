import {
  Edit2,
  MessageSquare,
  Plus,
  Search,
  ThumbsDown,
  ThumbsUp,
  Trash2,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

import React, { useEffect } from 'react';

import { CommentForm, CommentList } from '../entities/comment';
import { Post, UpdatePost } from '../entities/post';
import { User, UserAvatar, UserModal } from '../entities/user';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
} from '../shared';
import { highlightText } from '../shared/lib';
import { useCommentsStore } from '../stores';
import { usePostsStore } from '../stores/posts';
import { useSearchStore } from '../stores/search';
import { useUIStore } from '../stores/ui';
import { useUsersStore } from '../stores/users';

const PostsManager = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const {
    comments,
    fetchComments,
    addComment,
    updateComment,
    deleteComment,
    likeComment,
  } = useCommentsStore();

  const {
    posts,
    total,
    loading,
    skip,
    limit,
    fetchPosts,
    addPost,
    updatePost,
    deletePost,
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
    showPostDetailDialog,
    showUserModal,
    newPost,
    newComment,
    selectedPost,
    selectedComment,
    setShowAddDialog,
    setShowEditDialog,
    setShowAddCommentDialog,
    setShowEditCommentDialog,
    setShowPostDetailDialog,
    setShowUserModal,
    setNewPost,
    setNewComment,
    setSelectedPost,
    setSelectedComment,
    resetNewPost,
    resetNewComment,
  } = useUIStore();

  const { fetchUser } = useUsersStore();

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

  // 게시물 추가
  const handleAddPost = async () => {
    await addPost(newPost);
    setShowAddDialog(false);
    resetNewPost();
  };

  // 게시물 업데이트
  const handleUpdatePost = async () => {
    if (selectedPost) {
      const updateData: UpdatePost = {
        title: selectedPost.title,
        body: selectedPost.body,
      };
      await updatePost(selectedPost.id, updateData);
      setShowEditDialog(false);
    }
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

  // 게시물 테이블 렌더링
  const renderPostTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='w-[50px]'>ID</TableHead>
          <TableHead>제목</TableHead>
          <TableHead className='w-[150px]'>작성자</TableHead>
          <TableHead className='w-[150px]'>반응</TableHead>
          <TableHead className='w-[150px]'>작업</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map(post => (
          <TableRow key={post.id}>
            <TableCell>{post.id}</TableCell>
            <TableCell>
              <div className='space-y-1'>
                <div>{highlightText(post.title, searchQuery)}</div>

                <div className='flex flex-wrap gap-1'>
                  {post.tags?.map(tag => (
                    <span
                      key={tag}
                      className={`cursor-pointer rounded-[4px] px-1 text-[9px] font-semibold ${
                        selectedTag === tag
                          ? 'bg-blue-500 text-white hover:bg-blue-600'
                          : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      }`}
                      onClick={() => {
                        setSelectedTag(tag);
                        updateURL();
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </TableCell>
            <TableCell>
              {post.author && (
                <UserAvatar
                  user={post.author}
                  size='md'
                  onClick={openUserModal}
                />
              )}
            </TableCell>
            <TableCell>
              <div className='flex items-center gap-2'>
                <ThumbsUp className='h-4 w-4' />
                <span>{post.reactions?.likes || 0}</span>
                <ThumbsDown className='h-4 w-4' />
                <span>{post.reactions?.dislikes || 0}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className='flex items-center gap-2'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => openPostDetail(post)}
                >
                  <MessageSquare className='h-4 w-4' />
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => {
                    setSelectedPost(post);
                    setShowEditDialog(true);
                  }}
                >
                  <Edit2 className='h-4 w-4' />
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => deletePost(post.id)}
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

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
            renderPostTable()
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

      {/* 게시물 추가 대화상자 */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 게시물 추가</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <Input
              placeholder='제목'
              value={newPost.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewPost({ ...newPost, title: e.target.value })
              }
            />
            <Textarea
              rows={30}
              placeholder='내용'
              value={newPost.body}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setNewPost({ ...newPost, body: e.target.value })
              }
            />
            <Input
              type='number'
              placeholder='사용자 ID'
              value={newPost.userId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewPost({ ...newPost, userId: Number(e.target.value) })
              }
            />
            <Button onClick={handleAddPost}>게시물 추가</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 게시물 수정 대화상자 */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>게시물 수정</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <Input
              placeholder='제목'
              value={selectedPost?.title || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSelectedPost(
                  selectedPost
                    ? { ...selectedPost, title: e.target.value }
                    : null
                )
              }
            />
            <Textarea
              rows={30}
              placeholder='내용'
              value={selectedPost?.body || ''}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setSelectedPost(
                  selectedPost
                    ? { ...selectedPost, body: e.target.value }
                    : null
                )
              }
            />
            <Button onClick={handleUpdatePost}>게시물 업데이트</Button>
          </div>
        </DialogContent>
      </Dialog>

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

      {/* 게시물 상세 보기 대화상자 */}
      <Dialog
        open={showPostDetailDialog}
        onOpenChange={setShowPostDetailDialog}
      >
        <DialogContent className='max-w-3xl'>
          <DialogHeader>
            <DialogTitle>
              {highlightText(selectedPost?.title || '', searchQuery)}
            </DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <p>{highlightText(selectedPost?.body || '', searchQuery)}</p>
            {selectedPost && <CommentList />}
          </div>
        </DialogContent>
      </Dialog>

      {/* 사용자 모달 */}
      <UserModal />
    </Card>
  );
};

export default PostsManager;
