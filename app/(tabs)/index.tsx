import { CategoryList } from "@/src/components/CategoryList";
import { IconSymbol } from "@/src/components/ui/IconSymbol";
import { useColorScheme } from "@/src/hooks/useColorScheme";
import { useSharedIntent } from "@/src/services/shareIntent";
import { useStore } from "@/src/store/useStore";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const theme = useColorScheme();
  const router = useRouter();
  const { categories, isInitialized, init } = useStore();
  const { sharedUrl, clearSharedUrl } = useSharedIntent();

  React.useEffect(() => {
    if (!isInitialized) {
      init();
    }
  }, [isInitialized]);

  React.useEffect(() => {
    if (sharedUrl) {
      router.push({ pathname: "/add", params: { sharedUrl } });
      clearSharedUrl();
    }
  }, [sharedUrl]);

  const handleSelectCategory = (category: any) => {
    router.push({ pathname: "/category", params: { id: category.id } });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F3F4F6" }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingTop: 10,
          paddingBottom: 20,
        }}
      >
        <Text style={{ fontSize: 28, fontWeight: "bold", color: "#1F2937" }}>
          My Saved Videos
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/add")}
          style={{ padding: 8 }}
        >
          <IconSymbol name="plus.circle.fill" size={28} color="#6366F1" />
        </TouchableOpacity>
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
