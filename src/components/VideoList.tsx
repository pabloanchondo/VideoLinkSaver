import { LinkPreview } from "@flyerhq/react-native-link-preview";
import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { VideoLink } from "../types";

interface VideoListProps {
  videos: VideoLink[];
}

export const VideoList = ({ videos }: VideoListProps) => (
  <FlatList
    data={videos}
    renderItem={({ item }) => (
      <LinkPreview text={item.url} containerStyle={styles.card} />
      // <LinkPreviewCard url={item.url} />
    )}
    keyExtractor={(item) => item.id.toString()}
    contentContainerStyle={{ padding: 16 }}
    showsVerticalScrollIndicator={false}
  />
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    marginVertical: 8,
  },

  image: {
    width: "100%",
    height: 180,
  },

  content: {
    padding: 14,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    marginBottom: 6,
  },

  description: {
    fontSize: 14,
    color: "#666",
  },

  url: {
    fontSize: 12,
    color: "#999",
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
});
