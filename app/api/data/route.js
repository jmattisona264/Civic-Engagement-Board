import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  let weatherData = null;

  try {
    // Fetch DB records
    const issues = await prisma.issue.findMany({
      orderBy: { createdAt: 'desc' },
    });
    const events = await prisma.event.findMany({
      orderBy: { date: 'asc' },
    });

    //Fetch external Weather API
    try {
      const weatherRes = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=35.2271&longitude=-80.8431&current_weather=true',
        { cache: 'no-store' }
      );
      if (weatherRes.ok) {
        const weatherJson = await weatherRes.json();
        weatherData = weatherJson.current_weather || null;
      }
    } catch (apiError) {
      console.error('Failed to fetch external weather API:', apiError);
    }

    //Return issues, events, and weather
    return NextResponse.json(
      { issues, events, weather: weatherData },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}