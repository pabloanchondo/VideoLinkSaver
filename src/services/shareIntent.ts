import { useShareIntent } from 'expo-share-intent';
import { useEffect, useState } from 'react';

/**
 * Hook to listen for incoming share intents from Android and iOS.
 */
export function useSharedIntent() {
  const { hasShareIntent, shareIntent, resetShareIntent, error } = useShareIntent();
  const [sharedUrl, setSharedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      console.log('Share intent error:', error);
    }
    
    if (hasShareIntent && shareIntent) {
      const url = shareIntent.webUrl || shareIntent.text;
      if (url) {
        setSharedUrl(url);
      }
      resetShareIntent();
    }
  }, [hasShareIntent, shareIntent, resetShareIntent, error]);

  const clearSharedUrl = () => setSharedUrl(null);

  return { sharedUrl, clearSharedUrl };
}
