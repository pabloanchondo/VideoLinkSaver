import AdBanner from "@/components/Banner";
import { IconSymbol } from "@/src/components/ui/IconSymbol";
import Colors from "@/src/constants/Colors";
import { useColorScheme } from "@/src/hooks/useColorScheme";
import { getDb } from "@/src/services/database";
import { useStore } from "@/src/store/useStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import { StorageAccessFramework } from "expo-file-system/legacy";

import * as Application from "expo-application";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SettingsScreen() {
  const colors = Colors[useColorScheme()];
  let theme = useColorScheme();

  const { init, close, clean, loadCategories, loadVideos } = useStore();

  const [isLoading, setIsLoading] = useState(false);

  const backupDatabase = async () => {
    try {
      setIsLoading(true);
      const db = getDb();

      const categories = await db.getAllAsync("SELECT * FROM categories");
      const videos = await db.getAllAsync("SELECT * FROM videos");

      const backup = {
        categories,
        videos,
        createdAt: Date.now(),
      };

      const json = JSON.stringify(backup);

      const permission =
        await StorageAccessFramework.requestDirectoryPermissionsAsync();

      if (!permission.granted) return;

      const uri = await StorageAccessFramework.createFileAsync(
        permission.directoryUri,
        "myvideos-backup.json",
        "application/json",
      );

      await StorageAccessFramework.writeAsStringAsync(uri, json);

      Alert.alert("Success", "Database backup created successfully.");

      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const restoreDatabase = async () => {
    try {
      setIsLoading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];

      const json = await FileSystem.readAsStringAsync(file.uri);
      const data = JSON.parse(json);

      const db = getDb();

      await db.execAsync("BEGIN");

      await db.execAsync("DELETE FROM videos");
      await db.execAsync("DELETE FROM categories");

      for (const c of data.categories) {
        await db.runAsync(
          "INSERT INTO categories (id,name,parentId,createdAt) VALUES (?,?,?,?)",
          c.id,
          c.name,
          c.parentId,
          c.createdAt,
        );
      }

      for (const v of data.videos) {
        await db.runAsync(
          "INSERT INTO videos (id,url,title,thumbnailUrl,platform,categoryId,createdAt) VALUES (?,?,?,?,?,?,?)",
          v.id,
          v.url,
          v.title,
          v.thumbnailUrl,
          v.platform,
          v.categoryId,
          v.createdAt,
        );
      }

      await db.execAsync("COMMIT");

      await loadCategories();
      await loadVideos();

      Alert.alert("Success", "Database restored successfully.");

      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <ActivityIndicator size="large" color={colors.tint} style={{ flex: 1 }} />
    );
  }

  return (
    <SafeAreaView style={[styles.container]}>
      <AdBanner />

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
                <Text style={{ color: colors.icon }}>
                  Version {Application.nativeApplicationVersion}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.icon }]}>
            Backup
          </Text>
          <TouchableOpacity
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
            onPress={backupDatabase}
          >
            <View style={styles.row}>
              <Ionicons name="download-outline" size={24} color={colors.tint} />
              <View style={styles.rowText}>
                <Text style={[styles.rowTitle, { color: colors.text }]}>
                  Backup
                </Text>
                <Text style={{ color: colors.icon }}>
                  Download a backup of your data
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={restoreDatabase}
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.row}>
              <Ionicons name="refresh-outline" size={24} color={colors.tint} />

              <View style={styles.rowText}>
                <Text style={[styles.rowTitle, { color: colors.text }]}>
                  Restore
                </Text>
                <Text style={{ color: colors.icon }}>
                  Restore a backup of your data
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.icon }]}>
            Theme
          </Text>
          <View
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.row}>
              <IconSymbol
                name="paintbrush.fill"
                size={24}
                color={colors.tint}
              />
              <View style={styles.rowText}>
                <Text style={[styles.rowTitle, { color: colors.text }]}>
                  Current theme: {theme.toUpperCase()}
                </Text>
                <Text style={{ color: colors.icon }}>
                  Theme is determined by system settings
                </Text>
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
  card: { borderRadius: 12, borderWidth: 1, padding: 16, marginTop: 8 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowText: { flex: 1, marginLeft: 12 },
  rowTitle: { fontSize: 16, fontWeight: "500", marginBottom: 2 },
});
