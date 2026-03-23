import Colors from "@/src/constants/Colors";
import { useColorScheme } from "@/src/hooks/useColorScheme";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  version: string;
  message?: string;
  forceUpdate?: boolean;
  onUpdate: () => void;
  onLater?: () => void;
};

const UpdateContent: React.FC<Props> = ({
  version,
  message,
  forceUpdate,
  onUpdate,
  onLater,
}) => {
  const colors = Colors[useColorScheme()];

  return (
    <View style={styles.container}>
      {/* 🔥 Icon / Header */}
      <Text style={[styles.emoji, { color: colors.text }]}>🚀</Text>

      {/* 🧠 Title */}
      <Text style={[styles.title, { color: colors.text }]}>
        Update Available
      </Text>

      {/* 📦 Version */}
      <Text style={[styles.version, { color: colors.text }]}>
        Version {version} is now available
      </Text>

      {/* 📝 Message */}
      {message ? (
        <Text style={[styles.message, { color: colors.text }]}>{message}</Text>
      ) : (
        <Text style={[styles.message, { color: colors.text }]}>
          We've made improvements and added new features to enhance your
          experience.
        </Text>
      )}

      {/* 🎯 Actions */}
      <View style={styles.actions}>
        {!forceUpdate && (
          <TouchableOpacity
            style={[styles.laterBtn, { backgroundColor: colors.card }]}
            onPress={onLater}
          >
            <Text style={[styles.laterText, { color: colors.text }]}>
              Later
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.updateBtn, { backgroundColor: colors.tint }]}
          onPress={onUpdate}
        >
          <Text style={styles.updateText}>Update Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: "center",
  },
  emoji: {
    fontSize: 42,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 6,
    color: "#111",
  },
  version: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  message: {
    fontSize: 14,
    textAlign: "center",
    color: "#444",
    marginBottom: 24,
    lineHeight: 20,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  laterBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: "#E5E5E5",
  },
  laterText: {
    color: "#333",
    fontWeight: "500",
  },
  updateBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: "#4F46E5",
  },
  updateText: {
    color: "#FFF",
    fontWeight: "600",
  },
});

export default UpdateContent;
