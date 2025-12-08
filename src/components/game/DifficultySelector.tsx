import { Difficulty } from '@/hooks/useGameProgress';
import { getDifficultyInfo } from '@/lib/gameUtils';
import { StarDisplay } from './StarDisplay';
import { cn } from '@/lib/utils';

interface DifficultySelectorProps {
  selectedDifficulty: Difficulty | null;
  onSelect: (difficulty: Difficulty) => void;
  getStars: (difficulty: Difficulty) => number;
}

const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

export function DifficultySelector({ selectedDifficulty, onSelect, getStars }: DifficultySelectorProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      {difficulties.map((difficulty) => {
        const info = getDifficultyInfo(difficulty);
        const stars = getStars(difficulty);
        const isSelected = selectedDifficulty === difficulty;
        
        return (
          <button
            key={difficulty}
            onClick={() => onSelect(difficulty)}
            className={cn(
              "flex flex-col items-center gap-2 p-4 rounded-xl",
              "bg-card shadow-md border-4 transition-all duration-200",
              "hover:scale-105 hover:shadow-lg",
              "focus:outline-none focus:ring-4 focus:ring-primary/50",
              isSelected ? "border-primary scale-105" : "border-transparent"
            )}
          >
            <span className="text-3xl">{info.icon}</span>
            <span className="font-bold text-lg">{info.label}</span>
            <span className="text-sm text-muted-foreground">{info.pairs} par</span>
            <StarDisplay stars={stars} size="sm" />
          </button>
        );
      })}
    </div>
  );
}
