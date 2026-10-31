"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { EventCard, EventGridSkeleton } from "@/components/event-card";
import { EmptyState } from "@/components/empty-state";
import { api } from "@/lib/api";
import type { EventItem } from "@/lib/types";

export function UpcomingSection() {
  const [events, setEvents] = useState<EventItem[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<EventItem[]>("/events?limit=6").then(setEvents).catch((e) => setError(e.message));
  }, []);

  return (
    <section className="bg-muted/50 py-20">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading title="Recent upcoming events" description="The next six events on the calendar, soonest first." />
          <Button asChild variant="outline"><Link href="/events">See all events</Link></Button>
        </div>
        <div className="mt-10">
          {error ? (
            <EmptyState title="We couldn't load events" description={error} />
          ) : events === null ? (
            <EventGridSkeleton />
          ) : events.length === 0 ? (
            <EmptyState title="No upcoming events yet" description="Be the first to organise a drive in your area." actionHref="/create-event" actionLabel="Create an event" />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((e) => <EventCard key={e._id} event={e} />)}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
