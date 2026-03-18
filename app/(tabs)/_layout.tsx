import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";
import { HapticTab } from "@/src/components/HapticTab";
import { IconSymbol } from "@/src/components/ui/IconSymbol";

export default function TabLayout() {
  const backgroundColor = useThemeColor({}, "background");
  const cardBg = useThemeColor({}, "card");

  return (
    <Tabs
      screenOptions={{
        sceneStyle: {
          backgroundColor: backgroundColor,
        },
        tabBarActiveTintColor: useThemeColor({}, "tint"),

        headerBackgroundContainerStyle: {
          backgroundColor: "red",
          // backgroundColor: backgroundColor,
        },
        headerTintColor: useThemeColor({}, "text"),
        headerShadowVisible: true,
        headerShown: true,
        tabBarButton: HapticTab,
        headerStyle: {
          backgroundColor: cardBg,
          height: 100,
        },
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {
            backgroundColor: cardBg,
          },
        }),
        //Cambiar background del contenido
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Videos",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="play.rectangle.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: "Categories",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="folder.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="gearshape.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
