import { IconSymbol } from "@/src/components/ui/IconSymbol";
import Colors from "@/src/constants/Colors";
import { useColorScheme } from "@/src/hooks/useColorScheme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function SettingsScreen() {
  const theme = useColorScheme();
  const colors = Colors[theme];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Settings
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.icon }]}>
            About
          </Text>
          <View
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.row}>
              <IconSymbol
                name="play.rectangle.fill"
                size={24}
                color={colors.tint}
              />
              <View style={styles.rowText}>
                <Text style={[styles.rowTitle, { color: colors.text }]}>
                  Video Link Saver
                </Text>
                <Text style={{ color: colors.icon }}>Version 1.0.0</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Minimal stub for scrollview in this screen
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20 },
  headerTitle: { fontSize: 28, fontWeight: "bold" },
  content: { paddingHorizontal: 20 },
  section: { marginBottom: 30 },
  sectionTitle: {
    textTransform: "uppercase",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    marginLeft: 12,
  },
  card: { borderRadius: 12, borderWidth: 1, padding: 16 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowText: { flex: 1, marginLeft: 12 },
  rowTitle: { fontSize: 16, fontWeight: "500", marginBottom: 2 },
});
