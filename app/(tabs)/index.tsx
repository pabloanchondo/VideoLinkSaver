import AdBanner from "@/components/Banner";
import { Colors } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { CategoryList } from "@/src/components/CategoryList";
import { useColorScheme } from "@/src/hooks/useColorScheme";
import { useSharedIntent } from "@/src/services/shareIntent";
import { useStore } from "@/src/store/useStore";
import { useActionSheet } from "@expo/react-native-action-sheet";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { setItemAsync } from "expo-secure-store";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const colors = Colors[useColorScheme()];
  const { categories, isInitialized, init, sortBy, setSortBy } = useStore();
  const { sharedUrl, clearSharedUrl } = useSharedIntent();

  const { showActionSheetWithOptions } = useActionSheet();

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

  const handleSelectCategory = (category: any) => {
    router.push({ pathname: "/category", params: { id: category.id } });
  };

  return (
    <>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
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
