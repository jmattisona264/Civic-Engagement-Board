import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST: Create a new community issue
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, desc, category } = body;

    const newIssue = await prisma.issue.create({
      data: { title, desc, category, votes: 0 }
    });

    return NextResponse.json(newIssue, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create issue' }, { status: 500 });
  }
}

// PATCH: Upvote an issue
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id } = body;

    const updatedIssue = await prisma.issue.update({
      where: { id: Number(id) },
      data: { votes: { increment: 1 } }
    });

    return NextResponse.json(updatedIssue, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to upvote issue' }, { status: 500 });
  }
}