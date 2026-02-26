"use client";

import { useEffect, useState } from "react";

interface QuoteData {
  quote: string;
  author: string;
}

export default function QuoteOfDay() {
  const [data, setData] = useState<QuoteData | null>(null);

  useEffect(() => {
    fetch("/api/quote")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  if (!data) return null;

  return (
    <div className="rounded-2xl border border-border bg-card/60 px-6 py-5 transition-colors duration-300 animate-fade-in relative overflow-hidden">
      {/* Decorative quote mark */}
      <div className="absolute top-3 left-4 text-5xl leading-none font-serif text-accent/10 select-none pointer-events-none">
        &ldquo;
      </div>

      <p className="text-sm md:text-base text-foreground/80 italic leading-relaxed pl-6">
        {data.quote}
      </p>
      <p className="text-xs text-muted mt-2 pl-6">
        &mdash; {data.author}
      </p>
    </div>
  );
}
