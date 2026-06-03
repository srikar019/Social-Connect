import React, { useState } from 'react';
import { Heart, MessageSquare, Share2, CornerDownRight, User } from 'lucide-react';

export default function PostCard({ post, onLike, onFollowToggle, onAddComment, onHashtagClick, addToast }) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [animateLike, setAnimateLike] = useState(false);

  const handleLikeClick = () => {
    setAnimateLike(true);
    onLike(post.id);
    setTimeout(() => setAnimateLike(false), 300);
  };

  const handleShareClick = () => {
    // Generate a mock shareable link
    const mockLink = `${window.location.origin}/post/${post.id}`;
    navigator.clipboard.writeText(mockLink).then(() => {
      addToast('Link copied to clipboard!');
    }).catch(() => {
      addToast('Failed to copy link.');
    });
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(post.id, commentText.trim());
    setCommentText('');
    addToast('Comment added!');
  };

  // Render text and highlight hashtags
  const renderBodyText = (text) => {
    if (!text) return null;
    const parts = text.split(/(\s+)/);
    return parts.map((part, index) => {
      if (part.startsWith('#') && part.length > 1) {
        return (
          <span
            key={index}
            onClick={() => onHashtagClick(part)}
            style={{
              color: 'var(--color-primary)',
              fontWeight: '600',
              cursor: 'pointer',
            }}
            className="hashtag-highlight"
            title={`Filter by ${part}`}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <article className="card-base" id={`post-${post.id}`}>
      {/* Header section (Avatar / Name / Follow) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Circular user icon container */}
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-surface-container)',
              color: 'var(--color-primary-dark)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              border: '1px solid var(--color-outline-variant)',
            }}
          >
            <User size={20} />
          </div>
          {/* User info */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="headline-sm" style={{ color: 'var(--color-on-surface)' }}>
              {post.name}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span className="label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                {post.handle}
              </span>
              <span style={{ fontSize: '10px', color: 'var(--color-outline)' }}>•</span>
              <span className="label-sm" style={{ color: 'var(--color-outline)' }}>
                {post.time}
              </span>
            </div>
          </div>
        </div>


      </div>

      {/* Body section (Text / Media) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p className="body-base" style={{ color: 'var(--color-on-surface)', whiteSpace: 'pre-line' }}>
          {renderBodyText(post.text)}
        </p>

        {post.image && (
          <div
            style={{
              borderRadius: 'var(--rounded-md)',
              overflow: 'hidden',
              maxHeight: '340px',
              border: '1px solid var(--color-outline-variant)',
              backgroundColor: 'var(--color-surface-container)',
              marginTop: '4px',
            }}
          >
            <img
              src={post.image}
              alt="Post content visualization"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        )}
      </div>

      {/* Divider */}
      <hr style={{ border: 0, borderBottom: '1px solid rgba(0,0,0,0.05)', margin: '4px 0' }} />

      {/* Footer section (Action metrics) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '2px 0' }}>
        {/* Like action */}
        <button
          onClick={handleLikeClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: post.isLiked ? 'var(--color-error)' : 'var(--color-on-surface-variant)',
          }}
          className={animateLike ? 'heart-pulse' : ''}
          id={`like-action-${post.id}`}
          aria-label={`${post.likes} Likes`}
        >
          <Heart
            size={20}
            strokeWidth={2}
            fill={post.isLiked ? 'var(--color-error)' : 'none'}
            style={{ transition: 'fill 0.2s ease' }}
          />
          <span className="label-md" style={{ color: 'var(--color-on-surface-variant)' }}>
            {post.likes}
          </span>
        </button>

        {/* Comment action */}
        <button
          onClick={() => setShowComments(!showComments)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: showComments ? 'var(--color-primary)' : 'var(--color-on-surface-variant)',
          }}
          id={`comment-action-${post.id}`}
          aria-label={`${post.comments.length} Comments`}
        >
          <MessageSquare size={20} strokeWidth={2} />
          <span className="label-md" style={{ color: 'var(--color-on-surface-variant)' }}>
            {post.comments.length}
          </span>
        </button>

        {/* Share action */}
        <button
          onClick={handleShareClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--color-on-surface-variant)',
          }}
          id={`share-action-${post.id}`}
          aria-label="Share post link"
        >
          <Share2 size={20} strokeWidth={2} />
        </button>
      </div>

      {/* Comments Drawer/Expandable Panel */}
      {showComments && (
        <div
          style={{
            marginTop: '8px',
            backgroundColor: 'var(--color-surface-container-low)',
            borderRadius: 'var(--rounded-md)',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            border: '1px solid rgba(0, 0, 0, 0.05)',
          }}
        >
          {/* Write comment */}
          <form
            onSubmit={handleCommentSubmit}
            style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
          >
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              style={{
                flex: 1,
                padding: '8px 16px',
                borderRadius: 'var(--rounded-full)',
                backgroundColor: 'var(--color-surface-container-lowest)',
                fontSize: '12px',
                border: '1px solid var(--color-outline-variant)',
                color: 'var(--color-on-surface)',
              }}
              id={`comment-input-${post.id}`}
              aria-label="Write a comment"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="btn-primary"
              style={{ padding: '6px 14px', fontSize: '11px' }}
            >
              Reply
            </button>
          </form>

          {/* List existing comments */}
          {post.comments.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
              {post.comments.map((comment) => (
                <div
                  key={comment.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    padding: '4px 0',
                  }}
                >
                  <CornerDownRight size={14} color="var(--color-outline)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="label-sm" style={{ fontWeight: '600', color: 'var(--color-on-surface)' }}>
                        {comment.name}
                      </span>
                      <span className="label-sm" style={{ fontSize: '10px', color: 'var(--color-on-surface-variant)' }}>
                        {comment.handle}
                      </span>
                      <span style={{ fontSize: '9px', color: 'var(--color-outline)' }}>•</span>
                      <span style={{ fontSize: '9px', color: 'var(--color-outline)' }}>
                        {comment.time || 'Just now'}
                      </span>
                    </div>
                    <p className="body-base" style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
