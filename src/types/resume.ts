export interface ExperienceEntry {
  id: string;
  title: string;
  company: string;
  duration: string;
  bullets: string[];
}

export interface ProjectEntry {
  id: string;
  name: string;
  description: string;
  bullets: string[];
}

export interface EducationEntry {
  id: string;
  degree: string;
  institution: string;
  year: string;
}

export interface ResumeData {
  fullName: string;
  jobTitle: string;
  phone: string;
  email: string;
  linkedin: string;
  location: string;
  summary: string;
  skills: string[];
  tools: string[];
  certifications: string[];
  languages: string[];
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  education: EducationEntry[];
  achievements: string[];
}

export const emptyResume: ResumeData = {
  fullName: "",
  jobTitle: "",
  phone: "",
  email: "",
  linkedin: "",
  location: "",
  summary: "",
  skills: [],
  tools: [],
  certifications: [],
  languages: [],
  experience: [],
  projects: [],
  education: [],
  achievements: [],
};

export const generateId = () => crypto.randomUUID();
