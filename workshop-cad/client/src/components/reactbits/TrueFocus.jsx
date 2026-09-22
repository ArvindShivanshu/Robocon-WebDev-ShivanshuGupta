import React, { useState, useRef, useEffect } from 'react';

export default function TrueFocus({
  sentence = 'PRECISION MECHANICS • ULTRA SIGNAL INTEGRITY • CO-DESIGN',
  manualMode = false,
  blurAmount = 3,
  borderColor = '#00e5ff',
  glowColor = 'rgba(0, 229, 255, 0.35)',
  animationDuration = 0.4,
  className = '',
  style = {}
}) {
  const words = sentence.split(' ');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastActiveIndex, setLastActiveIndex] = useState(null);
  const containerRef = useRef(null);
  const wordRefs = useRef([]);
  const [focusRect, setFocusRect] = useState({ x: 0, y: 0, width: 0, height: 0, active: false });

  useEffect(() => {
    if (!manualMode) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % words.length);
      }, 2400);
      return () => clearInterval(interval);
    }
  }, [manualMode, words.length]);

  useEffect(() => {
    const activeEl = wordRefs.current[currentIndex];
    const containerEl = containerRef.current;
    if (activeEl && containerEl) {
      const cRect = containerEl.getBoundingClientRect();
      const elRect = activeEl.getBoundingClientRect();
      setFocusRect({
        x: elRect.left - cRect.left - 4,
        y: elRect.top - cRect.top - 2,
        width: elRect.width + 8,
        height: elRect.height + 4,
        active: true
      });
      setLastActiveIndex(currentIndex);
    }
  }, [currentIndex]);

  return (
    <div
      ref={containerRef}
      className={`true-focus-container ${className}`}
      style={{
        position: 'relative',
        display: 'inline-flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '8px',
        ...style
      }}
    >
      {/* Animated Focus Box */}
      {focusRect.active && (
        <div
          style={{
            position: 'absolute',
            left: `${focusRect.x}px`,
            top: `${focusRect.y}px`,
            width: `${focusRect.width}px`,
            height: `${focusRect.height}px`,
            borderRadius: '4px',
            border: `1.5px solid ${borderColor}`,
            boxShadow: `0 0 12px ${glowColor}`,
            transition: `all ${animationDuration}s cubic-bezier(0.2, 0.8, 0.2, 1)`,
            pointerEvents: 'none',
            zIndex: 1
          }}
        >
          {/* Neon Corner Accents */}
          <span style={{ position: 'absolute', top: '-3px', left: '-3px', width: '6px', height: '6px', borderTop: `2px solid ${borderColor}`, borderLeft: `2px solid ${borderColor}` }} />
          <span style={{ position: 'absolute', top: '-3px', right: '-3px', width: '6px', height: '6px', borderTop: `2px solid ${borderColor}`, borderRight: `2px solid ${borderColor}` }} />
          <span style={{ position: 'absolute', bottom: '-3px', left: '-3px', width: '6px', height: '6px', borderBottom: `2px solid ${borderColor}`, borderLeft: `2px solid ${borderColor}` }} />
          <span style={{ position: 'absolute', bottom: '-3px', right: '-3px', width: '6px', height: '6px', borderBottom: `2px solid ${borderColor}`, borderRight: `2px solid ${borderColor}` }} />
        </div>
      )}

      {words.map((word, idx) => {
        const isCurrent = idx === currentIndex;
        return (
          <span
            key={idx}
            ref={(el) => (wordRefs.current[idx] = el)}
            onMouseEnter={() => setCurrentIndex(idx)}
            style={{
              position: 'relative',
              zIndex: 2,
              cursor: 'pointer',
              filter: isCurrent ? 'blur(0px)' : `blur(${blurAmount}px)`,
              opacity: isCurrent ? 1 : 0.45,
              transition: `filter ${animationDuration}s ease, opacity ${animationDuration}s ease`,
              fontWeight: isCurrent ? 700 : 500
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
}
