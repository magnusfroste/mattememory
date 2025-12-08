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
    </div>
  );
};

export default Index;
