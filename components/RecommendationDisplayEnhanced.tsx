'use client';

import { RecommendationResult } from '@/lib/recommendations';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { PitchVisualization } from './PitchVisualization';
import { Download } from 'lucide-react';

interface RecommendationDisplayProps {
  recommendations: RecommendationResult;
}

export function RecommendationDisplayEnhanced({ recommendations }: RecommendationDisplayProps) {
  const exportToText = () => {
    let text = '⚽ TACTICAL ANALYSIS & SQUAD RECOMMENDATIONS\n\n';
    
    text += '═══════════════════════════════════════════════════════════════\n';
    text += '📋 STARTING XI RECOMMENDATION\n';
    text += '═══════════════════════════════════════════════════════════════\n\n';
    text += `Formation: ${recommendations.startingXI.formation}\n\n`;
    
    const positionGroups: Record<string, any[]> = {
      'GOALKEEPER': [],
      'DEFENSE': [],
      'MIDFIELD': [],
      'ATTACK': [],
    };
    
    recommendations.startingXI.players.forEach(p => {
      if (p.position === 'GK') positionGroups['GOALKEEPER'].push(p);
      else if (['CB', 'LB', 'RB'].includes(p.position)) positionGroups['DEFENSE'].push(p);
      else if (['DMF', 'CMF', 'AMF'].includes(p.position)) positionGroups['MIDFIELD'].push(p);
      else positionGroups['ATTACK'].push(p);
    });
    
    Object.entries(positionGroups).forEach(([group, players]) => {
      if (players.length > 0) {
        text += `\n${group}\n${'─'.repeat(50)}\n`;
        players.forEach(p => {
          text += `${p.position}: ${p.player.name} (${p.player.ovr}, ${p.player.age}y) - ${p.player.playingStyle}${p.isHighlighted ? ' ⭐' : ''}\n`;
          text += `└─ ${p.explanation}\n\n`;
        });
      }
    });
    
    text += '\n═══════════════════════════════════════════════════════════════\n';
    text += '⚡ SUPER SUB RECOMMENDATIONS\n';
    text += '═══════════════════════════════════════════════════════════════\n\n';
    
    recommendations.superSubs.forEach((sub, i) => {
      text += `${i + 1}. ${sub.player.name} (${sub.player.ovr}, ${sub.player.position})\n`;
      text += `   Reason: ${sub.reason}\n`;
      text += `   Timing: ${sub.timing}\n\n`;
    });
    
    text += '\n═══════════════════════════════════════════════════════════════\n';
    text += '🔄 FLUID FORMATION SYSTEM\n';
    text += '═══════════════════════════════════════════════════════════════\n\n';
    
    recommendations.formations.forEach(f => {
      text += `\n${f.type.toUpperCase()}: ${f.formation}\n`;
      text += `${f.description}\n\n`;
      text += 'Tactical Instructions:\n';
      f.tacticalInstructions.forEach(inst => text += `• ${inst}\n`);
      text += `\nWhen to use: ${f.whenToUse}\n`;
      text += '─'.repeat(50) + '\n';
    });
    
    text += '\n═══════════════════════════════════════════════════════════════\n';
    text += '⚙️ TACTICAL STRATEGIES\n';
    text += '═══════════════════════════════════════════════════════════════\n\n';
    
    recommendations.tacticalStrategies.forEach(strat => {
      text += `\n${strat.scenario}\n${'─'.repeat(50)}\n\n`;
      strat.strategies.forEach((s, i) => text += `${i + 1}. ${s}\n`);
      text += `\nKey Players: ${strat.keyPlayers.join(', ')}\n`;
      text += `Super Sub Timing: ${strat.superSubTiming}\n\n`;
    });
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'squad-recommendations.txt';
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 justify-end">
        <Button onClick={exportToText}>
          <Download className="w-4 h-4 mr-2" />
          Export as TXT
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>📋 Starting XI - {recommendations.startingXI.formation}</CardTitle>
          </CardHeader>
          <CardContent>
            <PitchVisualization
              formation={recommendations.startingXI.formation}
              players={recommendations.startingXI.players}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Squad Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['GOALKEEPER', 'DEFENSE', 'MIDFIELD', 'ATTACK'].map(group => {
                const players = recommendations.startingXI.players.filter(p => {
                  if (group === 'GOALKEEPER') return p.position === 'GK';
                  if (group === 'DEFENSE') return ['CB', 'LB', 'RB'].includes(p.position);
                  if (group === 'MIDFIELD') return ['DMF', 'CMF', 'AMF'].includes(p.position);
                  return ['LWF', 'RWF', 'CF', 'SS'].includes(p.position);
                });
                
                if (players.length === 0) return null;
                
                return (
                  <div key={group}>
                    <h3 className="font-bold text-sm mb-2 text-gray-700">{group}</h3>
                    <div className="space-y-2">
                      {players.map((p, i) => (
                        <div key={i} className="text-xs border-l-2 border-blue-500 pl-2 py-1 bg-gray-50">
                          <div className="font-semibold">
                            {p.position}: {p.player.name} ({p.player.ovr})
                            {p.isHighlighted && ' ⭐'}
                          </div>
                          <div className="text-gray-600">{p.player.playingStyle}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>⚡ Super Subs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {recommendations.superSubs.map((sub, i) => (
              <div key={i} className="border-2 border-green-500 rounded-lg p-4 bg-green-50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-bold">{sub.player.name}</div>
                    <div className="text-sm text-gray-600">{sub.player.position} • OVR {sub.player.ovr}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-700 mb-2">{sub.reason}</div>
                <div className="text-xs text-gray-600 italic">⏱️ {sub.timing}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🔄 Fluid Formations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {recommendations.formations.map((f, i) => (
              <div key={i} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${
                    f.type === 'balanced' ? 'bg-blue-500' :
                    f.type === 'offensive' ? 'bg-red-500' : 'bg-green-500'
                  }`}></div>
                  <h3 className="font-bold text-lg">{f.type.toUpperCase()}</h3>
                </div>
                <div className="text-2xl font-bold text-blue-600 mb-2">{f.formation}</div>
                <p className="text-sm text-gray-700 mb-3">{f.description}</p>
                <div className="text-xs text-gray-600 mb-2">
                  <span className="font-semibold">When:</span> {f.whenToUse}
                </div>
                <div className="text-xs">
                  <span className="font-semibold">Instructions:</span>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    {f.tacticalInstructions.slice(0, 2).map((inst, j) => (
                      <li key={j} className="text-gray-600">{inst}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>⚙️ Tactical Strategies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {recommendations.tacticalStrategies.map((strat, i) => (
              <div key={i} className="border-2 rounded-lg p-5 bg-gradient-to-r from-blue-50 to-white">
                <h3 className="font-bold text-xl mb-4 text-blue-900">{strat.scenario}</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-700">Strategies:</h4>
                    <ul className="space-y-2">
                      {strat.strategies.map((s, j) => (
                        <li key={j} className="flex gap-2 text-sm">
                          <span className="text-blue-600 font-bold">{j + 1}.</span>
                          <span className="text-gray-700">{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="bg-white rounded-lg p-3 border mb-3">
                      <h4 className="font-semibold text-sm mb-2 text-gray-700">🌟 Key Players:</h4>
                      <div className="flex flex-wrap gap-2">
                        {strat.keyPlayers.map((player, j) => (
                          <span key={j} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                            {player}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-green-100 rounded-lg p-3 border border-green-300">
                      <h4 className="font-semibold text-sm mb-1 text-green-800">⏱️ Super Sub Timing:</h4>
                      <p className="text-xs text-green-700">{strat.superSubTiming}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
