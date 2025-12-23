'use client';

import { useState } from 'react';
import { Player } from '@/db/schema';
import { POSITIONS, PLAYING_STYLES } from '@/lib/constants';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface PlayerFormProps {
  player?: Player;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function PlayerForm({ player, onSubmit, onCancel }: PlayerFormProps) {
  const [formData, setFormData] = useState({
    name: player?.name || '',
    ovr: player?.ovr || 70,
    age: player?.age || 20,
    position: player?.position || 'CF',
    playingStyle: player?.playingStyle || '',
    originalClub: player?.originalClub || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name *</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">OVR (1-99) *</label>
          <Input
            type="number"
            min="1"
            max="99"
            value={formData.ovr}
            onChange={(e) => setFormData({ ...formData, ovr: parseInt(e.target.value) })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Age (15-40) *</label>
          <Input
            type="number"
            min="15"
            max="40"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Position *</label>
        <select
          className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
          value={formData.position}
          onChange={(e) => setFormData({ ...formData, position: e.target.value, playingStyle: '' })}
          required
        >
          {POSITIONS.map((pos) => (
            <option key={pos} value={pos}>{pos}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Playing Style *</label>
        <select
          className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
          value={formData.playingStyle}
          onChange={(e) => setFormData({ ...formData, playingStyle: e.target.value })}
          required
        >
          <option value="">Select a style</option>
          {PLAYING_STYLES[formData.position]?.map((style) => (
            <option key={style} value={style}>{style}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Original Club</label>
        <Input
          value={formData.originalClub}
          onChange={(e) => setFormData({ ...formData, originalClub: e.target.value })}
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit">{player ? 'Update' : 'Add'} Player</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}
