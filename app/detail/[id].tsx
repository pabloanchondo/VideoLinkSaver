import Colors from "@/src/constants/Colors";
import { useColorScheme } from "@/src/hooks/useColorScheme";
import { useStore } from "@/src/store/useStore";
import * as Linking from "expo-linking";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VideoDetailScreen() {
  const { id } = useLocalSearchParams();
  const theme = useColorScheme();
  const colors = Colors[theme];
  const router = useRouter();

  const { videos, removeVideo } = useStore();
  const video = videos.find((v) => v.id === id);

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

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {video.thumbnailUrl && (
        <Image
          source={{ uri: video.thumbnailUrl }}
          style={styles.cover}
          resizeMode="cover"
        />
      )}

      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          {video.title}
        </Text>
        <Text style={[styles.url, { color: colors.tint }]} numberOfLines={2}>
          {video.url}
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.mainBtn, { backgroundColor: colors.tint }]}
            onPress={handleOpenLink}
          >
            <Text style={styles.btnText}>Open in App / Browser</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.deleteBtn, { borderColor: "#ff4444" }]}
            onPress={handleDelete}
          >
            <Text style={styles.deleteText}>Delete Link</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
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
});
