"use client";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { EventCard, EventGridSkeleton } from "@/components/event-card";
import { EmptyState } from "@/components/empty-state";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EVENT_TYPES } from "@/lib/constants";
import { api } from "@/lib/api";
import type { EventItem } from "@/lib/types";

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[] | null>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");

  useEffect(() => {
    setEvents(null);
    setError("");
    const t = setTimeout(() => {
      const qs = new URLSearchParams();
      if (search.trim()) qs.set("search", search.trim());
      if (type !== "All") qs.set("type", type);
      api<EventItem[]>(`/events?${qs}`).then(setEvents).catch((e) => setError(e.message));
    }, 300);
    return () => clearTimeout(t);
  }, [search, type]);

  return (
    <Container className="py-12">
      <SectionHeading as="h1" title="Upcoming events"  />
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input aria-label="Search events by title" placeholder="Search by title" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="sm:w-56">
          <Select value={type} onValueChange={setType}>
            <SelectTrigger aria-label="Filter by event type"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All types</SelectItem>
              {EVENT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-8">
        {error ? (
          <EmptyState title="We couldn't load events" description={error} />
        ) : events === null ? (
          <EventGridSkeleton />
        ) : events.length === 0 ? (
          <EmptyState
            title="No events match"
            description={search || type !== "All" ? "Try a different search or clear the type filter." : "Nothing is scheduled yet. Organise the first event."}
            actionHref="/create-event" actionLabel="Create an event"
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((e) => <EventCard key={e._id} event={e} />)}
          </div>
        )}
      </div>
    </Container>
  );
}
