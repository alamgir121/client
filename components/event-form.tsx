"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field } from "@/components/field";
import { EVENT_TYPES } from "@/lib/constants";
import { toLocalInput } from "@/lib/utils";
import { validateEvent, type EventFormErrors, type EventFormValues } from "@/lib/validation";
import type { EventItem, EventPayload } from "@/lib/types";

export function EventForm({
  initial, submitLabel, onSubmit,
}: { initial?: EventItem; submitLabel: string; onSubmit: (payload: EventPayload) => Promise<void> }) {
  const [values, setValues] = useState<EventFormValues>({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    type: initial?.type ?? "",
    thumbnail: initial?.thumbnail ?? "",
    location: initial?.location ?? "",
    date: initial ? toLocalInput(initial.date) : "",
  });
  const [errors, setErrors] = useState<EventFormErrors>({});
  const [busy, setBusy] = useState(false);

  const set = (key: keyof EventFormValues) => (value: string) => setValues((p) => ({ ...p, [key]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateEvent(values);
    setErrors(errs);
    const first = Object.values(errs)[0];
    if (first) return void toast.error(first);
    setBusy(true);
    try {
      await onSubmit({ ...values, date: new Date(values.date).toISOString() });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "We couldn't save the event. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <Field label="Event title" htmlFor="title" error={errors.title}>
        <Input id="title" value={values.title} onChange={(e) => set("title")(e.target.value)} aria-invalid={!!errors.title} placeholder="Winter Clothes Distribution" />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Event type" htmlFor="type" error={errors.type}>
          <Select value={values.type} onValueChange={set("type")}>
            <SelectTrigger id="type" aria-invalid={!!errors.type}><SelectValue placeholder="Choose a type" /></SelectTrigger>
            <SelectContent>
              {EVENT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Date and time" htmlFor="date" error={errors.date} hint="Must be in the future.">
          <Input id="date" type="datetime-local" min={toLocalInput(new Date())} value={values.date} onChange={(e) => set("date")(e.target.value)} aria-invalid={!!errors.date} />
        </Field>
      </div>
      <Field label="Location" htmlFor="location" error={errors.location}>
        <Input id="location" value={values.location} onChange={(e) => set("location")(e.target.value)} aria-invalid={!!errors.location} placeholder="Mirpur 10, Dhaka" />
      </Field>
      <Field label="Thumbnail image URL" htmlFor="thumbnail" error={errors.thumbnail}>
        <Input id="thumbnail" type="url" value={values.thumbnail} onChange={(e) => set("thumbnail")(e.target.value)} aria-invalid={!!errors.thumbnail} placeholder="https://example.com/photo.jpg" />
      </Field>
      <Field label="Description" htmlFor="description" error={errors.description} hint="Tell volunteers what to bring and what to expect.">
        <Textarea id="description" rows={5} value={values.description} onChange={(e) => set("description")(e.target.value)} aria-invalid={!!errors.description} />
      </Field>
      <Button type="submit" size="lg" className="w-full" disabled={busy}>
        {busy && <Loader2 className="animate-spin" />}
        {submitLabel}
      </Button>
    </form>
  );
}
