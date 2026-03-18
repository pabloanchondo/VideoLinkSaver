// import { LinkPreview } from "@flyerhq/react-native-link-preview";
import { useThemeColor } from "@/hooks/use-theme-color";
import React, { useState } from "react";
import { FlatList, StyleSheet, TextInput, View } from "react-native";
import { VideoLink } from "../types";
import { VideoCard } from "./VideoCard";

interface VideoListProps {
  videos: VideoLink[];
}

export const VideoList = ({ videos }: VideoListProps) => {
  const [filteredVideos, setFilteredVideos] = useState<VideoLink[]>(videos);
  const [search, setSearch] = useState("");

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

  return (
    <View style={{ paddingBottom: 16, marginBottom: 80 }}>
      <View style={styles.searchContainer}>
        <TextInput
          value={search}
          onChangeText={handleSearch}
          placeholder="Filtrar por título"
          style={{
            padding: 10,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#ccc",
            marginBottom: 12,
            width: "100%",
            color: useThemeColor({}, "text"),
          }}
        />
      </View>
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
