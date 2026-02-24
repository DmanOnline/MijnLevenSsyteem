"use client";

import Link from "next/link";

interface ModuleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  gradient: string;
  isActive: boolean;
  index: number;
}

export default function ModuleCard({
  title,
  description,
  icon,
  href,
  gradient,
  isActive,
  index,
}: ModuleCardProps) {
  return (
    <Link
      href={href}
      className={`group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-6 transition-all duration-300 hover:border-border hover:bg-card-hover hover:-translate-y-1 hover:shadow-xl hover:shadow-shadow animate-fade-in opacity-0 stagger-${index + 1}`}
    >
      {/* Gradient glow effect on hover */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${gradient} blur-3xl -z-10`}
        style={{ transform: "scale(0.8)", filter: "blur(40px)" }}
      />

      {/* Top accent line */}
      <div
        className={`absolute top-0 left-0 right-0 h-[2px] ${gradient} opacity-40 group-hover:opacity-100 transition-opacity duration-300`}
      />

      {/* Icon */}
      <div
        className={`w-12 h-12 rounded-xl ${gradient} flex items-center justify-center mb-4 shadow-lg transition-transform duration-300 group-hover:scale-110`}
      >
        {icon}
      </div>

      {/* Content */}
      <h3 className="text-base font-semibold text-foreground/90 mb-1 group-hover:text-foreground transition-colors">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-muted transition-colors">
        {description}
      </p>

      {/* Status */}
      <div className="mt-4 flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-medium ${
            isActive ? "text-emerald-500" : "text-muted-foreground"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isActive ? "bg-emerald-500 animate-pulse-glow" : "bg-muted"
            }`}
          />
          {isActive ? "Active" : "Coming soon"}
        </span>
        <svg
          className="w-4 h-4 text-muted group-hover:text-muted-foreground group-hover:translate-x-1 transition-all duration-200"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
      </div>
    </Link>
  );
}
