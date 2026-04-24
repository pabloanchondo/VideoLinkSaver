import AdBanner from "@/components/Banner";
import { IconSymbol } from "@/src/components/ui/IconSymbol";
import Colors from "@/src/constants/Colors";
import { getDb } from "@/src/services/database";
import { useStore } from "@/src/store/useStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import { StorageAccessFramework } from "expo-file-system/legacy";

import * as Application from "expo-application";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SettingsScreen() {
  const { isEnrolled, isLogginEnabled, isSupported, toggleLogin } =
    useLocalAuthentication();

  const colors = Colors[useColorScheme()];

  let theme = useColorScheme();

  const { init, close, clean, loadCategories, loadVideos } = useStore();

  const [isLoading, setIsLoading] = useState(false);

  const [isVisibleUpdate, setIsVisibleUpdate] = useState(false);
  const [newVersionInfo, setNewVersionInfo] =
    useState<iappVersionResponse | null>(null);

  const { t } = useTranslation("common");
  const { t: tErrors } = useTranslation("errors");
  const { t: tSettings } = useTranslation("settings");

  useEffect(() => {
    isLastVersion();
  }, []);

  const isLastVersion = async () => {
    try {
      const { data } = await api.get<iappVersionResponse>(
        "http://link2clip.eaproma.com/appVersion.json",
      );

      const currentVersion = getAppVersion();

      console.log(data.version, currentVersion.version);

      if (data.version !== currentVersion.version) {
        setNewVersionInfo(data);
        setIsVisibleUpdate(true);
      }
    } catch (e) {
      console.log("Error checking app version", e);
    }
  };

  const handleLocalAuth = async () => {
    if (!isSupported) {
      showToast(
        tErrors("general.noSupport"),
        tErrors("settings.noSupportedBiometric"),
        "error",
      );
      return;
    }
    if (!isEnrolled) {
      showToast(
        tErrors("general.notEnrolled"),
        tErrors("settings.noEnrolledBiometric"),
        "error",
      );
      return;
    }
    const result = await toggleLogin(!isLogginEnabled);
    if (!result.success) {
      showToast(
        tErrors("general.error"),
        result.message || tErrors("settings.failedToToggleLocalAuth"),
        "error",
      );
    }
  };

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

      showToast(t("success"), tSettings("backupSuccess"), "success");

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
          "INSERT INTO categories (id,name,parentId,createdAt,color) VALUES (?,?,?,?,?)",
          c.id,
          c.name,
          c.parentId,
          c.createdAt,
          c.color ?? "blue",
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

      showToast(t("success"), tSettings("restoreSuccess"), "success");

      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const getAppVersion = () => {
    return {
      version: Application.nativeApplicationVersion,
      build: Application.nativeBuildVersion,
    };
  };

  if (isLoading) {
    return (
      <ActivityIndicator size="large" color={colors.tint} style={{ flex: 1 }} />
    );
  }

  return (
    <>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <View
          style={{
            backgroundColor: colors.card,
            paddingTop: 25,
            minHeight: "15%",
            paddingHorizontal: 20,
            alignContent: "center",
            justifyContent: "center",
          }}
          className="shadow-md"
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 30,
                  fontWeight: "bold",
                  color: useThemeColor({}, "text"),
                }}
              >
                {tSettings("title")}
              </Text>
            </View>
          </View>

          {/* <TextInput
            placeholder="Search..."
            style={{
              backgroundColor: colors.background,
              borderRadius: 8,
              paddingHorizontal: 16,
              paddingVertical: 14,
              marginTop: 12,
              fontSize: 16,
              color: useThemeColor({}, "text"),
            }}
          /> */}
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          {
            /* Update Available Section */
            isVisibleUpdate && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.icon }]}>
                  {tSettings("update")}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(
                      "https://play.google.com/store/apps/details?id=com.anchondopablo.videos",
                    )
                  }
                  style={[
                    styles.card,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.tint,
                      borderWidth: 2,
                    },
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
                        {tSettings("updateAvailable")}
                      </Text>
                      <Text style={{ color: colors.icon }}>
                        {tSettings("updateDescription")}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            )
          }

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.icon }]}>
              {tSettings("about")}
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
                    Link2Clip
                  </Text>
                  <Text style={{ color: colors.icon }}>
                    {t("version")} {Application.nativeApplicationVersion}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.icon }]}>
              {tSettings("backup")}
            </Text>
            <TouchableOpacity
              style={[
                styles.card,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={backupDatabase}
            >
              <View style={styles.row}>
                <Ionicons
                  name="download-outline"
                  size={24}
                  color={colors.tint}
                />
                <View style={styles.rowText}>
                  <Text style={[styles.rowTitle, { color: colors.text }]}>
                    {tSettings("backup")}
                  </Text>
                  <Text style={{ color: colors.icon }}>
                    {tSettings("backupDescription")}
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
                <Ionicons
                  name="refresh-outline"
                  size={24}
                  color={colors.tint}
                />

                <View style={styles.rowText}>
                  <Text style={[styles.rowTitle, { color: colors.text }]}>
                    {tSettings("restore")}
                  </Text>
                  <Text style={{ color: colors.icon }}>
                    {tSettings("restoreDescription")}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.icon }]}>
              {tSettings("theme")}
            </Text>
            <View
              style={[
                styles.card,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View style={styles.row}>
                <Ionicons
                  name="color-palette-outline"
                  size={24}
                  color={colors.tint}
                />

                <View style={styles.rowText}>
                  <Text style={[styles.rowTitle, { color: colors.text }]}>
                    {tSettings("currentTheme")}: {theme.toUpperCase()}
                  </Text>
                  <Text style={{ color: colors.icon }}>
                    {tSettings("systemTheme")}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {
            /* Local Authentication Section */
            isSupported && isEnrolled && (
              <TouchableOpacity
                style={styles.section}
                onPress={handleLocalAuth}
                disabled={!isSupported || !isEnrolled}
              >
                <Text style={[styles.sectionTitle, { color: colors.icon }]}>
                  {tSettings("localAuth")}
                </Text>
                <View
                  style={[
                    styles.card,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <View style={styles.row}>
                    <Ionicons
                      name="finger-print-outline"
                      size={24}
                      color={colors.tint}
                    />

                    <View style={styles.rowText}>
                      <Text style={[styles.rowTitle, { color: colors.text }]}>
                        {tSettings("biometricEnabled")}:{" "}
                        {isLogginEnabled
                          ? tSettings("enabled")
                          : tSettings("disabled")}
                      </Text>
                      <Text style={{ color: colors.icon }}>
                        {isSupported
                          ? isEnrolled
                            ? tSettings("biometricDescription")
                            : tSettings("noEnrolled")
                          : tSettings("notSupported")}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )
          }
        </ScrollView>
      </View>
      <AdBanner />
    </>
  );
}

// Minimal stub for scrollview in this screen
import { api } from "@/api/api";
import { showToast } from "@/helpers/alert.helper";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useLocalAuthentication } from "@/hooks/useLocalAuthentication";
import { iappVersionResponse } from "@/interfaces/video.interfaces";
import { useColorScheme } from "@/src/hooks/useColorScheme";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native";

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20 },
  headerTitle: { fontSize: 28, fontWeight: "bold" },
  content: { paddingHorizontal: 20, marginTop: 10 },
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
