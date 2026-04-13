import AdBanner from "@/components/Banner";
import { Modal } from "@/components/ui/Modal";
import { CategoryFolderCard } from "@/src/components/CategoryFolderCard";
import { IconSymbol } from "@/src/components/ui/IconSymbol";
import Colors from "@/src/constants/Colors";
import { useColorScheme } from "@/src/hooks/useColorScheme";
import { useStore } from "@/src/store/useStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
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
  const colors = Colors[useColorScheme()];
  const { categories, addCategory, removeCategory, updateCategoryName } =
    useStore();
  const [newCategoryName, setNewCategoryName] = useState("");

  const [updateForm, setUpdateForm] = useState({ id: "", name: "" });
  const [isVisible, setIsVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { t: tc } = useTranslation("categories");
  const { t: tcom } = useTranslation("common");

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
    Alert.alert(tc("deleteCategory"), tc("confirmDelete"), [
      { text: tcom("cancel"), style: "cancel" },
      {
        text: tcom("delete"),
        style: "destructive",
        onPress: () => removeCategory(id),
      },
    ]);
  };

  const handleUpdateName = async () => {
    if (
      !updateForm.name.trim() ||
      updateForm.id === "uncategorized" ||
      updateForm.id == ""
    )
      return;
    setIsSaving(true);
    await updateCategoryName(updateForm.id, updateForm.name.trim());
    setUpdateForm({ id: "", name: "" });
    setIsVisible(false);
    setIsSaving(false);
  };

  const handleOpenModal = (id: string, name: string) => {
    if (id === "uncategorized") return;
    setUpdateForm({ id, name });
    setIsVisible(true);
  };

  return (
    <SafeAreaView style={[styles.container]}>
      <AdBanner />
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {tc("myCategories")}
        </Text>
      </View>

      <Modal isOpen={isVisible} withInput>
        <View
          style={{
            backgroundColor: colors.card,
            padding: 25,
            borderRadius: 8,
            width: "85%",
          }}
        >
          <Text className="text-xl mb-5" style={{ color: colors.text }}>
            {tc("updateCategory")}
          </Text>
          <View>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: 16,
                color: colors.text,
                backgroundColor: colors.card,
              }}
              placeholder={tc("newCategoryPlaceholder")}
              placeholderTextColor={colors.icon}
              value={updateForm.name}
              onChangeText={(text) =>
                setUpdateForm({ ...updateForm, name: text })
              }
            />
          </View>
          <View className="flex flex-row gap-2 justify-between items-center align-middle">
            <TouchableOpacity
              style={[
                styles.saveBtn,
                {
                  backgroundColor: colors.tint,
                  flex: 1,
                  opacity: isSaving ? 0.7 : 1,
                  marginRight: 1,
                },
              ]}
              onPress={handleUpdateName}
              disabled={isSaving}
            >
              <Text style={styles.saveText}>
                <Ionicons name="save" size={16} color="#fff" /> {tcom("save")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.saveBtn,
                {
                  borderWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                  flex: 1,
                  opacity: isSaving ? 0.7 : 1,
                  marginRight: 1,
                },
              ]}
              onPress={() => setIsVisible(false)}
              disabled={isSaving}
            >
              <Text style={[styles.saveText, { color: colors.text }]}>
                <Ionicons name="close" size={16} color={colors.text} />{" "}
                {tcom("close")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
          placeholder={tc("newCategoryPlaceholder")}
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
            {tc("noCategories")}
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
                  onPress={() => handleOpenModal(item.id, item.name)}
                  style={{ position: "absolute", right: 42, top: 18 }}
                >
                  {item.id !== "uncategorized" && (
                    <Ionicons
                      name="create-outline"
                      size={20}
                      color={colors.tint}
                    />
                  )}
                </TouchableOpacity>

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
  saveBtn: {
    paddingVertical: 16,
    marginHorizontal: 2,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  saveText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
