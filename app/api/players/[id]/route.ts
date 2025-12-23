import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { players } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updated = await db.update(players)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(players.id, params.id))
      .returning();
    
    if (updated.length === 0) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }
    
    return NextResponse.json(updated[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update player' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.delete(players).where(eq(players.id, params.id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete player' }, { status: 500 });
  }
}
