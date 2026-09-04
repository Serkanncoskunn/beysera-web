import projectsDb from "./projects_db.json";

export function getProjectsList() {
  return (projectsDb && projectsDb.projects && Array.isArray(projectsDb.projects)) ? projectsDb.projects : [];
}

export function getVideosList() {
  return (projectsDb && projectsDb.videos && Array.isArray(projectsDb.videos)) ? projectsDb.videos : [];
}

export const PROJECTS = getProjectsList();
export const PROJECT_VIDEOS = getVideosList();

export const PROJECT_CATEGORIES_TR = [
  "Tümü",
  "Restorasyon & Tarihi Dokular",
  "Müstakil Konut & Villa",
  "Otel & Ticari Yapılar",
  "İç Mekan & Konsept Duvarlar",
  "Mimari Cephe & Klinker"
];

export const PROJECT_CATEGORIES_EN = [
  "All",
  "Historical Restoration",
  "Residential Villa",
  "Hospitality & Hotel",
  "Interior Concept",
  "Facade & Klinker"
];

export const PROJECT_CATEGORIES = PROJECT_CATEGORIES_TR;
