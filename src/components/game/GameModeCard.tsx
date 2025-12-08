import { cn } from '@/lib/utils';
import { StarDisplay } from './StarDisplay';

interface GameModeCardProps {
  title: string;
  description: string;
  icon: string;
  colorClass: string;
  stars: number;
  maxStars: number;
  onClick: () => void;
}

export function GameModeCard({ 
  title, 
  description, 
  icon, 
  colorClass, 
  stars, 
  maxStars, 
  onClick 
}: GameModeCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative w-full p-6 rounded-2xl shadow-lg",
        "bg-card border-4 border-transparent",
        "hover:scale-105 hover:shadow-xl transition-all duration-300",
        "focus:outline-none focus:ring-4 focus:ring-primary/50",
        "active:scale-95"
      )}
    >
      {/* Colored accent bar */}
      <div className={cn(
        "absolute inset-x-0 top-0 h-2 rounded-t-xl",
        colorClass === 'game-orange' && "bg-game-orange",
        colorClass === 'game-blue' && "bg-game-blue",
        colorClass === 'game-green' && "bg-game-green"
      )} />
      
      <div className="flex flex-col items-center gap-3 pt-2">
        <span className="text-5xl group-hover:animate-wiggle">{icon}</span>
        <h3 className="text-xl font-bold text-card-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground text-center">{description}</p>
        <div className="mt-2">
          <StarDisplay stars={stars} maxStars={maxStars} size="md" />
        </div>
      </div>
    </button>
  );
}
