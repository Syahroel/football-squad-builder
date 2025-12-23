'use client';

import { RecommendationResult } from '@/lib/recommendations';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Download, Copy } from 'lucide-react';

interface RecommendationDisplayProps {
  recommendations: RecommendationResult;
}

export function RecommendationDisplay({ recommendations }: RecommendationDisplayProps) {
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
  
  const copyToClipboard = () => {
    exportToText();
    alert('Recommendations copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 justify-end">
        <Button onClick={exportToText}>
          <Download className="w-4 h-4 mr-2" />
          Export as TXT
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>📋 Starting XI - {recommendations.startingXI.formation}</CardTitle>
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
                  <h3 className="font-bold text-lg mb-2">{group}</h3>
                  <div className="space-y-2">
                    {players.map((p, i) => (
                      <div key={i} className="border-l-4 border-blue-500 pl-3 py-2 bg-gray-50">
                        <div className="font-semibold">
                          {p.position}: {p.player.name} ({p.player.ovr}, {p.player.age}y) - {p.player.playingStyle}
                          {p.isHighlighted && ' ⭐'}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">└─ {p.explanation}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>⚡ Super Subs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recommendations.superSubs.map((sub, i) => (
              <div key={i} className="border-l-4 border-green-500 pl-3 py-2 bg-gray-50">
                <div className="font-semibold">
                  {i + 1}. {sub.player.name} ({sub.player.ovr}, {sub.player.position})
                </div>
                <div className="text-sm text-gray-600 mt-1">Reason: {sub.reason}</div>
                <div className="text-sm text-gray-600">Timing: {sub.timing}</div>
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
          <div className="space-y-4">
            {recommendations.formations.map((f, i) => (
              <div key={i} className="border rounded-lg p-4">
                <h3 className="font-bold text-lg mb-2">
                  {f.type.toUpperCase()}: {f.formation}
                </h3>
                <p className="text-gray-700 mb-3">{f.description}</p>
                <div className="mb-2">
                  <span className="font-semibold">Tactical Instructions:</span>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    {f.tacticalInstructions.map((inst, j) => (
                      <li key={j} className="text-sm text-gray-600">{inst}</li>
                    ))}
                  </ul>
                </div>
                <div className="text-sm">
                  <span className="font-semibold">When to use:</span> {f.whenToUse}
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
          <div className="space-y-4">
            {recommendations.tacticalStrategies.map((strat, i) => (
              <div key={i} className="border rounded-lg p-4">
                <h3 className="font-bold text-lg mb-3">{strat.scenario}</h3>
                <ul className="list-decimal list-inside space-y-2 mb-3">
                  {strat.strategies.map((s, j) => (
                    <li key={j} className="text-sm text-gray-700">{s}</li>
                  ))}
                </ul>
                <div className="text-sm">
                  <span className="font-semibold">Key Players:</span> {strat.keyPlayers.join(', ')}
                </div>
                <div className="text-sm mt-1">
                  <span className="font-semibold">Super Sub Timing:</span> {strat.superSubTiming}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
