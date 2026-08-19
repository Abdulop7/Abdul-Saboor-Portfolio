import type {
  SiteData,
  TechStackData,
  ProjectsData,
  ExperienceData,
} from "./types";

import siteJson from "@/data/site.json";
import techStackJson from "@/data/techStack.json";
import projectsJson from "@/data/projects.json";
import experienceJson from "@/data/experience.json";

// Single typed access point for all content. Components never hardcode copy —
// they receive data from here (fetched server-side, zero client JSON weight).
export const getSite = (): SiteData => siteJson as SiteData;
export const getTechStack = (): TechStackData => techStackJson as TechStackData;
export const getProjects = (): ProjectsData => projectsJson as ProjectsData;
export const getExperience = (): ExperienceData =>
  experienceJson as ExperienceData;
