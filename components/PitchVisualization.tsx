'use client';

import { Player } from '@/db/schema';
import { FORMATION_POSITIONS } from '@/lib/constants';

interface PitchVisualizationProps {
  formation: string;
  players: Array<{ player: Player; position: string }>;
}

export function PitchVisualization({ formation, players }: PitchVisualizationProps) {
  const formationLayout = FORMATION_POSITIONS[formation as keyof typeof FORMATION_POSITIONS];
  
  const getPositionStyle = (index: number, total: number) => {
    const rows = formation.split('-').map(Number);
    let currentRow = 0;
    let posInRow = 0;
    let counted = 0;
    
    for (let i = 0; i < rows.length; i++) {
      if (index < counted + rows[i] + 1) {
        currentRow = i;
        posInRow = index - counted;
        break;
      }
      counted += rows[i];
    }
    
    const rowCount = rows.length + 1;
    const top = ((currentRow + 1) / (rowCount + 1)) * 100;
    const left = ((posInRow + 1) / (rows[currentRow] + 1)) * 100;
    
    return { top: `${top}%`, left: `${left}%` };
  };

  return (
    <div className="relative w-full aspect-[2/3] bg-pitch-green rounded-lg border-4 border-white overflow-hidden">
      {/* Pitch markings */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-16 border-2 border-pitch-line"></div>
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-pitch-line"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-pitch-line rounded-full"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-16 border-2 border-pitch-line"></div>
      </div>
      
      {/* Players */}
      {players.map((p, idx) => {
        const style = getPositionStyle(idx, players.length);
        return (
          <div
            key={idx}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={style}
          >
            <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex flex-col items-center justify-center text-xs shadow-lg">
              <div className="font-bold">{p.player.ovr}</div>
              <div className="text-[8px]">{p.position}</div>
            </div>
            <div className="text-white text-[10px] text-center mt-1 font-semibold bg-black/50 px-1 rounded">
              {p.player.name.split(' ')[0]}
            </div>
          </div>
        );
      })}
    </div>
  );
}
