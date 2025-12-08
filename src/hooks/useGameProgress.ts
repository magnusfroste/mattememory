import { useState, useEffect, useCallback } from 'react';

export type GameMode = 'antal' | 'taltvilling' | 'addition';
export type Difficulty = 'easy' | 'medium' | 'hard';

interface LevelProgress {
  stars: number;
  completed: boolean;
  bestAttempts: number | null;
}

interface GameProgress {
  [mode: string]: {
    [difficulty: string]: LevelProgress;
  };
}

interface UnlockedTheme {
  id: string;
  name: string;
}

const STORAGE_KEY = 'matte-memory-progress';

const defaultProgress: GameProgress = {
  antal: {
    easy: { stars: 0, completed: false, bestAttempts: null },
    medium: { stars: 0, completed: false, bestAttempts: null },
    hard: { stars: 0, completed: false, bestAttempts: null },
  },
  taltvilling: {
    easy: { stars: 0, completed: false, bestAttempts: null },
    medium: { stars: 0, completed: false, bestAttempts: null },
    hard: { stars: 0, completed: false, bestAttempts: null },
  },
  addition: {
    easy: { stars: 0, completed: false, bestAttempts: null },
    medium: { stars: 0, completed: false, bestAttempts: null },
    hard: { stars: 0, completed: false, bestAttempts: null },
  },
};

export function useGameProgress() {
  const [progress, setProgress] = useState<GameProgress>(defaultProgress);
  const [unlockedThemes, setUnlockedThemes] = useState<UnlockedTheme[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setProgress(parsed.progress || defaultProgress);
        setUnlockedThemes(parsed.unlockedThemes || []);
      } catch {
        setProgress(defaultProgress);
      }
    }
  }, []);

  const saveProgress = useCallback((newProgress: GameProgress, themes: UnlockedTheme[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      progress: newProgress,
      unlockedThemes: themes,
    }));
  }, []);

  const updateLevelProgress = useCallback((
    mode: GameMode,
    difficulty: Difficulty,
    stars: number,
    attempts: number
  ) => {
    setProgress(prev => {
      const currentLevel = prev[mode][difficulty];
      const shouldUpdate = stars > currentLevel.stars || 
        (stars === currentLevel.stars && (currentLevel.bestAttempts === null || attempts < currentLevel.bestAttempts));
      
      if (!shouldUpdate && currentLevel.completed) {
        return prev;
      }

      const newProgress = {
        ...prev,
        [mode]: {
          ...prev[mode],
          [difficulty]: {
            stars: Math.max(stars, currentLevel.stars),
            completed: true,
            bestAttempts: currentLevel.bestAttempts === null 
              ? attempts 
              : Math.min(attempts, currentLevel.bestAttempts),
          },
        },
      };

      // Check for theme unlocks based on total stars
      const totalStars = calculateTotalStars(newProgress);
      const newThemes = [...unlockedThemes];
      
      if (totalStars >= 5 && !newThemes.find(t => t.id === 'ocean')) {
        newThemes.push({ id: 'ocean', name: 'Havet' });
      }
      if (totalStars >= 15 && !newThemes.find(t => t.id === 'space')) {
        newThemes.push({ id: 'space', name: 'Rymden' });
      }
      if (totalStars >= 27 && !newThemes.find(t => t.id === 'rainbow')) {
        newThemes.push({ id: 'rainbow', name: 'Regnbåge' });
      }

      setUnlockedThemes(newThemes);
      saveProgress(newProgress, newThemes);
      
      return newProgress;
    });
  }, [unlockedThemes, saveProgress]);

  const calculateTotalStars = (prog: GameProgress = progress): number => {
    return Object.values(prog).reduce((total, mode) => {
      return total + Object.values(mode).reduce((modeTotal, level) => {
        return modeTotal + level.stars;
      }, 0);
    }, 0);
  };

  const getLevelProgress = (mode: GameMode, difficulty: Difficulty): LevelProgress => {
    return progress[mode]?.[difficulty] || { stars: 0, completed: false, bestAttempts: null };
  };

  const getModeProgress = (mode: GameMode) => {
    const modeData = progress[mode];
    const totalStars = Object.values(modeData).reduce((sum, level) => sum + level.stars, 0);
    const completedLevels = Object.values(modeData).filter(level => level.completed).length;
    return { totalStars, completedLevels, maxStars: 9 };
  };

  const resetProgress = useCallback(() => {
    setProgress(defaultProgress);
    setUnlockedThemes([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    progress,
    unlockedThemes,
    totalStars: calculateTotalStars(),
    updateLevelProgress,
    getLevelProgress,
    getModeProgress,
    resetProgress,
  };
}
