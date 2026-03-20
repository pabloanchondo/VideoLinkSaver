export interface APIVideoResponse {
  title: string | null;
  description: string | null;
  image: string | null;
  favicon: string | null;
}

export interface iappVersionResponse {
  version: string;
  minVersion: string;
  forceUpdate: boolean;
  message: string;
}
