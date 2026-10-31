import { Container } from "@/components/container";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/section-heading";

export function AuthShell({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <Container className="flex justify-center py-12 sm:py-16">
      <div className="w-full max-w-md">
        <SectionHeading as="h1" title={title} description={description} />
        <Card className="mt-8"><CardContent className="p-6 sm:p-8">{children}</CardContent></Card>
      </div>
    </Container>
  );
}
