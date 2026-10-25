/* lib.tsx — utilities, hooks, theme provider, all fest data and shared UI primitives. */
import { useEffect, useState, useRef, type RefObject, createContext, useCallback, useContext, useMemo, type ReactNode, type ComponentPropsWithoutRef, type CSSProperties, type ElementType } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/* Shared library: class merge, hooks and the concept (theme) provider. */





/* utils/cn.ts */

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* hooks/useCountdown.ts */

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
}

function compute(target: Date): Countdown {
  const diff = Math.max(0, target.getTime() - Date.now());
  const s = Math.floor(diff / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    done: diff === 0,
  };
}

export function useCountdown(target: Date): Countdown {
  const [value, setValue] = useState(() => compute(target));

  useEffect(() => {
    const id = window.setInterval(() => setValue(compute(target)), 1000);
    return () => window.clearInterval(id);
  }, [target]);

  return value;
}

/* hooks/useInView.ts */

/**
 * Returns a ref + boolean that flips to true once the element enters the viewport.
 * Used for scroll-reveal animations and count-ups.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: IntersectionObserverInit = { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
  once = true,
): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.unobserve(entry.target);
        } else if (!once) {
          setInView(false);
        }
      });
    }, options);
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [once]);

  return [ref, inView];
}

/* context/ThemeContext.tsx */

interface ThemeContextValue {
  theme: ThemeId;
  concept: Concept;
  setTheme: (id: ThemeId) => void;
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = "nittfest-concept";
export const DEFAULT_THEME: ThemeId = "neon";

function readInitial(): ThemeId {
  if (typeof window === "undefined") return DEFAULT_THEME;
  const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeId | null;
  return stored && stored in concepts ? stored : DEFAULT_THEME;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(readInitial);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      const bg = getComputedStyle(document.documentElement).getPropertyValue("--t-bg").trim();
      meta.setAttribute("content", bg || "#07061a");
    }
  }, [theme]);

  const setTheme = useCallback((id: ThemeId) => setThemeState(id), []);
  const cycleTheme = useCallback(() => {
    setThemeState((t) => themeOrder[(themeOrder.indexOf(t) + 1) % themeOrder.length]);
  }, []);

  const value = useMemo(
    () => ({ theme, concept: concepts[theme], setTheme, cycleTheme }),
    [theme, setTheme, cycleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}

/* All fest content + the three concept definitions. */


/* data/content.ts */

/** Target for the countdown — tentative opening ceremony */
export const FEST_START = new Date("2027-03-12T09:00:00+05:30");
export const FEST_DATES = "12 – 14 March 2027";

export const stats = [
  { value: 34, suffix: "th", label: "Edition", note: "Running since 1993" },
  { value: 80, suffix: "+", label: "Events", note: "Across 9 clusters" },
  { value: 17, suffix: "", label: "Departments", note: "One rolling trophy" },
  { value: 6000, suffix: "+", label: "Students", note: "The whole campus" },
];

export type ClusterIcon =
  | "dance"
  | "music"
  | "drama"
  | "lits"
  | "languages"
  | "quiz"
  | "arts"
  | "fashion"
  | "gaming";

export interface Cluster {
  name: string;
  icon: ClusterIcon;
  blurb: string;
  events: string[];
  weight: "High" | "Medium" | "Core";
}

export const clusters: Cluster[] = [
  {
    name: "Dance",
    icon: "dance",
    blurb: "Where it all began in '93. Solo, duet and the finale that decides everything.",
    events: ["ChoreoNite", "Eastern Solo", "Western Solo", "Duet", "Classical"],
    weight: "High",
  },
  {
    name: "Music",
    icon: "music",
    blurb: "From Carnatic kritis to distortion pedals — every genre gets a mic.",
    events: ["Battle of Bands", "Solo Vocals", "Classical Vocal", "Instrumental", "Rap Battle"],
    weight: "High",
  },
  {
    name: "Dramatics",
    icon: "drama",
    blurb: "Scripts, spoofs and silence. The stage belongs to whoever commits hardest.",
    events: ["Movie Spoof", "Stage Play", "Mime", "Mono-Acting", "Improv"],
    weight: "High",
  },
  {
    name: "English Lits",
    icon: "lits",
    blurb: "A dozen events of wit and word — the cluster that fills the most trophies.",
    events: ["Debate", "JAM", "DumbC", "Crossword", "Potpourri", "Creative Writing"],
    weight: "Core",
  },
  {
    name: "Tamil & Hindi Lits",
    icon: "languages",
    blurb: "Pattimandram, kavithai and shayari. Language is the loudest instrument here.",
    events: ["Pattimandram", "Kavi Sammelan", "Vaad Vivad", "Tamil Quiz", "Antakshari"],
    weight: "Core",
  },
  {
    name: "Quiz",
    icon: "quiz",
    blurb: "Prelims, finals and the Major General Quiz. Bring the whole bench.",
    events: ["General Quiz", "India Quiz", "Sports & Ent.", "Sci-Tech", "Biz Quiz"],
    weight: "Core",
  },
  {
    name: "Fine Arts",
    icon: "arts",
    blurb: "Walls, faces and sketchbooks become the canvas across all three days.",
    events: ["Wall Painting", "Body Art", "Sketch-a-thon", "Clay Modelling", "Rangoli"],
    weight: "Medium",
  },
  {
    name: "Fashion & Culinary",
    icon: "fashion",
    blurb: "The ramp and the kitchen — two places where presentation is everything.",
    events: ["Fashionista", "Culinary Conquest", "Mr & Ms NITTFEST", "Cocktail (mocktail!)"],
    weight: "Medium",
  },
  {
    name: "Gaming & Film",
    icon: "gaming",
    blurb: "Esports lobbies by day, short-film premieres by night.",
    events: ["Valorant", "FIFA", "Short Film", "Photography", "Reel Making"],
    weight: "Medium",
  },
];

export interface Flagship {
  index: string;
  name: string;
  cluster: string;
  venue: string;
  day: string;
  description: string;
}

export const flagships: Flagship[] = [
  {
    index: "01",
    name: "ChoreoNite",
    cluster: "Dance",
    venue: "GJCH Main Stage",
    day: "Day 3 · Finale",
    description:
      "Every department, one choreography, ten minutes. The results are announced right after — this is where the trophy is won or lost.",
  },
  {
    index: "02",
    name: "Movie Spoof",
    cluster: "Dramatics",
    venue: "Barn Hall",
    day: "Day 2 · Night",
    description:
      "Comic retellings of blockbusters, judged by a celebrity panel. Historically the loudest hall on campus.",
  },
  {
    index: "03",
    name: "Battle of Bands",
    cluster: "Music",
    venue: "Open Air Theatre",
    day: "Day 1 · Night",
    description:
      "Department bands go to war with original sets and covers. Amps at eleven, sound-check optional.",
  },
  {
    index: "04",
    name: "Culinary Conquest",
    cluster: "Fashion & Culinary",
    venue: "Orion Lawns",
    day: "Day 2 · Noon",
    description:
      "No-fire cooking under a ticking clock. Plating counts, and the judges are hungry.",
  },
  {
    index: "05",
    name: "Fashionista",
    cluster: "Fashion",
    venue: "GJCH Ramp",
    day: "Day 3 · Evening",
    description:
      "Themed ramp walks with department-built costumes. Expect lights, fog and at least one cape.",
  },
  {
    index: "06",
    name: "Major Quiz Finals",
    cluster: "Quiz",
    venue: "A13 Hall",
    day: "Day 2 · Morning",
    description:
      "Six teams, sixty questions, a buzzer round that ends friendships. Open to the whole campus to watch.",
  },
];

export interface Department {
  code: string;
  name: string;
  points: number;
  wins: number;
}

/** Demo standings — wire this to the live scoring API during the fest */
export const departments: Department[] = [
  { code: "MECH", name: "Mechanical", points: 1860, wins: 11 },
  { code: "CSE", name: "Computer Science", points: 1795, wins: 9 },
  { code: "ECE", name: "Electronics & Comm.", points: 1710, wins: 8 },
  { code: "EEE", name: "Electrical", points: 1640, wins: 7 },
  { code: "CIVIL", name: "Civil", points: 1515, wins: 6 },
  { code: "CHEM", name: "Chemical", points: 1480, wins: 5 },
  { code: "PROD", name: "Production", points: 1390, wins: 5 },
  { code: "MME", name: "Metallurgy", points: 1310, wins: 4 },
  { code: "ICE", name: "Instrumentation", points: 1255, wins: 4 },
  { code: "ARCH", name: "Architecture", points: 1180, wins: 6 },
  { code: "CA", name: "Computer Applications", points: 1020, wins: 2 },
  { code: "MBA", name: "Management", points: 940, wins: 2 },
];

export interface ScheduleItem {
  time: string;
  title: string;
  venue: string;
  tag: string;
}

export const schedule: { day: string; date: string; theme: string; items: ScheduleItem[] }[] = [
  {
    day: "Day 1",
    date: "Fri, 12 Mar",
    theme: "Curtain Raiser",
    items: [
      { time: "09:00", title: "Inauguration & Theme Reveal", venue: "GJCH", tag: "Ceremony" },
      { time: "10:30", title: "Lits Prelims — JAM, Crossword, Potpourri", venue: "LH Complex", tag: "Lits" },
      { time: "11:00", title: "Wall Painting begins", venue: "Orion Wall", tag: "Fine Arts" },
      { time: "14:00", title: "Solo Vocals & Instrumental", venue: "Barn Hall", tag: "Music" },
      { time: "16:00", title: "Eastern & Western Dance Solos", venue: "GJCH", tag: "Dance" },
      { time: "19:30", title: "Battle of Bands", venue: "Open Air Theatre", tag: "Music" },
    ],
  },
  {
    day: "Day 2",
    date: "Sat, 13 Mar",
    theme: "The Long Day",
    items: [
      { time: "09:30", title: "Major Quiz Finals", venue: "A13 Hall", tag: "Quiz" },
      { time: "11:00", title: "Debate & Pattimandram Finals", venue: "EEE Auditorium", tag: "Lits" },
      { time: "12:30", title: "Culinary Conquest", venue: "Orion Lawns", tag: "Culinary" },
      { time: "15:00", title: "Guest Lecture — Film & Media", venue: "Barn Hall", tag: "Talk" },
      { time: "17:00", title: "Mime & Mono-Acting", venue: "Barn Hall", tag: "Dramatics" },
      { time: "19:30", title: "Movie Spoof", venue: "Barn Hall", tag: "Dramatics" },
    ],
  },
  {
    day: "Day 3",
    date: "Sun, 14 Mar",
    theme: "Grand Finale",
    items: [
      { time: "10:00", title: "Short Film Screenings", venue: "Ojas", tag: "Film" },
      { time: "11:30", title: "Valorant & FIFA Grand Finals", venue: "Octagon", tag: "Gaming" },
      { time: "14:00", title: "Stage Play Finals", venue: "Barn Hall", tag: "Dramatics" },
      { time: "16:30", title: "Fashionista", venue: "GJCH Ramp", tag: "Fashion" },
      { time: "18:30", title: "ChoreoNite", venue: "GJCH Main Stage", tag: "Dance" },
      { time: "21:30", title: "Results & Trophy Ceremony", venue: "GJCH", tag: "Ceremony" },
    ],
  },
];

export const faqs = [
  {
    q: "Who can participate?",
    a: "Every student of NIT Trichy — UG, PG and research scholars — represents their own department. There's no outside participation; this one is just for us.",
  },
  {
    q: "How does the scoring work?",
    a: "Each cluster carries a weightage. Placements in every event earn points that roll up into the department tally. Whoever leads after ChoreoNite on Day 3 lifts the overall trophy.",
  },
  {
    q: "How do I register for events?",
    a: "Registrations are routed through your department's Cultural Secretaries. Once the portal opens, you'll also be able to self-register for solo events from this site.",
  },
  {
    q: "Are there pro-shows and guest lectures?",
    a: "Yes — expect a celebrity judging panel for Movie Spoof and ChoreoNite, a guest lecture on Day 2 and a closing night at GJCH. Announcements drop on our Instagram first.",
  },
  {
    q: "Where do events happen?",
    a: "Across campus — GJCH, Barn Hall, EEE Auditorium, the Lecture Hall Complex, Orion and the Open Air Theatre. Check the schedule for venues per event.",
  },
  {
    q: "I want to volunteer / join the team.",
    a: "NITTFEST is run entirely by students. Recruitments for Events, Design, WebOps, Marketing and Publicity open each semester — follow the socials for the forms.",
  },
];

export const sponsors = [
  "Title Sponsor",
  "Powered By",
  "Banking Partner",
  "Beverage Partner",
  "Media Partner",
  "Gaming Partner",
  "Fashion Partner",
  "Food Partner",
];

export const marqueeItems = [
  "ChoreoNite",
  "Movie Spoof",
  "Battle of Bands",
  "Pattimandram",
  "Culinary Conquest",
  "Fashionista",
  "Major Quiz",
  "Wall Painting",
  "Debate",
  "Valorant",
  "Short Film",
  "JAM",
];

export interface GalleryItem {
  src: string;
  alt: string;
  caption: string;
  span?: "wide" | "tall";
}

export const gallery: GalleryItem[] = [
  {
    src: "https://images.pexels.com/photos/13230484/pexels-photo-13230484.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    alt: "Night concert scene with audience and colourful stage lights",
    caption: "Closing night, GJCH",
    span: "wide",
  },
  {
    src: "https://images.pexels.com/photos/12442276/pexels-photo-12442276.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    alt: "Contemporary dancers performing in sync on stage",
    caption: "ChoreoNite",
  },
  {
    src: "https://images.pexels.com/photos/18368848/pexels-photo-18368848.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    alt: "Guitarist playing under stage lights",
    caption: "Battle of Bands",
    span: "tall",
  },
  {
    src: "https://images.pexels.com/photos/6896219/pexels-photo-6896219.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    alt: "Actors in a dramatic stage rehearsal",
    caption: "Stage Play finals",
  },
  {
    src: "https://images.pexels.com/photos/33767781/pexels-photo-33767781.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    alt: "Cultural dance performance in traditional attire",
    caption: "Classical showcase",
  },
  {
    src: "https://images.pexels.com/photos/167605/pexels-photo-167605.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    alt: "Live band on stage with crowd at night",
    caption: "Open Air Theatre",
  },
];

export const pastEditions = [
  { year: "'26", edition: "33rd", theme: "Comic Universe", note: "Stories that broke the frame" },
  { year: "'25", edition: "32nd", theme: "Desseptia", note: "The Dunes of Deceit" },
  { year: "'93", edition: "1st", theme: "The Beginning", note: "Started as a dance competition" },
];

/* data/themes.ts */

export type ThemeId = "neon" | "mythos" | "carnival";

export interface Concept {
  id: ThemeId;
  /** Short name shown in the picker */
  label: string;
  /** Full concept title */
  name: string;
  /** One-line description of the visual direction (for the ideas panel) */
  vibe: string;
  /** Hero kicker above the wordmark */
  kicker: string;
  /** Two-line hero headline */
  headline: [string, string];
  /** Hero paragraph */
  description: string;
  ctaPrimary: string;
  ctaSecondary: string;
  /** Picker swatches */
  swatches: [string, string, string];
  /** Theme-flavoured section vocabulary */
  words: {
    about: string;
    clusters: string;
    flagship: string;
    leaderboard: string;
    schedule: string;
    gallery: string;
    faq: string;
    sponsors: string;
    register: string;
  };
  /** Decorative glyph used in marquees */
  glyph: string;
}

export const concepts: Record<ThemeId, Concept> = {
  neon: {
    id: "neon",
    label: "Neon Nocturne",
    name: "NEON NOCTURNE",
    vibe: "Synthwave arcade night — magenta & cyan on midnight, perspective grids, glow and scanlines. Loud, electric, unmistakably a party.",
    kicker: "NIT Trichy · 34th Edition · 12–14 March 2027",
    headline: ["Plug in.", "Light up the night."],
    description:
      "Seventeen departments. Eighty-plus events. Three nights where the campus runs on bass, brushstrokes and bragging rights. One trophy leaves with the loudest department.",
    ctaPrimary: "Enter the Arena",
    ctaSecondary: "See the Line-up",
    swatches: ["#ff2bd6", "#22e4ff", "#ffd84a"],
    words: {
      about: "Insert Coin",
      clusters: "Pick Your Arena",
      flagship: "Boss Levels",
      leaderboard: "Live Scoreboard",
      schedule: "The Set List",
      gallery: "After Dark",
      faq: "Debug Mode",
      sponsors: "Powered By",
      register: "Player Select",
    },
    glyph: "◆",
  },
  mythos: {
    id: "mythos",
    label: "Mythos",
    name: "MYTHOS: AGE OF LEGENDS",
    vibe: "Ancient epic — obsidian and antique gold, crimson accents, ember particles and ornamental rings. Grand, cinematic, built for a rivalry.",
    kicker: "NIT Trichy · XXXIV Edition · 12–14 March 2027",
    headline: ["Every department.", "One legend."],
    description:
      "Since 1993, the departments of NIT Trichy have gathered to settle it on stage. Quizzes, choreography, verse and voice — each a battle in a far older war. This March, the chronicle gains a new chapter.",
    ctaPrimary: "Answer the Call",
    ctaSecondary: "Read the Chronicle",
    swatches: ["#d9a94c", "#b8262f", "#f4e4bd"],
    words: {
      about: "The Prophecy",
      clusters: "Choose Your Path",
      flagship: "Trials of Legend",
      leaderboard: "Hall of Legends",
      schedule: "The Chronicle",
      gallery: "Echoes of the Past",
      faq: "Ask the Oracle",
      sponsors: "Patrons of the Realm",
      register: "Pledge Your House",
    },
    glyph: "✦",
  },
  carnival: {
    id: "carnival",
    label: "Carnivale",
    name: "CARNIVALE ROYALE",
    vibe: "Vintage big-top — burgundy and marigold, sunbursts, marquee bulbs and confetti. Playful, warm and ridiculously fun.",
    kicker: "NIT Trichy · 34th Edition · 12–14 March 2027",
    headline: ["Step right up.", "The greatest show on campus."],
    description:
      "Roll up, roll up! Three days under the big top where every department brings its wildest acts — dancers, debaters, drummers and daredevils — all chasing the ringmaster's trophy.",
    ctaPrimary: "Grab Your Ticket",
    ctaSecondary: "See the Acts",
    swatches: ["#ffb21e", "#ff4d6d", "#35e8c8"],
    words: {
      about: "The Main Attraction",
      clusters: "Step Right Up",
      flagship: "Headline Acts",
      leaderboard: "The Big Board",
      schedule: "Showtimes",
      gallery: "Under the Big Top",
      faq: "Ask the Ringmaster",
      sponsors: "Our Showrunners",
      register: "Box Office",
    },
    glyph: "★",
  },
};

export const themeOrder: ThemeId[] = ["neon", "mythos", "carnival"];

/* Shared UI primitives: container, reveal, pill, button, logo, brand icons. */



/* components/ui.tsx */

/* ---------------------------------------------------------------- Reveal */
interface RevealProps extends ComponentPropsWithoutRef<"div"> {
  as?: ElementType;
  delay?: number;
}

export function Reveal({ as, delay = 0, className, style, children, ...rest }: RevealProps) {
  const Tag = (as ?? "div") as ElementType;
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <Tag
      ref={ref}
      className={cn("reveal", inView && "in", className)}
      style={{ ...(style as CSSProperties), ["--reveal-delay" as string]: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* -------------------------------------------------------- SectionHeading */
interface SectionHeadingProps {
  kicker: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({ kicker, title, description, align = "left", className }: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <Reveal>
        <Pill>{kicker}</Pill>
      </Reveal>
      <Reveal delay={80}>
        <h2 className="mt-5 font-display text-3xl leading-[1.05] font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={160}>
          <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">{description}</p>
        </Reveal>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ Pill
   Ticket-stub tag: punched notches, corner cuts, perforated segments.
   Pass a string with "·" separators to get segmented ticket panels. */
export function Pill({ children, className }: { children: ReactNode; className?: string }) {
  const segments =
    typeof children === "string" ? children.split("·").map((s) => s.trim()).filter(Boolean) : null;

  return (
    <span
      className={cn(
        "ticket inline-flex items-stretch font-display text-[10px] font-bold tracking-[0.22em] text-primary uppercase",
        className,
      )}
    >
      {segments ? (
        segments.map((seg, i) => (
          <span key={seg} className="flex items-stretch">
            {i > 0 && <span className="ticket-divider" />}
            <span className={cn("flex items-center px-4 py-2", i === 0 && "pl-5", i === segments.length - 1 && "pr-5")}>
              {seg}
            </span>
          </span>
        ))
      ) : (
        <span className="flex items-center gap-2 px-5 py-2">{children}</span>
      )}
    </span>
  );
}

/* ---------------------------------------------------------------- Button */
interface ButtonProps extends ComponentPropsWithoutRef<"a"> {
  variant?: "primary" | "ghost" | "outline";
  size?: "md" | "lg";
}

export function Button({ variant = "primary", size = "md", className, children, ...rest }: ButtonProps) {
  return (
    <a
      className={cn(
        "group relative inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden font-body font-semibold tracking-wide transition-all duration-300 select-none",
        "r-card focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none",
        size === "md" ? "px-5 py-2.5 text-sm" : "px-7 py-3.5 text-base",
        variant === "primary" &&
          "bg-primary text-bg shadow-[0_10px_40px_-10px_var(--t-primary)] hover:-translate-y-0.5 hover:shadow-[0_18px_50px_-10px_var(--t-primary)]",
        variant === "outline" && "border border-ink/20 bg-ink/5 text-ink hover:border-primary/60 hover:bg-primary/10",
        variant === "ghost" && "text-ink/80 hover:text-ink",
        className,
      )}
      {...rest}
    >
      {variant === "primary" && (
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      )}
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </a>
  );
}

/* ------------------------------------------------------------- Container */
export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10", className)}>{children}</div>;
}

/* ------------------------------------------------------------------ Logo */
export function Logo({ className }: { className?: string }) {
  return (
    <a href="#top" className={cn("group flex items-center gap-2.5", className)}>
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
  );
}

/* ----------------------------------------------------------- Brand icons */
const svgBase = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function InstagramIcon(props: ComponentPropsWithoutRef<"svg">) {
  return (
    <svg {...svgBase} {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function YoutubeIcon(props: ComponentPropsWithoutRef<"svg">) {
  return (
    <svg {...svgBase} {...props}>
      <path d="M2.5 17a24.1 24.1 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.6 49.6 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.1 24.1 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.6 49.6 0 0 1-16.2 0A2 2 0 0 1 2.5 17Z" />
      <path d="m10 15 5-3-5-3z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LinkedinIcon(props: ComponentPropsWithoutRef<"svg">) {
  return (
    <svg {...svgBase} {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
