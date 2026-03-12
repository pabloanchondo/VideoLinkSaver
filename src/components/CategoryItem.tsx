import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../constants/Colors";
import { Category } from "../types";
import { IconSymbol } from "./ui/IconSymbol";

interface Props {
  category: Category;
  onPress?: () => void;
  onDelete?: () => void;
}

export function CategoryItem({ category, onPress, onDelete }: Props) {
  const colors = Colors["light"];

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.left}>
        <IconSymbol name="folder.fill" size={24} color={colors.tint} />
        <Text style={[styles.title, { color: colors.text }]}>
          {category.name}
        </Text>
      </View>
      {onDelete && (
        <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
  },
  deleteBtn: {
    padding: 8,
  },
  deleteText: {
    color: "#ff4444",
    fontSize: 14,
  },
});
