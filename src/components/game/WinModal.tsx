import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { StarDisplay } from './StarDisplay';
import { cn } from '@/lib/utils';

interface WinModalProps {
  isOpen: boolean;
  stars: number;
  attempts: number;
  onPlayAgain: () => void;
  onNextLevel: () => void;
  onGoHome: () => void;
  hasNextLevel: boolean;
}

export function WinModal({ 
  isOpen, 
  stars, 
  attempts, 
  onPlayAgain, 
  onNextLevel, 
  onGoHome,
  hasNextLevel 
}: WinModalProps) {
  const messages = [
    'Bra jobbat! 🎉',
    'Fantastiskt! 🌟',
    'Du är en stjärna! ⭐',
  ];
  
  const message = messages[Math.min(stars - 1, messages.length - 1)];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onGoHome(); }}>
      <DialogContent className="sm:max-w-md bg-card border-4 border-primary/20 rounded-2xl">
        <DialogTitle className="sr-only">Du vann!</DialogTitle>
        <DialogDescription className="sr-only">Resultat från spelet</DialogDescription>
        <div className="flex flex-col items-center gap-6 py-4">
          {/* Confetti effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "absolute w-3 h-3 rounded-full animate-confetti",
                  i % 4 === 0 && "bg-game-pink",
                  i % 4 === 1 && "bg-game-yellow",
                  i % 4 === 2 && "bg-game-blue",
                  i % 4 === 3 && "bg-game-green"
                )}
                style={{
                  left: `${10 + (i * 4)}%`,
                  bottom: '50%',
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
          
          <h2 className="text-3xl font-bold text-center">{message}</h2>
          
          <StarDisplay stars={stars} size="lg" animated />
          
          <p className="text-lg text-muted-foreground">
            Du klarade det på <span className="font-bold text-primary">{attempts}</span> försök!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button
              onClick={onPlayAgain}
              variant="outline"
              className="flex-1 h-12 text-lg rounded-xl"
            >
              🔄 Spela igen
            </Button>
            {hasNextLevel && (
              <Button
                onClick={onNextLevel}
                className="flex-1 h-12 text-lg rounded-xl bg-primary hover:bg-primary/90"
              >
                ➡️ Nästa nivå
              </Button>
            )}
          </div>
          
          <Button
            onClick={onGoHome}
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
          >
            🏠 Tillbaka hem
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
