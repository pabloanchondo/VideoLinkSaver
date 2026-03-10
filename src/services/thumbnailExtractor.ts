import { Platform } from '../types';
import { getOpenGraphMeta } from './metadata';

export async function extractThumbnail(url: string, platform: Platform): Promise<string | undefined> {
  try {
    if (platform === 'youtube') {
      const match = url.match(/(?:v=|youtu.be\/|\/embed\/)([\w-]+)/);
      const videoId = match ? match[1] : undefined;
      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }
    }
    if (platform === 'tiktok') {
      const meta = await getOpenGraphMeta(url);
      return meta?.['og:image'] || meta?.['twitter:image'] || undefined;
    }
    if (platform === 'facebook') {
      const meta = await getOpenGraphMeta(url);
      return meta?.['og:image'] || undefined;
    }
    if (platform === 'instagram') {
      const meta = await getOpenGraphMeta(url);
      return meta?.['og:image'] || undefined;
    }
    // Fallback: OpenGraph
    const meta = await getOpenGraphMeta(url);
    return meta?.['og:image'] || undefined;
  } catch {
    return undefined;
  }
}
