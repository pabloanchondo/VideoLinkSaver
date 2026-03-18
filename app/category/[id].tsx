import AdBanner from "@/components/Banner";
import { useThemeColor } from "@/hooks/use-theme-color";
import { VideoList } from "@/src/components/VideoList";
import { useStore } from "@/src/store/useStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CategoryScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { categories, videos } = useStore();

  const category = categories.find((c) => c.id === id);
  const categoryVideos = videos.filter((v) => v.categoryId === id);

  if (!category) {
    return (
      <SafeAreaView
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: useThemeColor({}, "background") }}
      >
        <Text className="text-lg text-gray-500">Category not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: useThemeColor({}, "background") }}
    >
      <AdBanner />
      <View className="flex-row items-center px-5 pt-4 pb-5">
        <TouchableOpacity onPress={() => router.back()} className="mr-2">
          <Text className="text-lg text-blue-500">Back</Text>
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-gray-900">
          {category.name}
        </Text>
      </View>
      <VideoList videos={categoryVideos} />
    </SafeAreaView>
  );
}
