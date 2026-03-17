import AdBanner from "@/components/Banner";
import { CategoryFolderCard } from "@/src/components/CategoryFolderCard";
import { IconSymbol } from "@/src/components/ui/IconSymbol";
import Colors from "@/src/constants/Colors";
import { useStore } from "@/src/store/useStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CategoriesScreen() {
  const colors = Colors["light"];
  const { categories, addCategory, removeCategory } = useStore();
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    await addCategory({
      id: Date.now().toString(),
      name: newCategoryName.trim(),
      parentId: null,
      createdAt: Date.now(),
    });
    setNewCategoryName("");
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Category",
      "Are you sure? Videos in this category will become unassigned.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => removeCategory(id),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#F3F4F6" }]}>
      <AdBanner />
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Categories
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          placeholder="New folder name..."
          placeholderTextColor={colors.icon}
          value={newCategoryName}
          onChangeText={setNewCategoryName}
          onSubmitEditing={handleAddCategory}
        />
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: colors.tint }]}
          onPress={handleAddCategory}
        >
          <IconSymbol name="plus.circle.fill" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {categories.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.icon }]}>
            No categories yet.
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={categories}
            renderItem={({ item }) => (
              <View
                key={item.id}
                style={{
                  marginHorizontal: 20,
                  marginBottom: 8,
                  position: "relative",
                }}
              >
                <CategoryFolderCard name={item.name} onPress={() => {}} />
                <TouchableOpacity
                  onPress={() => handleDelete(item.id)}
                  style={{ position: "absolute", right: 18, top: 18 }}
                >
                  {item.id !== "uncategorized" && (
                    <Ionicons name="trash" size={20} color="#EF4444" />
                  )}
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
          />
          {/* {categories.map((item) => (
            <View
              key={item.id}
              style={{ marginHorizontal: 20, marginBottom: 8 }}
            >
              <CategoryFolderCard name={item.name} onPress={() => {}} />
              <TouchableOpacity
                onPress={() => handleDelete(item.id)}
                style={{ position: "absolute", right: 8, top: 8 }}
              >
                <IconSymbol name="trash.fill" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ))} */}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  addBtn: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  listContent: {
    paddingHorizontal: 20,
  },
  emptyContainer: {
    alignItems: "center",
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 16,
  },
});
