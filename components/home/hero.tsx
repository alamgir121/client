"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/container";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { EventItem } from "@/lib/types";

export function Hero() {
  const [events, setEvents] = useState<EventItem[] | null>(null);

  useEffect(() => {
    api<EventItem[]>("/events?limit=3").then(setEvents).catch(() => setEvents([]));
  }, []);

  return (
    <section className="border-b bg-gradient-to-b from-muted/60 to-background">
      <Container className="grid items-center gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
        <div>
          <h1 className="font-heading text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Your neighbourhood needs you this weekend.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            From winter clothes in Mirpur to blankets in Mohammadpur, find a community service event close to home, join it in one tap, or organise your own.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg"><Link href="/events">Find an event</Link></Button>
            <Button asChild size="lg" variant="accent"><Link href="/create-event">Organise an event</Link></Button>
          </div>
        </div>

        <div className="rounded-xl border-2 border-foreground/80 bg-card p-5 shadow-[8px_8px_0_0_var(--accent)] sm:p-6">
          <h2 className="font-heading text-lg font-bold">Coming up next</h2>
          <ul className="mt-4 divide-y">
            {events === null && Array.from({ length: 3 }).map((_, i) => (
              <li key={i} className="space-y-2 py-4"><Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-1/2" /></li>
            ))}
            {events?.map((e) => (
              <li key={e._id}>
                <Link href={`/events/${e._id}`} className="block py-4 hover:text-primary">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-semibold leading-snug">{e.title}</p>
                    <Badge variant="secondary" className="shrink-0">{e.type}</Badge>
                  </div>
                  <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5"><CalendarDays className="size-4" />{formatDate(e.date)}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="size-4" />{e.location}</span>
                  </p>
                </Link>
              </li>
            ))}
          </ul>
          {events?.length === 0 && (
            <p className="py-4 text-sm text-muted-foreground">No events are scheduled yet. Be the first to organise one.</p>
          )}
        </div>
      </Container>
    </section>
  );
}
