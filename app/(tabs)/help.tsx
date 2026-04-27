import AdBanner from "@/components/Banner";
import { Colors, gradients } from "@/constants/theme";
import { useColorScheme } from "@/src/hooks/useColorScheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";

export default function HelpScreen() {
  const router = useRouter();
  const colors = Colors[useColorScheme()];

  const { t } = useTranslation("help");

  return (
    <>
      <View
        className="flex-1 px-6 pt-16"
        style={{ backgroundColor: colors.background }}
      >
        {/* Header */}
        <Text
          className="text-3xl font-bold mb-6"
          style={{ color: colors.text }}
        >
          {t("tittle")}
        </Text>

        {/* Hero */}
        <View className="items-center mb-10">
          <MaterialIcons name="ondemand-video" size={80} color={colors.tint} />

          <Text
            className="text-xl font-semibold mt-4 text-center"
            style={{ color: colors.text }}
          >
            {t("learn")}
          </Text>

          <Text
            className="text-gray-500 text-center mt-2"
            style={{ color: colors.text }}
          >
            {t("description")}
          </Text>
        </View>

        {/* Button */}
        <TouchableOpacity
          className=" py-4 rounded-xl items-center mb-10"
          style={{
            experimental_backgroundImage: gradients.blue,
          }}
          onPress={() => router.push("/(tabs)/onbording")}
        >
          <Text className="font-semibold text-lg" style={{ color: "white" }}>
            {t("viewTutorial")}
          </Text>
        </TouchableOpacity>

        {/* Quick tips */}
        <View>
          <Text
            className="text-lg font-semibold mb-3"
            style={{ color: colors.text }}
          >
            {t("tips")}
          </Text>

          <Text className="text-slate-500 mb-2">• {t("share")}</Text>
          <Text className="text-slate-500 mb-2">• {t("create")}</Text>
          <Text className="text-slate-500 mb-2">• {t("colors")}</Text>
        </View>
      </View>
      <AdBanner />
    </>
  );
}
