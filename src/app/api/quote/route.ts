import { NextResponse } from "next/server";

let cached: { quote: string; author: string; date: string } | null = null;

export async function GET() {
  const today = new Date().toISOString().substring(0, 10);

  if (cached && cached.date === today) {
    return NextResponse.json(cached);
  }

  try {
    const res = await fetch("https://zenquotes.io/api/today", {
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error("ZenQuotes API error");

    const data = await res.json();
    const { q, a } = data[0];

    cached = { quote: q, author: a, date: today };
    return NextResponse.json(cached);
  } catch {
    return NextResponse.json({
      quote: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
      date: today,
    });
  }
}
