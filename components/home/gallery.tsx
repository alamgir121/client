import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { SafeImage } from "@/components/safe-image";

const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=70`;


const photos = [
  { src: u("photo-1593113598332-cd288d649433"), caption: "Winter clothes drive" },
  { src: u("photo-1488521787991-ed7bbaae773c"), caption: "Blanket distribution" },
  { src: u("photo-1532629345422-7515f3d16bb6"), caption: "Lakeside cleanup" },
  { src: u("photo-1542601906990-b4d3fb778b09"), caption: "Riverbank plantation" },
  { src: u("photo-1559027615-cd4628902d4a"), caption: "Volunteers at work" },
  { src: u("photo-1497633762265-9d179a990aa6"), caption: "Reading class" },
];

export function Gallery() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading title="Moments from the field" description="Small acts, repeated by many hands." />
        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-3">
          {photos.map((p) => (
            <figure key={p.caption} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
              <SafeImage src={p.src} alt={p.caption} className="absolute inset-0 size-full object-cover" />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4 pt-10 text-sm font-semibold text-white">
                {p.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
