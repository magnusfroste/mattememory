import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { report } from '@/lib/skolappar';

interface SoundToggleProps {
  enabled: boolean;
  onToggle: () => void;
  className?: string;
}

export function SoundToggle({ enabled, onToggle, className }: SoundToggleProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        if (enabled) report('sound_off');
        onToggle();
      }}
      className={cn(
        "rounded-full w-12 h-12 bg-card/80 backdrop-blur-sm shadow-md",
        "hover:bg-card hover:scale-110 transition-all duration-200",
        className
      )}
      aria-label={enabled ? 'Stäng av ljud' : 'Sätt på ljud'}
    >
      {enabled ? (
        <Volume2 className="w-6 h-6 text-primary" />
      ) : (
        <VolumeX className="w-6 h-6 text-muted-foreground" />
      )}
    </Button>
  );
}
