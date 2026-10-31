"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { EventPayload } from "@/lib/types";
import { PrivateGuard } from "@/components/private-guard";
import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { EventForm } from "@/components/event-form";
import { Card, CardContent } from "@/components/ui/card";

export default function CreateEventPage() {
  const router = useRouter();

  async function create(payload: EventPayload) {
    await api("/events", { method: "POST", body: JSON.stringify(payload) }, true);
    toast.success("Your event is live! Volunteers can now find it.");
    router.push("/events");
  }

  return (
    <PrivateGuard>
      <Container className="py-12">
        <div className="mx-auto max-w-2xl">
          <SectionHeading as="h1" title="Create an event" description="Tell volunteers where to go, when, and what to expect." />
          <Card className="mt-8"><CardContent className="p-6 sm:p-8"><EventForm submitLabel="Publish event" onSubmit={create} /></CardContent></Card>
        </div>
      </Container>
    </PrivateGuard>
  );
}
