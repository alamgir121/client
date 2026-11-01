import Link from "next/link";
import { HeartHandshake, Mail, MapPin, Phone } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { Container } from "@/components/container";

const socials = [
  { label: "X", href: "https://x.com", icon: FaXTwitter },
  { label: "Facebook", href: "https://facebook.com", icon: FaFacebookF },
  { label: "Instagram", href: "https://instagram.com", icon: FaInstagram },
  { label: "LinkedIn", href: "https://linkedin.com", icon: FaLinkedinIn },
];

export function Footer() {
  return (
    <footer className="mt-24 bg-[#0a3d2f] text-[#e8f1ed]">
      <div className="h-2 bg-[repeating-linear-gradient(90deg,#f4b400_0_24px,#0a3d2f_24px_48px)]" aria-hidden />
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2 font-heading text-xl font-bold">
            <span className="flex size-9 items-center justify-center rounded-lg bg-[#f4b400] text-[#2a1f00]"><HeartHandshake className="size-5" /></span>
            HelpingHands BD
          </Link>
          <p className="text-sm leading-relaxed text-[#b9d3c8]">
            A community noticeboard for good work. Plan a drive, find one near you and show up with your neighbours.
          </p>
        </div>
        <div>
          <h3 className="mb-4 font-heading text-base font-bold">Explore</h3>
          <ul className="space-y-2 text-sm text-[#b9d3c8]">
            <li><Link className="hover:text-white" href="/events">Upcoming events</Link></li>
            <li><Link className="hover:text-white" href="/create-event">Create an event</Link></li>
            <li><Link className="hover:text-white" href="/joined-events">Events I joined</Link></li>
            <li><Link className="hover:text-white" href="/manage-events">Manage my events</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-heading text-base font-bold">Contact</h3>
          <ul className="space-y-3 text-sm text-[#b9d3c8]">
            <li className="flex gap-2"><MapPin className="mt-0.5 size-4 shrink-0" />House 12, Road 5, Bashundhara, Dhaka 1205</li>
            <li className="flex gap-2"><Mail className="mt-0.5 size-4 shrink-0" />helpinghandsbd@gmail.com</li>
            <li className="flex gap-2"><Phone className="mt-0.5 size-4 shrink-0" />+880 1700 000000</li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-heading text-base font-bold">Follow us</h3>
          <div className="flex gap-3">
            {socials.map(({ label, href, icon: Icon }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                className="flex size-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-[#f4b400] hover:text-[#2a1f00]">
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </Container>
      <div className="border-t border-white/10 py-5 text-center text-sm text-[#b9d3c8]">
        © {new Date().getFullYear()} HelpingHands BD. Built by neighbours, for neighbours.
      </div>
    </footer>
  );
}
