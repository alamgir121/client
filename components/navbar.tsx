"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CalendarPlus, HandHeart, HeartHandshake, ListChecks, LogOut, Menu, UserRound, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { Container } from "@/components/container";

const menu = [
  { href: "/create-event", label: "Create Event", icon: CalendarPlus },
  { href: "/manage-events", label: "Manage Events", icon: ListChecks },
  { href: "/joined-events", label: "Joined Events", icon: HandHeart },
  { href: "/profile", label: "My Profile", icon: UserRound },
];

export function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const user = session?.user;
  const initials =  (user?.name || "?").trim().slice(0, 2).toUpperCase();

  async function logout() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("You've been logged out. See you soon!");
          setOpen(false);
          router.push("/");
          router.refresh();
        },
      },
    });
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-heading text-xl font-bold tracking-tight">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <HeartHandshake className="size-5" />
          </span>
          HelpingHands BD
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Button asChild variant="ghost"><Link href="/events">Upcoming Events</Link></Button>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isPending ? (
            <Skeleton className="size-10 rounded-full" />
          ) : user ? (
            <>
              <DropdownMenu>
                <TooltipProvider delayDuration={150}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <button aria-label="Open account menu" className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                          <Avatar>
                            <AvatarImage src={user.image || undefined} alt={user.name} />
                            <AvatarFallback>{initials}</AvatarFallback>
                          </Avatar>
                        </button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>{user.name}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {menu.map(({ href, label, icon: Icon }) => (
                    <DropdownMenuItem key={href} asChild>
                      <Link href={href}><Icon />{label}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" onClick={logout} className="hidden sm:inline-flex">
                <LogOut />Logout
              </Button>
            </>
          ) : (
            <Button asChild><Link href="/login">Login</Link></Button>
          )}
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Toggle menu" onClick={() => setOpen((o) => !o)}>
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </Container>

      {open && (
        <div className="border-t bg-background md:hidden">
          <Container className="flex flex-col gap-1 py-3">
            <Button asChild variant="ghost" className="justify-start" onClick={() => setOpen(false)}>
              <Link href="/events">Upcoming Events</Link>
            </Button>
            {user && (
              <Button variant="ghost" className="justify-start sm:hidden" onClick={logout}>
                <LogOut />Logout
              </Button>
            )}
          </Container>
        </div>
      )}
    </header>
  );
}
