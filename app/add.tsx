import Colors from "@/src/constants/Colors";
import { useColorScheme } from "@/src/hooks/useColorScheme";
import { extractMetadata } from "@/src/services/metadata";
import { useStore } from "@/src/store/useStore";
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
  const theme = useColorScheme();
  const colors = Colors[theme];
  const router = useRouter();
  const params = useLocalSearchParams();

  const { categories, addVideo } = useStore();

  const [url, setUrl] = useState("");
  const [userTitle, setUserTitle] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<string>("uncategorized");
  const [isSaving, setIsSaving] = useState(false);

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

        <Text style={[styles.label, { color: colors.text, marginTop: 24 }]}>
          Select Category (Optional)
        </Text>
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
            { backgroundColor: colors.tint, opacity: isSaving ? 0.7 : 1 },
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
});
