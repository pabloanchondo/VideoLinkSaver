import { api } from "@/api/api";
import AdBanner from "@/components/Banner";
import { Modal } from "@/components/ui/Modal";
import UpdateContent from "@/components/UpdateContent";
import { Colors } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { iappVersionResponse } from "@/interfaces/video.interfaces";
import { CategoryList } from "@/src/components/CategoryList";
import { IconSymbol } from "@/src/components/ui/IconSymbol";
import { useColorScheme } from "@/src/hooks/useColorScheme";
import { useSharedIntent } from "@/src/services/shareIntent";
import { useStore } from "@/src/store/useStore";
import * as Application from "expo-application";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const colors = Colors[useColorScheme()];
  const { categories, isInitialized, init } = useStore();
  const { sharedUrl, clearSharedUrl } = useSharedIntent();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newVersionInfo, setNewVersionInfo] =
    useState<iappVersionResponse | null>(null);

  const { t: tv } = useTranslation("videos");
  const { t: tcom } = useTranslation("common");

  useEffect(() => {
    if (!isInitialized) {
      init();
    }
  }, [isInitialized]);

  useEffect(() => {
    if (sharedUrl) {
      router.push({ pathname: "/add", params: { sharedUrl } });
      clearSharedUrl();
    }
  }, [sharedUrl]);

  useEffect(() => {
    isLastVersion();
  }, []);

  const isLastVersion = async () => {
    try {
      const { data } = await api.get<iappVersionResponse>(
        "http://link2clip.eaproma.com/appVersion.json",
      );

      const currentVersion = getAppVersion();

      console.log(currentVersion.version, data.version);

      if (data.version !== currentVersion.version) {
        setNewVersionInfo(data);
        setIsModalVisible(true);
      }
    } catch (e) {
      console.log("Error checking app version", e);
    }
  };

  const getAppVersion = () => {
    return {
      version: Application.nativeApplicationVersion,
      build: Application.nativeBuildVersion,
    };
  };

  const handleSelectCategory = (category: any) => {
    router.push({ pathname: "/category", params: { id: category.id } });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AdBanner />

      {/* <Modal isOpen={true}> */}
      <Modal isOpen={isModalVisible}>
        <View
          style={{
            backgroundColor: colors.card,
            padding: 25,
            borderRadius: 8,
            width: "85%",
          }}
        >
          <UpdateContent
            version={newVersionInfo?.version || "1.0.0"}
            message={tcom("modalMessage")}
            onUpdate={() => {
              // Open app store link
              Linking.openURL(
                "https://play.google.com/store/apps/details?id=com.anchondopablo.videos",
              );
            }}
            onLater={() => setIsModalVisible(false)}
          />
        </View>
      </Modal>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingTop: 10,
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            color: useThemeColor({}, "text"),
          }}
        >
          {tv("savedVideos")}
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/add")}
          style={{ padding: 8 }}
        >
          <IconSymbol
            name="plus.circle.fill"
            size={28}
            color={useThemeColor({}, "tint")}
          />
        </TouchableOpacity>
      </View>

      <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
        <Text className="text-sm text-slate-300">
          {tcom("version")}: {Application.nativeApplicationVersion}
        </Text>
      </View>

      <CategoryList categories={categories} onSelect={handleSelectCategory} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
  },
  addButton: {
    padding: 8,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
