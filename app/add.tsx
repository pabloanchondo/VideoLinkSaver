import Colors from "@/src/constants/Colors";
import { useColorScheme } from "@/src/hooks/useColorScheme";
import { extractMetadata } from "@/src/services/metadata";
import { extractThumbnail } from "@/src/services/thumbnailExtractor";
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
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddVideoScreen() {
  const theme = useColorScheme();
  const colors = Colors[theme];
  const router = useRouter();
  const params = useLocalSearchParams();

  const { categories, addVideo } = useStore();

  const [url, setUrl] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (params.sharedUrl && typeof params.sharedUrl === "string") {
      setUrl(params.sharedUrl);
    }
  }, [params.sharedUrl]);

  const handleSave = async () => {
    if (!url.trim()) {
      Alert.alert("Error", "Please enter a valid URL.");
      return;
    }

    setIsSaving(true);
    try {
      const metadata = await extractMetadata(url.trim());
      let thumbnailUrl = metadata.thumbnailUrl;
      // Robust thumbnail extraction
      if (!thumbnailUrl) {
        thumbnailUrl =
          (await extractThumbnail(url.trim(), metadata.platform)) || null;
      }
      await addVideo({
        id: Date.now().toString(),
        url: url.trim(),
        title: metadata.title,
        thumbnailUrl,
        platform: metadata.platform,
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
          onChangeText={setUrl}
          autoCapitalize="none"
          keyboardType="url"
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
                setSelectedCategory(selectedCategory === cat.id ? null : cat.id)
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
