import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { players } from '@/db/schema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileContent } = body;

    const lines = fileContent.split('\n').filter((line: string) => line.trim());
    const dataLines = lines.slice(1);

    const playersToInsert = dataLines.map((line: string) => {
      const parts = line.split('\t');
      return {
        name: parts[1]?.trim(),
        position: parts[2]?.trim(),
        playingStyle: parts[3]?.trim(),
        ovr: parseInt(parts[4]?.trim()),
        age: parseInt(parts[5]?.trim()),
        originalClub: parts[6]?.trim(),
      };
    }).filter((p: any) => p.name && p.ovr && p.age);

    const inserted = await db.insert(players).values(playersToInsert).returning();
    
    return NextResponse.json({ 
      success: true, 
      count: inserted.length,
      players: inserted 
    });
  } catch (error) {
    console.error('Bulk import error:', error);
    return NextResponse.json({ error: 'Failed to import players' }, { status: 500 });
  }
}
