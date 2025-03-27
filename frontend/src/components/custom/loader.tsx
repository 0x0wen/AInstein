import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface CreativeLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'default' | 'primary' | 'secondary' | 'accent';
  text?: string;
  showText?: boolean;
  className?: string;
}

export function CreativeLoader({
  size = 'md',
  color = 'primary',
  text = 'Loading',
  showText = true,
  className,
}: CreativeLoaderProps) {
  const [dots, setDots] = useState<string>('.');
  const [particles, setParticles] = useState<
    Array<{ id: number; delay: number; scale: number }>
  >([]);

  // Size mapping
  const sizeMap = {
    sm: {
      container: 'w-16 h-16',
      text: 'text-sm',
      particleCount: 6,
    },
    md: {
      container: 'w-24 h-24',
      text: 'text-base',
      particleCount: 8,
    },
    lg: {
      container: 'w-32 h-32',
      text: 'text-lg',
      particleCount: 10,
    },
    xl: {
      container: 'w-40 h-40',
      text: 'text-xl',
      particleCount: 12,
    },
  };

  // Color mapping
  const colorMap = {
    default: 'bg-gray-500',
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    accent: 'bg-blue-500',
  };

  // Animate the dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '.' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Generate particles
  useEffect(() => {
    const particleCount = sizeMap[size].particleCount;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      delay: Math.random() * 2,
      scale: 0.5 + Math.random() * 0.5,
    }));
    setParticles(newParticles);
  }, [size]);

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div
        className={cn(
          'relative flex items-center justify-center',
          sizeMap[size].container,
        )}
        role="status"
        aria-label={`${text} in progress`}
      >
        {/* Center circle */}
        <div
          className={cn(
            'absolute w-1/3 h-1/3 rounded-full animate-pulse',
            colorMap[color],
          )}
        />

        {/* Orbiting particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-full h-full"
            style={{
              animation: `spin ${3 + particle.delay}s linear infinite`,
              animationDelay: `${particle.delay}s`,
            }}
          >
            <div
              className={cn('absolute w-2 h-2 rounded-full', colorMap[color])}
              style={{
                top: '10%',
                left: '50%',
                transform: `translateX(-50%) scale(${particle.scale})`,
                opacity: 0.7 * particle.scale,
                animation: `pulse ${1 + particle.delay}s ease-in-out infinite alternate`,
              }}
            />
          </div>
        ))}

        {/* Rotating ring */}
        <div
          className={cn(
            'absolute w-2/3 h-2/3 rounded-full border-2 border-dashed animate-spin',
            `border-${color === 'default' ? 'gray-500' : color}`,
          )}
          style={{ animationDuration: '8s' }}
        />

        {/* Counterrotating ring */}
        <div
          className={cn(
            'absolute w-full h-full rounded-full border-2 border-dotted animate-spin',
            `border-${color === 'default' ? 'gray-500' : color}`,
          )}
          style={{ animationDuration: '12s', animationDirection: 'reverse' }}
        />
      </div>

      {showText && (
        <div
          className={cn(
            'mt-4 font-medium animate-pulse',
            sizeMap[size].text,
            color === 'default' ? 'text-gray-700' : `text-${color}`,
          )}
        >
          {text}
          <span className="inline-block w-8">{dots}</span>
        </div>
      )}
    </div>
  );
}
