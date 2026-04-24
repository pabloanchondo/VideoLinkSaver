import { getItemAsync } from "expo-secure-store";
import { create } from "zustand";
import * as db from "../services/database";
import { Category, VideoLink } from "../types";
import { getCategoryNameByi18n } from "./../../helpers/category-name.helper";

interface AppState {
  videos: VideoLink[];
  categories: Category[];
  isInitialized: boolean;
  sortBy: "title" | "color";
  setSortBy: (sortBy: "title" | "color") => void;

  // Actions
  init: () => Promise<void>;
  close: () => Promise<void>;
  clean: () => Promise<void>;
  loadVideos: () => Promise<void>;
  loadCategories: () => Promise<void>;
  addVideo: (video: VideoLink) => Promise<void>;
  removeVideo: (id: string) => Promise<void>;
  addCategory: (category: Category) => Promise<void>;
  removeCategory: (id: string) => Promise<void>;
  updateVideo: (id: string, title: string, categoryId: string) => Promise<void>;
  checkRestore: () => Promise<null>;
  updateVideoThumbnail: (id: string, thumbnailUrl: string) => Promise<void>;
  updateCategoryName: (
    id: string,
    name: string,
    color: string,
  ) => Promise<void>;
  getCategoryById: (id: string) => Category | undefined;
}

export const useStore = create<AppState>((set, get) => ({
  videos: [],
  categories: [],
  isInitialized: false,
  sortBy: "title",

  init: async () => {
    try {
      await db.initDb();

      const stored = await getItemAsync("sortBy");
      if (stored) {
        get().setSortBy(stored as "title" | "color");
      }

      await get().loadCategories();
      await get().loadVideos();

      set({ isInitialized: true });
    } catch (error) {
      console.error("Failed to initialize local database:", error);
    }
  },

  setSortBy: (sortBy: "title" | "color") => {
    set({ sortBy });
  },

  getCategoryById: (id: string) => {
    const category = get().categories.find((c) => c.id === id);
    return category;
  },

  checkRestore: async () => {
    const categories = await db.fetchCategories();
    console.log(categories);
    return null;
  },

  clean: async () => {
    await db.clearDb();
  },

  close: async () => {
    await db.closeDatabase();
    set({ isInitialized: false, videos: [], categories: [] });
  },

  updateVideoThumbnail: async (id: string, thumbnailUrl: string) => {
    await db.updateVideoThumbnail(id, thumbnailUrl);
    get().loadVideos();
  },

  loadVideos: async () => {
    const videos = await db.fetchVideos();
    set({ videos });
  },

  loadCategories: async () => {
    const categories = await db.fetchCategories();
    const name = getCategoryNameByi18n();
    let uncategory: Category = {
      id: "uncategorized",
      name,
      parentId: null,
      createdAt: 0,
      color: "blue",
    };
    categories.unshift(uncategory);
    set({ categories: [...categories] });
  },

  addVideo: async (video) => {
    await db.insertVideo(video);
    set((state) => ({ videos: [video, ...state.videos] }));
  },

  updateVideo: async (id: string, title: string, categoryId: string) => {
    await db.updateVideo(id, title, categoryId);
    set((state) => ({
      videos: state.videos.map((v) =>
        v.id === id ? { ...v, title, categoryId } : v,
      ),
    }));
  },

  removeVideo: async (id) => {
    await db.removeVideo(id);
    await get().loadVideos();
  },

  addCategory: async (category) => {
    await db.insertCategory(category);
    set((state) => ({ categories: [category, ...state.categories] }));
  },

  removeCategory: async (id) => {
    await db.removeCategory(id);
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
    }));
  },

  updateCategoryName: async (id: string, name: string, color: string) => {
    await db.updateCategoryName(id, name, color);
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === id ? { ...c, name, color } : c,
      ),
    }));
  },
}));
