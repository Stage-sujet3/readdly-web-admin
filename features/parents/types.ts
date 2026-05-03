export interface ParentEnfant {
  idEnfant: string;
  nom: string;
  prenom: string;
  dateNaissance?: string;
  age?: number;
  trancheAge?: string;
  niveau?: string;
  difficulte?: string;
  dateCreation: string;
  genre?: string;
}

export interface ParentFile {
  id: string;
  fileType: string;
  hostedUrl: string;
  fullUrl: string;
  fileName: string;
  mimeType: string;
  size: number;
  extension: string;
  createdAt: string;
}

export interface Parent {
  idU: string;
  supertokensUserId?: string;
  nom: string;
  prenom: string;
  genre?: string;
  email: string;
  role: string;
  cin?: string;
  avatar?: string;
  numTel?: string;
  adresse?: string;
  authProvider: string;
  emailVerified: boolean;
  emailVerifiedAt?: string;
  dateCreation: string;
  etatCompte: string;
  isProfileCompleted: boolean;
  profileCompletedAt?: string;
  verificationStatus: string;
  verificationAdmin: boolean;
  files?: ParentFile[];
  enfants?: ParentEnfant[];
  enfantCount?: number;
}

export interface ParentStats {
  totalChildren: number;
  totalParents: number;
  verifiedParents: number;
}
