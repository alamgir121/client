import { cn } from "@/lib/utils";


export function SectionHeading({
  title, description, className, as: Tag = "h2",
}: { title: string; description?: string; className?: string; as?: "h1" | "h2" }) {
  return (
    <div className={cn("max-w-2xl", className)}>
      <Tag className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</Tag>
      {description && <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">{description}</p>}
    </div>
  );
}
