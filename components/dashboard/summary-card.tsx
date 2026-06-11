import type { ReactNode } from "react";

interface SummaryCardProps {
  title: string;
  value: string;
  description: string;
  accentClassName: string;
  icon: ReactNode;
}

export function SummaryCard({
  title,
  value,
  description,
  accentClassName,
  icon,
}: SummaryCardProps) {
  return (
    <article className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-zinc-500">{title}</p>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-2xl ${accentClassName}`}
        >
          {icon}
        </div>
      </div>
      <p className="mt-4 text-2xl font-semibold tracking-tight text-zinc-950">
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-zinc-600">{description}</p>
    </article>
  );
}
