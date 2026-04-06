export type AgeGroup = '3-5' | '6-8' | '9-12' | '13+';
export type Level = 'Facile' | 'Moyen' | 'Difficile';
export type Theme = 'Animaux' | 'École' | 'Émotions' | 'Famille' | 'Nature' | 'Aventure' | 'Science' | 'Histoire' | 'Autre';
export type ContentStatus = 'actif' | 'inactif' | 'brouillon';
export type Language = 'Français' | 'Anglais' | 'Arabe';

export interface BaseContent {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  ageGroup: AgeGroup;
  level: Level;
  theme: Theme;
  language: Language;
  status: ContentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Story extends BaseContent {
  content: string; // The text content or PDF URL of the story
  pdfUrl?: string; // Explicit PDF URL if content is used for text
  author?: string;
}

export interface Dictionary {
  id: string;
  title: string;
  language: Language;
  theme: string;
  status: ContentStatus;
  words?: DictionaryWord[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DictionaryWord {
  id: string;
  word: string;
  definition?: string;
  example?: string;
  level: Level;
  theme: string;
  status: ContentStatus;
  dictionaryId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EducationalText extends BaseContent {
  content: string; // HTML, Markdown or Text
  format: 'text' | 'pdf' | 'image';
  fileUrl?: string; // If 'pdf' or 'image'
}
