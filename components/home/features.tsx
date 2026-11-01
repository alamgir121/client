import { CalendarPlus, HandHeart, ListChecks, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";

const features = [
  { icon: CalendarPlus, title: "Organise in minutes", text: "Add a title, place, date and photo. Your event goes live on the Upcoming Events page right away." },
  { icon: HandHeart, title: "Join with one tap", text: "Found something worth showing up for? Press Join Event and you're on the list." },
  { icon: ListChecks, title: "Keep track of your impact", text: "Your Joined Events page lists everything you signed up for, sorted by date." },
  { icon: ShieldCheck, title: "Your events stay yours", text: "Only you can edit or delete the events you created, and every change is verified on the server." },
];

export function Features() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading title="Everything you need to do good, together" description="Simple tools for organisers and volunteers, with no spreadsheets and group-chat chaos." />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, text }) => (
            <Card key={title} className="h-full">
              <CardContent className="p-6">
                <span className="flex size-12 items-center justify-center rounded-lg bg-secondary text-secondary-foreground"><Icon className="size-6" /></span>
                <h3 className="mt-5 font-heading text-lg font-bold">{title}</h3>
                <p  className="mt-2 leading-relaxed text-muted-foreground">{text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
