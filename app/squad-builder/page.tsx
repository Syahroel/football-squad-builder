'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Player } from '@/db/schema';
import { PlayerCard } from '@/components/PlayerCard';
import { PlayerForm } from '@/components/PlayerForm';
import { RecommendationDisplayEnhanced } from '@/components/RecommendationDisplayEnhanced';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RecommendationResult } from '@/lib/recommendations';
import { Plus, Search, Sparkles, Upload } from 'lucide-react';

export default function SquadBuilderPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [recommendations, setRecommendations] = useState<RecommendationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    fetchPlayers();
  }, []);

  useEffect(() => {
    let filtered = players;
    
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (positionFilter) {
      filtered = filtered.filter(p => p.position === positionFilter);
    }
    
    setFilteredPlayers(filtered);
  }, [players, searchTerm, positionFilter]);

  const fetchPlayers = async () => {
    try {
      const res = await fetch('/api/players');
      const data = await res.json();
      setPlayers(data);
      setFilteredPlayers(data);
    } catch (error) {
      console.error('Failed to fetch players:', error);
    }
  };

  const handleAddPlayer = async (data: any) => {
    try {
      const res = await fetch('/api/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (res.ok) {
        await fetchPlayers();
        setShowForm(false);
      }
    } catch (error) {
      console.error('Failed to add player:', error);
    }
  };

  const handleUpdatePlayer = async (data: any) => {
    if (!editingPlayer) return;
    
    try {
      const res = await fetch(`/api/players/${editingPlayer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (res.ok) {
        await fetchPlayers();
        setEditingPlayer(null);
      }
    } catch (error) {
      console.error('Failed to update player:', error);
    }
  };

  const handleDeletePlayer = async (id: string) => {
    if (!confirm('Are you sure you want to delete this player?')) return;
    
    try {
      const res = await fetch(`/api/players/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchPlayers();
      }
    } catch (error) {
      console.error('Failed to delete player:', error);
    }
  };

  const generateRecommendations = async () => {
    if (players.length < 11) {
      alert('You need at least 11 players to generate recommendations!');
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch('/api/recommendations', { method: 'POST' });
      const data = await res.json();
      
      if (res.ok) {
        setRecommendations(data);
      } else {
        alert(data.error || 'Failed to generate recommendations');
      }
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
      alert('Failed to generate recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const text = await file.text();
      const res = await fetch('/api/players/bulk-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileContent: text }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`Successfully imported ${data.count} players!`);
        await fetchPlayers();
      } else {
        alert(data.error || 'Failed to import players');
      }
    } catch (error) {
      console.error('Import error:', error);
      alert('Failed to import players');
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold text-blue-600 cursor-pointer">⚽ Squad Builder</h1>
          </Link>
          <div className="flex gap-2">
            <Button
              onClick={generateRecommendations}
              disabled={loading || players.length < 11}
              className="flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {loading ? 'Generating...' : 'Get AI Recommendations'}
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {recommendations ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">AI Tactical Recommendations</h2>
              <Button variant="outline" onClick={() => setRecommendations(null)}>
                ← Back to Squad
              </Button>
            </div>
            <RecommendationDisplayEnhanced recommendations={recommendations} />
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Your Squad ({players.length} players)</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" disabled={importing} onClick={() => document.getElementById('bulk-import')?.click()}>
                        <Upload className="w-4 h-4 mr-2" />
                        {importing ? 'Importing...' : 'Import TXT'}
                      </Button>
                      <input
                        id="bulk-import"
                        type="file"
                        accept=".txt"
                        onChange={handleBulkImport}
                        className="hidden"
                      />
                      <Button onClick={() => setShowForm(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Player
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          placeholder="Search players..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <select
                      className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                      value={positionFilter}
                      onChange={(e) => setPositionFilter(e.target.value)}
                    >
                      <option value="">All Positions</option>
                      {['GK', 'CB', 'LB', 'RB', 'DMF', 'CMF', 'AMF', 'LWF', 'RWF', 'CF', 'SS'].map(pos => (
                        <option key={pos} value={pos}>{pos}</option>
                      ))}
                    </select>
                  </div>

                  {filteredPlayers.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <p className="text-lg mb-2">No players yet</p>
                      <p className="text-sm">Add your first player to get started!</p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {filteredPlayers.map(player => (
                        <PlayerCard
                          key={player.id}
                          player={player}
                          onEdit={setEditingPlayer}
                          onDelete={handleDeletePlayer}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div>
              {(showForm || editingPlayer) && (
                <Card>
                  <CardHeader>
                    <CardTitle>{editingPlayer ? 'Edit Player' : 'Add New Player'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PlayerForm
                      player={editingPlayer || undefined}
                      onSubmit={editingPlayer ? handleUpdatePlayer : handleAddPlayer}
                      onCancel={() => {
                        setShowForm(false);
                        setEditingPlayer(null);
                      }}
                    />
                  </CardContent>
                </Card>
              )}

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Players:</span>
                      <span className="font-bold">{players.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average OVR:</span>
                      <span className="font-bold">
                        {players.length > 0 
                          ? Math.round(players.reduce((sum, p) => sum + p.ovr, 0) / players.length)
                          : 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average Age:</span>
                      <span className="font-bold">
                        {players.length > 0 
                          ? Math.round(players.reduce((sum, p) => sum + p.age, 0) / players.length)
                          : 0}
                      </span>
                    </div>
                  </div>
                  
                  {players.length >= 11 && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                      <p className="text-sm text-green-800">
                        ✓ You have enough players! Click "Get AI Recommendations" to see your tactical analysis.
                      </p>
                    </div>
                  )}
                  
                  {players.length < 11 && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                      <p className="text-sm text-blue-800">
                        Add {11 - players.length} more player{11 - players.length !== 1 ? 's' : ''} to unlock AI recommendations.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
