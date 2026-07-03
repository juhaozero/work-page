export interface Project {
  id: string;
  name: string;
  emoji: string;
  category: string;
  description: string;
  url: string;
  featured?: boolean;
}

export interface SiteConfig {
  title: string;
  domain: string;
  eyebrow: string;
  heroTitle: string;
  heroDescription: string;
  tagline: string;
  email: string;
  github: string;
}
