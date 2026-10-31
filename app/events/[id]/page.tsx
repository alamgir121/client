"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, CalendarDays, CheckCircle2, Loader2, MapPin, User, Users } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { formatDate, isPast } from "@/lib/utils";
import type { EventItem } from "@/lib/types";
import { Container } from "@/components/container";
import { SafeImage } from "@/components/safe-image";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [error, setError] = useState("");
  const [joined, setJoined] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api<EventItem>(`/events/${id}`).then(setEvent).catch((e) => setError(e.message));
  }, [id]);

  const checkJoined = useCallback(async () => {
    try {
      const r = await api<{ joined: boolean }>(`/events/${id}/joined`, {}, true);
      setJoined(r.joined);
    } catch { /* not critical */ }
  }, [id]);

  useEffect(() => {
    if (session) checkJoined();
    else setJoined(false);
  }, [session, checkJoined]);

  async function join() {
    if (!session) {
      toast.error("Log in to join this event.");
      return router.push(`/login?redirect=${encodeURIComponent(`/events/${id}`)}`);
    }
    setBusy(true);
    try {
      const r = await api<{ message: string }>(`/events/${id}/join`, { method: "POST" }, true);
      toast.success(r.message);
      setJoined(true);
      setEvent((e) => (e ? { ...e, joinedCount: (e.joinedCount ?? 0) + 1 } : e));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "We couldn't join you to this event.";
      toast.error(msg);
      if (msg.includes("already joined")) setJoined(true);
    } finally {
      setBusy(false);
    }
  }

  if (error) {
    return (
      <Container className="py-16">
        <EmptyState title="Event not found" description={error} actionHref="/events" actionLabel="Browse upcoming events" />
      </Container>
    );
  }

  if (!event) {
    return (
      <Container className="py-12">
        <Skeleton className="h-6 w-40" />
        <div className="mt-6 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <Skeleton className="aspect-[16/10] w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </Container>
    );
  }

  const ended = isPast(event.date);
  return (
    <Container className="py-12">
      <Button asChild variant="ghost" size="sm" className="-ml-3">
        <Link href="/events"><ArrowLeft />All events</Link>
      </Button>
      <div className="mt-4 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-muted">
            <SafeImage src={event.thumbnail} alt={event.title} className="absolute inset-0 size-full object-cover" />
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-2">
            <Badge>{event.type}</Badge>
            {ended && <Badge variant="destructive">Ended</Badge>}
          </div>
          <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">{event.title}</h1>
          <p className="mt-6 max-w-prose whitespace-pre-line text-base leading-relaxed text-muted-foreground sm:text-lg">{event.description}</p>
        </div>

        <aside>
          <Card className="lg:sticky lg:top-24">
            <CardContent className="space-y-5 p-6">
              <ul className="space-y-4 text-sm">
                <li className="flex gap-3"><CalendarDays className="size-5 shrink-0 text-primary" /><div><p className="font-semibold">When</p><p className="text-muted-foreground">{formatDate(event.date)}</p></div></li>
                <li className="flex gap-3"><MapPin className="size-5 shrink-0 text-primary" /><div><p className="font-semibold">Where</p><p className="text-muted-foreground">{event.location}</p></div></li>
                <li className="flex gap-3"><User className="size-5 shrink-0 text-primary" /><div><p className="font-semibold">Organiser</p><p className="text-muted-foreground">{event.creatorName || event.createdBy}</p></div></li>
                <li className="flex gap-3"><Users className="size-5 shrink-0 text-primary" /><div><p className="font-semibold">Volunteers</p><p className="text-muted-foreground">{event.joinedCount ?? 0} joined</p></div></li>
              </ul>
              {joined ? (
                <Button size="lg" className="w-full" disabled><CheckCircle2 />You've joined</Button>
              ) : (
                <Button size="lg" variant="accent" className="w-full" onClick={join} disabled={busy || ended}>
                  {busy && <Loader2 className="animate-spin" />}
                  {ended ? "This event has ended" : "Join Event"}
                </Button>
              )}
              {!session && !ended && <p className="text-center text-xs text-muted-foreground">You'll be asked to log in first.</p>}
            </CardContent>
          </Card>
        </aside>
      </div>
    </Container>
  );
}
