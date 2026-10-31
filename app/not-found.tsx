import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";

export default function NotFound() {
  return (
    <Container className="py-32 text-center">
      <h1 className="font-heading text-4xl font-bold">This page doesn't exist</h1>
      <p className="mx-auto mt-3 max-w-md text-muted-foreground">The link may be broken, or the page may have moved.</p>
      <Button asChild className="mt-8"><Link href="/">Back to home</Link></Button>
    </Container>
  );
}
