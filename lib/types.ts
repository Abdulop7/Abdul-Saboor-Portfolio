export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
  handle: string;
}

export interface Metric {
  label: string;
  value: number;
  suffix: string;
  decimals?: number;
}

export interface ProcessStep {
  step: string;
  title: string;
  body: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  roleLine: string;
}

export interface SiteData {
  name: string;
  firstName: string;
  logotype: string;
  role: string;
  tagline: string;
  email: string;
  location: string;
  timezone: string;
  available: boolean;
  availabilityLabel: string;
  accent: string;
  hero: {
    lineBack: string;
    lineFront: string;
    kicker: string;
    /** image revealed inside the cursor's fluid trail on the hero background */
    bgReveal?: string | null;
  };
  manifesto: string;
  currentlyBuilding: {
    label: string;
    repo: string;
    stack: string[];
    status: string;
  };
  nav: NavLink[];
  socials: SocialLink[];
  metrics: Metric[];
  process: ProcessStep[];
  testimonials: Testimonial[];
  footer: {
    builtWith: string;
  };
}

export interface TechItem {
  name: string;
  icon: string;
  years: number;
  use: string;
}

export interface TechCategory {
  id: string;
  label: string;
  items: TechItem[];
}

export interface TechStackData {
  marquee: string[];
  categories: TechCategory[];
}

export interface Project {
  slug: string;
  index: string;
  title: string;
  year: string;
  role: string;
  stack: string[];
  problem: string;
  result: string;
  image: string;
  live: string | null;
  repo: string | null;
}

export interface ProjectsData {
  projects: Project[];
}

export interface ExperienceEntry {
  company: string;
  role: string;
  dates: string;
  bullets: string[];
}

export interface ExperienceData {
  entries: ExperienceEntry[];
}
