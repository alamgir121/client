"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { EventItem } from "@/lib/types";
import { PrivateGuard } from "@/components/private-guard";
import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { EventCard, EventGridSkeleton } from "@/components/event-card";
import { EmptyState } from "@/components/empty-state";

export default function JoinedEventsPage() {
  const [events, setEvents] = useState<EventItem[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<EventItem[]>("/my-joined", {}, true).then(setEvents).catch((e) => setError(e.message));
  }, []);

  return (
    <PrivateGuard>
      <Container className="py-12">
        <SectionHeading as="h1" title="Events you joined" description="Sorted by event date, so the next one is always first." />
        <div className="mt-10">
          {error ? (
            <EmptyState title="We couldn't load your events" description={error} />
          ) : events === null ? (
            <EventGridSkeleton count={3} />
          ) : events.length === 0 ? (
            <EmptyState title="You haven't joined an event yet" description="Find one near you and press Join Event." actionHref="/events" actionLabel="Browse events" />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((e) => <EventCard key={e._id} event={e} />)}
            </div>
          )}
        </div>
      </Container>
    </PrivateGuard>
  );
}
