import { Link } from "expo-router";
import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
// NativeWind uses className prop, not tw function
import { useThemeColor } from "@/hooks/use-theme-color";
import { VideoLink } from "../types";
import { PlatformIcon } from "./PlatformIcon";
import { ThumbnailImage } from "./ThumbnailImage";

interface Props {
  video: VideoLink;
}

export const VideoCard = memo(({ video }: Props) => {
  return (
    <Link
      href={{ pathname: "/detail/[id]", params: { id: video.id } }}
      className="mb-4"
    >
      <View
        className=" rounded-xl shadow-md  flex-row items-center p-1"
        style={{ backgroundColor: useThemeColor({}, "card") }}
      >
        <ThumbnailImage
          uri={video.thumbnailUrl || undefined}
          style={{ width: 110, height: 110 }}
        />
        <View className="flex-1 ml-4">
          <Text
            className="text-base font-semibold mb-1"
            style={{ color: useThemeColor({}, "text") }}
            numberOfLines={2}
          >
            {video.title || "Unknown Title"}
          </Text>
          <View className="flex-row items-center mb-1">
            <PlatformIcon platform={video.platform} size={18} />
            <Text
              className="text-xs"
              style={{ color: useThemeColor({}, "text") }}
            >
              {video.platform.charAt(0).toUpperCase() + video.platform.slice(1)}
            </Text>
          </View>
          <View>
            <Text
              className="text-xs text-slate-400"
              style={{ color: useThemeColor({}, "text") }}
            >
              {new Date(video.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </Text>
          </View>
        </View>
      </View>
    </Link>
  );
});

const styles = StyleSheet.create({
  cardLink: {
    marginBottom: 16,
  },
  container: {
    flexDirection: "row",
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  thumbnail: {
    width: 120,
    height: 90,
  },
  thumbnailPlaceholder: {
    width: 120,
    height: 90,
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: "row",
    marginTop: 8,
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  platformBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  platformText: {
    fontSize: 12,
    textTransform: "capitalize",
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "500",
  },
});
