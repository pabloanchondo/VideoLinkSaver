// import { LinkPreview } from "@flyerhq/react-native-link-preview";
import { Colors } from "@/constants/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useColorScheme } from "../hooks/useColorScheme";
import { VideoLink } from "../types";
import { VideoCard } from "./VideoCard";

interface VideoListProps {
  videos: VideoLink[];
}

export const VideoList = ({ videos }: VideoListProps) => {
  const [filteredVideos, setFilteredVideos] = useState<VideoLink[]>(videos);
  const [search, setSearch] = useState("");
  const colors = Colors[useColorScheme()];

  const { t } = useTranslation("videos");

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

  if (filteredVideos.length === 0) {
    return (
      <View
        style={{
          padding: 16,
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <MaterialIcons name="video-library" size={80} color={colors.tint} />
        <Text
          className="text-2xl font-bold mt-4 text-center"
          style={{ color: colors.text }}
        >
          {t("noVideosCat")}
        </Text>
      </View>
    );
  }

  return (
    <View style={{ paddingBottom: 16 }}>
      <FlatList
        data={filteredVideos}
        renderItem={({ item }) => <VideoCard video={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16, marginBottom: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    padding: 16,
    paddingBottom: 0,
  },
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
