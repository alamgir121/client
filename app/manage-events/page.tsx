"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { CalendarDays, Loader2, MapPin, Pencil, Trash2, Users } from "lucide-react";
import { api } from "@/lib/api";
import { formatDate, isPast } from "@/lib/utils";
import type { EventItem, EventPayload } from "@/lib/types";
import { PrivateGuard } from "@/components/private-guard";
import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { EventForm } from "@/components/event-form";
import { EmptyState } from "@/components/empty-state";
import { EventGridSkeleton } from "@/components/event-card";
import { SafeImage } from "@/components/safe-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function ManageEventsPage() {
  const [events, setEvents] = useState<EventItem[] | null>(null);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<EventItem | null>(null);
  const [deleting, setDeleting] = useState<EventItem | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    api<EventItem[]>("/my-events", {}, true).then(setEvents).catch((e) => setError(e.message));
  }, []);
  useEffect(load, [load]);

  async function update(payload: EventPayload) {
    if (!editing) return;
    await api(`/events/${editing._id}`, { method: "PUT", body: JSON.stringify(payload) }, true);
    toast.success("Event updated.");
    setEditing(null);
    load();
  }

  async function remove() {
    if (!deleting) return;
    setBusy(true);
    try {
      await api(`/events/${deleting._id}`, { method: "DELETE" }, true);
      toast.success("Event deleted.");
      setEvents((list) => list?.filter((e) => e._id !== deleting._id) ?? null);
      setDeleting(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "We couldn't delete that event.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PrivateGuard>
      <Container className="py-12">
        <SectionHeading as="h1" title="Manage your events" description="Edit details or remove events you created." />
        <div className="mt-10">
          {error ? (
            <EmptyState title="We couldn't load your events" description={error} />
          ) : events === null ? (
            <EventGridSkeleton count={3} />
          ) : events.length === 0 ? (
            <EmptyState title="You haven't created any events" description="Organise your first drive and it will show up here." actionHref="/create-event" actionLabel="Create an event" />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((e) => (
                <Card key={e._id} className="flex h-full flex-col overflow-hidden">
                  <div className="relative aspect-[16/10] bg-muted">
                    <SafeImage src={e.thumbnail} alt={e.title} className="absolute inset-0 size-full object-cover" />
                    <Badge className="absolute left-3 top-3">{e.type}</Badge>
                    {isPast(e.date) && <Badge variant="destructive" className="absolute right-3 top-3">Ended</Badge>}
                  </div>
                  <CardContent className="flex flex-1 flex-col gap-4 p-5">
                    <h3 className="line-clamp-2 min-h-[3.25rem] font-heading text-lg font-bold leading-snug">
                      <Link href={`/events/${e._id}`} className="hover:text-primary">{e.title}</Link>
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex gap-2"><CalendarDays className="mt-0.5 size-4 shrink-0 text-primary" />{formatDate(e.date)}</li>
                      <li className="flex gap-2"><MapPin className="mt-0.5 size-4 shrink-0 text-primary" /><span className="line-clamp-1">{e.location}</span></li>
                      <li className="flex gap-2"><Users className="mt-0.5 size-4 shrink-0 text-primary" />{e.joinedCount ?? 0} joined</li>
                    </ul>
                    <div className="mt-auto grid grid-cols-2 gap-3">
                      <Button variant="outline" onClick={() => setEditing(e)}><Pencil />Update</Button>
                      <Button variant="destructive" onClick={() => setDeleting(e)}><Trash2 />Delete</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Update event</DialogTitle>
              <DialogDescription>Changes appear on the public event page straight away.</DialogDescription>
            </DialogHeader>
            {editing && <EventForm key={editing._id} initial={editing} submitLabel="Save changes" onSubmit={update} />}
          </DialogContent>
        </Dialog>

        <Dialog open={!!deleting} onOpenChange={(o) => !o && !busy && setDeleting(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete this event?</DialogTitle>
              <DialogDescription>
                “{deleting?.title}” and everyone's sign-ups for it will be removed. This can't be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleting(null)} disabled={busy}>Keep event</Button>
              <Button variant="destructive" onClick={remove} disabled={busy}>
                {busy && <Loader2 className="animate-spin" />}Delete event
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Container>
    </PrivateGuard>
  );
}
