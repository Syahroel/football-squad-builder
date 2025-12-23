import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { players } from '@/db/schema';
import { eq, like, or } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const position = searchParams.get('position');
    const search = searchParams.get('search');
    
    let query = db.select().from(players);
    
    if (position) {
      const result = await db.select().from(players).where(eq(players.position, position));
      return NextResponse.json(result);
    }
    
    if (search) {
      const result = await db.select().from(players).where(like(players.name, `%${search}%`));
      return NextResponse.json(result);
    }
    
    const allPlayers = await db.select().from(players);
    return NextResponse.json(allPlayers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch players' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newPlayer = await db.insert(players).values(body).returning();
    return NextResponse.json(newPlayer[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create player' }, { status: 500 });
  }
}
