export interface Category {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: number;
  color: string;
}

export type PlatformType =
  | "youtube"
  | "tiktok"
  | "instagram"
  | "facebook"
  | "generic";

export interface VideoLink {
  id: string;
  url: string;
  title: string;
  thumbnailUrl: string | null;
  platform: PlatformType;
  categoryId: string | null;
  createdAt: number;
}

export interface Settings {
  autoFetchMetadata: boolean;
}
