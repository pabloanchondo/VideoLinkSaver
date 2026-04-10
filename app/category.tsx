import AdBanner from "@/components/Banner";
import { useThemeColor } from "@/hooks/use-theme-color";
import { VideoList } from "@/src/components/VideoList";
import { useStore } from "@/src/store/useStore";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CategoryScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { categories, videos, loadVideos } = useStore();

  React.useEffect(() => {
    // Opcional: recargar videos al montar
    loadVideos();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadVideos();
    }, [id]),
  );

  const category = categories.find((c) => c.id === id);
  const categoryVideos = videos.filter((v) => v.categoryId === id);

  if (!category) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <Text className="text-lg text-gray-500">Category not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: useThemeColor({}, "background") }}
    >
      {/* Contenido */}
      <View className="flex-1">
        <View className="flex-row items-center px-5 pb-4">
          <Text
            className="text-2xl font-bold"
            style={{ color: useThemeColor({}, "text") }}
          >
            {category.name}
          </Text>
        </View>

        <VideoList videos={categoryVideos} />
      </View>

      {/* Banner fijo abajo */}
      <AdBanner />
    </SafeAreaView>
  );
}
