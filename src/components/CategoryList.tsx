import React from 'react';
import { CategoryFolderCard } from './CategoryFolderCard';
import { Category } from '../types';
import { FlatList, View } from 'react-native';

interface CategoryListProps {
  categories: Category[];
  onSelect: (category: Category) => void;
}

export const CategoryList = ({ categories, onSelect }: CategoryListProps) => (
  <FlatList
    data={categories}
    renderItem={({ item: t }) => (
      <CategoryFolderCard name={t.name} onPress={() => onSelect(t)} />
    )}
    keyExtractor={item => item.id.toString()}
    contentContainerStyle={{ padding: 16 }}
    showsVerticalScrollIndicator={false}
  />
);
