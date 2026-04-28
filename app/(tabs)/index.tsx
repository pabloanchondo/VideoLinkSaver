import { api } from "@/api/api";
import AdBanner from "@/components/Banner";
import { Modal } from "@/components/ui/Modal";
import UpdateContent from "@/components/UpdateContent";
import { Colors } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { iappVersionResponse } from "@/interfaces/video.interfaces";
import { CategoryList } from "@/src/components/CategoryList";
import { useColorScheme } from "@/src/hooks/useColorScheme";
import { useSharedIntent } from "@/src/services/shareIntent";
import { useStore } from "@/src/store/useStore";
import { useActionSheet } from "@expo/react-native-action-sheet";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Application from "expo-application";
import { useRouter } from "expo-router";
import { getItemAsync, setItemAsync } from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const colors = Colors[useColorScheme()];

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newVersionInfo, setNewVersionInfo] =
    useState<iappVersionResponse | null>(null);

  const { categories, isInitialized, init, sortBy, setSortBy } = useStore();
  const { sharedUrl, clearSharedUrl } = useSharedIntent();

  const { showActionSheetWithOptions } = useActionSheet();

  const { bottom } = useSafeAreaInsets();

  const { t: tv } = useTranslation("videos");
  const { t: tcom } = useTranslation("common");
  const { t: tcat } = useTranslation("categories");

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
      //Valdiar no haber preguntado antes
      let lastAskedDateString = await getItemAsync("lastAskedDate");

      // Si se ha preguntado antes, validar que haya pasado al menos 1 día

      if (lastAskedDateString) {
        const lastAskedDate = new Date(lastAskedDateString);
        const now = new Date();
        const diffInDays =
          (now.getTime() - lastAskedDate.getTime()) / (1000 * 3600 * 24);

        if (diffInDays < 1) {
          console.log(
            "Ya se preguntó por una nueva versión hace menos de 1 día",
          );
          return;
        }
      }

      const { data } = await api.get<iappVersionResponse>(
        "http://link2clip.eaproma.com/appVersion.json",
      );

      const currentVersion = getAppVersion();

      console.log(currentVersion.version, data.version);

      if (data.version !== currentVersion.version) {
        setNewVersionInfo(data);
        setIsModalVisible(true);
      }

      // Guardar la última versión preguntada
      await setItemAsync("lastAskedDate", new Date().toISOString());
    } catch (e) {
      console.log("Error checking app version", e);
    }
  };

  const onPressSort = () => {
    const options = [
      `🔼 ${tcom("sortByTitle")}`,
      `🎨 ${tcom("sortByColor")}`,
      `❌ ${tcom("cancel")}`,
    ];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        textStyle: { color: colors.text, fontSize: 18 },
        containerStyle: {
          backgroundColor: colors.card,
          minHeight: 200,
          paddingVertical: 25,
          paddingBottom: bottom + 50,
        },
      },
      async (selectedIndex?: number) => {
        switch (selectedIndex) {
          case 0:
            await setItemAsync("sortBy", "title");
            setSortBy("title");
            break;
          case 1:
            await setItemAsync("sortBy", "color");
            setSortBy("color");
            break;
          case cancelButtonIndex:
            break;
          default:
            break;
        }
      },
    );
  };

  const onPressAdd = () => {
    const options = [
      `🎬 ${tv("addVideo")}`,
      `📁 ${tcat("addCategory")}`,
      `❌ ${tcom("cancel")}`,
    ];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        textStyle: { color: colors.text, fontSize: 18 },
        containerStyle: {
          backgroundColor: colors.card,
          minHeight: 200,
          paddingVertical: 25,
          paddingBottom: bottom + 50,
        },
      },
      (selectedIndex?: number) => {
        switch (selectedIndex) {
          case 0:
            router.push("/add");
            break;
          case 1:
            router.push("/createCategory");
            break;
          case cancelButtonIndex:
            break;
          default:
            break;
        }
      },
    );
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
    <>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
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
            backgroundColor: colors.card,
            paddingTop: 25,
            minHeight: "15%",
            paddingHorizontal: 20,
            alignContent: "center",
            justifyContent: "center",
          }}
          className="shadow-md"
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 30,
                  fontWeight: "bold",
                  color: useThemeColor({}, "text"),
                }}
              >
                {tv("savedVideos")}
              </Text>
            </View>

            <View className="flex flex-row gap-2">
              <TouchableOpacity
                onPress={onPressSort}
                style={{
                  padding: 6,
                  borderRadius: 9999,
                  experimental_backgroundImage:
                    "linear-gradient(to right bottom, #2088ff, #009df0, #00b4df)",
                }}
              >
                <MaterialIcons name="sort" size={30} color={"white"} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onPressAdd}
                style={{
                  padding: 6,
                  borderRadius: 9999,
                  experimental_backgroundImage:
                    "linear-gradient(to right bottom, #2088ff, #009df0, #00b4df)",
                }}
              >
                <Ionicons name="add-outline" size={30} color={"white"} />
              </TouchableOpacity>
            </View>
          </View>

          {/* <TextInput
            placeholder="Search..."
            style={{
              backgroundColor: colors.background,
              borderRadius: 8,
              paddingHorizontal: 16,
              paddingVertical: 14,
              marginTop: 12,
              fontSize: 16,
              color: useThemeColor({}, "text"),
            }}
          /> */}
        </View>

        <CategoryList categories={categories} onSelect={handleSelectCategory} />
      </View>
      <AdBanner />
    </>
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
