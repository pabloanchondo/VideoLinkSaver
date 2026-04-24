import { gradients } from "@/constants/theme";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { useStore } from "../store/useStore";
import { Category } from "../types";
import { CategoryFolderCard } from "./CategoryFolderCard";

interface CategoryListProps {
  categories: Category[];
  onSelect: (category: Category) => void;
}

export const CategoryList = ({ categories, onSelect }: CategoryListProps) => {
  const [sortedCategories, setSortedCategories] = useState<Category[]>([]);

  const { sortBy } = useStore();

  useEffect(() => {
    const sorted = doSortedCategories(sortBy);
    setSortedCategories(sorted);
  }, [sortBy, categories]);

  const doSortedCategories = (type: string) => {
    if (type === "color") {
      return [...categories].sort((a, b) => {
        const colorCompare = (a.color || "").localeCompare(b.color || "");
        if (colorCompare !== 0) return colorCompare;
        return a.name.localeCompare(b.name);
      });
    }

    return [...categories].sort((a, b) => a.name.localeCompare(b.name));
  };

  return (
    <FlatList
      numColumns={2}
      data={sortedCategories}
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
};
