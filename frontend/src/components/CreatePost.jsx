import React, { useState, useRef, useEffect } from 'react';
import { Image as ImageIcon, Smile, X } from 'lucide-react';

const EMOJIS = ['😀', '😍', '🔥', '🌅', '🚀', '🎉', '👏', '💡', '✨', '💻'];

export default function CreatePost({ onAddPost, currentUser, addToast }) {
  const [text, setText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const emojiRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('Please select a valid image file.');
      return;
    }

    // Limit size to 5MB to avoid payload issues
    if (file.size > 5 * 1024 * 1024) {
      addToast('Image size should be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result); // Base64 Data URL
    };
    reader.readAsDataURL(file);
  };

  const handlePost = () => {
    if (!text.trim() && !selectedImage) return;

    onAddPost({
      text,
      image: selectedImage,
    });

    // Reset state
    setText('');
    setSelectedImage(null);
    setShowEmojiPicker(false);
    
    // Clear file input value to allow uploading the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    addToast('Post published successfully!');
  };

  const handleAddEmoji = (emoji) => {
    setText((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="card-base" id="create-post-card">
      <h2 className="headline-md" style={{ color: 'var(--color-on-surface)' }}>
        Create Post
      </h2>

      {/* Main Textarea Container */}
      <div 
        style={{ 
          backgroundColor: 'var(--color-surface-container-low)', 
          borderRadius: 'var(--rounded-default)',
          padding: '12px',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        <textarea
          id="post-compose-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's on your mind?"
          style={{
            width: '100%',
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: '13px',
            lineHeight: '18px',
            color: 'var(--color-on-surface)',
            minHeight: '80px',
          }}
          aria-label="Post text content"
        />

        {/* Selected Image Preview */}
        {selectedImage && (
          <div style={{ position: 'relative', borderRadius: 'var(--rounded-md)', overflow: 'hidden' }}>
            <img 
              src={selectedImage} 
              alt="Attached content preview" 
              style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} 
            />
            <button
              onClick={() => {
                setSelectedImage(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                color: '#fff',
                borderRadius: '50%',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Remove attached image"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Hidden File Input for Native Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
        id="native-image-uploader"
        aria-label="Upload real image file"
      />

      {/* Actions and Submit Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
        
        {/* Left Action Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          
          {/* Image Attachment Trigger */}
          <button
            id="attach-image-button"
            onClick={() => fileInputRef.current.click()}
            style={{
              padding: '8px',
              borderRadius: 'var(--rounded-full)',
              color: 'var(--color-on-surface-variant)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Attach real image file"
          >
            <ImageIcon size={20} strokeWidth={2} />
          </button>

          {/* Emoji Trigger */}
          <div ref={emojiRef} style={{ position: 'relative' }}>
            <button
              id="insert-emoji-button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              style={{
                padding: '8px',
                borderRadius: 'var(--rounded-full)',
                color: 'var(--color-on-surface-variant)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Insert Emoji"
            >
              <Smile size={20} strokeWidth={2} />
            </button>

            {showEmojiPicker && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '40px',
                  left: '0',
                  backgroundColor: 'var(--color-surface-container-lowest)',
                  border: '1px solid var(--color-outline-variant)',
                  borderRadius: 'var(--rounded-md)',
                  padding: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  zIndex: 10,
                  display: 'flex',
                  gap: '6px',
                  flexWrap: 'wrap',
                  width: '180px',
                }}
              >
                {EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleAddEmoji(emoji)}
                    style={{
                      fontSize: '18px',
                      padding: '4px',
                      borderRadius: 'var(--rounded-default)',
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Post Button */}
        <button
          id="post-submit-button"
          onClick={handlePost}
          disabled={!text.trim() && !selectedImage}
          className="btn-primary"
        >
          Post
        </button>
      </div>
    </div>
  );
}
