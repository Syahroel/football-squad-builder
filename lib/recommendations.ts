import { Player } from '@/db/schema';
import { FORMATION_POSITIONS, Formation } from './constants';

interface StartingXI {
  formation: Formation;
  players: Array<{
    player: Player;
    position: string;
    explanation: string;
    isHighlighted?: boolean;
    score?: number;
    strengths?: string[];
  }>;
}

interface SuperSub {
  player: Player;
  reason: string;
  timing: string;
  impact?: string;
}

interface FormationRecommendation {
  type: 'balanced' | 'offensive' | 'defensive';
  formation: Formation;
  description: string;
  tacticalInstructions: string[];
  whenToUse: string;
}

interface TacticalStrategy {
  scenario: string;
  strategies: string[];
  keyPlayers: string[];
  superSubTiming: string;
}

export interface RecommendationResult {
  startingXI: StartingXI;
  superSubs: SuperSub[];
  formations: FormationRecommendation[];
  tacticalStrategies: TacticalStrategy[];
}

const PLAYING_STYLE_SYNERGY: Record<string, { synergy: string[], antiSynergy: string[], formationBonus: Record<string, number> }> = {
  'Offensive Goalkeeper': { synergy: ['Build Up', 'Orchestrator'], antiSynergy: ['Defensive Fullback'], formationBonus: { '4-3-3': 10, '3-4-3': 8 } },
  'Build Up': { synergy: ['Offensive Goalkeeper', 'Orchestrator'], antiSynergy: [], formationBonus: { '4-3-3': 10, '4-2-3-1': 8 } },
  'Destroyer': { synergy: ['Anchor Man', 'Defensive Fullback'], antiSynergy: ['Extra Frontman'], formationBonus: { '5-3-2': 10, '4-4-2': 8 } },
  'Offensive Fullback': { synergy: ['Prolific Winger', 'Anchor Man'], antiSynergy: [], formationBonus: { '4-3-3': 10, '3-5-2': 8 } },
  'Anchor Man': { synergy: ['Offensive Fullback', 'Hole Player'], antiSynergy: [], formationBonus: { '4-3-3': 10, '4-2-3-1': 8 } },
  'Box-to-Box': { synergy: ['Anchor Man', 'Prolific Winger'], antiSynergy: [], formationBonus: { '4-3-3': 8, '4-4-2': 10 } },
  'Classic No. 10': { synergy: ['Anchor Man', 'Target Man'], antiSynergy: ['Hole Player'], formationBonus: { '4-2-3-1': 10, '4-4-2': 8 } },
  'Prolific Winger': { synergy: ['Offensive Fullback', 'Anchor Man'], antiSynergy: [], formationBonus: { '4-3-3': 15, '4-2-3-1': 10 } },
  'Goal Poacher': { synergy: ['Creative Playmaker', 'Hole Player'], antiSynergy: ['Target Man'], formationBonus: { '4-3-3': 10, '4-2-3-1': 8 } },
};

const POSITION_STRENGTHS: Record<string, string[]> = {
  'Offensive Goalkeeper': ['Distribution', 'Sweeping'],
  'Build Up': ['Passing', 'Ball control'],
  'Destroyer': ['Tackling', 'Physical duels'],
  'Offensive Fullback': ['Overlapping', 'Crossing'],
  'Anchor Man': ['Defensive positioning', 'Interceptions'],
  'Box-to-Box': ['Work rate', 'Stamina'],
  'Classic No. 10': ['Creativity', 'Through balls'],
  'Prolific Winger': ['Cutting inside', 'Shooting'],
  'Goal Poacher': ['Finishing', 'Positioning'],
};

function canPlayPosition(player: Player, position: string): boolean {
  const positionCompatibility: Record<string, string[]> = {
    GK: ['GK'],
    CB: ['CB'],
    LB: ['LB', 'CB'],
    RB: ['RB', 'CB'],
    DMF: ['DMF', 'CMF', 'CB'],
    CMF: ['CMF', 'DMF', 'AMF'],
    AMF: ['AMF', 'CMF', 'LWF', 'RWF', 'SS'],
    LWF: ['LWF', 'AMF', 'LB', 'SS'],
    RWF: ['RWF', 'AMF', 'RB', 'SS'],
    CF: ['CF', 'SS'],
    SS: ['SS', 'CF', 'AMF'],
  };
  
  return positionCompatibility[position]?.includes(player.position) || false;
}

function normalizeOVR(ovr: number): number {
  return ((ovr - 40) / (99 - 40)) * 100;
}

function calculateAgeScore(age: number): number {
  if (age >= 19 && age <= 28) return 100;
  if (age >= 17 && age < 19) return 85 + (19 - age) * 5;
  if (age > 28 && age <= 32) return 100 - (age - 28) * 5;
  if (age > 32) return Math.max(50 - (age - 32) * 10, 20);
  return 70;
}

function calculateChemistryBonus(player: Player, lineup: Player[]): number {
  let bonus = 0;
  const playerStyle = PLAYING_STYLE_SYNERGY[player.playingStyle];
  if (!playerStyle) return 0;
  
  for (const teammate of lineup) {
    if (playerStyle.synergy.includes(teammate.playingStyle)) bonus += 10;
    if (playerStyle.antiSynergy.includes(teammate.playingStyle)) bonus -= 15;
  }
  
  return Math.max(0, Math.min(bonus, 30));
}

function calculatePositionFit(player: Player, position: string, formation: Formation, lineup: Player[]): number {
  if (!canPlayPosition(player, position)) return 0;
  
  const weights = { ovr: 0.35, position: 0.25, style: 0.20, age: 0.10, chemistry: 0.10 };
  
  const ovrScore = normalizeOVR(player.ovr);
  const positionScore = player.position === position ? 100 : 70;
  
  const styleData = PLAYING_STYLE_SYNERGY[player.playingStyle];
  const styleScore = styleData?.formationBonus[formation] ? 80 + styleData.formationBonus[formation] : 60;
  
  const ageScore = calculateAgeScore(player.age);
  const chemistryScore = 70 + calculateChemistryBonus(player, lineup);
  
  return (
    ovrScore * weights.ovr +
    positionScore * weights.position +
    styleScore * weights.style +
    ageScore * weights.age +
    chemistryScore * weights.chemistry
  );
}

function selectBestFormation(players: Player[]): Formation {
  const positionCounts = players.reduce((acc, p) => {
    acc[p.position] = (acc[p.position] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const styleCount = players.reduce((acc, p) => {
    acc[p.playingStyle] = (acc[p.playingStyle] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const avgWingerOVR = players.filter(p => ['LWF', 'RWF'].includes(p.position))
    .reduce((sum, p) => sum + p.ovr, 0) / Math.max(players.filter(p => ['LWF', 'RWF'].includes(p.position)).length, 1);
  
  const avgStrikerOVR = players.filter(p => ['CF', 'SS'].includes(p.position))
    .reduce((sum, p) => sum + p.ovr, 0) / Math.max(players.filter(p => ['CF', 'SS'].includes(p.position)).length, 1);
  
  const avgDefenderOVR = players.filter(p => ['CB'].includes(p.position))
    .reduce((sum, p) => sum + p.ovr, 0) / Math.max(players.filter(p => ['CB'].includes(p.position)).length, 1);
  
  // Formation scoring
  const formationScores: Record<Formation, number> = {
    '4-3-3': 0,
    '4-4-2': 0,
    '4-2-3-1': 0,
    '3-5-2': 0,
    '5-3-2': 0,
    '4-2-4': 0,
    '3-4-3': 0,
  };
  
  // 4-3-3: Strong wingers
  if (avgWingerOVR > 75 && (positionCounts['LWF'] || 0) >= 1 && (positionCounts['RWF'] || 0) >= 1) {
    formationScores['4-3-3'] += 30;
  }
  
  // 4-2-3-1: Creative AMF
  if (styleCount['Classic No. 10'] || styleCount['Creative Playmaker']) {
    formationScores['4-2-3-1'] += 25;
  }
  
  // 5-3-2: Strong defense
  if ((positionCounts['CB'] || 0) >= 4 && avgDefenderOVR > 75) {
    formationScores['5-3-2'] += 25;
  }
  
  // 4-4-2: Strong strikers
  if (avgStrikerOVR > 75 && (positionCounts['CF'] || 0) >= 2) {
    formationScores['4-4-2'] += 25;
  }
  
  // 3-5-2: Wing-backs
  if ((positionCounts['LB'] || 0) >= 1 && (positionCounts['RB'] || 0) >= 1 && styleCount['Offensive Fullback']) {
    formationScores['3-5-2'] += 20;
  }
  
  // Default bonus for 4-3-3 (most versatile)
  formationScores['4-3-3'] += 15;
  formationScores['4-2-3-1'] += 10;
  
  // Select highest scoring formation
  let bestFormation: Formation = '4-3-3';
  let bestScore = 0;
  
  for (const [formation, score] of Object.entries(formationScores)) {
    if (score > bestScore) {
      bestScore = score;
      bestFormation = formation as Formation;
    }
  }
  
  return bestFormation;
}

function selectStartingXI(players: Player[], formation: Formation): StartingXI {
  const positions = FORMATION_POSITIONS[formation];
  const selectedPlayers: Array<{ player: Player; position: string; explanation: string; isHighlighted?: boolean; score?: number; strengths?: string[] }> = [];
  const usedPlayerIds = new Set<string>();
  const lineup: Player[] = [];
  
  for (const position of positions) {
    const candidates = players
      .filter(p => !usedPlayerIds.has(p.id) && canPlayPosition(p, position))
      .map(p => ({ player: p, score: calculatePositionFit(p, position, formation, lineup) }))
      .sort((a, b) => b.score - a.score);
    
    if (candidates.length > 0) {
      const best = candidates[0];
      usedPlayerIds.add(best.player.id);
      lineup.push(best.player);
      
      const styleData = PLAYING_STYLE_SYNERGY[best.player.playingStyle];
      const hasGoodChemistry = lineup.some(p => styleData?.synergy.includes(p.playingStyle));
      
      let explanation = `Top ${position} choice (Score: ${Math.round(best.score)}/100). `;
      if (best.player.position === position) explanation += 'Natural position. ';
      if (hasGoodChemistry) explanation += 'Excellent chemistry with teammates. ';
      if (best.player.age >= 17 && best.player.age <= 23) explanation += 'Young prospect with high potential.';
      else if (best.player.ovr >= 80) explanation += 'Elite quality player.';
      
      selectedPlayers.push({
        player: best.player,
        position,
        explanation,
        isHighlighted: best.player.ovr >= 80,
        score: Math.round(best.score),
        strengths: POSITION_STRENGTHS[best.player.playingStyle] || ['Solid all-round ability'],
      });
    }
  }
  
  return { formation, players: selectedPlayers };
}

function selectSuperSubs(players: Player[], starters: Player[]): SuperSub[] {
  const starterIds = new Set(starters.map(p => p.id));
  const bench = players.filter(p => !starterIds.has(p.id)).sort((a, b) => b.ovr - a.ovr);
  
  const subs: SuperSub[] = [];
  const starterStyles = new Set(starters.map(p => p.playingStyle));
  
  const impactWinger = bench.find(p => 
    ['LWF', 'RWF'].includes(p.position) && 
    (p.playingStyle === 'Prolific Winger' || p.ovr >= 75)
  );
  if (impactWinger) {
    subs.push({
      player: impactWinger,
      reason: 'Game-changing pace and dribbling to unlock tired defenses',
      timing: '60th-70th minute when opponent legs are heavy',
      impact: 'High attacking threat from wide areas',
    });
  }
  
  const impactStriker = bench.find(p => 
    ['CF', 'SS'].includes(p.position) && 
    p.ovr >= 70 && 
    !starterStyles.has(p.playingStyle)
  );
  if (impactStriker && subs.length < 3) {
    subs.push({
      player: impactStriker,
      reason: 'Fresh legs and different attacking style when chasing a goal',
      timing: '65th-75th minute if losing or drawing',
      impact: 'Clinical finishing and movement in the box',
    });
  }
  
  const versatileMid = bench.find(p => 
    ['CMF', 'DMF', 'AMF'].includes(p.position) && 
    (p.playingStyle === 'Box-to-Box' || p.ovr >= 72)
  );
  if (versatileMid && subs.length < 3) {
    subs.push({
      player: versatileMid,
      reason: 'Energy and versatility to control midfield or add defensive cover',
      timing: '70th-80th minute to see out the game or push for a winner',
      impact: 'Fresh legs covering both boxes',
    });
  }
  
  while (subs.length < 3 && bench.length > subs.length) {
    const nextBest = bench.find(p => !subs.some(s => s.player.id === p.id));
    if (nextBest) {
      const role = ['CF', 'SS', 'LWF', 'RWF'].includes(nextBest.position) ? 'attacking' : 
                   ['CB', 'RB', 'LB', 'DMF'].includes(nextBest.position) ? 'defensive' : 'utility';
      subs.push({
        player: nextBest,
        reason: `Quality ${role} option (OVR ${nextBest.ovr}) for tactical flexibility`,
        timing: 'As needed based on match situation',
        impact: `Provides ${role} cover and fresh legs`,
      });
    } else break;
  }
  
  return subs;
}

function generateFormationRecommendations(players: Player[], baseFormation: Formation): FormationRecommendation[] {
  const hasStrongWingers = players.filter(p => ['LWF', 'RWF'].includes(p.position) && p.ovr >= 75).length >= 2;
  const hasStrongDefense = players.filter(p => p.position === 'CB' && p.ovr >= 75).length >= 3;
  
  const offensiveFormation = hasStrongWingers ? '4-2-4' : '3-4-3';
  const defensiveFormation = hasStrongDefense ? '5-3-2' : '5-4-1';
  
  return [
    {
      type: 'balanced',
      formation: baseFormation,
      description: 'Your primary formation for kick-off and balanced play',
      tacticalInstructions: [
        'Maintain shape and compactness',
        'Quick transitions from defense to attack',
        'Wingers stay wide to stretch the defense',
        'Midfielders support both phases',
      ],
      whenToUse: 'Start of match, when scores are level, or controlling the game',
    },
    {
      type: 'offensive',
      formation: offensiveFormation as Formation,
      description: 'Ultra-attacking setup when chasing a goal',
      tacticalInstructions: [
        'Push fullbacks high as auxiliary wingers',
        'Commit more players forward',
        'High defensive line to compress space',
        'Quick combinations in final third',
      ],
      whenToUse: 'Losing in final 20 minutes or need a goal urgently',
    },
    {
      type: 'defensive',
      formation: defensiveFormation as Formation,
      description: 'Defensive solidity to protect a lead',
      tacticalInstructions: [
        'Drop into a low block',
        'Wingers track back to form a 5-man defense',
        'Compact midfield to deny space',
        'Counter-attack with pace on the break',
      ],
      whenToUse: 'Protecting a lead in final 15-20 minutes',
    },
  ];
}

function generateTacticalStrategies(startingXI: StartingXI): TacticalStrategy[] {
  const keyAttackers = startingXI.players
    .filter(p => ['LWF', 'RWF', 'CF', 'AMF', 'SS'].includes(p.position))
    .sort((a, b) => b.player.ovr - a.player.ovr)
    .slice(0, 3)
    .map(p => p.player.name);
  
  const hasPaceWingers = startingXI.players.some(p => 
    ['LWF', 'RWF'].includes(p.position) && p.player.playingStyle === 'Prolific Winger'
  );
  
  const hasCreativeAMF = startingXI.players.some(p => 
    p.position === 'AMF' && ['Classic No. 10', 'Creative Playmaker'].includes(p.player.playingStyle)
  );
  
  return [
    {
      scenario: 'VS Full Defensive Teams (Low Block)',
      strategies: [
        'Patience is key - don\'t force passes into congested areas',
        hasCreativeAMF ? 'Use your creative AMF to unlock defense with through balls' : 'Use wingers to stretch the defense wide, creating central gaps',
        'Overload one side then switch play quickly to exploit space',
        'Set pieces become crucial - practice corner and free-kick routines',
        'Late runs from midfielders can catch defenders ball-watching',
        'Keep possession and tire them out - they can\'t defend for 90 minutes',
      ],
      keyPlayers: keyAttackers,
      superSubTiming: 'Bring on fresh wingers at 60-65 minutes to exploit tired fullbacks',
    },
    {
      scenario: 'VS Full Attacking Teams (High Press)',
      strategies: [
        'Stay compact and absorb pressure - let them commit forward',
        hasPaceWingers ? 'Quick counter-attacks with pace - your wingers will punish them' : 'Quick transitions - win ball and counter at pace',
        'Exploit space behind their high defensive line with through balls',
        'Target their fullbacks who push high - isolate them 1v1',
        'Midfield discipline crucial - don\'t get dragged out of position',
        'Be clinical - you won\'t get many chances against aggressive teams',
      ],
      keyPlayers: keyAttackers,
      superSubTiming: 'Introduce fresh legs at 65-70 minutes to exploit their tired press',
    },
  ];
}

export function generateRecommendations(players: Player[]): RecommendationResult {
  if (players.length < 11) {
    throw new Error('Need at least 11 players to generate recommendations');
  }
  
  const bestFormation = selectBestFormation(players);
  const startingXI = selectStartingXI(players, bestFormation);
  const superSubs = selectSuperSubs(players, startingXI.players.map(p => p.player));
  const formations = generateFormationRecommendations(players, bestFormation);
  const tacticalStrategies = generateTacticalStrategies(startingXI);
  
  return {
    startingXI,
    superSubs,
    formations,
    tacticalStrategies,
  };
}
