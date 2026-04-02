import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import "expo-share-intent";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import mobileAds from "react-native-google-mobile-ads";

import { useThemeColor } from "@/hooks/use-theme-color";
import { useLocalAuthentication } from "@/hooks/useLocalAuthentication";
import "@/i18n/i18n";
import { useTranslation } from "react-i18next";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "./globals.css";
import { MustLogin } from "./mustLogin";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const backgroundColor = useThemeColor({}, "background");
  const cardColor = useThemeColor({}, "card");
  const textColor = useThemeColor({}, "text");

  const { isLogged, authenticate, isLogginEnabled } = useLocalAuthentication();
  const [hasTried, setHasTried] = useState(false);

  const { t: tv } = useTranslation("videos");
  const { t: tc } = useTranslation("categories");

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (!isLogged && isLogginEnabled && !hasTried) {
      setHasTried(true);
      authenticate();
    }
  }, [isLogged, isLogginEnabled]);

  useEffect(() => {
    mobileAds().initialize().then(console.log);
  }, []);

  // mobileAds()
  //   .initialize()
  //   .then((adapterStatuses) => {
  //     // Initialization complete!
  //     console.log(adapterStatuses);
  //   });

  if (!loaded) {
    return null;
  }

  if (isLogginEnabled && !isLogged) {
    return <MustLogin onAuthenticate={authenticate} />;
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
          options={{ presentation: "modal", title: tv("addVideo") }}
        />
        <Stack.Screen
          name="detail/[id]"
          options={{ title: tv("videoDetail"), headerShown: false }}
        />
        <Stack.Screen name="category" options={{ title: tc("detailTitle") }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </GestureHandlerRootView>
    // </ThemeProvider>
  );
}
