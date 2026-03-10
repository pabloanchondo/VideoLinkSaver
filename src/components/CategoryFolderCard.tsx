import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pressable, Text, View } from "react-native";
// import * from 'nativewind';
// NativeWind uses className prop, not tw function

interface CategoryFolderCardProps {
  name: string;
  onPress: () => void;
}

export const CategoryFolderCard = ({
  name,
  onPress,
}: CategoryFolderCardProps) => (
  <Pressable
    onPress={onPress}
    className="flex-row items-center bg-white rounded-xl shadow-md p-4 mb-3 mr-3 flex-1"
  >
    <View className="mr-3">
      <MaterialIcons name="folder" size={32} color="#4B5563" />
    </View>
    <Text className="text-lg font-semibold text-gray-800">{name}</Text>
  </Pressable>
);
