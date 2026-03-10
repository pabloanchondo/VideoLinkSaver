import { View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
// NativeWind uses className prop, not tw function

interface PlatformIconProps {
  platform: 'youtube' | 'tiktok' | 'facebook' | 'instagram' | 'generic';
  size?: number;
}

export const PlatformIcon = ({ platform, size = 24 }: PlatformIconProps) => {
  let iconName: keyof typeof Ionicons.glyphMap = 'musical-notes-outline';
  let color = '#6366F1';

  switch (platform) {
    case 'youtube':
      iconName = 'logo-youtube';
      color = '#FF0000';
      break;
    case 'tiktok':
      iconName = 'logo-tiktok';
      color = '#000000';
      break;
    case 'facebook':
      iconName = 'logo-facebook';
      color = '#1877F2';
      break;
    case 'instagram':
      iconName = 'logo-instagram';
      color = '#E1306C';
      break;
    default:
      iconName = 'musical-notes-outline';
      color = '#6366F1';
  }

  return (
    <View className="mr-2">
      <Ionicons name={iconName} size={size} color={color} />
    </View>
  );
};
