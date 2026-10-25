/* components.tsx — every page component: navbar, hero, sections, footer, concept picker. */
import { useEffect, useState, useMemo, useRef, type MouseEvent, type FormEvent } from "react";
import { Menu, X, ArrowUpRight, ArrowDown, CalendarDays, MapPin, Sparkles, Trophy, Users, Swords, Flag, Brain, Crown, Drama, Feather, Footprints, Gamepad2, Guitar, Languages, Palette, type LucideIcon, ArrowLeft, ArrowRight, Clock3, TrendingUp, Download, Handshake, Plus, Check, Mail } from "lucide-react";
import { cn, useTheme, useCountdown, type ThemeId, FEST_START, FEST_DATES, Button, Container, Pill, useInView, stats, clusters, type Cluster, type ClusterIcon, flagships, departments, schedule, gallery, pastEditions, sponsors, faqs, Reveal, SectionHeading, InstagramIcon, YoutubeIcon, concepts, themeOrder, LinkedinIcon, Logo } from "@/lib";

/* Top of page: navbar, hero backdrops, hero and the ticker marquee. */






/* components/Navbar.tsx */

const links = [
  { label: "About", href: "#about" },
  { label: "Clusters", href: "#clusters" },
  { label: "Events", href: "#events" },
  { label: "Scoreboard", href: "#scoreboard" },
  { label: "Schedule", href: "#schedule" },
  { label: "Gallery", href: "#gallery" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { concept } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className={cn("fixed inset-x-0 top-0 z-50 transition-all duration-500", scrolled ? "py-2.5" : "py-5")}>
        <Container>
          <nav
            className={cn(
              "flex items-center justify-between gap-4 rounded-2xl px-4 py-2.5 transition-all duration-500 sm:px-5",
              scrolled ? "glass-strong shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)]" : "bg-transparent",
            )}
          >
            <a href="#top" className="group flex items-center gap-2.5">
              <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-xl border border-ink/15 bg-ink/5">
                <svg viewBox="0 0 64 64" className="h-6 w-6" aria-hidden>
                  <path
                    d="M18 46V18l28 28V18"
                    fill="none"
                    stroke="var(--t-primary)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="absolute inset-0 bg-primary/20 opacity-0 transition-opacity group-hover:opacity-100" />
              </span>
              <span className="font-display text-base leading-none font-bold tracking-tight text-ink sm:text-lg">
                NITTFEST<span className="text-primary">'27</span>
              </span>
            </a>

            <ul className="hidden items-center gap-1 lg:flex">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="relative rounded-full px-3.5 py-2 text-sm font-medium text-ink/70 transition-colors after:absolute after:bottom-1 after:left-1/2 after:h-px after:w-0 after:-translate-x-1/2 after:bg-primary after:transition-all hover:text-ink hover:after:w-6"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2">
              <Button href="#register" className="hidden sm:inline-flex">
                {concept.words.register}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Button>
              <button
                aria-label="Toggle menu"
                onClick={() => setOpen((v) => !v)}
                className="grid h-10 w-10 place-items-center rounded-xl border border-ink/15 bg-ink/5 text-ink lg:hidden"
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </nav>
        </Container>
      </header>

      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 flex flex-col bg-bg/95 px-6 pt-28 pb-10 backdrop-blur-xl transition-all duration-500 lg:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <ul className="flex flex-col gap-1">
          {links.map((l, i) => (
            <li
              key={l.href}
              style={{ transitionDelay: open ? `${80 + i * 40}ms` : "0ms" }}
              className={cn("transition-all duration-500", open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0")}
            >
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between border-b border-ink/10 py-4 font-display text-2xl font-bold text-ink"
              >
                {l.label}
                <ArrowUpRight className="h-5 w-5 text-primary" />
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-auto">
          <Button href="#register" size="lg" className="w-full" onClick={() => setOpen(false)}>
            {concept.words.register}
          </Button>
        </div>
      </div>
    </>
  );
}

/* components/HeroBackdrop.tsx */

/** Tiny deterministic PRNG so particles don't jump between renders */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/* ------------------------------------------------------------- NEON */
function NeonBackdrop() {
  const stars = useMemo(() => {
    const rnd = seeded(7);
    return Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: rnd() * 100,
      y: rnd() * 55,
      size: 1 + rnd() * 2,
      delay: rnd() * 4,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_15%,var(--t-bg-2),var(--t-bg)_60%)]" />

      {/* stars */}
      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full bg-ink animate-twinkle"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            opacity: 0.5,
          }}
        />
      ))}

      {/* the rising sun — scales and lifts with --scroll */}
      <div className="sun-rise absolute top-[13%] left-1/2 h-[min(54vw,400px)] w-[min(54vw,400px)] will-change-transform">
        <div className="sun-glow absolute inset-0 rounded-full bg-primary/40 blur-[90px]" />
        <div className="synth-sun absolute inset-0 rounded-full opacity-90" />
      </div>

      {/* horizon glow */}
      <div className="absolute inset-x-0 top-[58%] h-px bg-linear-to-r from-transparent via-secondary to-transparent opacity-80" />
      <div className="absolute inset-x-0 top-[58%] h-32 bg-linear-to-b from-secondary/25 to-transparent blur-2xl" />

      {/* grid floor */}
      <div className="absolute inset-x-[-20%] top-[58%] bottom-0">
        <div className="synth-grid h-full w-full" />
      </div>

      {/* orbs */}
      <div className="absolute -left-20 top-1/3 h-72 w-72 rounded-full bg-secondary/25 blur-[100px] animate-float" />
      <div
        className="absolute -right-24 top-1/4 h-80 w-80 rounded-full bg-primary/25 blur-[110px] animate-float"
        style={{ animationDelay: "-3s" }}
      />

      {/* scan beam */}
      <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-transparent via-secondary/10 to-transparent animate-scan" />
      <div className="scanlines absolute inset-0" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-bg to-transparent" />
    </div>
  );
}

/* ----------------------------------------------------------- MYTHOS */
function MythosBackdrop() {
  const embers = useMemo(() => {
    const rnd = seeded(21);
    return Array.from({ length: 34 }, (_, i) => ({
      id: i,
      x: rnd() * 100,
      size: 2 + rnd() * 4,
      delay: rnd() * 7,
      duration: 6 + rnd() * 6,
      drift: (rnd() - 0.5) * 120,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,var(--t-bg-2),var(--t-bg)_65%)]" />
      <div className="absolute left-1/2 top-[8%] h-[70vmin] w-[70vmin] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />

      {/* ornamental rings — breathe outward as you scroll */}
      <svg viewBox="0 0 800 800" className="motif-rise absolute top-1/2 left-1/2 h-[135vmin] w-[135vmin] opacity-60 will-change-transform">
        <g fill="none" stroke="var(--t-primary)" strokeOpacity="0.35">
          <circle cx="400" cy="400" r="390" strokeWidth="1" strokeDasharray="2 10" className="origin-center animate-spin-slow" />
          <circle cx="400" cy="400" r="330" strokeWidth="0.8" strokeDasharray="60 20 10 20" className="origin-center animate-spin-slower" />
          <circle cx="400" cy="400" r="270" strokeWidth="1.2" strokeDasharray="1 6" className="origin-center animate-spin-slow" />
          <circle cx="400" cy="400" r="200" strokeWidth="0.8" />
          <circle cx="400" cy="400" r="196" strokeWidth="0.4" />
          {Array.from({ length: 24 }).map((_, i) => {
            const a = (i / 24) * Math.PI * 2;
            return (
              <line
                key={i}
                x1={400 + Math.cos(a) * 330}
                y1={400 + Math.sin(a) * 330}
                x2={400 + Math.cos(a) * 345}
                y2={400 + Math.sin(a) * 345}
                strokeWidth="1.5"
              />
            );
          })}
        </g>
      </svg>

      {/* embers */}
      {embers.map((e) => (
        <span
          key={e.id}
          className="absolute bottom-0 rounded-full animate-ember"
          style={{
            left: `${e.x}%`,
            width: e.size,
            height: e.size,
            background: e.id % 3 === 0 ? "var(--t-secondary)" : "var(--t-primary)",
            boxShadow: `0 0 ${e.size * 3}px var(--t-primary)`,
            animationDelay: `${e.delay}s`,
            animationDuration: `${e.duration}s`,
            ["--drift" as string]: `${e.drift}px`,
          }}
        />
      ))}

      {/* crimson floor glow + vignette */}
      <div className="absolute inset-x-0 bottom-0 h-72 bg-linear-to-t from-secondary/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--t-bg)_100%)]" />
      <div className="noise absolute inset-0" />
    </div>
  );
}

/* --------------------------------------------------------- CARNIVAL */
function CarnivalBackdrop() {
  const confetti = useMemo(() => {
    const rnd = seeded(99);
    const palette = ["var(--t-primary)", "var(--t-secondary)", "var(--t-accent)", "var(--t-ink)"];
    return Array.from({ length: 36 }, (_, i) => ({
      id: i,
      x: rnd() * 100,
      delay: rnd() * 9,
      duration: 8 + rnd() * 6,
      w: 6 + rnd() * 6,
      h: 10 + rnd() * 10,
      color: palette[i % palette.length],
    }));
  }, []);

  const bulbs = Array.from({ length: 36 });

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,var(--t-bg-2),var(--t-bg)_70%)]" />

      {/* sunburst — opens up as you scroll */}
      <div className="motif-rise absolute top-[40%] left-1/2 h-[220vmax] w-[220vmax] will-change-transform">
        <div className="sunburst h-full w-full animate-spin-slower" />
      </div>
      <div className="absolute left-1/2 top-[30%] h-[60vmin] w-[60vmin] -translate-x-1/2 rounded-full bg-primary/20 blur-[100px]" />

      {/* marquee bulbs — top & bottom */}
      {(["top", "bottom"] as const).map((pos) => (
        <div key={pos} className={`absolute inset-x-0 flex justify-between px-4 ${pos === "top" ? "top-24" : "bottom-6"}`}>
          {bulbs.map((_, i) => (
            <span
              key={i}
              className="h-2.5 w-2.5 rounded-full bg-primary animate-twinkle"
              style={{
                boxShadow: "0 0 14px var(--t-primary)",
                animationDelay: `${(i % 2) * 0.6}s`,
                animationDuration: "1.2s",
              }}
            />
          ))}
        </div>
      ))}

      {/* confetti */}
      {confetti.map((c) => (
        <span
          key={c.id}
          className="absolute top-0 rounded-[2px] animate-confetti"
          style={{
            left: `${c.x}%`,
            width: c.w,
            height: c.h,
            background: c.color,
            animationDelay: `${c.delay}s`,
            animationDuration: `${c.duration}s`,
            opacity: 0.9,
          }}
        />
      ))}

      {/* corner stars */}
      <span className="absolute left-[8%] top-[28%] font-display text-5xl text-accent/60 animate-float">★</span>
      <span className="absolute right-[10%] top-[36%] font-display text-3xl text-secondary/70 animate-float" style={{ animationDelay: "-2s" }}>
        ★
      </span>
      <span className="absolute left-[18%] bottom-[22%] font-display text-2xl text-primary/70 animate-float" style={{ animationDelay: "-4s" }}>
        ★
      </span>

      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-bg to-transparent" />
    </div>
  );
}

export function HeroBackdrop({ theme }: { theme: ThemeId }) {
  if (theme === "mythos") return <MythosBackdrop />;
  if (theme === "carnival") return <CarnivalBackdrop />;
  return <NeonBackdrop />;
}

/* components/Hero.tsx */

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function Countdown() {
  const c = useCountdown(FEST_START);
  const cells = [
    { label: "Days", value: c.days },
    { label: "Hours", value: c.hours },
    { label: "Mins", value: c.minutes },
    { label: "Secs", value: c.seconds },
  ];
  return (
    <div className="flex items-stretch gap-2 sm:gap-3">
      {cells.map((cell, i) => (
        <div key={cell.label} className="flex items-center gap-2 sm:gap-3">
          <div className="glass r-card flex min-w-[64px] flex-col items-center px-3 py-2.5 sm:min-w-[84px] sm:px-4 sm:py-3">
            <span className="font-display text-2xl leading-none font-bold tabular-nums text-ink sm:text-3xl">
              {pad(cell.value)}
            </span>
            <span className="mt-1.5 text-[10px] font-semibold tracking-[0.2em] text-muted uppercase">{cell.label}</span>
          </div>
          {i < cells.length - 1 && <span className="font-display text-xl text-primary/60 animate-ticker">:</span>}
        </div>
      ))}
    </div>
  );
}

export function Hero() {
  const { theme, concept } = useTheme();
  const sectionRef = useRef<HTMLElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);

  /* Sun-rise: expose scroll progress (0 → 1 across the hero) as --scroll so
     the backdrop's sun can swell and lift without any re-render. */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const h = el.offsetHeight || 1;
      const p = Math.min(1, Math.max(0, window.scrollY / h));
      el.style.setProperty("--scroll", p.toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    if (frame.current) return;
    const { clientX, clientY, currentTarget } = e;
    frame.current = requestAnimationFrame(() => {
      const r = currentTarget.getBoundingClientRect();
      const x = (clientX - r.left) / r.width - 0.5;
      const y = (clientY - r.top) / r.height - 0.5;
      if (backdropRef.current) {
        backdropRef.current.style.transform = `translate3d(${x * -18}px, ${y * -12}px, 0) scale(1.04)`;
      }
      frame.current = null;
    });
  };

  return (
    <section
      id="top"
      ref={sectionRef}
      onMouseMove={onMove}
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 pb-20 sm:pt-32"
    >
      <div
        ref={backdropRef}
        key={theme}
        className="absolute inset-0 transition-transform duration-700 ease-out animate-fade-in will-change-transform"
      >
        <HeroBackdrop theme={theme} />
      </div>

      {/* side label */}
      <div className="pointer-events-none absolute left-6 top-1/2 z-10 hidden -translate-y-1/2 -rotate-90 items-center gap-3 text-[10px] font-semibold tracking-[0.35em] text-muted uppercase xl:flex">
        <span className="h-px w-10 bg-primary" />
        Inter-departmental cultural fest
      </div>

      <Container className="relative">
        {/* legibility halo behind headline/description/countdown */}
        <div aria-hidden className="hero-shield pointer-events-none absolute inset-x-[-10%] top-[30%] bottom-[-10%]" />

        <div className="relative mx-auto flex max-w-5xl flex-col items-center text-center">
          <Pill className="animate-fade-in text-[11px] shadow-[0_8px_30px_-10px_rgba(0,0,0,0.8)]">
            {concept.kicker}
          </Pill>

          <h1 className="wordmark mt-7 font-display text-[clamp(2.6rem,13vw,10.5rem)] leading-[0.9] font-black tracking-tight whitespace-nowrap">
            NITTFEST
            <span className="wordmark-year ml-2 align-top text-[0.42em] font-bold">'27</span>
          </h1>

          <p
            key={`${theme}-headline`}
            className="mt-6 font-display text-xl font-semibold text-ink animate-fade-in sm:text-2xl lg:text-3xl"
          >
            {concept.headline[0]} <span className="text-primary">{concept.headline[1]}</span>
          </p>

          <p key={`${theme}-desc`} className="mt-5 max-w-2xl text-base leading-relaxed text-muted animate-fade-in sm:text-lg">
            {concept.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button href="#register" size="lg">
              {concept.ctaPrimary}
              <ArrowUpRight className="h-4 w-4" />
            </Button>
            <Button href="#events" size="lg" variant="outline">
              <Sparkles className="h-4 w-4 text-primary" />
              {concept.ctaSecondary}
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" /> {FEST_DATES}
            </span>
            <span className="hidden h-1 w-1 rounded-full bg-muted/50 sm:block" />
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" /> NIT Tiruchirappalli
            </span>
          </div>

          <div className="mt-8">
            <Countdown />
          </div>
        </div>
      </Container>

      <a
        href="#about"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] font-semibold tracking-[0.3em] text-muted uppercase transition-colors hover:text-ink sm:flex"
      >
        Scroll
        <ArrowDown className="h-4 w-4 animate-bob" />
      </a>
    </section>
  );
}

/* components/Marquee.tsx */

interface MarqueeProps {
  items: string[];
  reverse?: boolean;
  className?: string;
  variant?: "solid" | "ghost";
}

export function Marquee({ items, reverse, className, variant = "solid" }: MarqueeProps) {
  const { concept } = useTheme();
  const list = [...items, ...items];
  return (
    <div
      className={cn(
        "relative overflow-hidden py-3 select-none",
        variant === "solid" && "bg-primary text-bg",
        variant === "ghost" && "border-y border-ink/10 text-ink/80",
        className,
      )}
    >
      <div className={cn("flex w-max whitespace-nowrap", reverse ? "animate-marquee-reverse" : "animate-marquee")}>
        {list.map((item, i) => (
          <span key={i} className="flex items-center gap-6 pr-6 font-display text-sm font-bold tracking-[0.18em] uppercase sm:text-base">
            {item}
            <span className={cn("text-xs", variant === "solid" ? "text-bg/60" : "text-primary")}>{concept.glyph}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* The page body: about, clusters, flagship events, scoreboard, schedule, gallery, sponsors, FAQ. */






/* components/About.tsx */

function CountUp({ value, suffix, active }: { value: number; suffix: string; active: boolean }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    const duration = 1600;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 4);
      setN(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, value]);
  return (
    <span className="tabular-nums">
      {n.toLocaleString("en-IN")}
      <span className="text-primary">{suffix}</span>
    </span>
  );
}

const steps = [
  {
    icon: Flag,
    title: "Departments assemble",
    body: "Every department fields teams across nine clusters — from the freshers' quiz bench to the final-year choreo squad.",
  },
  {
    icon: Swords,
    title: "80+ events, 3 days",
    body: "Prelims by morning, finals by evening. Each event's placements convert to points, weighted by cluster.",
  },
  {
    icon: Trophy,
    title: "One trophy, one night",
    body: "The tally stays sealed until after ChoreoNite. Then the overall champions are crowned on the GJCH stage.",
  },
];

export function About() {
  const { concept } = useTheme();
  const [statsRef, statsIn] = useInView<HTMLDivElement>({ threshold: 0.3 });

  return (
    <section id="about" className="relative scroll-mt-24 py-24 sm:py-32">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <SectionHeading
              kicker={concept.words.about}
              title={
                <>
                  The campus, <span className="text-primary">split seventeen ways.</span>
                </>
              }
              description={
                <>
                  NITTFEST is NIT Trichy's annual inter-departmental cultural festival. What started in 1993 as a single
                  dance competition is now a three-day, eighty-event war fought in lecture halls, lawns and the Golden
                  Jubilee Convention Hall — where every department plays for the same rolling trophy.
                </>
              }
            />
            <Reveal delay={200} className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-2">
                {["CSE", "MECH", "ECE", "ARCH"].map((d, i) => (
                  <span
                    key={d}
                    className="grid h-10 w-10 place-items-center rounded-full border-2 border-bg bg-bg-2 text-[10px] font-bold text-ink"
                    style={{ zIndex: 10 - i }}
                  >
                    {d}
                  </span>
                ))}
                <span className="grid h-10 w-10 place-items-center rounded-full border-2 border-bg bg-primary text-[10px] font-bold text-bg">
                  +13
                </span>
              </div>
              <p className="text-sm text-muted">
                <Users className="mr-1 inline h-4 w-4 text-primary" />
                Every department. Every year. No exceptions.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <div ref={statsRef} className="grid grid-cols-2 gap-3 sm:gap-4">
              {stats.map((s, i) => (
                <Reveal
                  key={s.label}
                  delay={i * 90}
                  className="glass r-card group relative overflow-hidden p-5 sm:p-7"
                >
                  <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/15 blur-2xl transition-transform duration-500 group-hover:scale-150" />
                  <div className="font-display text-4xl font-bold text-ink sm:text-5xl">
                    <CountUp value={s.value} suffix={s.suffix} active={statsIn} />
                  </div>
                  <div className="mt-2 text-sm font-semibold tracking-wide text-ink/90 uppercase">{s.label}</div>
                  <div className="mt-1 text-xs text-muted">{s.note}</div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-20 grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 100} className="group relative">
              <div className="r-card relative h-full overflow-hidden border border-ink/10 bg-bg-2/40 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 sm:p-7">
                <div className="mb-5 flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <span className="font-display text-sm font-bold text-muted/60">0{i + 1}</span>
                </div>
                <h3 className="font-display text-lg font-bold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
                <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-linear-to-r from-primary to-secondary transition-transform duration-500 group-hover:scale-x-100" />
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* components/Clusters.tsx */

const weightStyle: Record<Cluster["weight"], string> = {
  High: "bg-secondary/15 text-secondary ring-secondary/40",
  Core: "bg-primary/15 text-primary ring-primary/40",
  Medium: "bg-accent/15 text-accent ring-accent/40",
};

const weightDot: Record<Cluster["weight"], string> = {
  High: "bg-secondary",
  Core: "bg-primary",
  Medium: "bg-accent",
};

const clusterIcons: Record<ClusterIcon, LucideIcon> = {
  dance: Footprints,
  music: Guitar,
  drama: Drama,
  lits: Feather,
  languages: Languages,
  quiz: Brain,
  arts: Palette,
  fashion: Crown,
  gaming: Gamepad2,
};

function ClusterCard({ cluster, index }: { cluster: Cluster; index: number }) {
  const Icon = clusterIcons[cluster.icon];
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <Reveal delay={(index % 3) * 90}>
      <div
        onMouseMove={onMove}
        className="group r-card relative h-full overflow-hidden border border-ink/10 bg-bg-2/40 p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/50"
      >
        {/* spotlight */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(240px circle at var(--mx, 50%) var(--my, 50%), color-mix(in srgb, var(--t-primary) 18%, transparent), transparent 70%)",
          }}
        />
        <div className="relative">
          <div className="flex items-start justify-between gap-3">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-ink/5 text-primary ring-1 ring-ink/10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
              <Icon className="h-6 w-6" strokeWidth={1.75} />
            </span>
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-[10px] font-bold tracking-[0.18em] uppercase ring-1",
                weightStyle[cluster.weight],
              )}
            >
              {cluster.weight} weight
            </span>
          </div>

          <h3 className="mt-5 font-display text-xl font-bold text-ink">{cluster.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{cluster.blurb}</p>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {cluster.events.map((ev) => (
              <span
                key={ev}
                className="rounded-full border border-ink/10 bg-ink/5 px-2.5 py-1 text-[11px] font-medium text-ink/80 transition-colors group-hover:border-primary/30"
              >
                {ev}
              </span>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between text-xs font-semibold tracking-wider text-muted uppercase">
            <span>{cluster.events.length}+ events</span>
            <span className="inline-flex items-center gap-1 text-primary opacity-0 transition-all duration-300 group-hover:opacity-100">
              Rulebook <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export function Clusters() {
  const { concept } = useTheme();
  return (
    <section id="clusters" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-ink/15 to-transparent" />
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            kicker={concept.words.clusters}
            title={
              <>
                Nine clusters. <span className="text-primary">Find your fight.</span>
              </>
            }
            description="Each cluster carries its own weightage in the overall tally — so a department that sweeps Lits can still be chased down at ChoreoNite."
          />
          <Reveal delay={200} className="flex gap-6 text-sm text-muted lg:pb-2">
            {(["High", "Core", "Medium"] as const).map((w) => (
              <span key={w} className="inline-flex items-center gap-2">
                <span className={cn("h-2.5 w-2.5 rounded-full", weightDot[w])} />
                {w}
              </span>
            ))}
          </Reveal>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clusters.map((c, i) => (
            <ClusterCard key={c.name} cluster={c} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}

/* components/Flagship.tsx */

export function Flagship() {
  const { concept } = useTheme();
  const track = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 360) + 20), behavior: "smooth" });
  };

  return (
    <section id="events" className="relative scroll-mt-24 overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute -left-40 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-secondary/10 blur-[120px]" />
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            kicker={concept.words.flagship}
            title={
              <>
                The events that <span className="text-primary">decide it.</span>
              </>
            }
            description="Six evenings the whole campus shows up for. Win these and the trophy is halfway home."
          />
          <Reveal delay={200} className="flex gap-2">
            <button
              onClick={() => scrollBy(-1)}
              aria-label="Previous"
              className="grid h-11 w-11 place-items-center rounded-full border border-ink/15 bg-ink/5 text-ink transition-all hover:border-primary hover:bg-primary hover:text-bg"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scrollBy(1)}
              aria-label="Next"
              className="grid h-11 w-11 place-items-center rounded-full border border-ink/15 bg-ink/5 text-ink transition-all hover:border-primary hover:bg-primary hover:text-bg"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </Reveal>
        </div>
      </Container>

      <div
        ref={track}
        className="no-scrollbar track-pad mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-6"
      >
        {flagships.map((f, i) => (
          <Reveal
            key={f.name}
            delay={i * 60}
            data-card
            className="group r-card relative flex w-[82vw] shrink-0 snap-start flex-col justify-between overflow-hidden border border-ink/10 bg-bg-2/50 p-7 transition-all duration-500 hover:border-primary/50 sm:w-[420px] sm:p-8"
          >
            <div className="pointer-events-none absolute -right-4 -top-8 font-display text-[9rem] leading-none font-black text-ink/[0.04] transition-all duration-700 group-hover:text-primary/15 select-none">
              {f.index}
            </div>
            <div className="relative">
              <span className="inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-primary uppercase">
                {f.cluster}
              </span>
              <h3 className="mt-6 font-display text-2xl font-bold text-ink sm:text-3xl">{f.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{f.description}</p>
            </div>
            <div className="relative mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-ink/10 pt-5 text-xs text-muted">
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="h-3.5 w-3.5 text-primary" /> {f.day}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary" /> {f.venue}
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-linear-to-r from-primary via-secondary to-accent transition-transform duration-500 group-hover:scale-x-100" />
          </Reveal>
        ))}

        {/* trailing CTA card */}
        <Reveal
          delay={360}
          className="r-card relative flex w-[70vw] shrink-0 snap-start flex-col items-start justify-center gap-5 border border-dashed border-primary/40 bg-primary/5 p-8 sm:w-[320px]"
        >
          <p className="font-display text-xl font-bold text-ink">80+ more events across nine clusters.</p>
          <p className="text-sm text-muted">The full event list with rulebooks drops with the portal.</p>
          <Button href="#register" variant="outline">
            Get notified <ArrowRight className="h-4 w-4" />
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

/* components/Leaderboard.tsx */

export function Leaderboard() {
  const { concept } = useTheme();
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.2 });
  const sorted = [...departments].sort((a, b) => b.points - a.points);
  const max = sorted[0].points;
  const podium = [sorted[1], sorted[0], sorted[2]]; // 2nd, 1st, 3rd layout
  const podiumHeights = ["h-28 sm:h-36", "h-40 sm:h-52", "h-24 sm:h-28"];
  const podiumRank = [2, 1, 3];

  return (
    <section id="scoreboard" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-ink/15 to-transparent" />
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            kicker={concept.words.leaderboard}
            title={
              <>
                Who's lifting it <span className="text-primary">this year?</span>
              </>
            }
            description="Points roll in after every final. During the fest this board updates live — right now it's showing last edition's closing tally."
          />
          <Reveal delay={200} className="flex items-center gap-3 text-xs font-semibold tracking-[0.2em] text-muted uppercase">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-secondary" />
            </span>
            Demo standings · Live during fest
          </Reveal>
        </div>

        <div ref={ref} className="mt-14 grid gap-6 lg:grid-cols-12">
          {/* Podium */}
          <Reveal className="lg:col-span-5">
            <div className="glass r-card flex h-full flex-col p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
                  <Crown className="h-4 w-4 text-primary" /> Top three
                </span>
                <span className="text-[10px] font-bold tracking-[0.2em] text-muted uppercase">After 64 / 80 events</span>
              </div>

              {/* race snapshot */}
              <div className="my-8 grid grid-cols-3 gap-2">
                {[
                  { label: "Gap at top", value: `${sorted[0].points - sorted[1].points}`, unit: "pts" },
                  { label: "Finals left", value: "16", unit: "events" },
                  { label: "Still in it", value: "5", unit: "depts" },
                ].map((s) => (
                  <div key={s.label} className="r-card border border-ink/10 bg-ink/[0.03] px-3 py-3">
                    <div className="font-display text-xl font-bold text-ink tabular-nums">
                      {s.value}
                      <span className="ml-1 text-[10px] font-semibold text-muted">{s.unit}</span>
                    </div>
                    <div className="mt-1 text-[10px] font-semibold tracking-[0.15em] text-muted uppercase">{s.label}</div>
                  </div>
                ))}
              </div>

              <p className="text-sm leading-relaxed text-muted">
                <span className="font-semibold text-primary">{sorted[0].code}</span> hold the edge, but ChoreoNite alone is
                worth enough to flip the top three. Nothing is decided until Day 3.
              </p>

              <div className="mt-auto flex items-end justify-center gap-3 pt-10">
                {podium.map((d, i) => (
                  <div key={d.code} className="flex w-1/3 flex-col items-center">
                    <span
                      className={cn(
                        "mb-3 font-display text-lg font-bold",
                        podiumRank[i] === 1 ? "text-primary" : "text-ink",
                      )}
                    >
                      {d.code}
                    </span>
                    <div
                      className={cn(
                        "r-card relative w-full overflow-hidden border border-ink/10",
                        podiumHeights[i],
                        podiumRank[i] === 1 ? "bg-primary/20 ring-glow" : "bg-ink/5",
                      )}
                    >
                      <div className="absolute inset-x-0 top-0 flex flex-col items-center pt-4">
                        <span className="font-display text-3xl font-black text-ink">{podiumRank[i]}</span>
                        <span className="mt-1 text-[11px] font-semibold text-muted tabular-nums">
                          {d.points.toLocaleString("en-IN")} pts
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Standings */}
          <Reveal delay={120} className="lg:col-span-7">
            <div className="r-card border border-ink/10 bg-bg-2/40 p-4 sm:p-6">
              <div className="mb-3 grid grid-cols-[2rem_1fr_auto] items-center gap-3 px-2 text-[10px] font-bold tracking-[0.2em] text-muted uppercase sm:grid-cols-[2rem_1fr_5rem_5rem]">
                <span>#</span>
                <span>Department</span>
                <span className="hidden text-right sm:block">Wins</span>
                <span className="text-right">Points</span>
              </div>
              <ul className="space-y-1.5">
                {sorted.map((d, i) => (
                  <li
                    key={d.code}
                    className="group relative grid grid-cols-[2rem_1fr_auto] items-center gap-3 overflow-hidden rounded-xl px-2 py-2.5 transition-colors hover:bg-ink/5 sm:grid-cols-[2rem_1fr_5rem_5rem]"
                  >
                    {/* bar */}
                    <div
                      className={cn(
                        "absolute inset-y-0 left-0 origin-left rounded-xl transition-transform duration-[1200ms] ease-out",
                        i === 0 ? "bg-primary/20" : "bg-ink/[0.04]",
                      )}
                      style={{
                        width: `${(d.points / max) * 100}%`,
                        transform: inView ? "scaleX(1)" : "scaleX(0)",
                        transitionDelay: `${i * 60}ms`,
                      }}
                    />
                    <span className={cn("relative font-display text-sm font-bold", i < 3 ? "text-primary" : "text-muted")}>
                      {i + 1}
                    </span>
                    <span className="relative flex items-center gap-2.5">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-ink/5 text-[10px] font-bold text-ink ring-1 ring-ink/10">
                        {d.code}
                      </span>
                      <span className="truncate text-sm font-medium text-ink">{d.name}</span>
                      {i < 2 && <TrendingUp className="hidden h-3.5 w-3.5 text-secondary sm:block" />}
                    </span>
                    <span className="relative hidden text-right text-sm text-muted tabular-nums sm:block">{d.wins}</span>
                    <span className="relative text-right font-display text-sm font-bold text-ink tabular-nums">
                      {d.points.toLocaleString("en-IN")}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

/* components/Schedule.tsx */

export function Schedule() {
  const { concept } = useTheme();
  const [active, setActive] = useState(0);
  const day = schedule[active];

  return (
    <section id="schedule" className="relative scroll-mt-24 overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute -right-40 top-20 h-[460px] w-[460px] rounded-full bg-primary/10 blur-[120px]" />
      <Container>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading
              kicker={concept.words.schedule}
              title={
                <>
                  Three days, <span className="text-primary">zero gaps.</span>
                </>
              }
              description="A tentative run-of-show. Venues and timings get locked a week before the fest — the final PDF lands here."
            />
            <Reveal delay={200} className="mt-8 flex flex-col gap-2">
              {schedule.map((d, i) => (
                <button
                  key={d.day}
                  onClick={() => setActive(i)}
                  className={cn(
                    "r-card group flex items-center justify-between border px-5 py-4 text-left transition-all duration-300",
                    active === i
                      ? "border-primary/60 bg-primary/10 ring-glow"
                      : "border-ink/10 bg-ink/[0.03] hover:border-ink/25",
                  )}
                >
                  <div>
                    <div className={cn("font-display text-lg font-bold", active === i ? "text-primary" : "text-ink")}>
                      {d.day}
                    </div>
                    <div className="text-xs text-muted">
                      {d.date} · {d.theme}
                    </div>
                  </div>
                  <span className="font-display text-2xl font-black text-ink/10 transition-colors group-hover:text-ink/20">
                    0{i + 1}
                  </span>
                </button>
              ))}
            </Reveal>
            <Reveal delay={300} className="mt-6">
              <Button href="#" variant="outline" onClick={(e) => e.preventDefault()}>
                <Download className="h-4 w-4" /> Download full schedule
              </Button>
            </Reveal>
          </div>

          <div className="lg:col-span-8">
            <Reveal className="r-card border border-ink/10 bg-bg-2/40 p-5 sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-display text-xl font-bold text-ink">
                  {day.day} <span className="text-muted">— {day.theme}</span>
                </h3>
                <span className="text-xs font-semibold tracking-[0.2em] text-muted uppercase">{day.date}</span>
              </div>
              <ol key={active} className="relative space-y-1 border-l border-ink/10 pl-6 sm:pl-8">
                {day.items.map((item, i) => (
                  <li
                    key={item.title}
                    className="group relative rounded-xl py-3.5 pr-3 transition-colors hover:bg-ink/[0.03] animate-fade-in sm:py-4"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <span className="absolute -left-[31px] top-5 h-3 w-3 rounded-full border-2 border-bg bg-primary shadow-[0_0_0_4px_color-mix(in_srgb,var(--t-primary)_25%,transparent)] transition-transform group-hover:scale-125 sm:-left-[39px]" />
                    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-6">
                      <span className="w-14 shrink-0 font-display text-sm font-bold text-primary tabular-nums">{item.time}</span>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-ink">{item.title}</div>
                        <div className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-muted">
                          <MapPin className="h-3 w-3" /> {item.venue}
                        </div>
                      </div>
                      <span className="w-fit rounded-full border border-ink/10 bg-ink/5 px-2.5 py-1 text-[10px] font-bold tracking-[0.18em] text-ink/70 uppercase">
                        {item.tag}
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* components/Gallery.tsx */

export function Gallery() {
  const { concept } = useTheme();
  return (
    <section id="gallery" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-ink/15 to-transparent" />
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            kicker={concept.words.gallery}
            title={
              <>
                Thirty-three editions <span className="text-primary">of proof.</span>
              </>
            }
            description="Every year the bar moves. Here's what the last few looked like from the pit."
          />
          <Reveal delay={200} className="flex gap-2">
            {[
              { icon: InstagramIcon, label: "@nittfest", href: "https://www.instagram.com/nittfest/" },
              { icon: YoutubeIcon, label: "YouTube", href: "https://www.youtube.com/channel/UC79ftXsZywNu0GOiHg3NLiQ" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-ink/5 px-4 py-2 text-sm font-medium text-ink transition-all hover:border-primary/60 hover:bg-primary/10"
              >
                <s.icon className="h-4 w-4 text-primary" /> {s.label}
              </a>
            ))}
          </Reveal>
        </div>

        {/* Photo grid */}
        <div className="mt-14 grid auto-rows-[180px] grid-cols-2 gap-3 sm:auto-rows-[220px] md:grid-cols-4 sm:gap-4">
          {gallery.map((g, i) => (
            <Reveal
              key={g.src}
              delay={i * 70}
              className={cn(
                "group r-card relative overflow-hidden border border-ink/10",
                g.span === "wide" && "col-span-2",
                g.span === "tall" && "row-span-2",
              )}
            >
              <img
                src={g.src}
                alt={g.alt}
                loading="lazy"
                className="h-full w-full object-cover saturate-[0.85] transition-all duration-700 group-hover:scale-105 group-hover:saturate-100"
              />
              <div className="absolute inset-0 bg-linear-to-t from-bg/90 via-bg/10 to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
              <div className="absolute inset-0 bg-primary/20 mix-blend-color opacity-40 transition-opacity duration-500 group-hover:opacity-0" />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
                <span className="font-display text-sm font-bold text-ink">{g.caption}</span>
                <span className="text-[10px] font-semibold tracking-[0.2em] text-primary uppercase">{concept.glyph}</span>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Past editions */}
        <div className="mt-14 grid gap-3 sm:grid-cols-3">
          {pastEditions.map((p, i) => (
            <Reveal
              key={p.year}
              delay={i * 90}
              className="group r-card relative overflow-hidden border border-ink/10 bg-bg-2/40 p-6 transition-all hover:border-primary/40"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-display text-4xl font-black text-ink transition-colors group-hover:text-primary">
                  {p.year}
                </span>
                <span className="text-[10px] font-bold tracking-[0.2em] text-muted uppercase">{p.edition} edition</span>
              </div>
              <div className="mt-4 font-display text-lg font-bold text-ink">{p.theme}</div>
              <div className="mt-1 text-sm text-muted">{p.note}</div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* components/Sponsors.tsx */

export function Sponsors() {
  const { concept } = useTheme();
  return (
    <section id="sponsors" className="relative py-16 sm:py-20">
      <Container>
        <Reveal className="flex flex-col items-center gap-3 text-center">
          <span className="text-[11px] font-bold tracking-[0.3em] text-muted uppercase">{concept.words.sponsors}</span>
          <h3 className="font-display text-2xl font-bold text-ink">Sponsor slots open for '27</h3>
        </Reveal>

        <Reveal delay={120} className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {sponsors.map((s, i) => (
            <div
              key={s}
              className="group r-card relative flex h-24 items-center justify-center overflow-hidden border border-dashed border-ink/15 bg-ink/[0.02] transition-all hover:border-primary/50 hover:bg-primary/5"
            >
              <div
                className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-ink/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full"
                aria-hidden
              />
              <span className="relative font-display text-xs font-bold tracking-[0.2em] text-muted uppercase transition-colors group-hover:text-ink">
                {s}
              </span>
              <span className="absolute right-3 top-2 font-display text-[10px] text-ink/20">0{i + 1}</span>
            </div>
          ))}
        </Reveal>

        <Reveal delay={200} className="mt-8 flex justify-center">
          <Button href="mailto:sponsorship@nittfest.in" variant="outline">
            <Handshake className="h-4 w-4 text-primary" /> Partner with NITTFEST
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}

/* components/FAQ.tsx */

export function FAQ() {
  const { concept } = useTheme();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-ink/15 to-transparent" />
      <Container>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              kicker={concept.words.faq}
              title={
                <>
                  Questions, <span className="text-primary">answered.</span>
                </>
              }
              description="Still stuck? Your department's Cultural Secretaries know everything — or DM us on Instagram."
            />
          </div>
          <div className="lg:col-span-7">
            <Reveal className="divide-y divide-ink/10 border-y border-ink/10">
              {faqs.map((f, i) => {
                const isOpen = open === i;
                return (
                  <div key={f.q}>
                    <button
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="group flex w-full items-center justify-between gap-6 py-5 text-left"
                    >
                      <span className="flex items-center gap-4">
                        <span className="font-display text-xs font-bold text-muted/60">0{i + 1}</span>
                        <span
                          className={cn(
                            "font-display text-base font-semibold transition-colors sm:text-lg",
                            isOpen ? "text-primary" : "text-ink group-hover:text-primary",
                          )}
                        >
                          {f.q}
                        </span>
                      </span>
                      <span
                        className={cn(
                          "grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-all duration-300",
                          isOpen
                            ? "rotate-45 border-primary bg-primary text-bg"
                            : "border-ink/15 text-ink group-hover:border-primary/60",
                        )}
                      >
                        <Plus className="h-4 w-4" />
                      </span>
                    </button>
                    <div
                      className={cn(
                        "grid transition-all duration-500 ease-out",
                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <div className="overflow-hidden">
                        <p className="pb-6 pl-9 text-sm leading-relaxed text-muted sm:text-base">{f.a}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* Register CTA, footer, and the floating concept switcher. */






/* components/Footer.tsx */

function RegisterBand() {
  const { concept } = useTheme();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setDone(true);
  };

  return (
    <section id="register" className="relative scroll-mt-24 py-10">
      <Container>
        <Reveal className="r-card relative overflow-hidden border border-primary/30 bg-bg-2/60 px-6 py-14 text-center sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,color-mix(in_srgb,var(--t-primary)_30%,transparent),transparent_60%)]" />
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-secondary/20 blur-[90px]" />
          <div className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-primary/25 blur-[90px]" />

          <div className="relative mx-auto max-w-2xl">
            <span className="text-[11px] font-bold tracking-[0.3em] text-primary uppercase">{concept.words.register}</span>
            <h2 className="mt-4 font-display text-3xl leading-[1.05] font-bold text-ink sm:text-5xl">
              Your department needs you on stage.
            </h2>
            <p className="mt-4 text-muted sm:text-lg">
              Registrations open with the portal. Drop your webmail and we'll ping you the moment it goes live.
            </p>

            <form onSubmit={submit} className="mx-auto mt-8 flex max-w-md flex-col gap-2 sm:flex-row">
              <label className="sr-only" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rollno@nitt.edu"
                className="r-card w-full flex-1 border border-ink/15 bg-bg/60 px-5 py-3.5 text-ink placeholder:text-muted/70 focus:border-primary focus:outline-none"
              />
              <button
                type="submit"
                className="r-card inline-flex items-center justify-center gap-2 bg-primary px-6 py-3.5 font-semibold text-bg shadow-[0_10px_40px_-10px_var(--t-primary)] transition-all hover:-translate-y-0.5"
              >
                {done ? (
                  <>
                    <Check className="h-4 w-4" /> You're on the list
                  </>
                ) : (
                  <>
                    Notify me <ArrowUpRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
            <p className="mt-3 text-xs text-muted/70">{FEST_DATES} · NIT Trichy · Students only</p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

const columns = [
  {
    title: "Fest",
    links: ["About", "Clusters", "Events", "Schedule", "Scoreboard"],
    hrefs: ["#about", "#clusters", "#events", "#schedule", "#scoreboard"],
  },
  {
    title: "Teams",
    links: ["Events", "Design", "WebOps", "Marketing", "Publicity"],
    hrefs: ["#", "#", "#", "#", "#"],
  },
  {
    title: "More",
    links: ["Gallery", "FAQ", "Sponsors", "Rulebook", "Brochure"],
    hrefs: ["#gallery", "#faq", "#sponsors", "#", "#"],
  },
];

export function Footer() {
  return (
    <>
      <RegisterBand />
      <footer className="relative mt-10 border-t border-ink/10">
        <Container className="py-14">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Logo />
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
                The annual inter-departmental cultural festival of the National Institute of Technology,
                Tiruchirappalli. Run by students, for students, since 1993.
              </p>
              <div className="mt-6 space-y-2 text-sm text-muted">
                <p className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  NIT Tiruchirappalli, Tanjore Main Road, Tiruchirappalli — 620015
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0 text-primary" />
                  <a href="mailto:contact@nittfest.in" className="hover:text-ink">
                    contact@nittfest.in
                  </a>
                </p>
              </div>
              <div className="mt-6 flex gap-2">
                {[
                  { Icon: InstagramIcon, href: "https://www.instagram.com/nittfest/", label: "Instagram" },
                  { Icon: YoutubeIcon, href: "https://www.youtube.com/channel/UC79ftXsZywNu0GOiHg3NLiQ", label: "YouTube" },
                  { Icon: LinkedinIcon, href: "https://www.linkedin.com/company/nittfest", label: "LinkedIn" },
                ].map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="grid h-10 w-10 place-items-center rounded-xl border border-ink/15 bg-ink/5 text-ink transition-all hover:border-primary hover:bg-primary hover:text-bg"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
              {columns.map((col) => (
                <div key={col.title}>
                  <h4 className="text-[11px] font-bold tracking-[0.25em] text-ink uppercase">{col.title}</h4>
                  <ul className="mt-4 space-y-2.5">
                    {col.links.map((l, i) => (
                      <li key={l}>
                        <a href={col.hrefs[i]} className="text-sm text-muted transition-colors hover:text-primary">
                          {l}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-ink/10 pt-6 text-xs text-muted sm:flex-row sm:items-center">
            <p>© 2027 NITTFEST, NIT Tiruchirappalli. All rights reserved.</p>
            <p>
              Crafted by <span className="font-semibold text-ink">WebOps</span> · Made with too much coffee at Orion
            </p>
          </div>
        </Container>

        {/* big watermark */}
        <div className="pointer-events-none overflow-hidden select-none" aria-hidden>
          <div className="text-stroke font-display text-[18vw] leading-[0.8] font-black tracking-tight opacity-[0.06]">
            NITTFEST
          </div>
        </div>
      </footer>
    </>
  );
}

/* components/ConceptPicker.tsx */

export function ConceptPicker() {
  const { theme, concept, setTheme, cycleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  // Press "T" anywhere to cycle concepts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key.toLowerCase() === "t") cycleTheme();
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cycleTheme]);

  return (
    <div className="fixed right-5 bottom-5 z-50 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      {/* Panel */}
      <div
        className={cn(
          "glass-strong r-card w-[min(92vw,360px)] origin-bottom-right overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] transition-all duration-300",
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-3 scale-95 opacity-0",
        )}
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
          <div>
            <div className="text-[10px] font-bold tracking-[0.25em] text-primary uppercase">Concept explorer</div>
            <div className="mt-0.5 text-sm text-muted">Three directions — pick one when the theme drops.</div>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-ink/10 hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <ul className="max-h-[min(52vh,420px)] overflow-y-auto p-2">
          {themeOrder.map((id) => {
            const c = concepts[id];
            const active = id === theme;
            return (
              <li key={id}>
                <button
                  onClick={() => setTheme(id)}
                  className={cn(
                    "r-card group flex w-full items-start gap-3 px-3 py-3 text-left transition-all",
                    active ? "bg-primary/10 ring-1 ring-primary/40" : "hover:bg-ink/5",
                  )}
                >
                  <span className="mt-0.5 flex shrink-0 -space-x-1.5">
                    {c.swatches.map((s) => (
                      <span key={s} className="h-5 w-5 rounded-full border-2 border-bg" style={{ background: s }} />
                    ))}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className={cn("font-display text-sm font-bold", active ? "text-primary" : "text-ink")}>
                        {c.name}
                      </span>
                      {active && <Check className="h-4 w-4 shrink-0 text-primary" />}
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-muted">{c.vibe}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center justify-between border-t border-ink/10 px-5 py-3 text-[11px] text-muted">
          <span>
            Press <kbd className="rounded border border-ink/20 bg-ink/10 px-1.5 py-0.5 font-mono text-ink">T</kbd> to cycle
          </span>
          <span className="font-semibold text-ink/70">
            {themeOrder.indexOf(theme) + 1} / {themeOrder.length}
          </span>
        </div>
      </div>

      {/* Toggle pill */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="glass-strong group flex items-center gap-3 rounded-full py-2 pr-4 pl-2 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)] transition-all hover:border-primary/50"
      >
        <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-bg">
          <Palette className="h-4 w-4" />
        </span>
        <span className="flex flex-col items-start leading-none">
          <span className="text-[9px] font-bold tracking-[0.25em] text-muted uppercase">Concept</span>
          <span className="mt-1 font-display text-xs font-bold text-ink">{concept.label}</span>
        </span>
        <span className="ml-1 flex -space-x-1">
          {concept.swatches.map((s) => (
            <span key={s} className="h-3 w-3 rounded-full border border-bg" style={{ background: s }} />
          ))}
        </span>
      </button>
    </div>
  );
}
