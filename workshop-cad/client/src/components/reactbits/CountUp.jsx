import React, { useState, useEffect, useRef } from 'react';

export default function CountUp({
  to = 0,
  from = 0,
  duration = 2,
  decimals = 0,
  separator = ',',
  className = '',
  style = {},
  prefix = '',
  suffix = ''
}) {
  const [currentValue, setCurrentValue] = useState(from);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      // Ease out expo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const value = from + (to - from) * ease;
      setCurrentValue(value);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animationFrame = requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [to, from, duration]);

  const formatted = currentValue.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });

  return (
    <span ref={ref} className={`count-up ${className}`} style={{ ...style }}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
