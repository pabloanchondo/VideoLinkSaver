import Colors from "@/src/constants/Colors";
import {
  getPreviewData
} from "@flyerhq/react-native-link-preview";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  url: string;
};

export default function LinkPreviewCard({ url }: Props) {
  const [preview, setPreview] = useState<any>(null);

  const colors = Colors["light"];

  useEffect(() => {
    const loadPreview = async () => {
      try {
        const data = await getPreviewData(url);
        console.log(JSON.stringify(data, null, 5));
        const imageUrl = await getVideoThumbnail(url);

        setPreview({ ...data, imageUrl });
      } catch (err) {
        console.log("Preview error", err);
      }
    };

    loadPreview();
  }, [url]);

  const getVideoThumbnail = async (url: string) => {
    try {
      // YOUTUBE
      if (url.includes("youtube.com") || url.includes("youtu.be")) {
        const idMatch =
          url.match(/v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/);

        const id = idMatch ? idMatch[1] : null;

        if (id) {
          return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
        }
      }

      // TIKTOK
      if (url.includes("tiktok.com")) {
        const response = await fetch(
          `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`,
        );
        const data = await response.json();
        return data.thumbnail_url;
      }

      // INSTAGRAM
      if (url.includes("instagram.com")) {
        return getInstagramThumbnail(url) || null;
      }

      // FACEBOOK
      if (url.includes("facebook.com")) {
        const response = await fetch(
          `https://graph.facebook.com/v18.0/oembed_post?url=${encodeURIComponent(
            url,
          )}&omitscript=true`,
        );

        const data = await response.json();

        return data.thumbnail_url;
      }

      // VIMEO
      if (url.includes("vimeo.com")) {
        const response = await fetch(
          `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`,
        );

        const data = await response.json();

        return data.thumbnail_url;
      }

      return null;
    } catch (error) {
      console.log("Thumbnail error:", error);
      return null;
    }
  };

  const cleanInstagramUrl = (url: string) => {
    const match = url.match(/https:\/\/www\.instagram\.com\/p\/[^\/]+\//);
    return match ? match[0] : url;
  };

  const getInstagramThumbnail = async (url: string) => {
    try {
      const cleanUrl = url.split("?")[0];

      const res = await fetch(
        `https://api.codetabs.com/v1/proxy?quest=https://www.instagram.com/oembed?url=${encodeURIComponent(
          cleanUrl,
        )}`,
      );

      const data = await res.json();

      return data.thumbnail_url ?? null;
    } catch (error) {
      console.log("Instagram thumbnail error:", error);
      return null;
    }
  };

  if (!preview) return null;

  return (
    <>
      <View style={styles.card}>
        <View style={styles.content}>
          {preview.imageUrl && (
            <Image source={{ uri: preview.imageUrl }} style={styles.image} />
          )}

          <Text style={styles.title} numberOfLines={2}>
            {preview.title}
          </Text>

          {preview.description && (
            <Text style={styles.description} numberOfLines={2}>
              {preview.description}
            </Text>
          )}

          <Text style={styles.url}>{preview.url}</Text>

          <View className="flex flex-row justify-between mt-2">
            <TouchableOpacity
              className="flex-1 mr-1"
              style={[styles.mainBtn, { backgroundColor: colors.tint }]}
            >
              <Text style={styles.btnText}>Open Link</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 ml-1"
              style={[styles.mainBtn, { backgroundColor: colors.tint }]}
            >
              <Text style={styles.btnText}>Copy URL</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}

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
