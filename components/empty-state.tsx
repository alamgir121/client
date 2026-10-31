import Link from "next/link";
import { Button } from "@/components/ui/button";

export function EmptyState({ title, description, actionHref, actionLabel }: {
  title: string; description: string; actionHref?: string; actionLabel?: string;
}) {
  return (
    <div className="rounded-xl border border-dashed bg-card px-6 py-16 text-center">
      <h3 className="font-heading text-xl font-bold">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-muted-foreground">{description}</p>
      {actionHref && actionLabel && (
        <Button asChild className="mt-6"><Link href={actionHref}>{actionLabel}</Link></Button>
      )}
    </div>
  );
}
