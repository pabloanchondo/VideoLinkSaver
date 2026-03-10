import { Image, View } from 'react-native';
// NativeWind uses className prop, not tw function

interface ThumbnailImageProps {
  uri?: string;
  style?: any;
}

const placeholder = require('../../assets/images/video-placeholder.png');

export const ThumbnailImage = ({ uri, style }: ThumbnailImageProps) => (
  <View className="rounded-lg overflow-hidden bg-gray-200">
    <Image
      source={uri ? { uri } : placeholder}
      className="w-full h-32"
      style={style}
      resizeMode="cover"
      defaultSource={placeholder}
    />
  </View>
);
