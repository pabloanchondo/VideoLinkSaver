import AdBanner from "@/components/Banner";
import { PlatformIcon } from "@/src/components/PlatformIcon";
import Colors from "@/src/constants/Colors";
import { useColorScheme } from "@/src/hooks/useColorScheme";
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
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function VideoDetailScreen() {
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
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

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this: ${video.url}`,
      });
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        marginBottom: 60,
        position: "relative",
        minHeight: "100%",
        backgroundColor: colors.background,
      }}
      contentContainerStyle={{ flexGrow: 1 }}
    >
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
          <View>
            <Text style={[styles.title, { color: colors.text }]}>
              {video.title}
            </Text>

            <Text
              className="text-md"
              style={{ color: colors.text, marginBottom: 8 }}
            >
              {new Date(video.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </Text>

            <View className="flex-row items-center mb-1 mt-3">
              <TouchableOpacity
                className=" rounded-xl px-5 py-3 flex-row items-center"
                style={{
                  backgroundColor:
                    colorScheme === "dark" ? Colors.dark.card : "#E2E8F0",
                  borderColor: colors.border,
                  borderWidth: 1,
                }}
                onPress={handleOpenLink}
              >
                <PlatformIcon platform={video.platform} size={25} />
                <Text className="text-md" style={{ color: colors.text }}>
                  View on{" "}
                  {video.platform.charAt(0).toUpperCase() +
                    video.platform.slice(1)}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className=" rounded-xl px-5 py-3 flex-row items-center ml-4"
                style={{
                  backgroundColor:
                    colorScheme === "dark" ? Colors.dark.card : "#E2E8F0",
                  borderColor: colors.border,
                  borderWidth: 1,
                }}
                onPress={() => router.back()}
              >
                <Ionicons
                  name="arrow-back-outline"
                  size={20}
                  color={colors.text}
                  style={{ bottom: 1, left: 1, marginRight: 4 }}
                />

                <Text className="text-md" style={{ color: colors.text }}>
                  Back
                </Text>
              </TouchableOpacity>
            </View>

            {/* <TouchableOpacity onPress={handleCopyLink}>
              <Text style={[styles.url, { color: colors.tint }]}>
                {video.url}
              </Text>
            </TouchableOpacity> */}

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 12,
                marginTop: 20,
              }}
            >
              <TouchableOpacity
                onPress={handleCopyLink}
                style={[
                  styles.btnAction,
                  {
                    borderColor: colors.tint,
                    backgroundColor: colors.card,
                  },
                ]}
              >
                <Ionicons
                  name="copy-outline"
                  size={24}
                  color={colors.tint}
                  style={{ bottom: 1, left: 1 }}
                />
                <Text style={[styles.btnText, { color: colors.text }]}>
                  Copy
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setIsEditing(true)}
                style={[
                  styles.btnAction,
                  {
                    borderColor: colors.tint,
                    backgroundColor: colors.card,
                  },
                ]}
              >
                <Ionicons
                  name="sync-outline"
                  size={24}
                  color={colors.tint}
                  style={{ bottom: 1, left: 1 }}
                />
                <Text style={[styles.btnText, { color: colors.text }]}>
                  Edit
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 12,
                marginTop: 12,
              }}
            >
              <TouchableOpacity
                onPress={handleDelete}
                style={[
                  styles.btnAction,
                  {
                    borderColor: "#ff4444",
                    backgroundColor: colors.card,
                  },
                ]}
              >
                <Ionicons
                  name="trash-outline"
                  size={24}
                  color="#ff4444"
                  style={{ bottom: 1, left: 1 }}
                />
                <Text style={[styles.btnText, { color: colors.text }]}>
                  Delete
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleShare}
                style={[
                  styles.btnAction,
                  { borderColor: colors.tint, backgroundColor: colors.card },
                ]}
              >
                <Ionicons
                  name="share-social-outline"
                  size={24}
                  color={colors.tint}
                  style={{ bottom: 1, left: 1 }}
                />
                <Text style={[styles.btnText, { color: colors.text }]}>
                  Share
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
      <View style={{ height: 80 }}></View>
      <View
        style={{
          width: "100%",
          position: "absolute",
          bottom: 0,
          paddingBottom: 10,
        }}
      >
        <AdBanner />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  roundedBtn: {
    borderRadius: 50,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
  },
  cover: {
    width: "100%",
    height: 360,
  },
  content: {
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
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
    color: "#333",
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
  btnAction: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    flexGrow: 1,
    flexBasis: "auto",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    marginVertical: 8,
  },
});
