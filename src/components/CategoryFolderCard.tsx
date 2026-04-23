import { gradients } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, TouchableOpacity, View } from "react-native";
// import * from 'nativewind';
// NativeWind uses className prop, not tw function

interface CategoryFolderCardProps {
  name: string;
  color: keyof typeof gradients;
  onPress: () => void;
}

export const CategoryFolderCard = ({
  name,
  color,
  onPress,
}: CategoryFolderCardProps) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      width: "47%",
      margin: "2%",
      backgroundColor: useThemeColor({}, "card"),
    }}
    className="flex-col items-center rounded-xl shadow-md p-4 mb-3"
  >
    <View
      className="mb-2"
      style={{
        experimental_backgroundImage: gradients[color],
        padding: 13,
        borderRadius: 13,
      }}
    >
      <MaterialIcons name="folder" size={35} color={"white"} />
    </View>

    <Text
      numberOfLines={2}
      ellipsizeMode="tail"
      style={{
        fontSize: 18,
        fontWeight: "600",
        color: useThemeColor({}, "text"),
        textAlign: "center",
      }}
    >
      {name}
    </Text>
  </TouchableOpacity>
);
