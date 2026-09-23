import React, { useRef, useEffect, useState } from 'react';

/**
 * ScrollCard / AnimatedBlock from reactbits.dev
 * Animates cards smoothly into view with perspective depth, scale, and subtle scroll parallax as the user scrolls down the page.
 */
export default function ScrollCard({
  children,
  className = '',
  style = {},
  direction = 'up', // 'up', 'down', 'left', 'right'
  delay = 0, // stagger delay in ms
  duration = 650, // transition duration in ms
  distance = 40, // initial offset distance in px
  scale = 0.94, // initial scale
  rotateX = 5, // 3D tilt angle on enter
  parallaxSpeed = 0.05, // subtle scroll-driven parallax rate
  threshold = 0.12,
  once = true
}) {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [parallaxY, setParallaxY] = useState(0);

  // Entrance observer
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    if (typeof window === 'undefined' || !window.IntersectionObserver) {
      setIsVisible(true);
      return;
    }

    // Immediate check if already inside or near viewport on mount
    const rect = el.getBoundingClientRect();
    if (rect.top < (window.innerHeight || 800) + 100 && rect.bottom > -100) {
      setIsVisible(true);
      if (once) return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold: Math.min(threshold, 0.05), rootMargin: '80px 0px' }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, [threshold, once]);

  // Subtle scroll parallax while card is in viewport
  useEffect(() => {
    if (!parallaxSpeed) return;
    let animFrame = 0;

    const handleScroll = () => {
      const el = cardRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 800;
      
      // If card is inside/near viewport, calculate subtle parallax
      if (rect.top < viewportHeight && rect.bottom > 0) {
        const centerDiff = (rect.top + rect.height / 2) - (viewportHeight / 2);
        const shift = -centerDiff * parallaxSpeed;
        setParallaxY(Math.round(shift * 10) / 10);
      }
    };

    const onScrollRaf = () => {
      animFrame = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScrollRaf, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScrollRaf);
      cancelAnimationFrame(animFrame);
    };
  }, [parallaxSpeed]);

  // Directional initial transforms
  const getInitialTransform = () => {
    switch (direction) {
      case 'up':
        return `translate3d(0, ${distance}px, 0) scale(${scale}) rotateX(${rotateX}deg)`;
      case 'down':
        return `translate3d(0, -${distance}px, 0) scale(${scale}) rotateX(-${rotateX}deg)`;
      case 'left':
        return `translate3d(${distance}px, 0, 0) scale(${scale})`;
      case 'right':
        return `translate3d(-${distance}px, 0, 0) scale(${scale})`;
      default:
        return `translate3d(0, ${distance}px, 0) scale(${scale})`;
    }
  };

  const activeTransform = isVisible
    ? `translate3d(0, ${parallaxY}px, 0) scale(1) rotateX(0deg)`
    : getInitialTransform();

  return (
    <div
      ref={cardRef}
      className={`reactbits-scroll-card ${className}`.trim()}
      style={{
        opacity: 1,
        transform: activeTransform,
        transformOrigin: 'center center',
        perspective: '1000px',
        willChange: 'transform, opacity',
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        ...style
      }}
    >
      {children}
    </div>
  );
}
