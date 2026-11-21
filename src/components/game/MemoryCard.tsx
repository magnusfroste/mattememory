import { cn } from '@/lib/utils';
import { Card } from '@/lib/gameUtils';

interface MemoryCardProps {
  card: Card;
  onClick: () => void;
  disabled: boolean;
  colorClass: string;
}

const EMOJI_RUN = /\p{Extended_Pictographic}\uFE0F?(?:\u200D\p{Extended_Pictographic}\uFE0F?)*/gu;

function splitGlyphs(text: string): string[] {
  const träffar = text.match(EMOJI_RUN);
  if (träffar && träffar.join('') === text) return träffar;
  return [text];
}

function isEmoji(glyph: string): boolean {
  return /^\p{Extended_Pictographic}/u.test(glyph);
}

/** Ritar ett gäng frukter i ett rutnät som alltid ryms på kortet. */
function GlyphGrid({ glyphs }: { glyphs: string[] }) {
  const n = glyphs.length;
  const cols = n <= 4 ? 2 : n <= 6 ? 3 : n <= 9 ? 3 : 5;
  const rows = Math.ceil(n / cols);
  return (
    <div
      className="grid h-full w-full place-items-center"
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridAutoRows: 'minmax(0, 1fr)',
        rowGap: rows > 1 ? '0.1em' : 0,
        columnGap: '0.1em',
      }}
    >
      {glyphs.map((g, i) => (
        <span
          key={i}
          className="flex items-center justify-center leading-none select-none"
          style={{
            fontSize: `min(${(78 / cols).toFixed(1)}cqw, ${(80 / rows).toFixed(1)}cqh)`,
            lineHeight: 1,
          }}
        >
          {g}
        </span>
      ))}
    </div>
  );
}

export function MemoryCard({ card, onClick, disabled, colorClass }: MemoryCardProps) {
  const isRevealed = card.isFlipped || card.isMatched;
  const glyphs = splitGlyphs(card.value);
  const showAsGrid = glyphs.length > 1 && glyphs.every(isEmoji);

  return (
    <button
      onClick={onClick}
      disabled={disabled || card.isMatched}
      className={cn(
        "relative aspect-square w-full cursor-pointer perspective-1000",
        "transition-transform duration-200 hover:scale-105",
        "focus:outline-none focus:ring-4 focus:ring-primary/50 rounded-xl",
        disabled && !card.isMatched && "cursor-not-allowed",
        card.isMatched && "cursor-default"
      )}
      aria-label={isRevealed ? card.value : 'Dolt kort'}
    >
      <div
        className={cn(
          "absolute inset-0 w-full h-full transition-all duration-300 transform-style-preserve-3d rounded-xl",
          isRevealed && "animate-flip"
        )}
        style={{
          transform: isRevealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Back of card */}
        <div
          className={cn(
            "absolute inset-0 w-full h-full rounded-xl flex items-center justify-center",
            "backface-hidden shadow-lg border-4 border-card",
            colorClass,
            "bg-gradient-to-br from-primary via-primary to-accent"
          )}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="text-4xl sm:text-5xl">❓</span>
        </div>

        {/* Front of card */}
        <div
          className={cn(
            "absolute inset-0 w-full h-full rounded-xl flex items-center justify-center p-2",
            "backface-hidden shadow-lg border-4",
            "bg-card text-card-foreground",
            card.isMatched && "border-game-green bg-game-green/10 animate-pop"
          )}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            containerType: 'size',
          }}
        >
          {showAsGrid ? (
            <GlyphGrid glyphs={glyphs} />
          ) : (
            <span
              className={cn(
                "font-bold text-center",
                "leading-tight break-words",
                card.value.length <= 4 ? "text-4xl sm:text-5xl md:text-6xl" : "text-lg sm:text-xl md:text-2xl"
              )}
            >
              {card.value}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}