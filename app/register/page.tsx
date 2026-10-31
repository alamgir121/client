"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { safeRedirect } from "@/lib/utils";
import { validateEmail, validateName, validatePassword, validateUrl } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/field";
import { AuthShell } from "@/components/auth-shell";

type Errors = Partial<Record<"name" | "email" | "photo" | "password", string>>;

function RegisterForm() {
  const router = useRouter();
  const redirect = safeRedirect(useSearchParams().get("redirect"));
  const [form, setForm] = useState({ name: "", email: "", photo: "", password: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((p) => ({ ...p, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Errors = {
      name: validateName(form.name) ?? undefined,
      email: validateEmail(form.email) ?? undefined,
      photo: validateUrl(form.photo, "photo URL") ?? undefined,
      password: validatePassword(form.password) ?? undefined,
    };
    setErrors(errs);
    const first = errs.name || errs.email || errs.photo || errs.password;
    if (first) return void toast.error(first);
    setBusy(true);
    const { error } = await authClient.signUp.email({
      name: form.name.trim(), email: form.email.trim(), password: form.password, image: form.photo.trim(),
    });
    setBusy(false);
    if (error) return void toast.error(error.message || "We couldn't create your account. Try again.");
    toast.success("Account created. Welcome to HelpingHands BD!");
    router.push(redirect);
    router.refresh();
  }

  return (
    <AuthShell title="Create your account" description="Join your neighbours and start showing up.">
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <Field label="Full name" htmlFor="name" error={errors.name}>
          <Input id="name" autoComplete="name" value={form.name} onChange={set("name")} aria-invalid={!!errors.name} />
        </Field>
        <Field label="Email" htmlFor="email" error={errors.email}>
          <Input id="email" type="email" autoComplete="email" value={form.email} onChange={set("email")} aria-invalid={!!errors.email} />
        </Field>
        <Field label="Photo URL" htmlFor="photo" error={errors.photo} hint="Link to a profile picture.">
          <Input id="photo" type="url" value={form.photo} onChange={set("photo")} aria-invalid={!!errors.photo} placeholder="https://example.com/me.jpg" />
        </Field>
        <Field label="Password" htmlFor="password" error={errors.password} hint="At least 6 characters with an uppercase and a lowercase letter.">
          <Input id="password" type="password" autoComplete="new-password" value={form.password} onChange={set("password")} aria-invalid={!!errors.password} />
        </Field>
        <Button type="submit" size="lg" className="w-full" disabled={busy}>
          {busy && <Loader2 className="animate-spin" />}Create account
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href={`/login${redirect !== "/" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`} className="font-semibold text-primary underline-offset-4 hover:underline">Log in</Link>
      </p>
    </AuthShell>
  );
}

export default function RegisterPage() {
  return <Suspense><RegisterForm /></Suspense>;
}
