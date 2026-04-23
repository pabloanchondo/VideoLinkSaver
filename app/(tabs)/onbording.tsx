import { Colors, gradients } from "@/constants/theme";
import { useColorScheme } from "@/src/hooks/useColorScheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import PagerView from "react-native-pager-view";

const { width } = Dimensions.get("window");

export default function Onboarding({ onFinish }: { onFinish: () => void }) {
  const pagerRef = useRef<PagerView>(null);
  const [page, setPage] = useState(0);
  const [pagerKey, setPagerKey] = useState(0);
  const router = useRouter();

  const { t } = useTranslation("board");

  const slides = [
    {
      title: t("save"),
      description: t("saveDesc"),
      icon: "share",
    },
    {
      title: t("organize"),
      description: t("organizeDesc"),
      icon: "folder",
    },
    {
      title: t("colors"),
      description: t("colorsDesc"),
      icon: "palette",
    },
    {
      title: t("start"),
      description: t("startDesc"),
      icon: "bolt",
    },
  ];

  const colors = Colors[useColorScheme()];

  useFocusEffect(
    useCallback(() => {
      setPage(0);
      setPagerKey((prev) => prev + 1);
    }, []),
  );
  const goNext = () => {
    if (page < slides.length - 1) {
      pagerRef.current?.setPage(page + 1);
    } else {
      pagerRef.current?.setPage(0);
      setPage(0);
      router.replace("/(tabs)");
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Skip */}
      <TouchableOpacity
        onPress={onFinish}
        className="absolute top-12 right-5 z-10"
      >
        <Text className="text-gray-500" style={{ color: colors.text }}>
          {t("skip")}
        </Text>
      </TouchableOpacity>

      {/* Slides */}
      <PagerView
        key={pagerKey} // 👈 esto es la clave
        style={{ flex: 1 }}
        initialPage={0}
        ref={pagerRef}
        onPageSelected={(e) => setPage(e.nativeEvent.position)}
      >
        {slides.map((item, index) => (
          <View key={index} className="flex-1 justify-center items-center px-6">
            <View className="mb-6">
              <MaterialIcons
                name={item.icon as any}
                size={80}
                color={colors.tint}
              />
            </View>

            <Text
              className="text-2xl font-bold mb-4 text-center"
              style={{ color: colors.text }}
            >
              {item.title}
            </Text>

            <Text
              className="text-base text-gray-600 text-center"
              style={{ color: colors.text }}
            >
              {item.description}
            </Text>
          </View>
        ))}
      </PagerView>

      {/* Indicators */}
      <View className="flex-row justify-center mb-4">
        {slides.map((_, i) => (
          <View
            key={i}
            className={`h-2 w-2 mx-1 rounded-full ${i === page ? "bg-teal-700" : "bg-gray-300"}`}
          />
        ))}
      </View>

      {/* Button */}
      <View className="px-6 pb-8">
        <TouchableOpacity
          onPress={goNext}
          style={{
            experimental_backgroundImage: gradients.blue,
          }}
          className="py-4 rounded-xl items-center"
        >
          <Text className="text-white font-semibold text-lg">
            {page === slides.length - 1 ? t("getStarted") : t("next")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
