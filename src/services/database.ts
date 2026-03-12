import * as SQLite from "expo-sqlite";
import { Category, VideoLink } from "../types";

let db: SQLite.SQLiteDatabase | null = null;

export const initDb = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync("myvideos.db");
  }

  // Create tables
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      parentId TEXT,
      createdAt INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS videos (
      id TEXT PRIMARY KEY NOT NULL,
      url TEXT NOT NULL,
      title TEXT NOT NULL,
      thumbnailUrl TEXT,
      platform TEXT NOT NULL,
      categoryId TEXT,
      createdAt INTEGER NOT NULL
    );
  `);
};

export const getDb = () => {
  if (!db) throw new Error("Database not initialized");
  return db;
};

// --- Category Methods ---

export const fetchCategories = async (): Promise<Category[]> => {
  const database = getDb();
  return await database.getAllAsync<Category>(
    "SELECT * FROM categories ORDER BY createdAt DESC;",
  );
};

export const insertCategory = async (category: Category) => {
  const database = getDb();
  await database.runAsync(
    "INSERT INTO categories (id, name, parentId, createdAt) VALUES (?, ?, ?, ?)",
    category.id,
    category.name,
    category.parentId,
    category.createdAt,
  );
};

export const removeCategory = async (id: string) => {
  const database = getDb();
  await database.runAsync("DELETE FROM categories WHERE id = ?", id);
};

// --- Video Methods ---

export const fetchVideos = async (): Promise<VideoLink[]> => {
  const database = getDb();
  return await database.getAllAsync<VideoLink>(
    "SELECT * FROM videos ORDER BY createdAt DESC;",
  );
};

export const insertVideo = async (video: VideoLink) => {
  const database = getDb();
  await database.runAsync(
    "INSERT INTO videos (id, url, title, thumbnailUrl, platform, categoryId, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
    video.id,
    video.url,
    video.title,
    video.thumbnailUrl,
    video.platform,
    video.categoryId,
    video.createdAt,
  );
};

export const removeVideo = async (id: string) => {
  const database = getDb();
  await database.runAsync("DELETE FROM videos WHERE id = ?", id);
};

export const updateVideo = async (
  id: string,
  title: string,
  categoryId: string,
) => {
  const database = getDb();
  await database.runAsync(
    "UPDATE videos SET title = ?, categoryId = ? WHERE id = ?",
    title,
    categoryId,
    id,
  );
};
