import AdBanner from "@/components/Banner";
import Colors from "@/src/constants/Colors";
import { extractMetadata } from "@/src/services/metadata";
import { useStore } from "@/src/store/useStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
  const colors = Colors["light"];
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
    description: "",
    thumbnailUrl: "",
  });

  useEffect(() => {
    if (params.sharedUrl && typeof params.sharedUrl === "string") {
      setUrl(params.sharedUrl);
      getMetadata(params.sharedUrl);
    }
  }, [params.sharedUrl]);

  const getMetadata = async (url: string) => {
    try {
      const { title, description, images } = await LinkPreview.getPreview(url);
      setUserTitle(title || "");
    } catch (e) {
      console.log("Metadata error", e);
    }
  };

  const getTikTokThumbnail = async (url: string) => {
    try {
      const response = await fetch(
        `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`,
      );

      const data = await response.json();
      console.log(JSON.stringify(data, null, 5));
      return data.thumbnail_url;
    } catch (e) {
      return "";
    }
  };

  const getYoutubeThumbnail = (url: string) => {
    const idMatch = url.match(/v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/);

    const id = idMatch ? idMatch[1] : null;

    if (id) {
      return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
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
      const cleanUrl = url.split("?")[0];

      const { title, description, images } =
        await LinkPreview.getPreview(cleanUrl);

      const platform = (await extractMetadata(cleanUrl)).platform;

      let thumbnailUrl = images && images.length > 0 ? images[0] : "";

      console.log(platform);

      if (platform === "tiktok" && meta.thumbnailUrl.trim() === "") {
        thumbnailUrl = await getTikTokThumbnail(cleanUrl);
      }

      if (platform === "youtube") {
        thumbnailUrl = getYoutubeThumbnail(url); //Aqui se manda el url completo
        console.log("youtube", thumbnailUrl);
      }

      setMeta({
        title: title || "",
        description: description || "",
        thumbnailUrl: thumbnailUrl || "",
      });

      await addVideo({
        id: Date.now().toString(),
        url: url.trim(),
        title: userTitle || meta.title,
        thumbnailUrl: thumbnailUrl,
        platform: platform,
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
          placeholder="Paste YouTube, TikTok or Instagram link..."
          placeholderTextColor={colors.icon}
          value={url}
          onChangeText={(text) => {
            setUrl(text);
            getMetadata(text);
          }}
          autoCapitalize="none"
          keyboardType="url"
        />

        <Text style={[styles.label, { color: colors.text }]}>Titulo</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          placeholder="Titulo del video"
          placeholderTextColor={colors.icon}
          value={userTitle}
          onChangeText={setUserTitle}
          autoCapitalize="none"
          keyboardType="default"
        />
        <View className="flex flex-row justify-between">
          <Text style={[styles.label, { color: colors.text, marginTop: 24 }]}>
            Select Category (Optional)
          </Text>

          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: colors.tint }]}
            onPress={handleShowInputText}
          >
            <Ionicons
              name={isVisible ? "remove-circle-outline" : "add-circle-outline"}
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        {isVisible && (
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.inputCat,
                {
                  backgroundColor: colors.card,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              placeholder="New folder name..."
              placeholderTextColor={colors.icon}
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              onSubmitEditing={handleAddCategory}
            />
            <TouchableOpacity
              style={[styles.addBtn, { backgroundColor: colors.tint }]}
              onPress={handleAddCategory}
            >
              <Ionicons name="add-circle-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.categoriesGrid}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryChip,
                {
                  backgroundColor:
                    selectedCategory === cat.id ? colors.tint : colors.card,
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
            <Text style={{ color: colors.icon }}>
              No categories found. Create some first!
            </Text>
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
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveText}>Save Video Link</Text>
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
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  addBtn: {
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
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
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
    fontSize: 16,
  },
});
