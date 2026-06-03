import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import CreatePost from './components/CreatePost';
import PostCard from './components/PostCard';
import Auth from './components/Auth';
import BottomNavigation from './components/BottomNavigation';
import { Search } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function App() {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Posts'); // 'All Posts' | 'Most Liked' | 'Most Commented'

  // Auth state
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  // Lightweight toast stub (no UI component)
  const addToast = (message) => {
    console.log('[Toast]', message);
  };

  // Fetch posts from backend API
  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/posts`);
      if (!response.ok) throw new Error('Failed to retrieve timeline posts');
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
      addToast('Error loading posts feed.');
    }
  };

  // Fetch posts upon loading and authentication
  useEffect(() => {
    if (token && currentUser) {
      fetchPosts();
    } else {
      setPosts([]);
    }
  }, [token, currentUser]);

  // Auth Success callback
  const handleAuthSuccess = (newToken, userPayload) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userPayload));
    setToken(newToken);
    setCurrentUser(userPayload);
  };

  // Log out callback
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setCurrentUser(null);
    addToast('Logged out successfully!');
  };

  // Likes toggler endpoint wrapper
  const handleLike = async (postId) => {
    if (!token) {
      addToast('Please login to like posts');
      return;
    }
    try {
      const response = await fetch(`${API_URL}/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update like status');

      // Update local posts array
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === postId || post.id === postId ? { ...post, likes: data.likes } : post))
      );
    } catch (err) {
      addToast(err.message);
    }
  };

  // Add Comment handler
  const handleAddComment = async (postId, commentText) => {
    if (!token) {
      addToast('Please login to add comments');
      return;
    }
    try {
      const response = await fetch(`${API_URL}/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: commentText })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to post comment');

      // Update post in state with new comments list
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === postId || post.id === postId ? { ...post, comments: data.comments } : post))
      );
    } catch (err) {
      addToast(err.message);
    }
  };

  // Compose new post
  const handleAddPost = async ({ text, image }) => {
    if (!token) {
      addToast('Please login to compose posts');
      return;
    }
    try {
      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text, image })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to post content');

      fetchPosts();
    } catch (err) {
      addToast(err.message);
    }
  };

  // Clickable hashtag handler
  const handleHashtagClick = (tag) => {
    setSearchQuery(tag);
    addToast(`Filtered feed by ${tag}`);
  };

  // Navigation actions
  const handleHomeClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleComposeClick = () => {
    const el = document.getElementById('post-compose-textarea');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.focus();
    }
  };

  const handleSearchClick = () => {
    const el = document.getElementById('search-posts-input');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.focus();
    }
  };

  // Filter & Search Logic
  const processedPosts = useMemo(() => {
    // Add runtime fields mapping Mongoose structures to React expectations
    let result = posts.map(post => ({
      ...post,
      id: post.id || post._id,
      likesCount: post.likes ? post.likes.length : 0,
      isLiked: post.likes && currentUser ? post.likes.includes(currentUser.handle) : false,
      isFollowing: false,
    }));

    // 1. Search Query Filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((post) => {
        const nameMatch = post.name?.toLowerCase().includes(query);
        const handleMatch = post.handle?.toLowerCase().includes(query);
        const textMatch = post.text?.toLowerCase().includes(query);
        return nameMatch || handleMatch || textMatch;
      });
    }

    // 2. Sort Logic based on Pills
    if (activeFilter === 'Most Liked') {
      result.sort((a, b) => {
        const aLikes = a.likes ? a.likes.length : 0;
        const bLikes = b.likes ? b.likes.length : 0;
        return bLikes - aLikes;
      });
    } else if (activeFilter === 'Most Commented') {
      result.sort((a, b) => {
        const aComments = a.comments ? a.comments.length : 0;
        const bComments = b.comments ? b.comments.length : 0;
        return bComments - aComments;
      });
    }

    // Adapt structures to match feed specs mapping
    return result.map(p => ({
      ...p,
      likes: p.likes ? p.likes.length : 0,
      isLiked: p.isLiked,
    }));
  }, [posts, searchQuery, activeFilter, currentUser]);

  // Main login wall gate
  if (!token || !currentUser) {
    return (
      <div className="app-container" style={{ minHeight: '100vh', justifyContent: 'center' }}>
        <Auth onAuthSuccess={handleAuthSuccess} addToast={addToast} />
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Top Header sticky */}
      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content View Wrapper */}
      <main className="main-content">

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-gutter-card)' }}>

          {/* Search Input Bar (Pill shaped) */}
          <div
            style={{
              position: 'relative',
              width: '100%',
            }}
          >
            <input
              id="search-posts-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users, posts..."
              style={{
                width: '100%',
                padding: '12px 16px 12px 42px',
                backgroundColor: 'var(--color-surface-container-lowest)',
                borderRadius: 'var(--rounded-full)',
                fontSize: '13px',
                color: 'var(--color-on-surface)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                transition: 'outline 0.15s ease-in-out',
              }}
              className="search-input-active"
            />
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-outline)',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '14px',
                  color: 'var(--color-outline)',
                  fontWeight: 'bold',
                }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Create Post composer */}
          <CreatePost
            onAddPost={handleAddPost}
            currentUser={currentUser}
            addToast={addToast}
          />

          {/* Filter Tabs (Pills) */}
          <div className="filter-tabs-container" id="feed-filter-tabs">
            {['All Posts', 'Most Liked', 'Most Commented'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`filter-tab ${activeFilter === filter ? 'active' : ''}`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Posts Feed Timeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-gutter-card)' }} id="posts-timeline">
            {processedPosts.length === 0 ? (
              <div
                className="card-base"
                style={{
                  textAlign: 'center',
                  padding: '40px',
                  color: 'var(--color-on-surface-variant)'
                }}
              >
                <p className="body-base">Be the first to post!</p>
              </div>
            ) : (
              processedPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onAddComment={handleAddComment}
                  onHashtagClick={handleHashtagClick}
                  addToast={addToast}
                />
              ))
            )}
          </div>
        </div>
      </main>

      {/* Floating Bottom Navigation bar */}
      <BottomNavigation
        onHomeClick={handleHomeClick}
        onComposeClick={handleComposeClick}
        onSearchClick={handleSearchClick}
      />

    </div>
  );
}
