import { useNavigate } from 'react-router-dom';
import { GameModeCard } from '@/components/game/GameModeCard';
import { StarDisplay } from '@/components/game/StarDisplay';
import { SoundToggle } from '@/components/game/SoundToggle';
import { useGameProgress } from '@/hooks/useGameProgress';
import { useSound } from '@/hooks/useSound';
import { getModeInfo } from '@/lib/gameUtils';

const Index = () => {
  const navigate = useNavigate();
  const { totalStars, getModeProgress, unlockedThemes } = useGameProgress();
  const { soundEnabled, toggleSound, playSound } = useSound();

  const handleModeSelect = (mode: 'antal' | 'taltvilling' | 'addition') => {
    playSound('click');
    navigate(`/spela/${mode}`);
  };

  const modes = ['antal', 'taltvilling', 'addition'] as const;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30 px-4 py-8">
      {/* Sound toggle */}
      <div className="fixed top-4 right-4 z-50">
        <SoundToggle enabled={soundEnabled} onToggle={toggleSound} />
      </div>

      {/* Header */}
      <header className="text-center mb-10 animate-slide-up">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-2 text-shadow-fun">
          🧠 Matte-Memory
        </h1>
        <p className="text-lg text-muted-foreground">
          Lär dig matte genom att spela memory!
        </p>
        
        {/* Total stars display */}
        <div className="mt-6 inline-flex items-center gap-3 bg-card px-6 py-3 rounded-full shadow-lg">
          <span className="text-lg font-medium">Dina stjärnor:</span>
          <span className="text-3xl font-bold text-star-gold">{totalStars}</span>
          <span className="text-2xl">⭐</span>
        </div>
      </header>

      {/* Game modes */}
      <main className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6">Välj spelläge</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {modes.map((mode, index) => {
            const info = getModeInfo(mode);
            const progress = getModeProgress(mode);
            
            return (
              <div 
                key={mode} 
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <GameModeCard
                  title={info.title}
                  description={info.description}
                  icon={info.icon}
                  colorClass={info.color}
                  stars={progress.totalStars}
                  maxStars={progress.maxStars}
                  onClick={() => handleModeSelect(mode)}
                />
              </div>
            );
          })}
        </div>

        {/* Unlocked themes */}
        {unlockedThemes.length > 0 && (
          <section className="text-center">
            <h3 className="text-xl font-bold mb-4">Upplåsta teman 🎨</h3>
            <div className="flex justify-center gap-3 flex-wrap">
              {unlockedThemes.map(theme => (
                <span 
                  key={theme.id}
                  className="bg-card px-4 py-2 rounded-full shadow-md text-sm font-medium"
                >
                  {theme.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Progress hints */}
        <section className="mt-10 text-center text-muted-foreground">
          <p className="text-sm">
            🌟 Samla stjärnor för att låsa upp nya teman!
          </p>
          <p className="text-xs mt-1">
            5 stjärnor = Havet • 15 stjärnor = Rymden • 27 stjärnor = Regnbåge
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 pb-8 text-center">
        <div className="inline-flex flex-col items-center gap-2 text-muted-foreground text-sm">
          <p>
            Skapad med 💜 av{' '}
            <a 
              href="https://github.com/magnusfroste" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline transition-colors"
            >
              Magnus Froste
            </a>
          </p>
          <a 
            href="https://github.com/magnusfroste" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs text-muted-foreground/70 hover:text-primary transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Öppen källkod
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Index;
