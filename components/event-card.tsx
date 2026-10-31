import Link from "next/link";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SafeImage } from "@/components/safe-image";
import { formatDate, isPast } from "@/lib/utils";
import type { EventItem } from "@/lib/types";

export function EventCard({ event }: { event: EventItem }) {
  const ended = isPast(event.date);
  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[16/10] w-full shrink-0 bg-muted">
        <SafeImage src={event.thumbnail} alt={event.title} className="absolute inset-0 size-full object-cover" />
        <Badge className="absolute left-3 top-3">{event.type}</Badge>
        {ended && <Badge variant="destructive" className="absolute right-3 top-3">Ended</Badge>}
      </div>
      <CardContent className="flex flex-1 flex-col gap-4 p-5">
        <h3 className="line-clamp-2 min-h-[3.25rem] font-heading text-lg font-bold leading-snug">{event.title}</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2"><CalendarDays className="mt-0.5 size-4 shrink-0 text-primary" /><span>{formatDate(event.date)}</span></li>
          <li className="flex items-start gap-2"><MapPin className="mt-0.5 size-4 shrink-0 text-primary" /><span className="line-clamp-1">{event.location}</span></li>
          <li className="flex items-start gap-2"><Users className="mt-0.5 size-4 shrink-0 text-primary" /><span>{event.joinedCount ?? 0} joined</span></li>
        </ul>
        <Button asChild className="mt-auto w-full">
          <Link href={`/events/${event._id}`}>View Event</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export function EventCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-[16/10] w-full rounded-none" />
      <CardContent className="space-y-4 p-5">
        <Skeleton className="h-6 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
        <Skeleton className="h-4 w-2/5" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}

export function EventGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Loading events">
      {Array.from({ length: count }).map((_, i) => <EventCardSkeleton key={i} />)}
    </div>
  );
}
