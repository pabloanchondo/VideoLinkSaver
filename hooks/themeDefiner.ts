import { useStore } from "@/src/store/useStore";

export const themeDefiner = () => {
  const theme = useStore((state) => state.theme);
  const setTheme = useStore((state) => state.setTheme);

  const toggleTheme = async (selectedTheme: "light" | "dark" | "system") => {
    await setTheme(selectedTheme);
  };

  const getTheme = async () => {
    // Note: Theme loading is now handled during app initialization in useStore.init()
  };

  return { theme, toggleTheme, getTheme };
};
