import React, { useEffect, useState, useCallback } from 'react';

/**
 * Hook for page entry animation
 */
export function usePageEntry(delay = 0) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return isVisible;
}

/**
 * Hook for stagger animations on lists
 */
export function useStagger(itemCount: number, baseDelay = 50, maxDelay = 300) {
  const delays = Array.from({ length: itemCount }, (_, i) =>
    Math.min(baseDelay * (i + 1), maxDelay)
  );
  return delays;
}

/**
 * Hook for scroll-triggered reveal animations
 */
export function useScrollReveal(options: IntersectionObserverInit = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  const elementRef = useCallback((node: HTMLElement | null) => {
    if (hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
        ...options,
      }
    );

    if (node) {
      observer.observe(node);
    }

    return () => observer.disconnect();
  }, [hasAnimated, options]);

  return { ref: elementRef, isVisible };
}

/**
 * Hook for reduced motion preference
 */
export function useReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReduced(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReduced;
}

/**
 * Hook for scroll position
 */
export function useScrollY() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollY;
}

/**
 * Hook for parallax offset
 */
export function useParallax(speed = 0.3) {
  const scrollY = useScrollY();
  return scrollY * speed;
}

/**
 * Generate stagger class names
 */
export function getStaggerClass(index: number, base = 'stagger') {
  if (index <= 8) {
    return `${base}-${index + 1}`;
  }
  return `${base}-8`;
}

/**
 * Page transition class names
 */
export const pageTransitions = {
  enter: 'page-enter animate-fade-in-up',
  enterFast: 'page-enter animate-fade-in',
  exit: 'page-exit animate-fade-in',
  reveal: 'animate-reveal-up',
  revealDown: 'animate-reveal-down',
};

/**
 * Stagger children with Framer Motion-like API
 */
export function staggerChildren(
  children: React.ReactNode,
  baseDelay = 50,
  maxDelay = 300
) {
  return React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) return child;

    const delay = Math.min(baseDelay * (index + 1), maxDelay);
    return React.cloneElement(child as React.ReactElement<Record<string, unknown>>, {
      style: {
        ...(child.props.style || {}),
        animationDelay: `${delay}ms`,
      } as React.CSSProperties,
    });
  });
}

/**
 * Magnetic hover effect
 */
export function useMagnetic(strength = 0.3) {
  const [transform, setTransform] = useState({ x: 0, y: 0 });
  const ref = useCallback((node: HTMLElement | null) => {
    if (!node) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = node.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;
      setTransform({ x: deltaX, y: deltaY });
    };

    const handleMouseLeave = () => {
      setTransform({ x: 0, y: 0 });
    };

    node.addEventListener('mousemove', handleMouseMove);
    node.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      node.removeEventListener('mousemove', handleMouseMove);
      node.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);

  return { ref, transform };
}

/**
 * Ripple effect on click
 */
export function useRipple() {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const triggerRipple = useCallback((event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const id = Date.now();

    setRipples(prev => [...prev, { x, y, id }]);

    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 400);
  }, []);

  return { ripples, triggerRipple };
}