// Type definitions for the app

export interface User {
  id: string;
  phoneNumber: string;
  name: string;
  state: string;
  constituency: string;
  party: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Campaign {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: 'poster' | 'video';
  templateId: string;
  content: any;
  status: 'draft' | 'completed';
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Template {
  id: string;
  partyId: string;
  templateName: string;
  category: string;
  thumbnail: string;
  content: any;
  isOfficial: boolean;
  createdAt: string;
  syncedAt?: string;
}

export interface PartyLogo {
  id: string;
  partyId: string;
  logoUrl: string;
  slogan: string;
  color: string;
  createdAt: string;
}

export interface ImageData {
  path: string;
  width: number;
  height: number;
  mime: string;
  size: number;
}

export interface PosterContent {
  image: string;
  logo?: PartyLogo;
  slogan: string;
  textColor?: string;
  fontSize?: number;
}

export interface VideoContent {
  video: string;
  logo?: PartyLogo;
  slogan: string;
  duration: number;
  effects?: string[];
}
