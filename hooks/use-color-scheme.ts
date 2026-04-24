import { useStore } from '@/src/store/useStore';
import { useColorScheme as useNativeColorScheme } from 'react-native';

export function useColorScheme() {
  const nativeTheme = useNativeColorScheme() ?? 'light';
  const selectedTheme = useStore((state) => state.theme);
  
  if (selectedTheme === 'system') {
    return nativeTheme;
  }
  
  return selectedTheme;
}
