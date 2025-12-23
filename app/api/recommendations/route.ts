import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { players } from '@/db/schema';
import { generateRecommendations } from '@/lib/recommendations';

export async function POST(request: NextRequest) {
  try {
    const allPlayers = await db.select().from(players);
    
    if (allPlayers.length < 11) {
      return NextResponse.json(
        { error: 'Need at least 11 players to generate recommendations' },
        { status: 400 }
      );
    }
    
    const recommendations = generateRecommendations(allPlayers);
    return NextResponse.json(recommendations);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}
