import { create } from "zustand";
import * as db from "../services/database";
import { Category, VideoLink } from "../types";

interface AppState {
  videos: VideoLink[];
  categories: Category[];
  isInitialized: boolean;

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
}

export const useStore = create<AppState>((set, get) => ({
  videos: [],
  categories: [],
  isInitialized: false,

  init: async () => {
    try {
      await db.initDb();
      await get().loadCategories();
      await get().loadVideos();
      set({ isInitialized: true });
    } catch (error) {
      console.error("Failed to initialize local database:", error);
    }
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

  loadVideos: async () => {
    const videos = await db.fetchVideos();
    set({ videos });
  },

  loadCategories: async () => {
    const categories = await db.fetchCategories();
    let uncategory: Category = {
      id: "uncategorized",
      name: "Uncategorized",
      parentId: null,
      createdAt: 0,
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
}));
