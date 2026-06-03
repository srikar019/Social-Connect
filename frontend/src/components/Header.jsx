import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Mail } from 'lucide-react';

export default function Header({ currentUser, onLogout }) {
  const [showProfile, setShowProfile] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      id="top-header"
      style={{
        position: 'fixed',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)',
        maxWidth: '615px',
        height: '56px',
        backgroundColor: 'var(--color-surface-container-lowest)',
        border: '1px solid var(--color-outline-variant)',
        borderRadius: '9999px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        zIndex: 1000,
        boxShadow: 'var(--shadow-ambient)',
      }}
    >
      {/* Left: Empty spacer for symmetry */}
      <div style={{ width: '40px' }} />

      {/* Center: Brand Title */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <span
          className="display-title"
          style={{
            color: 'var(--color-on-surface)',
            fontSize: '24px',
            fontWeight: '800',
            letterSpacing: '-0.025em',
            userSelect: 'none'
          }}
        >
          PostHub
        </span>
      </div>

      {/* Right: Profile Button with Dropdown */}
      <div style={{ position: 'relative' }} ref={dropdownRef}>
        <button
          id="profile-button-trigger"
          onClick={() => setShowProfile(!showProfile)}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--rounded-full)',
            border: showProfile ? '1px solid var(--color-primary)' : '1px solid var(--color-outline-variant)',
            backgroundColor: showProfile ? 'var(--color-surface-container-low)' : 'transparent',
            color: showProfile ? 'var(--color-primary)' : 'var(--color-on-surface-variant)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-surface-container-low)';
            e.currentTarget.style.color = 'var(--color-primary)';
            e.currentTarget.style.borderColor = 'var(--color-primary)';
          }}
          onMouseLeave={(e) => {
            if (!showProfile) {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--color-on-surface-variant)';
              e.currentTarget.style.borderColor = 'var(--color-outline-variant)';
            }
          }}
          aria-label="Profile"
        >
          <User size={18} />
        </button>

        {/* Profile Dropdown */}
        {showProfile && (
          <div
            style={{
              position: 'absolute',
              top: '52px',
              right: '0',
              width: '260px',
              backgroundColor: 'var(--color-surface-container-lowest)',
              border: '1px solid var(--color-outline-variant)',
              borderRadius: 'var(--rounded-lg)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              zIndex: 1001,
              animation: 'toastFadeIn 0.2s ease forwards',
            }}
          >
            {/* User avatar circle + name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-surface-container)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--color-outline-variant)',
                  flexShrink: 0,
                }}
              >
                <User size={20} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <span className="headline-sm" style={{ color: 'var(--color-on-surface)' }}>
                  {currentUser?.name || 'User'}
                </span>
                <span className="label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                  {currentUser ? `@${currentUser.name.toLowerCase().replace(/\s+/g, '')}` : ''}
                </span>
              </div>
            </div>

            {/* Divider */}
            <hr style={{ border: 0, borderBottom: '1px solid rgba(0,0,0,0.06)', margin: '0' }} />

            {/* Profile details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {currentUser?.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mail size={14} color="var(--color-outline)" />
                  <span className="label-md" style={{ color: 'var(--color-on-surface-variant)' }}>
                    {currentUser.email}
                  </span>
                </div>
              )}

              {currentUser?.bio && (
                <p className="body-base" style={{ color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
                  {currentUser.bio}
                </p>
              )}
            </div>

            {/* Divider */}
            <hr style={{ border: 0, borderBottom: '1px solid rgba(0,0,0,0.06)', margin: '0' }} />

            {/* Logout button */}
            <button
              onClick={() => {
                setShowProfile(false);
                onLogout();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                borderRadius: 'var(--rounded-default)',
                color: 'var(--color-error)',
                fontSize: '13px',
                fontWeight: '600',
                width: '100%',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-error-container)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <LogOut size={16} />
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
