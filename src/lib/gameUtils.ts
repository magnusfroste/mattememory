import { GameMode, Difficulty } from '@/hooks/useGameProgress';

export interface Card {
  id: string;
  value: string;
  pairId: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const fruitEmojis = ['🍎', '🍊', '🍋', '🍇', '🍓', '🍑', '🍒', '🥝', '🍌', '🍉'];
const animalEmojis = ['🐶', '🐱', '🐰', '🐻', '🦊', '🐸', '🐵', '🐼', '🦁', '🐯'];

const numberWords: Record<number, string> = {
  1: 'ett',
  2: 'två',
  3: 'tre',
  4: 'fyra',
  5: 'fem',
  6: 'sex',
  7: 'sju',
  8: 'åtta',
  9: 'nio',
  10: 'tio',
  11: 'elva',
  12: 'tolv',
  13: 'tretton',
  14: 'fjorton',
  15: 'femton',
  16: 'sexton',
  17: 'sjutton',
  18: 'arton',
  19: 'nitton',
  20: 'tjugo',
};

export function getDifficultyConfig(
  difficulty: Difficulty
): { pairs: number; maxNumber: number; maxCount: number } {
  // maxCount är taket för antal-bilder: barn ska kunna räkna på kortet,
  // därför aldrig fler än 10 föremål (maxNumber gäller tal/ord-lägena).
  switch (difficulty) {
    case 'easy':
      return { pairs: 3, maxNumber: 5, maxCount: 5 };
    case 'medium':
      return { pairs: 6, maxNumber: 10, maxCount: 8 };
    case 'hard':
      return { pairs: 8, maxNumber: 20, maxCount: 10 };
  }
}

export function generateCards(mode: GameMode, difficulty: Difficulty): Card[] {
  const config = getDifficultyConfig(difficulty);
  const cards: Card[] = [];
  
  // Generate random unique numbers for this game
  const tak = mode === 'antal' ? config.maxCount : config.maxNumber;
  const numbers: number[] = [];
  while (numbers.length < config.pairs) {
    const num = Math.floor(Math.random() * tak) + 1;
    if (!numbers.includes(num)) {
      numbers.push(num);
    }
  }

  numbers.forEach((num, index) => {
    const pairId = `pair-${index}`;
    const pair = generatePair(mode, num, index);
    
    cards.push({
      id: `card-${index}-a`,
      value: pair.first,
      pairId,
      isFlipped: false,
      isMatched: false,
    });
    
    cards.push({
      id: `card-${index}-b`,
      value: pair.second,
      pairId,
      isFlipped: false,
      isMatched: false,
    });
  });

  return shuffleArray(cards);
}

function generatePair(mode: GameMode, num: number, index: number): { first: string; second: string } {
  switch (mode) {
    case 'antal': {
      const emoji = fruitEmojis[index % fruitEmojis.length];
      return {
        first: String(num),
        second: emoji.repeat(num),
      };
    }
    case 'taltvilling': {
      return {
        first: String(num),
        second: numberWords[num] || String(num),
      };
    }
    case 'addition': {
      // Generate a random addition that equals num
      const firstNum = Math.floor(Math.random() * num);
      const secondNum = num - firstNum;
      return {
        first: `${firstNum}+${secondNum}`,
        second: String(num),
      };
    }
  }
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function calculateStars(attempts: number, pairs: number): number {
  const perfectAttempts = pairs;
  const goodAttempts = pairs * 1.5;
  const okAttempts = pairs * 2.5;
  
  if (attempts <= perfectAttempts) return 3;
  if (attempts <= goodAttempts) return 3;
  if (attempts <= okAttempts) return 2;
  return 1;
}

export function getGridCols(cardCount: number): string {
  if (cardCount <= 6) return 'grid-cols-3';
  if (cardCount <= 12) return 'grid-cols-4';
  return 'grid-cols-4 sm:grid-cols-4';
}

export function getModeInfo(mode: GameMode) {
  switch (mode) {
    case 'antal':
      return {
        title: 'Antal-Memory',
        description: 'Para ihop siffran med rätt antal',
        icon: '🍎',
        color: 'game-orange',
      };
    case 'taltvilling':
      return {
        title: 'Taltvilling-Memory',
        description: 'Para ihop siffran med ordet',
        icon: '🔢',
        color: 'game-blue',
      };
    case 'addition':
      return {
        title: 'Additions-Memory',
        description: 'Para ihop talet med summan',
        icon: '➕',
        color: 'game-green',
      };
  }
}

export function getDifficultyInfo(difficulty: Difficulty) {
  switch (difficulty) {
    case 'easy':
      return { label: 'Lätt', icon: '🌱', pairs: 3 };
    case 'medium':
      return { label: 'Medium', icon: '🌿', pairs: 6 };
    case 'hard':
      return { label: 'Svår', icon: '🌳', pairs: 8 };
  }
}
