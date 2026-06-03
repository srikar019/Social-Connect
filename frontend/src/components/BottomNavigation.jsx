import React, { useState, useEffect, useRef } from 'react';
import { Home, Plus, Search } from 'lucide-react';

export default function BottomNavigation({ onHomeClick, onComposeClick, onSearchClick }) {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(615);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(() => {
      if (containerRef.current) {
        setWidth(containerRef.current.getBoundingClientRect().width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const height = 60;
  const r = 20; // Corner radius
  const dipRadius = 38; // Radius of center dip
  const dipDepth = 30; // Depth of center dip
  const centerX = width / 2;
  const startX = centerX - dipRadius;
  const endX = centerX + dipRadius;

  // SVG path for a bar with rounded top corners and a center curved notch
  const pathData = `
    M 0,${r} 
    Q 0,0 ${r},0 
    L ${startX},0 
    C ${startX + 12},0 ${startX + 16},${dipDepth} ${centerX},${dipDepth} 
    C ${centerX + 16},${dipDepth} ${endX - 12},0 ${endX},0 
    L ${width - r},0 
    Q ${width},0 ${width},${r} 
    L ${width},${height} 
    L 0,${height} 
    Z
  `;

  return (
    <div
      ref={containerRef}
      id="bottom-navigation-bar"
      style={{
        position: 'fixed',
        bottom: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '615px',
        maxWidth: 'calc(100% - 32px)',
        height: `${height}px`,
        zIndex: 1000,
        filter: 'drop-shadow(0 -4px 12px rgba(0, 0, 0, 0.05))',
      }}
    >
      {/* Background SVG with Cutout Notch */}
      <svg
        width="100%"
        height="100%"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
        }}
      >
        <path
          d={pathData}
          fill="var(--color-surface-container-lowest)"
          stroke="#000000"
          strokeWidth="1.5"
        />
      </svg>

      {/* Navigation Buttons container */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 40px',
        }}
      >
        {/* Left Action: Home/Feed */}
        <button
          onClick={onHomeClick}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-primary)',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-container-low)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          aria-label="Feed Home"
        >
          <Home size={22} strokeWidth={2.5} />
        </button>

        {/* Space filler for the center compose button overlay */}
        <div style={{ width: '60px' }} />

        {/* Right Action: Search */}
        <button
          onClick={onSearchClick}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-on-surface-variant)',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-container-low)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          aria-label="Focus Search"
        >
          <Search size={22} strokeWidth={2.5} />
        </button>
      </div>

      {/* Floating Center Compose Button */}
      <button
        onClick={onComposeClick}
        style={{
          position: 'absolute',
          top: '-18px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-on-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(124, 58, 237, 0.45)',
          border: 'none',
          cursor: 'pointer',
          zIndex: 1001,
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)';
          e.currentTarget.style.transform = 'translateX(-50%) scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--color-primary)';
          e.currentTarget.style.transform = 'translateX(-50%) scale(1)';
        }}
        aria-label="Compose Post"
      >
        <Plus size={24} strokeWidth={3} />
      </button>
    </div>
  );
}
