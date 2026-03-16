export interface Project {
  id?: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl: string;
  demoUrl: string;
  images: string[];
  category: string;
  featured: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface SkillCategory {
  id: string;
  name: string;
  icon: string;
  description?: string;
  orderIndex: number;
  createdAt?: Date | string;
}

export interface Skill {
  id?: string;
  name: string;
  category: string; // Links to SkillCategory.name or ID
  icon: string;
  level: number; // 0-100
  createdAt?: Date | string;
}

export interface Experience {
  id?: string;
  title: string;
  organization: string;
  description: string;
  startDate: string;
  endDate: string | null; // null means "Present"
  type: 'work' | 'education';
  createdAt?: Date | string;
}

export interface Message {
  id?: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt?: Date | string;
}

export interface SocialLinks {
  github: string;
  linkedin: string;
  codeforces: string;
  email: string;
  phone?: string;
  location?: string;
}

export interface Settings {
  id?: string;
  developerName: string;
  bio: string;
  title: string;
  tagline: string;
  profileImage: string;
  socialLinks: SocialLinks;
  siteTitle: string;
  experienceYears: number;
  projectsCompleted: number;
  technologiesCount: number;
  updatedAt?: Date | string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface ServiceItem {
  id?: string;
  key: string;
  title?: string; // Optional if we use translations for name
  description?: string; // Optional if we use translations for desc
  icon: string;
  color: string;
  tech: string[];
  orderIndex: number;
}
