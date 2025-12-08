import { useState, useEffect, useCallback } from 'react';
import { Card, generateCards, getGridCols, calculateStars } from '@/lib/gameUtils';
import { GameMode, Difficulty } from '@/hooks/useGameProgress';
import { MemoryCard } from './MemoryCard';
import { useSound } from '@/hooks/useSound';
import { Mascot, getRandomMessage } from './Mascot';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  mode: GameMode;
  difficulty: Difficulty;
  onComplete: (stars: number, attempts: number) => void;
  colorClass: string;
}

export function GameBoard({ mode, difficulty, onComplete, colorClass }: GameBoardProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [mascotMessage, setMascotMessage] = useState(getRandomMessage('start'));
  const [mascotMood, setMascotMood] = useState<'happy' | 'excited' | 'thinking' | 'cheering' | 'encouraging'>('happy');
  const { playSound } = useSound();

  useEffect(() => {
    const newCards = generateCards(mode, difficulty);
    setCards(newCards);
    setFlippedCards([]);
    setAttempts(0);
    setMatchedPairs(0);
    setIsChecking(false);
    setMascotMessage(getRandomMessage('start'));
    setMascotMood('happy');
  }, [mode, difficulty]);

  const totalPairs = cards.length / 2;

  const handleCardClick = useCallback((cardId: string) => {
    if (isChecking || flippedCards.length >= 2) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    playSound('flip');

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);
    
    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));

    if (newFlipped.length === 2) {
      setIsChecking(true);
      setAttempts(prev => prev + 1);

      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find(c => c.id === firstId)!;
      const secondCard = cards.find(c => c.id === secondId)!;

      setTimeout(() => {
        if (firstCard.pairId === secondCard.pairId) {
          playSound('match');
          setCards(prev => prev.map(c => 
            c.pairId === firstCard.pairId ? { ...c, isMatched: true } : c
          ));
          setMatchedPairs(prev => {
            const newMatched = prev + 1;
            if (newMatched === totalPairs) {
              const stars = calculateStars(attempts + 1, totalPairs);
              setMascotMessage(getRandomMessage('win'));
              setMascotMood('cheering');
              setTimeout(() => {
                playSound('win');
                onComplete(stars, attempts + 1);
              }, 500);
            } else if (newMatched >= totalPairs - 1) {
              setMascotMessage(getRandomMessage('fewLeft'));
              setMascotMood('excited');
            } else {
              setMascotMessage(getRandomMessage('match'));
              setMascotMood('cheering');
            }
            return newMatched;
          });
        } else {
          playSound('noMatch');
          setMascotMessage(getRandomMessage('noMatch'));
          setMascotMood('encouraging');
          setCards(prev => prev.map(c => 
            newFlipped.includes(c.id) ? { ...c, isFlipped: false } : c
          ));
        }
        setFlippedCards([]);
        setIsChecking(false);
      }, 800);
    }
  }, [cards, flippedCards, isChecking, attempts, totalPairs, onComplete, playSound]);

  const gridCols = getGridCols(cards.length);

  return (
    <div className="flex flex-col items-center gap-4">
      <Mascot mood={mascotMood} message={mascotMessage} />
      
      <div className="flex items-center gap-6 text-lg font-medium">
        <span className="bg-card px-4 py-2 rounded-full shadow-sm">
          Försök: <span className="font-bold text-primary">{attempts}</span>
        </span>
        <span className="bg-card px-4 py-2 rounded-full shadow-sm">
          Matchade: <span className="font-bold text-game-green">{matchedPairs}</span>/{totalPairs}
        </span>
      </div>
      
      <div className={cn(
        "grid gap-3 sm:gap-4 w-full max-w-md mx-auto p-4",
        gridCols
      )}>
        {cards.map(card => (
          <MemoryCard
            key={card.id}
            card={card}
            onClick={() => handleCardClick(card.id)}
            disabled={isChecking || flippedCards.length >= 2}
            colorClass={colorClass}
          />
        ))}
      </div>
    </div>
  );
}
