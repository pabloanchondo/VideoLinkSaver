import { PlatformType } from '../types';

export interface MetadataResult {
  title: string;
  thumbnailUrl: string | null;
  platform: PlatformType;
}

export const extractMetadata = async (url: string): Promise<MetadataResult> => {
  let platform: PlatformType = 'generic';
  let title = 'Saved Video';
  let thumbnailUrl: string | null = null;

  try {
    const parsedUrl = new URL(url.includes('http') ? url : `https://${url}`);
    const host = parsedUrl.hostname.toLowerCase();

    // YouTube Extraction
    if (host.includes('youtube.com') || host.includes('youtu.be')) {
      platform = 'youtube';
      let videoId = null;
      if (host.includes('youtu.be')) {
        videoId = parsedUrl.pathname.slice(1);
      } else {
        videoId = parsedUrl.searchParams.get('v');
      }

      if (videoId) {
        thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }
    } 
    // TikTok Extraction
    else if (host.includes('tiktok.com')) {
      platform = 'tiktok';
      const pathSegments = parsedUrl.pathname.split('/');
      const videoIndex = pathSegments.findIndex(segment => segment === 'video');
      if (videoIndex !== -1 && pathSegments.length > videoIndex + 1) {
        const videoId = pathSegments[videoIndex + 1];
        thumbnailUrl = `https://www.tiktok.com/node/video/${videoId}/thumbnail`;
      }
    } 
    // Instagram Extraction
    else if (host.includes('instagram.com')) {
      platform = 'instagram';
      const pathSegments = parsedUrl.pathname.split('/');
      const videoIndex = pathSegments.findIndex(segment => segment === 'p' || segment === 'reel' || segment === 'tv');
      if (videoIndex !== -1 && pathSegments.length > videoIndex + 1) {
        const videoId = pathSegments[videoIndex + 1];
        thumbnailUrl = `https://www.instagram.com/p/${videoId}/media/?size=l`;
      }
    } 
    // Facebook Extraction
    else if (host.includes('facebook.com') || host.includes('fb.watch')) {
      platform = 'facebook';
      const pathSegments = parsedUrl.pathname.split('/');
      const videoIndex = pathSegments.findIndex(segment => segment === 'videos');
      console.log(videoIndex)
      if (videoIndex !== -1 && pathSegments.length > videoIndex + 1) {
        const videoId = pathSegments[videoIndex + 1];
        thumbnailUrl = `https://graph.facebook.com/${videoId}/picture`;
      }
    }

    // Attempt to fetch OpenGraph data for title if possible
    // Note: In a real production app, doing this directly from the client might hit CORS issues
    // on Web, but works generally cross-origin in React Native.
    try {
      const response = await fetch(url.includes('http') ? url : `https://${url}`);
      const text = await response.text();

      const titleMatch = text.match(/<title[^>]*>([^<]+)<\/title>/);
      if (titleMatch && titleMatch[1]) {
        title = titleMatch[1].trim();
      }

      if (!thumbnailUrl) {
        const ogImageMatch = text.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"[^>]*>/i);
        if (ogImageMatch && ogImageMatch[1]) {
          thumbnailUrl = ogImageMatch[1];
        }
      }
    } catch (e) {
      console.log('Failed to fetch open graph data for url', url, e);
    }
  } catch (error) {
    console.error('Invalid URL passed to metadata extractor:', url);
  }

  return { title, thumbnailUrl, platform };
};
