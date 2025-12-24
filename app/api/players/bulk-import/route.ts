import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { players } from '@/db/schema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileContent } = body;

    if (!fileContent) {
      return NextResponse.json({ error: 'No file content provided' }, { status: 400 });
    }

    const lines = fileContent.split(/\r?\n/).filter((line: string) => line.trim());
    const dataLines = lines.slice(1);

    const playersToInsert = dataLines.map((line: string) => {
      const parts = line.split('\t');
      return {
        name: parts[1]?.trim(),
        position: parts[2]?.trim(),
        playingStyle: parts[3]?.trim(),
        ovr: parseInt(parts[4]?.trim()),
        age: parseInt(parts[5]?.trim()),
        originalClub: parts[6]?.trim() || null,
      };
    }).filter((p: any) => p.name && !isNaN(p.ovr) && !isNaN(p.age));

    if (playersToInsert.length === 0) {
      return NextResponse.json({ error: 'No valid players found in file' }, { status: 400 });
    }

    const inserted = [];
    for (const player of playersToInsert) {
      const result = await db.insert(players).values(player).returning();
      inserted.push(result[0]);
    }
    
    return NextResponse.json({ 
      success: true, 
      count: inserted.length,
      players: inserted 
    });
  } catch (error: any) {
    console.error('Bulk import error:', error);
    return NextResponse.json({ error: error.message || 'Failed to import players' }, { status: 500 });
  }
}
