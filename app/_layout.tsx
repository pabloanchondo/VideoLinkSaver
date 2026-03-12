import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import "expo-share-intent";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import mobileAds from "react-native-google-mobile-ads";
import "./globals.css";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  mobileAds()
    .initialize()
    .then((adapterStatuses) => {
      // Initialization complete!
    });

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="add"
          options={{ presentation: "modal", title: "Add Video" }}
        />
        <Stack.Screen name="detail/[id]" options={{ title: "Video Detail" }} />
        <Stack.Screen name="category" options={{ title: "Category Detail" }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
