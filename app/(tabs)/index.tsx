import AdBanner from "@/components/Banner";
import { Colors } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { CategoryList } from "@/src/components/CategoryList";
import { useColorScheme } from "@/src/hooks/useColorScheme";
import { useSharedIntent } from "@/src/services/shareIntent";
import { useStore } from "@/src/store/useStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const colors = Colors[useColorScheme()];
  const { categories, isInitialized, init } = useStore();
  const { sharedUrl, clearSharedUrl } = useSharedIntent();

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

  const handleSelectCategory = (category: any) => {
    router.push({ pathname: "/category", params: { id: category.id } });
  };

  return (
    <>
      <View style={{ flex: 1 }}>
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
                  fontSize: 35,
                  fontWeight: "bold",
                  color: useThemeColor({}, "text"),
                }}
              >
                {tv("savedVideos")}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => router.push("/add")}
              style={{
                padding: 6,
                borderRadius: 9999,
                experimental_backgroundImage:
                  "linear-gradient(to right bottom, #2088ff, #009df0, #00b4df)",
              }}
            >
              <Ionicons name="add-outline" size={35} color={"white"} />
            </TouchableOpacity>
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
