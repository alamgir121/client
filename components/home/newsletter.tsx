"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Container } from "@/components/container";
import { validateEmail } from "@/lib/validation";


export function Newsletter() {
  const [email, setEmail] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const err = validateEmail(email);
    if (err) return void toast.error(err);
    toast.success("Thanks! We'll send the weekly event round-up to this address.");
    setEmail("");
  }

  return (
    <section className="pb-4">
      <Container>
        <div className="rounded-2xl bg-primary px-6 py-12 text-primary-foreground sm:px-12">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">Get the weekend round-up</h2>
              <p className="mt-3 text-base leading-relaxed opacity-90 sm:text-lg">One short email every Thursday with the events happening near you.</p>
            </div>
            <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row" noValidate>
              <Input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Email address"
                placeholder="you@example.com" className="h-12 border-transparent bg-white text-[#10231c] placeholder:text-[#4f625a]"
              />
              <Button type="submit" variant="accent" size="lg">Subscribe</Button>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}
