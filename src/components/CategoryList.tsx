import { gradients } from "@/constants/theme";
import React from "react";
import { FlatList } from "react-native";
import { Category } from "../types";
import { CategoryFolderCard } from "./CategoryFolderCard";

interface CategoryListProps {
  categories: Category[];
  onSelect: (category: Category) => void;
}

export const CategoryList = ({ categories, onSelect }: CategoryListProps) => (
  <FlatList
    numColumns={2}
    data={categories.sort((a, b) => a.name.localeCompare(b.name))}
    renderItem={({ item: t }) => (
      <CategoryFolderCard
        name={t.name}
        color={t.color as keyof typeof gradients}
        onPress={() => onSelect(t)}
      />
    )}
    keyExtractor={(item) => item.id.toString()}
    contentContainerStyle={{ padding: 16 }}
    showsVerticalScrollIndicator={false}
  />
);
