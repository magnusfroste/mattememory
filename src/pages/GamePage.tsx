import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DifficultySelector } from '@/components/game/DifficultySelector';
import { GameBoard } from '@/components/game/GameBoard';
import { WinModal } from '@/components/game/WinModal';
import { SoundToggle } from '@/components/game/SoundToggle';
import { Confetti } from '@/components/game/Confetti';
import { GameMode, Difficulty, useGameProgress } from '@/hooks/useGameProgress';
import { useSound } from '@/hooks/useSound';
import { getModeInfo, getDifficultyInfo } from '@/lib/gameUtils';

const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

export default function GamePage() {
  const { mode } = useParams<{ mode: string }>();
  const navigate = useNavigate();
  const { updateLevelProgress, getLevelProgress } = useGameProgress();
  const { soundEnabled, toggleSound, playSound } = useSound();

  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [gameKey, setGameKey] = useState(0);
  const [showWinModal, setShowWinModal] = useState(false);
  const [gameResult, setGameResult] = useState({ stars: 0, attempts: 0 });
  const [showConfetti, setShowConfetti] = useState(false);

  const gameMode = mode as GameMode;
  const modeInfo = getModeInfo(gameMode);
  const difficultyInfo = selectedDifficulty ? getDifficultyInfo(selectedDifficulty) : null;

  const handleDifficultySelect = (difficulty: Difficulty) => {
    playSound('click');
    setSelectedDifficulty(difficulty);
    setGameKey(prev => prev + 1);
    setShowWinModal(false);
  };

  const handleGameComplete = useCallback((stars: number, attempts: number) => {
    setGameResult({ stars, attempts });
    updateLevelProgress(gameMode, selectedDifficulty!, stars, attempts);
    setShowConfetti(true);
    setShowWinModal(true);
    
    setTimeout(() => setShowConfetti(false), 3000);
  }, [gameMode, selectedDifficulty, updateLevelProgress]);

  const handlePlayAgain = () => {
    playSound('click');
    setShowWinModal(false);
    setGameKey(prev => prev + 1);
  };

  const handleNextLevel = () => {
    playSound('click');
    const currentIndex = difficulties.indexOf(selectedDifficulty!);
    if (currentIndex < difficulties.length - 1) {
      setSelectedDifficulty(difficulties[currentIndex + 1]);
      setShowWinModal(false);
      setGameKey(prev => prev + 1);
    }
  };

  const handleGoHome = () => {
    playSound('click');
    navigate('/');
  };

  const handleBack = () => {
    playSound('click');
    if (selectedDifficulty) {
      setSelectedDifficulty(null);
    } else {
      navigate('/');
    }
  };

  const getStarsForDifficulty = (difficulty: Difficulty) => {
    return getLevelProgress(gameMode, difficulty).stars;
  };

  const hasNextLevel = selectedDifficulty !== 'hard';

  if (!mode || !['antal', 'taltvilling', 'addition'].includes(mode)) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30 px-4 py-6">
      <Confetti active={showConfetti} />
      
      {/* Header */}
      <header className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="flex items-center gap-2 text-lg hover:bg-card"
          >
            <ArrowLeft className="w-5 h-5" />
            Tillbaka
          </Button>
          
          <SoundToggle enabled={soundEnabled} onToggle={toggleSound} />
        </div>
        
        <div className="text-center mt-4 animate-slide-up">
          <span className="text-5xl mb-2 block">{modeInfo.icon}</span>
          <h1 className="text-3xl font-bold text-foreground">{modeInfo.title}</h1>
          <p className="text-muted-foreground">{modeInfo.description}</p>
          {difficultyInfo && (
            <p className="mt-2 text-lg font-medium">
              {difficultyInfo.icon} {difficultyInfo.label} • {difficultyInfo.pairs} par
            </p>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        {!selectedDifficulty ? (
          <div className="animate-slide-up">
            <h2 className="text-xl font-bold text-center mb-6">Välj svårighetsgrad</h2>
            <DifficultySelector
              selectedDifficulty={selectedDifficulty}
              onSelect={handleDifficultySelect}
              getStars={getStarsForDifficulty}
            />
          </div>
        ) : (
          <GameBoard
            key={gameKey}
            mode={gameMode}
            difficulty={selectedDifficulty}
            onComplete={handleGameComplete}
            colorClass={modeInfo.color}
          />
        )}
      </main>

      <WinModal
        isOpen={showWinModal}
        stars={gameResult.stars}
        attempts={gameResult.attempts}
        onPlayAgain={handlePlayAgain}
        onNextLevel={handleNextLevel}
        onGoHome={handleGoHome}
        hasNextLevel={hasNextLevel}
      />
    </div>
  );
}
