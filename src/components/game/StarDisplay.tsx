import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarDisplayProps {
  stars: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export function StarDisplay({ stars, maxStars = 3, size = 'md', animated = false }: StarDisplayProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  };

  return (
    <div className="flex gap-1">
      {Array.from({ length: maxStars }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            sizeClasses[size],
            "transition-all duration-300",
            i < stars 
              ? "fill-star-gold text-star-gold" 
              : "fill-star-empty text-star-empty",
            animated && i < stars && "animate-star-pulse",
            animated && i < stars && `animation-delay-${i * 200}`
          )}
          style={animated && i < stars ? { animationDelay: `${i * 0.2}s` } : undefined}
        />
      ))}
    </div>
  );
}
