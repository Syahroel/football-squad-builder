'use client';

import { Player } from '@/db/schema';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Pencil, Trash2 } from 'lucide-react';

interface PlayerCardProps {
  player: Player;
  onEdit: (player: Player) => void;
  onDelete: (id: string) => void;
}

export function PlayerCard({ player, onEdit, onDelete }: PlayerCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg">{player.name}</h3>
            <p className="text-sm text-gray-600">{player.originalClub || 'Free Agent'}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{player.ovr}</div>
            <div className="text-xs text-gray-500">OVR</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
          <div>
            <span className="text-gray-600">Position:</span>
            <span className="ml-1 font-semibold">{player.position}</span>
          </div>
          <div>
            <span className="text-gray-600">Age:</span>
            <span className="ml-1 font-semibold">{player.age}</span>
          </div>
        </div>
        
        <div className="text-xs text-gray-700 mb-3 p-2 bg-gray-50 rounded">
          {player.playingStyle}
        </div>
        
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(player)}
            className="flex-1"
          >
            <Pencil className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(player.id)}
            className="flex-1"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
