/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const tintColorLight = "#009af4";
const tintColorDark = "#009af4";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#f5f8fa",
    tint: tintColorLight,
    tintSecondary: "#10B981",
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    card: "#fff",
    border: "#e0e0e0",
  },
  dark: {
    text: "#ECEDEE",
    background: "#050c1f",
    tint: tintColorDark,
    tintSecondary: "#10B981",
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    card: "#1d293d",
    border: "#333333",
  },
};

export const gradients = {
  blue: "linear-gradient(to right bottom, #2088ff, #009df0, #00b4df)",
  pink: "linear-gradient(to right bottom, #b549fa, #d248d0, #ef3aa6)",
  orange: "linear-gradient(to right bottom, #ff6300, #ff4e19, #fc3333)",
  green: "linear-gradient(to right bottom, #00c758, #00c26a, #00bd79)",
  purple: "linear-gradient(to right bottom, #6e5dff, #8c55ff, #a74aff)",
  red: "linear-gradient(to right bottom, #fe2461, #fb2d7c, #f83293)",
  yellow: "linear-gradient(to right bottom, #fe9400, #ff8000, #ff6e00)",
  teal: "linear-gradient(to right bottom, #00bbaf, #00bac3, #00b8d5)",
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
