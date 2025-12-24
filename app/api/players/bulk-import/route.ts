import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { players } from '@/db/schema';
import { sql } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileContent } = body;

    if (!fileContent) {
      return NextResponse.json({ error: 'No file content provided' }, { status: 400 });
    }

    const lines = fileContent.split(/\r?\n/).filter((line: string) => line.trim());
    const dataLines = lines.slice(1);

    const playersData = dataLines.map((line: string) => {
      const parts = line.split('\t');
      return {
        id: crypto.randomUUID(),
        name: parts[1]?.trim(),
        position: parts[2]?.trim(),
        playingStyle: parts[3]?.trim(),
        ovr: parseInt(parts[4]?.trim()),
        age: parseInt(parts[5]?.trim()),
        originalClub: parts[6]?.trim() || null,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        userId: 'default',
      };
    }).filter((p: any) => p.name && !isNaN(p.ovr) && !isNaN(p.age));

    if (playersData.length === 0) {
      return NextResponse.json({ error: 'No valid players found in file' }, { status: 400 });
    }

    for (const player of playersData) {
      await db.run(sql`
        INSERT INTO players (id, name, ovr, age, position, playing_style, original_club, created_at, updated_at, user_id)
        VALUES (${player.id}, ${player.name}, ${player.ovr}, ${player.age}, ${player.position}, ${player.playingStyle}, ${player.originalClub}, ${player.createdAt}, ${player.updatedAt}, ${player.userId})
      `);
    }
    
    return NextResponse.json({ 
      success: true, 
      count: playersData.length
    });
  } catch (error: any) {
    console.error('Bulk import error:', error);
    return NextResponse.json({ error: error.message || 'Failed to import players' }, { status: 500 });
  }
}
