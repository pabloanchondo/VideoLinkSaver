import { AlertNotificationRoot } from "react-native-alert-notification";

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
    "Amelia-OblicuaBlack": require("../assets/fonts/Amelia-OblicuaBlack.otf"),
    "Amelia-OblicuaLight": require("../assets/fonts/Amelia-OblicuaLight.otf"),
    "Montserrat-Black": require("../assets/fonts/Montserrat-Black.ttf"),
    "Montserrat-Medium": require("../assets/fonts/Montserrat-Medium.ttf"),
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

  if (!loaded) {
    return null;
  }

  if (isLogginEnabled && !isLogged) {
    return <MustLogin onAuthenticate={authenticate} />;
  }

  return (
    // <ThemeProvider value={DefaultTheme}>
    <GestureHandlerRootView style={{ flex: 1, backgroundColor }}>
      <AlertNotificationRoot>
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
          <Stack.Screen
            name="category"
            options={{ title: tc("detailTitle"), headerShown: false }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </AlertNotificationRoot>
    </GestureHandlerRootView>
    // </ThemeProvider>
  );
}
