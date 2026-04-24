import { useStore } from '@/src/store/useStore';
import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const nativeTheme = useRNColorScheme() ?? 'light';
  const selectedTheme = useStore((state) => state.theme);

  const themeToReturn = selectedTheme === 'system' ? nativeTheme : selectedTheme;

  if (hasHydrated) {
    return themeToReturn;
  }

  return 'light';
}
