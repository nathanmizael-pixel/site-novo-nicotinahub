import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Routes, useLocation, type Location } from 'react-router-dom';
import { useReducedMotion } from '@/hooks/useMotion';
import { cn } from '@/lib/utils';

const EXIT_MS = 180;
const ENTER_MS = 280;

export function RouteTransition({ children }: { children: ReactNode }) {
  const location = useLocation();
  const reduced = useReducedMotion();
  const [displayLocation, setDisplayLocation] = useState<Location>(location);
  const [phase, setPhase] = useState<'idle' | 'exiting' | 'entering'>('idle');
  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }

    if (location.key === displayLocation.key) return;

    if (reduced) {
      setDisplayLocation(location);
      setPhase('idle');
      return;
    }

    setPhase('exiting');
    const exitTimer = setTimeout(() => {
      setDisplayLocation(location);
      setPhase('entering');
      const enterTimer = setTimeout(() => setPhase('idle'), ENTER_MS);
      return () => clearTimeout(enterTimer);
    }, EXIT_MS);

    return () => clearTimeout(exitTimer);
  }, [location, displayLocation.key, reduced]);

  const phaseClass =
    phase === 'exiting' ? 'page-transition-exit' : phase === 'entering' ? 'page-transition-enter' : '';
  const activeDuration = phase === 'exiting' ? EXIT_MS : phase === 'entering' ? ENTER_MS : 0;

  return (
    <div
      className={cn('w-full', phaseClass)}
      style={activeDuration ? { animationDuration: `${activeDuration}ms`, willChange: 'opacity, transform' } : undefined}
    >
      <Routes location={displayLocation}>{children}</Routes>
    </div>
  );
}
