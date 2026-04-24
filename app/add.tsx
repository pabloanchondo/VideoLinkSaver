import { api } from "@/api/api";
import AdBanner from "@/components/Banner";
import { Modal } from "@/components/ui/Modal";
import { Colors, gradients } from "@/constants/theme";
import { showToast } from "@/helpers/alert.helper";
import { APIVideoResponse } from "@/interfaces/video.interfaces";
import { CategoryFolderCard } from "@/src/components/CategoryFolderCard";
import { CategoryList } from "@/src/components/CategoryList";
import { PreviewCard } from "@/src/components/PreviewCard";
import { useColorScheme } from "@/src/hooks/useColorScheme";
import { extractMetadata } from "@/src/services/metadata";
import { useStore } from "@/src/store/useStore";
import { Category, PlatformType } from "@/src/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import LinkPreview from "react-native-link-preview";
import CreateCategoryScreen from "./createCategory";

export default function AddVideoScreen() {
  const colors = Colors[useColorScheme()];
  const router = useRouter();
  const params = useLocalSearchParams();

  const { categories, addVideo, addCategory } = useStore();

  const [url, setUrl] = useState("");
  const [userTitle, setUserTitle] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<string>("uncategorized");
  const [isSaving, setIsSaving] = useState(false);
  const [isVisibleSelect, setIsVisibleSelect] = useState(false);

  const [category, setCategory] = useState({
    name: "uncategorized",
    color: "blue",
  });

  const [isVisible, setIsVisible] = useState(false);
  const [isFetchingMeta, setIsFetchingMeta] = useState(false);

  const { t: tv } = useTranslation("videos");
  const { t: tc } = useTranslation("categories");
  const { t: tcom } = useTranslation("common");

  const [meta, setMeta] = useState({
    title: "",
    thumbnailUrl: "",
    platform: "" as PlatformType,
  });

  useEffect(() => {
    if (params.sharedUrl && typeof params.sharedUrl === "string") {
      setUrl(params.sharedUrl);
      handleGetVideoData(params.sharedUrl);
    }
  }, [params.sharedUrl]);

  const handleGetVideoData = async (url: string) => {
    try {
      setIsFetchingMeta(true);

      const data = await getVideoData(url);

      setMeta(data);
      setUserTitle(data.title);
    } catch {
      showToast("Error", "Failed to get video data.", "error");
    } finally {
      setIsFetchingMeta(false);
    }
  };

  const getVideoData = async (url: string) => {
    let cleanUrl = url.split("?")[0];

    const { platform } = await extractMetadata(cleanUrl);

    let title = "";
    let thumbnailUrl = "";

    console.log(platform);

    // Facebook primero (evita LinkPreview innecesario)
    if (platform === "facebook") {
      const fbData = await getFacebookData(cleanUrl, platform);
      console.log(fbData);

      return {
        title: fbData.title || "",
        thumbnailUrl: fbData.thumbnailUrl || "",
        platform,
      };
    }

    if (platform === "youtube") {
      //Aqui se pasa el url original porque LinkPreview no funciona bien con los shorts de youtube, y el url limpio pierde la información necesaria para obtener la miniatura
      const fbData = await getFacebookData(url, platform);

      return {
        title: fbData.title || "",
        thumbnailUrl: fbData.thumbnailUrl || "",
        platform,
      };
    }

    // LinkPreview (base para la mayoría)
    try {
      const preview = await LinkPreview.getPreview(cleanUrl);
      title = preview.title || "";
      thumbnailUrl = preview.images?.[0] || "";
    } catch {
      // fallback silencioso
    }

    // Ajustes por plataforma
    if (platform === "tiktok" && !thumbnailUrl) {
      const tikTokData = await getTikTokThumbnail(cleanUrl);
      title = tikTokData.title || title;
      thumbnailUrl = tikTokData.thumbnailUrl || thumbnailUrl;
    }

    //Si es un short de youtube, la metadata no funciona bien, así que obtenemos la miniatura directamente

    return {
      title,
      thumbnailUrl,
      platform,
    };
  };

  const getTikTokThumbnail = async (url: string) => {
    try {
      const response = await fetch(
        `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`,
      );

      const data = await response.json();
      console.log(JSON.stringify(data, null, 5));
      return {
        title: data.title || "",
        thumbnailUrl: data.thumbnail_url || "",
      };
    } catch (e) {
      return {
        title: "",
        thumbnailUrl: "",
      };
    }
  };

  const getFacebookData = async (url: string, platform: PlatformType) => {
    try {
      const { data } = await api.post<APIVideoResponse>("metadata", {
        url,
      });

      if (platform === "youtube") {
        return {
          title: data.title || data.description || "",
          thumbnailUrl: data.image || data.favicon || "",
        };
      }

      return {
        title: data.description || data.title || "",
        thumbnailUrl: data.image || data.favicon || "",
      };
    } catch (e) {
      return {
        title: "",
        thumbnailUrl: "",
      };
    }
  };

  const handleSave = async () => {
    if (!url.trim()) {
      showToast("Error", "Please enter a valid URL.", "error");
      return;
    }

    setIsSaving(true);
    try {
      await addVideo({
        id: Date.now().toString(),
        url: url.trim(),
        title: userTitle || meta.title,
        thumbnailUrl: meta.thumbnailUrl,
        platform: meta.platform,
        categoryId: selectedCategory,
        createdAt: Date.now(),
      });

      router.back();
    } catch (e) {
      showToast("Error", "Failed to save video.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleShowInputText = () => {
    setIsVisible((state) => !state);
  };

  const onCategoryCreated = (id: string) => {
    setSelectedCategory(id);
    setIsVisible(false);
  };

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category.id);
    setCategory({
      name: category.name,
      color: category.color,
    });
    setIsVisibleSelect(false);
  };

  return (
    <>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View
            className="shadow-md mt-6"
            style={{
              backgroundColor: colors.card,
              padding: 20,
              borderRadius: 10,
            }}
          >
            <View>
              <Text className=" mb-2 text-xl" style={{ color: colors.text }}>
                Video URL
              </Text>

              <TextInput
                placeholder={tv("urlPlaceholder")}
                placeholderTextColor={colors.icon}
                style={{
                  backgroundColor: colors.background,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  fontSize: 14,
                  color: colors.text,
                }}
                value={url}
                onChangeText={(text) => {
                  setUrl(text);
                  handleGetVideoData(text);
                }}
                autoCapitalize="none"
                keyboardType="url"
              />
            </View>

            <View className="mt-6">
              <Text className=" mb-2 text-xl" style={{ color: colors.text }}>
                {tv("title")}
              </Text>

              <TextInput
                placeholder={tv("videoTitle")}
                placeholderTextColor={colors.icon}
                style={{
                  backgroundColor: colors.background,
                  borderRadius: 8,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  fontSize: 14,
                  color: colors.text,
                }}
                value={userTitle}
                onChangeText={setUserTitle}
                autoCapitalize="none"
                keyboardType="default"
              />
            </View>

            <View className="flex flex-row justify-between mt-3">
              <Text
                style={[styles.label, { color: colors.text, marginTop: 24 }]}
              >
                {tv("selectCategory")}
              </Text>

              <TouchableOpacity
                style={[styles.addBtn, { backgroundColor: colors.tint }]}
                onPress={handleShowInputText}
              >
                <View className="flex flex-row gap-1 items-center">
                  <Text
                    style={{ color: "#fff", fontSize: 14, fontWeight: "500" }}
                  >
                    {isVisible ? tcom("close") : tc("newCategoryPlaceholder")}
                  </Text>
                  <Ionicons
                    name={
                      isVisible ? "remove-circle-outline" : "add-circle-outline"
                    }
                    size={24}
                    color="#fff"
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View className="flex flex-col gap-3 mt-2 justify-center items-center align-middle">
              <Text className="text-slate-400 text-lg">{tc("press")}</Text>
              <CategoryFolderCard
                name={category.name}
                color={category.color as keyof typeof gradients}
                onPress={() => setIsVisibleSelect(true)}
              />
            </View>

            <Modal isOpen={isVisibleSelect} withInput>
              <View
                style={{
                  backgroundColor: colors.background,
                  padding: 25,
                  borderRadius: 8,
                  minWidth: "99%",
                  maxHeight: "60%",
                }}
              >
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 20,
                    fontWeight: "500",
                    marginBottom: 15,
                  }}
                >
                  {tc("select")}
                </Text>
                <CategoryList
                  categories={categories}
                  onSelect={(category: Category) => {
                    handleSelectCategory(category);
                  }}
                />
              </View>
            </Modal>

            <Modal isOpen={isVisible} withInput>
              <View
                style={{
                  minWidth: "99%",
                  maxHeight: "80%",
                }}
              >
                <CreateCategoryScreen
                  showAdd={false}
                  showClsoeButton
                  onCategoryCreated={onCategoryCreated}
                  onClose={() => {
                    setIsVisible(false);
                  }}
                />
              </View>
            </Modal>

            <TouchableOpacity
              className=" py-4 rounded-xl items-center mt-10"
              style={{
                experimental_backgroundImage: gradients.blue,
              }}
              onPress={handleSave}
            >
              {isSaving || isFetchingMeta ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text
                  className="font-semibold text-lg"
                  style={{ color: "white" }}
                >
                  {tv("saveVideoLink")}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {meta.thumbnailUrl && (
            <View
              className="shadow-md mt-6 p-6"
              style={{
                backgroundColor: colors.card,
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  color: colors.text,
                  fontSize: 18,
                  fontWeight: "500",
                  margin: 12,
                }}
              >
                Preview
              </Text>
              <PreviewCard
                platform={meta.platform}
                thumbnailUrl={meta.thumbnailUrl}
                title={userTitle || meta.title || "Unknown Title"}
              />
            </View>
          )}
        </ScrollView>
      </View>
      <AdBanner />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 40,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  catText: {
    fontWeight: "500",
  },
  saveBtn: {
    paddingVertical: 16,
    marginHorizontal: 2,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  saveText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  addBtn: {
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    marginTop: 12,
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 12,
    alignItems: "center",
  },
  inputCat: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
    fontSize: 16,
  },
});
