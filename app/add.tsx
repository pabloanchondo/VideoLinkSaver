import { api } from "@/api/api";
import AdBanner from "@/components/Banner";
import { Modal } from "@/components/ui/Modal";
import { APIVideoResponse } from "@/interfaces/video.interfaces";
import Colors from "@/src/constants/Colors";
import { useColorScheme } from "@/src/hooks/useColorScheme";
import { extractMetadata } from "@/src/services/metadata";
import { useStore } from "@/src/store/useStore";
import { PlatformType } from "@/src/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import LinkPreview from "react-native-link-preview";
import { SafeAreaView } from "react-native-safe-area-context";

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

  const [newCategoryName, setNewCategoryName] = useState("");

  const [isVisible, setIsVisible] = useState(false);
  const [isFetchingMeta, setIsFetchingMeta] = useState(false);

  const { t: tv } = useTranslation("videos");
  const { t: tc } = useTranslation("categories");
  const { t: tcom } = useTranslation("common");

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    let id = Date.now().toString();

    await addCategory({
      id,
      name: newCategoryName.trim(),
      parentId: null,
      createdAt: Date.now(),
    });
    setNewCategoryName("");
    setIsVisible(false);
    handleAdd(id);
  };

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
      Alert.alert("Error", "Failed to get video data.");
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

  const getYoutubeThumbnail = (url: string) => {
    console.log(url);
    url = url.split("&")[0]; // Elimina parámetros adicionales
    console.log("url no params", url);
    const idMatch = url.match(/v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/);

    const id = idMatch ? idMatch[1] : null;

    if (id) {
      console.log(
        "Thumbnail ID:",
        `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      );
      return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
    }

    return "";
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

  const handleAdd = async (categoryId: string) => {
    try {
      setSelectedCategory(categoryId);
    } catch (e) {
      Alert.alert("Error", "Failed to add video to category.");
    }
  };

  const handleSave = async () => {
    if (!url.trim()) {
      Alert.alert("Error", "Please enter a valid URL.");
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
      Alert.alert("Error", "Failed to save video.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleShowInputText = () => {
    setIsVisible((state) => !state);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.label, { color: colors.text }]}>Video URL</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          placeholder={tv("urlPlaceholder")}
          placeholderTextColor={colors.icon}
          value={url}
          onChangeText={(text) => {
            setUrl(text);
            handleGetVideoData(text);
          }}
          autoCapitalize="none"
          keyboardType="url"
        />

        <Text style={[styles.label, { color: colors.text }]}>
          {tv("title")}
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          placeholder={tv("videoTitle")}
          placeholderTextColor={colors.icon}
          value={userTitle}
          onChangeText={setUserTitle}
          autoCapitalize="none"
          keyboardType="default"
        />
        <View className="flex flex-row justify-between">
          <Text style={[styles.label, { color: colors.text, marginTop: 24 }]}>
            {tv("selectCategory")}
          </Text>

          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: colors.tintSecondary }]}
            onPress={handleShowInputText}
          >
            <View className="flex flex-row gap-1 items-center">
              <Text style={{ color: "#fff", fontSize: 14, fontWeight: "500" }}>
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

        <Modal isOpen={isVisible} withInput>
          <View
            style={{
              backgroundColor: colors.card,
              padding: 25,
              borderRadius: 8,
              width: "85%",
            }}
          >
            <Text className="text-xl mb-5" style={{ color: colors.text }}>
              {tc("addCategory")}
            </Text>
            <View>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.card,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                placeholder={tc("newCategoryPlaceholder")}
                placeholderTextColor={colors.icon}
                value={newCategoryName}
                onChangeText={setNewCategoryName}
                onSubmitEditing={handleAddCategory}
              />
            </View>
            <View className="flex flex-row gap-2 justify-between items-center align-middle">
              <TouchableOpacity
                style={[
                  styles.saveBtn,
                  {
                    backgroundColor: colors.tint,
                    flex: 1,
                    opacity: isSaving ? 0.7 : 1,
                    marginRight: 1,
                  },
                ]}
                onPress={handleAddCategory}
                disabled={isSaving}
              >
                <Text style={styles.saveText}>
                  <Ionicons name="save" size={16} color="#fff" /> {tcom("save")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.saveBtn,
                  {
                    borderWidth: 1,
                    borderColor: colors.border,
                    backgroundColor: colors.background,
                    flex: 1,
                    opacity: isSaving ? 0.7 : 1,
                    marginRight: 1,
                  },
                ]}
                onPress={() => setIsVisible(false)}
                disabled={isSaving}
              >
                <Text style={[styles.saveText, { color: colors.text }]}>
                  <Ionicons name="close" size={16} color={colors.text} />{" "}
                  {tcom("close")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View style={styles.categoriesGrid}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryChip,
                {
                  backgroundColor:
                    selectedCategory === cat.id
                      ? colors.tintSecondary
                      : colors.card,
                  borderColor: colors.border,
                },
              ]}
              onPress={() =>
                handleAdd(
                  selectedCategory === cat.id ? "uncategorized" : cat.id,
                )
              }
            >
              <Text
                style={[
                  styles.catText,
                  { color: selectedCategory === cat.id ? "#fff" : colors.text },
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
          {categories.length === 0 && (
            <Text style={{ color: colors.icon }}>{tc("noCategories")}</Text>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.saveBtn,
            {
              backgroundColor: colors.tint,
              opacity: isSaving ? 0.7 : 1,
              marginBottom: 15,
            },
          ]}
          onPress={handleSave}
          disabled={isSaving || isFetchingMeta}
        >
          {isSaving || isFetchingMeta ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveText}>{tv("saveVideoLink")}</Text>
          )}
        </TouchableOpacity>
        <AdBanner />
      </ScrollView>
    </SafeAreaView>
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
    fontWeight: "600",
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
