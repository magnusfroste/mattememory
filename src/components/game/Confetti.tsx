import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ConfettiProps {
  active: boolean;
}

interface Particle {
  id: number;
  x: number;
  color: string;
  delay: number;
}

const colors = [
  'bg-game-pink',
  'bg-game-yellow',
  'bg-game-blue',
  'bg-game-green',
  'bg-game-orange',
  'bg-game-purple',
];

export function Confetti({ active }: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (active) {
      const newParticles: Particle[] = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: Math.random() * 0.5,
        });
      }
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [active]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(particle => (
        <div
          key={particle.id}
          className={cn(
            "absolute w-3 h-3 rounded-full",
            particle.color
          )}
          style={{
            left: `${particle.x}%`,
            top: '-20px',
            animation: `fall 3s ease-out ${particle.delay}s forwards`,
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
