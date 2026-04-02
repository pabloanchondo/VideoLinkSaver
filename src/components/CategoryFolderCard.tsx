import { useThemeColor } from "@/hooks/use-theme-color";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, TouchableOpacity, View } from "react-native";
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
  <TouchableOpacity
    onPress={onPress}
    style={{
      backgroundColor: useThemeColor({}, "card"),
    }}
    className="flex-row items-center rounded-xl shadow-md p-4 mb-3 mr-3"
  >
    <View className="mr-3">
      <MaterialIcons
        name="folder"
        size={32}
        color={useThemeColor({}, "tint")}
      />
    </View>
    <Text
      style={{
        fontSize: 18,
        fontWeight: "600",
        color: useThemeColor({}, "text"),
      }}
    >
      {name}
    </Text>
  </TouchableOpacity>
);
