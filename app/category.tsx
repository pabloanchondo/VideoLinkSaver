import AdBanner from "@/components/Banner";
import { VideoList } from "@/src/components/VideoList";
import { useColorScheme } from "@/src/hooks/useColorScheme";
import { useStore } from "@/src/store/useStore";

import { Colors, gradients } from "@/constants/theme";
import { VideoLink } from "@/src/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CategoryScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { categories, videos, loadVideos, removeCategory } = useStore();

  const [filteredVideos, setFilteredVideos] = useState<VideoLink[]>(videos);
  const [search, setSearch] = useState("");

  const { t } = useTranslation("videos");
  const { t: tcat } = useTranslation("categories");
  const { t: tcom } = useTranslation("common");

  const colors = Colors[useColorScheme()];

  React.useEffect(() => {
    // Opcional: recargar videos al montar
    loadVideos();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadVideos();
    }, [id]),
  );

  React.useEffect(() => {
    // Actualiza la lista filtrada cuando cambian los videos
    if (search === "") {
      setFilteredVideos(videos);
    } else {
      setFilteredVideos(
        videos.filter((video) =>
          video.title.toLowerCase().includes(search.toLowerCase()),
        ),
      );
    }
  }, [videos, search]);

  const handleSearch = (text: string) => {
    setSearch(text);
  };

  const handleDeleteCategory = () => {
    Alert.alert(tcat("deleteCategory"), tcat("confirmDelete"), [
      { text: tcom("cancel"), style: "cancel" },
      {
        text: tcom("delete"),
        style: "destructive",
        onPress: () => deleteCategory(),
      },
    ]);
  };

  const deleteCategory = async () => {
    if (id) {
      await removeCategory(id as string);
      router.replace("/");
    }
  };

  const category = categories.find((c) => c.id === id);
  const categoryVideos = filteredVideos.filter((v) => v.categoryId === id);

  if (!category) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <Text className="text-lg text-gray-500">Category not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <View
          style={{
            backgroundColor: colors.card,
            paddingTop: 25,
            minHeight: "20%",
            paddingHorizontal: 20,
            alignContent: "center",
            justifyContent: "center",
          }}
          className="shadow-md"
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: "bold",
                  color: colors.text,
                }}
              >
                {category.name.length > 25
                  ? category.name.slice(0, 20) + "..."
                  : category.name}
              </Text>
              <Text className="text-slate-400">
                {categoryVideos.length} Videos
              </Text>
            </View>

            <View className="flex flex-row gap-2">
              <TouchableOpacity
                style={{
                  width: 40,
                  height: 40,
                  experimental_backgroundImage: gradients.red,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => {
                  if (category.id != "uncategorized") {
                    handleDeleteCategory();
                  }
                }}
              >
                <Ionicons name="trash" size={18} color={"white"} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: 40,
                  height: 40,
                  experimental_backgroundImage:
                    gradients[category.color as keyof typeof gradients],
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => {
                  if (category.id != "uncategorized") {
                    router.push(`/category/${category.id}`);
                  }
                }}
              >
                <Ionicons name="pencil" size={18} color={"white"} />
              </TouchableOpacity>
            </View>
          </View>

          <TextInput
            placeholder={t("filterByTitle")}
            value={search}
            onChangeText={handleSearch}
            style={{
              backgroundColor: colors.background,
              borderRadius: 8,
              paddingHorizontal: 14,
              paddingVertical: 12,
              marginTop: 15,
              fontSize: 14,
              color: colors.text,
            }}
          />
        </View>

        <View className="flex-1">
          <VideoList videos={categoryVideos} />
        </View>
      </View>
      <AdBanner />
    </>
  );
}
