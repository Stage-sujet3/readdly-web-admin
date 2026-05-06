export type AgeGroup = '3-5' | '6-8' | '9-12' | '13+';
export type Level = 'Facile' | 'Moyen' | 'Difficile';
export type Theme = 'Général' | 'Animaux' | 'École' | 'Émotions' | 'Famille' | 'Nature' | 'Aventure' | 'Science' | 'Histoire' | 'Sports' | 'Espace' | 'Alimentation' | 'Voyage' | 'Technologie' | 'Autre';
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

export interface StoryChapter {
  id: string;
  title: string;
  content: string;
  chapterNumber?: number;
}

export interface Story extends BaseContent {
  content: string;      // The text content or concatenated chapters for PDF
  pdfUrl?: string;      // Explicit PDF URL if content is used for text
  author?: string;
  type?: 'TEXT' | 'PDF' | 'IMAGE'; // Story type from backend
  children?: StoryChapter[];        // Chapter array for PDF stories
  parentId?: string;                // Set on chapter stories
  chapterNumber?: number;
  totalChapters?: number;
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
