import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

type MascotMood = 'happy' | 'excited' | 'thinking' | 'cheering' | 'encouraging';

interface MascotProps {
  mood: MascotMood;
  message?: string;
}

const moodEmojis: Record<MascotMood, string> = {
  happy: '🦊',
  excited: '🎉',
  thinking: '🤔',
  cheering: '🌟',
  encouraging: '💪'
};

const encouragingMessages = {
  start: ['Du klarar det!', 'Lycka till!', 'Nu kör vi!', 'Kom igen!'],
  match: ['Snyggt!', 'Bra jobbat!', 'Fantastiskt!', 'Wow!', 'Du är grym!', 'Jättebra!'],
  noMatch: ['Försök igen!', 'Nästan!', 'Du kan!', 'Ge inte upp!', 'Fortsätt leta!'],
  fewLeft: ['Nästan klart!', 'Bara lite kvar!', 'Du är nära!'],
  win: ['GRATTIS!', 'Du vann!', 'Fantastiskt!', 'Stjärnklar!']
};

export function getRandomMessage(type: keyof typeof encouragingMessages): string {
  const messages = encouragingMessages[type];
  return messages[Math.floor(Math.random() * messages.length)];
}

export function Mascot({ mood, message }: MascotProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [message, mood]);

  return (
    <div className="flex items-center gap-3">
      <div 
        className={cn(
          "text-5xl transition-transform duration-300",
          isAnimating && "animate-wiggle"
        )}
      >
        🦊
      </div>
      
      {message && (
        <div 
          className={cn(
            "relative bg-card px-4 py-2 rounded-2xl shadow-lg border-2 border-game-yellow/30",
            "before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-x-2 before:-translate-y-1/2",
            "before:border-8 before:border-transparent before:border-r-card",
            isAnimating && "animate-pop"
          )}
        >
          <span className={cn(
            "font-bold text-lg",
            mood === 'excited' || mood === 'cheering' ? 'text-game-green' : 
            mood === 'encouraging' ? 'text-game-blue' : 'text-foreground'
          )}>
            {message}
          </span>
          {(mood === 'excited' || mood === 'cheering') && (
            <span className="ml-1">{moodEmojis[mood]}</span>
          )}
        </div>
      )}
    </div>
  );
}
