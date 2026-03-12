import AdBanner from "@/components/Banner";
import Colors from "@/src/constants/Colors";
import { useStore } from "@/src/store/useStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function VideoDetailScreen() {
  const { id } = useLocalSearchParams();
  const colors = Colors["light"];
  const router = useRouter();

  const { videos, removeVideo, categories } = useStore();
  const video = videos.find((v) => v.id === id);

  const [userTitle, setUserTitle] = useState(video?.title || "");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    video?.categoryId || "uncategorized",
  );
  const [isSaving, setIsSaving] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  if (!video) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <Text style={{ color: colors.text }}>Video not found.</Text>
      </View>
    );
  }

  const handleOpenLink = async () => {
    const oppened = await Linking.openURL(video.url);
    if (!oppened) {
      Alert.alert("Error", "Cannot open this URL.");
    }
  };

  const handleDelete = () => {
    Alert.alert("Delete", "Remove this video link?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await removeVideo(video.id);
          router.back();
        },
      },
    ]);
  };

  const handleCopyLink = async () => {
    await Clipboard.setStringAsync(video.url);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      let titleToSave = userTitle.trim() !== "" ? userTitle : video.title;

      await useStore
        .getState()
        .updateVideo(video.id, titleToSave, selectedCategory);

      setIsEditing(false);
    } catch (e) {
      Alert.alert("Error", "Failed to save video.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, marginBottom: 30 }}>
      {video.thumbnailUrl && (
        <Image
          source={{ uri: video.thumbnailUrl }}
          style={styles.cover}
          resizeMode="cover"
        />
      )}

      <View style={styles.content}>
        {isEditing && (
          <>
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
                  onPress={() => {
                    const newCategory =
                      selectedCategory === cat.id ? "uncategorized" : cat.id;
                    setSelectedCategory(newCategory);
                  }}
                >
                  <Text
                    style={[
                      styles.catText,
                      {
                        color:
                          selectedCategory === cat.id ? "#fff" : colors.text,
                      },
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
                  flex: 1,
                  marginRight: 1,
                },
              ]}
              onPress={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveText}>
                  <Ionicons name="save" size={16} color="#fff" /> Save Changes
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.saveBtn,
                {
                  borderColor: "#ff4444",
                  flex: 1,
                  borderWidth: 1,
                  marginLeft: 1,
                  marginTop: 0,
                },
              ]}
              onPress={() => setIsEditing(false)}
            >
              <Text style={styles.deleteText}>
                <Ionicons
                  name="close-circle-outline"
                  size={16}
                  color="#ff4444"
                />{" "}
                Cancel
              </Text>
            </TouchableOpacity>
          </>
        )}

        {!isEditing && (
          <>
            <Text style={[styles.title, { color: colors.text }]}>
              {video.title}
            </Text>

            <TouchableOpacity onPress={handleCopyLink}>
              <Text style={[styles.url, { color: colors.tint }]}>
                {video.url}
              </Text>
            </TouchableOpacity>

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.mainBtn, { backgroundColor: colors.tint }]}
                onPress={handleOpenLink}
              >
                <Text style={styles.btnText}>Open in App / Browser</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.mainBtn, { backgroundColor: colors.tint }]}
                onPress={() => setIsEditing(true)}
              >
                <Text style={styles.btnText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.deleteBtn, { borderColor: "#ff4444" }]}
                onPress={handleDelete}
              >
                <Text style={styles.deleteText}>Delete Link</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
      <AdBanner />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cover: {
    width: "100%",
    height: 240,
  },
  content: {
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  url: {
    fontSize: 14,
    marginBottom: 30,
    textDecorationLine: "underline",
  },
  actions: {
    gap: 16,
    marginTop: "auto",
    marginBottom: 40,
  },
  mainBtn: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  deleteBtn: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  deleteText: {
    color: "#ff4444",
    fontSize: 16,
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
    marginBottom: 20,
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
