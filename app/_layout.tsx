import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import "expo-share-intent";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import mobileAds from "react-native-google-mobile-ads";

import { useThemeColor } from "@/hooks/use-theme-color";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "./globals.css";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const backgroundColor = useThemeColor({}, "background");
  const cardColor = useThemeColor({}, "card");
  const textColor = useThemeColor({}, "text");

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
      console.log(adapterStatuses);
    });

  if (!loaded) {
    return null;
  }

  return (
    // <ThemeProvider value={DefaultTheme}>
    <GestureHandlerRootView style={{ flex: 1, backgroundColor }}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: cardColor,
          },
          headerTintColor: textColor,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="add"
          options={{ presentation: "modal", title: "Add Video" }}
        />
        <Stack.Screen
          name="detail/[id]"
          options={{ title: "Video Detail", headerShown: false }}
        />
        <Stack.Screen name="category" options={{ title: "Category Detail" }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </GestureHandlerRootView>
    // </ThemeProvider>
  );
}
