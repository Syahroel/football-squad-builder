export const POSITIONS = [
  'GK', 'CB', 'LB', 'RB', 'DMF', 'CMF', 'AMF', 'LWF', 'RWF', 'CF', 'SS'
] as const;

export const PLAYING_STYLES: Record<string, string[]> = {
  GK: ['Offensive Goalkeeper', 'Defensive Goalkeeper'],
  CB: ['Extra Frontman', 'Build Up', 'Destroyer', 'The Wall'],
  LB: ['Offensive Fullback', 'Defensive Fullback', 'Roaming Flank'],
  RB: ['Offensive Fullback', 'Defensive Fullback', 'Roaming Flank'],
  DMF: ['Anchor Man', 'Destroyer', 'Orchestrator', 'Box-to-Box'],
  CMF: ['Box-to-Box', 'Hole Player', 'Orchestrator', 'The Destroyer'],
  AMF: ['Classic No. 10', 'Hole Player', 'Creative Playmaker', 'Box-to-Box'],
  LWF: ['Prolific Winger', 'Roaming Flank', 'Goal Poacher'],
  RWF: ['Prolific Winger', 'Roaming Flank', 'Goal Poacher'],
  CF: ['Goal Poacher', 'Fox In The Box', 'Advanced Striker', 'Target Man'],
  SS: ['Creative Playmaker', 'Hole Player', 'Dummy Runner'],
};

export const FORMATIONS = [
  '4-3-3',
  '4-4-2',
  '4-2-3-1',
  '3-5-2',
  '5-3-2',
  '4-2-4',
  '3-4-3',
] as const;

export const FORMATION_POSITIONS: Record<string, string[]> = {
  '4-3-3': ['GK', 'LB', 'CB', 'CB', 'RB', 'CMF', 'CMF', 'CMF', 'LWF', 'CF', 'RWF'],
  '4-4-2': ['GK', 'LB', 'CB', 'CB', 'RB', 'LWF', 'CMF', 'CMF', 'RWF', 'CF', 'CF'],
  '4-2-3-1': ['GK', 'LB', 'CB', 'CB', 'RB', 'DMF', 'DMF', 'LWF', 'AMF', 'RWF', 'CF'],
  '3-5-2': ['GK', 'CB', 'CB', 'CB', 'LB', 'CMF', 'CMF', 'CMF', 'RB', 'CF', 'CF'],
  '5-3-2': ['GK', 'LB', 'CB', 'CB', 'CB', 'RB', 'CMF', 'CMF', 'CMF', 'CF', 'CF'],
  '4-2-4': ['GK', 'LB', 'CB', 'CB', 'RB', 'DMF', 'DMF', 'LWF', 'RWF', 'CF', 'CF'],
  '3-4-3': ['GK', 'CB', 'CB', 'CB', 'LB', 'CMF', 'CMF', 'RB', 'LWF', 'CF', 'RWF'],
};

export type Position = typeof POSITIONS[number];
export type Formation = typeof FORMATIONS[number];
