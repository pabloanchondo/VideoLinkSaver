import { api } from "@/api/api";
import AdBanner from "@/components/Banner";
import { Modal } from "@/components/ui/Modal";
import { gradients } from "@/constants/theme";
import { showToast } from "@/helpers/alert.helper";
import { getCategoryNameByi18n } from "@/helpers/category-name.helper";
import { getColorByPlatform } from "@/helpers/platformHelper";
import { APIVideoResponse } from "@/interfaces/video.interfaces";
import { CategoryFolderCard } from "@/src/components/CategoryFolderCard";
import { CategoryList } from "@/src/components/CategoryList";
import { PlatformIcon } from "@/src/components/PlatformIcon";
import Colors from "@/src/constants/Colors";
import { useColorScheme } from "@/src/hooks/useColorScheme";
import { useStore } from "@/src/store/useStore";
import { Category } from "@/src/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function VideoDetailScreen() {
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const router = useRouter();

  const { videos, removeVideo, categories, updateVideoThumbnail, updateVideo } =
    useStore();

  const video = videos.find((v) => v.id === id);

  const [userTitle, setUserTitle] = useState(video?.title || "");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    video?.categoryId || "uncategorized",
  );
  const [isSaving, setIsSaving] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const [isLoadingMeta, setIsLoadingMeta] = useState(false);

  const [hasBeenRefreshed, setHasBeenRefreshed] = useState(false);

  const [isVisibleSelect, setIsVisibleSelect] = useState(false);

  const [category, setCategory] = useState({
    name: getCategoryNameByi18n(),
    color: "blue",
  });

  useEffect(() => {
    if (video) {
      const cat = categories.find((c) => c.id === video.categoryId);
      if (cat) {
        setCategory({
          name: cat.name,
          color: cat.color as keyof typeof gradients,
        });
      }
    }
  }, [video, categories]);

  const insets = useSafeAreaInsets();

  const { t } = useTranslation("common");
  const { t: tVideos } = useTranslation("videos");
  const { t: tc } = useTranslation("categories");

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
        <Text style={{ color: colors.text }}>{tVideos("videoNotFound")}</Text>
      </View>
    );
  }

  const handleOpenLink = async () => {
    const oppened = await Linking.openURL(video.url);
    if (!oppened) {
      showToast(t("error"), t("cannotOpenUrl"), "error");
    }
  };

  const handleDelete = () => {
    Alert.alert(t("delete"), tVideos("removeVideoLink"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("delete"),
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

      await updateVideo(video.id, titleToSave, selectedCategory);

      setIsEditing(false);
    } catch (e) {
      showToast(t("error"), tVideos("failedToSaveVideo"), "error");
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
      showToast(t("error"), error.message, "error");
    }
  };

  const handleRefreshThumbnail = async () => {
    try {
      setIsLoadingMeta(true);
      const { data } = await api.post<APIVideoResponse>("metadata", {
        url: video.url,
      });
      if (data.image) {
        await updateVideoThumbnail(video.id, data.image);
      } else {
        showToast(
          tVideos("noThumbnail"),
          tVideos("couldNotRetrieveThumbnail"),
          "error",
        );
      }
    } catch (e) {
      showToast("Error", tVideos("failedToRefreshThumbnail"), "error");
    } finally {
      setIsLoadingMeta(false);
    }
  };

  const handleLoadError = () => {
    if (hasBeenRefreshed) {
      return;
    }

    setHasBeenRefreshed(true);
    handleRefreshThumbnail();
  };

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category.id);
    setCategory({
      name: category.name,
      color: category.color,
    });
    setIsVisibleSelect(false);
  };

  if (isLoadingMeta) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator
          style={{ flex: 1 }}
          size="large"
          color={colors.tint}
        />
      </View>
    );
  }

  return (
    <>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            backgroundColor: colors.background,
          }}
        >
          <View style={styles.imageContainer} className="shadow-md">
            {video.thumbnailUrl && (
              <Image
                source={{ uri: video.thumbnailUrl }}
                style={styles.cover}
                resizeMode="cover"
                onError={handleLoadError}
              />
            )}

            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.85)"]}
              style={styles.gradient}
            />

            <TouchableOpacity
              style={[styles.backBtn, { top: insets.top }]}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>

            <View style={styles.imageContent}>
              <Text style={styles.imageTitle} numberOfLines={2}>
                {video.title}
              </Text>

              <Text style={styles.imageDate}>
                {new Date(video.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </Text>
            </View>
          </View>

          <Modal isOpen={isVisibleSelect} withInput>
            <View
              style={{
                backgroundColor: colors.background,
                padding: 25,
                borderRadius: 8,
                minWidth: "99%",
                maxHeight: "60%",
              }}
            >
              <Text
                style={{
                  color: colors.text,
                  fontSize: 20,
                  fontWeight: "500",
                  marginBottom: 15,
                }}
              >
                {tc("select")}
              </Text>
              <CategoryList
                categories={categories}
                onSelect={(category: Category) => {
                  handleSelectCategory(category);
                }}
              />
            </View>
          </Modal>

          <View style={styles.content}>
            {isEditing && (
              <>
                <View
                  className="shadow-md mt-6"
                  style={{
                    backgroundColor: colors.card,
                    padding: 20,
                    borderRadius: 10,
                  }}
                >
                  <Text style={[styles.label, { color: colors.text }]}>
                    {tVideos("videoTitle")}
                  </Text>
                  <TextInput
                    placeholder={tVideos("videoTitle")}
                    placeholderTextColor={colors.icon}
                    style={{
                      backgroundColor: colors.background,
                      borderRadius: 8,
                      paddingHorizontal: 12,
                      paddingVertical: 12,
                      fontSize: 14,
                      color: colors.text,
                    }}
                    value={userTitle}
                    onChangeText={setUserTitle}
                    autoCapitalize="none"
                    keyboardType="url"
                  />

                  <Text
                    style={[
                      styles.label,
                      { color: colors.text, marginTop: 24 },
                    ]}
                  >
                    {tVideos("selectCategory")}
                  </Text>

                  <View className="flex flex-col gap-3 mt-2 justify-center items-center align-middle">
                    <Text className="text-slate-400 text-lg">
                      {tc("press")}
                    </Text>
                    <CategoryFolderCard
                      name={category.name}
                      color={category.color as keyof typeof gradients}
                      onPress={() => setIsVisibleSelect(true)}
                    />
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
                        <Ionicons name="save" size={16} color="#fff" />{" "}
                        {t("save")}
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
                      {t("cancel")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {!isEditing && (
              <View>
                <View className="flex-row items-center mb-1 mt-3">
                  <TouchableOpacity
                    className=" rounded-xl px-5 py-3 flex-row items-center"
                    style={{
                      backgroundColor: getColorByPlatform(video.platform),
                      borderColor: colors.border,
                      borderWidth: 1,
                    }}
                    onPress={handleOpenLink}
                  >
                    <PlatformIcon
                      platform={video.platform}
                      size={25}
                      color="#FFF"
                    />
                    <Text
                      className="text-md font-bold"
                      style={{ color: "#fff" }}
                    >
                      {tVideos("viewOnWeb")}{" "}
                      {video.platform.charAt(0).toUpperCase() +
                        video.platform.slice(1)}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View className="flex-row items-center mb-1 mt-3">
                  <TouchableOpacity
                    style={{
                      experimental_backgroundImage:
                        gradients[category.color as keyof typeof gradients],
                      paddingHorizontal: 2,
                      paddingVertical: 2,
                      borderRadius: 12,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                    className="rounded-xl px-5 py-3 flex-row items-center"
                  >
                    <MaterialIcons
                      name="folder"
                      size={20}
                      color="#fff"
                      style={{ left: 1, bottom: 1 }}
                    />
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      className="text-sm font-bold"
                      style={{
                        color: "white",
                        textAlign: "center",
                        marginLeft: 5,
                      }}
                    >
                      {category.name.length > 30
                        ? category.name.substring(0, 30) + "..."
                        : category.name}
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
                    gap: 8,
                    marginTop: 10,
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
                      size={35}
                      color={colors.tint}
                      style={{ bottom: 1, left: 1 }}
                    />
                    <Text style={[styles.btnText, { color: colors.text }]}>
                      {tVideos("copy")}
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
                      size={35}
                      color={colors.tint}
                      style={{ bottom: 1, left: 1 }}
                    />
                    <Text style={[styles.btnText, { color: colors.text }]}>
                      {tVideos("edit")}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 8,
                    marginTop: 5,
                  }}
                >
                  <TouchableOpacity
                    onPress={handleShare}
                    style={[
                      styles.btnAction,
                      {
                        borderColor: colors.tint,
                        backgroundColor: colors.card,
                      },
                    ]}
                  >
                    <Ionicons
                      name="share-social-outline"
                      size={35}
                      color={colors.tint}
                      style={{ bottom: 1, left: 1 }}
                    />
                    <Text style={[styles.btnText, { color: colors.text }]}>
                      {tVideos("share")}
                    </Text>
                  </TouchableOpacity>

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
                      size={35}
                      color="#ff4444"
                      style={{ bottom: 1, left: 1 }}
                    />
                    <Text style={[styles.btnText, { color: colors.text }]}>
                      {t("delete")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
      <View
        style={{
          backgroundColor: colors.background,
          paddingBottom: insets.bottom,
        }}
      >
        <AdBanner />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 200,
  },
  backBtn: {
    position: "absolute",
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    // backgroundColor: "rgba(0,0,0,0.5)",
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  imageContent: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
  },

  imageTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  imageDate: {
    color: "#ccc",
    fontSize: 12,
    marginTop: 4,
  },
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
  imageContainer: {
    position: "relative",
  },
  cover: {
    width: "100%",
    height: 360,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)", // ajusta intensidad
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
    fontSize: 14,
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
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    flexGrow: 1,
    flexBasis: "auto",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    marginVertical: 8,
  },
});
