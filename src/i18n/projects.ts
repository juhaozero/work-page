import type { Locale } from './config';
import type { Project } from '../types/project';
import projectsZh from '../data/projects.json';
import projectsEn from '../data/projects.en.json';

const projectsByLocale: Record<Locale, Project[]> = {
  zh: projectsZh as Project[],
  en: projectsEn as Project[],
};

export function getProjects(locale: Locale): Project[] {
  return projectsByLocale[locale];
}
