"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { validateName, validateUrl } from "@/lib/validation";
import { PrivateGuard } from "@/components/private-guard";
import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { Field } from "@/components/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function ProfileForm() {
  const { data: session } = authClient.useSession();
  const user = session!.user;
  const [name, setName] = useState(user.name);
  const [image, setImage] = useState(user.image ?? "");
  const [errors, setErrors] = useState<{ name?: string; image?: string }>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => { setName(user.name); setImage(user.image ?? ""); }, [user.name, user.image]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = { name: validateName(name) ?? undefined, image: validateUrl(image, "photo URL") ?? undefined };
    setErrors(errs);
    const first = errs.name || errs.image;
    if (first) return void toast.error(first);
    setBusy(true);
    const { error } = await authClient.updateUser({ name: name.trim(), image: image.trim() });
    setBusy(false);
    if (error) return void toast.error(error.message || "We couldn't update your profile.");
    toast.success("Profile updated.");
  }

  return (
    <Container className="py-12">
      <div className="mx-auto max-w-xl">
        <SectionHeading as="h1" title="Your profile" description="Update the name and photo other volunteers see." />
        <Card className="mt-8">
          <CardContent className="p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-4">
              <Avatar className="size-16">
                <AvatarImage src={user.image || undefined} alt={user.name} />
                <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div><p className="font-heading text-lg font-bold">{user.name}</p><p className="text-sm text-muted-foreground">{user.email}</p></div>
            </div>
            <form onSubmit={onSubmit} className="space-y-5" noValidate>
              <Field label="Full name" htmlFor="name" error={errors.name}>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name} />
              </Field>
              <Field label="Photo URL" htmlFor="image" error={errors.image}>
                <Input id="image" type="url" value={image} onChange={(e) => setImage(e.target.value)} aria-invalid={!!errors.image} />
              </Field>
              <Button type="submit" size="lg" className="w-full" disabled={busy}>
                {busy && <Loader2 className="animate-spin" />}Save changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}

export default function ProfilePage() {
  return <PrivateGuard><ProfileForm /></PrivateGuard>;
}
