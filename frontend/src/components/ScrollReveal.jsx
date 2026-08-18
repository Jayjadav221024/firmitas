import { useEffect, useRef, useState } from 'react';

function ScrollReveal({
  children,
  animation = 'fade-in-up', // fade-in, fade-in-up, fade-in-down, fade-in-left, fade-in-right, scale-up
  delay = 0, // ms
  duration = 750, // ms
  threshold = 0.08,
  once = true,
  className = '',
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, once]);

  const getAnimationStyles = () => {
    // Check user preference for reduced motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return {};
    }

    const baseTransition = {
      transitionProperty: 'opacity, transform',
      transitionDuration: `${duration}ms`,
      transitionDelay: `${delay}ms`,
      transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)', // easeOutExpo
      willChange: 'opacity, transform',
    };

    if (isVisible) {
      return {
        ...baseTransition,
        opacity: 1,
        transform: 'translate(0, 0) scale(1)',
      };
    }

    let transform = 'translate(0, 0) scale(1)';
    if (animation === 'fade-in-up') transform = 'translateY(24px)';
    else if (animation === 'fade-in-down') transform = 'translateY(-24px)';
    else if (animation === 'fade-in-left') transform = 'translateX(-24px)';
    else if (animation === 'fade-in-right') transform = 'translateX(24px)';
    else if (animation === 'scale-up') transform = 'scale(0.96)';

    return {
      ...baseTransition,
      opacity: 0,
      transform,
    };
  };

  return (
    <div ref={ref} style={getAnimationStyles()} className={className}>
      {children}
    </div>
  );
}

export default ScrollReveal;
