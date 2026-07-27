import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get issues merged with External Weather Data
export async function GET() {
  try {
    const issues = await prisma.issue.findMany({
      orderBy: { id: 'desc'}
  });
    //Fetch external data from weather API
  const weatherRes = await fetch(
    'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m',
    { next: {revalidate: 300} } //Cache data for 5 minutes
  );

  let weatherData= null;
  if (weatherRes.ok) {
    const weatherJson = await weatherRes.json();
    weatherData = weatherJson.current_weather;
  }
  return NextResponse.json({
    issues,
    weather: weatherData
  }, { status: 200 });

} catch (error) {
  return NextResponse.json({ error: 'Failed to fetch issues and weather data' }, { status: 500});
}
}

//Create a new community issue
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

//Upvote an issue
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