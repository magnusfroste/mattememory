import { cn } from '@/lib/utils';
import { Card } from '@/lib/gameUtils';

interface MemoryCardProps {
  card: Card;
  onClick: () => void;
  disabled: boolean;
  colorClass: string;
}

export function MemoryCard({ card, onClick, disabled, colorClass }: MemoryCardProps) {
  const isRevealed = card.isFlipped || card.isMatched;
  
  return (
    <button
      onClick={onClick}
      disabled={disabled || card.isMatched}
      className={cn(
        "relative aspect-square w-full cursor-pointer perspective-1000",
        "transition-transform duration-200 hover:scale-105",
        "focus:outline-none focus:ring-4 focus:ring-primary/50 rounded-xl",
        disabled && !card.isMatched && "cursor-not-allowed",
        card.isMatched && "cursor-default"
      )}
      aria-label={isRevealed ? card.value : 'Dolt kort'}
    >
      <div
        className={cn(
          "absolute inset-0 w-full h-full transition-all duration-300 transform-style-preserve-3d rounded-xl",
          isRevealed && "animate-flip"
        )}
        style={{
          transform: isRevealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Back of card */}
        <div
          className={cn(
            "absolute inset-0 w-full h-full rounded-xl flex items-center justify-center",
            "backface-hidden shadow-lg border-4 border-card",
            colorClass,
            "bg-gradient-to-br from-primary via-primary to-accent"
          )}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="text-4xl sm:text-5xl">❓</span>
        </div>
        
        {/* Front of card */}
        <div
          className={cn(
            "absolute inset-0 w-full h-full rounded-xl flex items-center justify-center",
            "backface-hidden shadow-lg border-4",
            "bg-card text-card-foreground",
            card.isMatched && "border-game-green bg-game-green/10 animate-pop"
          )}
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <span className={cn(
            "text-xl sm:text-2xl md:text-3xl font-bold text-center px-2",
            "leading-tight break-all",
            card.value.length > 6 && "text-lg sm:text-xl md:text-2xl"
          )}>
            {card.value}
          </span>
        </div>
      </div>
    </button>
  );
}
