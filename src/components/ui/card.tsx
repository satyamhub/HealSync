import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-lg border border-slate-200 bg-white p-5 shadow-sm", className)} {...props} />;
}

export function PageShell({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <main className={cn("mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8", className)} {...props} />;
}

export function SectionTitle({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-5">
      <h1 className="text-2xl font-bold tracking-normal text-slate-950">{title}</h1>
      {description ? <p className="mt-1 max-w-3xl text-sm text-slate-600">{description}</p> : null}
    </div>
  );
}
