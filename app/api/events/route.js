import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST: Create a new municipal event
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, date } = body;

    const newEvent = await prisma.event.create({
      data: { title, date }
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}