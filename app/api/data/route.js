import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const issues = await prisma.issue.findMany({
      orderBy: { createdAt: 'desc' }
    });
    const events = await prisma.event.findMany({
      orderBy: { date: 'asc' }
    });

    return NextResponse.json({ issues, events }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}