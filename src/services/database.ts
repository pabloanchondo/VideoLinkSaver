import * as SQLite from "expo-sqlite";
import { Category, VideoLink } from "../types";

let db: SQLite.SQLiteDatabase | null = null;

export const closeDatabase = async () => {
  if (db) {
    await db.closeAsync();
    db = null;
  }
};

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
  // 🔥 MIGRACIÓN SEGURA
  const columns = await db.getAllAsync<{ name: string }>(
    `PRAGMA table_info(categories);`,
  );

  const hasColor = columns.some((col) => col.name === "color");

  if (!hasColor) {
    await db.execAsync(`
      ALTER TABLE categories ADD COLUMN color TEXT DEFAULT 'blue';
    `);
  }
};

export const getDb = () => {
  if (!db) throw new Error("Database not initialized");
  return db;
};

export const clearDb = async () => {
  const database = getDb();

  // merge WAL into main DB
  await database.execAsync("PRAGMA wal_checkpoint(TRUNCATE)");

  // force SQLite to write everything
  await database.execAsync("VACUUM");
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
    "INSERT INTO categories (id, name, parentId, createdAt, color) VALUES (?, ?, ?, ?, ?)",
    category.id,
    category.name,
    category.parentId,
    category.createdAt,
    category.color,
  );
};

export const removeCategory = async (id: string) => {
  const database = getDb();
  await database.runAsync("DELETE FROM categories WHERE id = ?", id);
  await database.runAsync("DELETE FROM videos WHERE categoryId = ?", id);
};

export const updateCategoryName = async (
  id: string,
  name: string,
  color: string,
) => {
  const database = getDb();
  await database.runAsync(
    "UPDATE categories SET name = ?, color = ? WHERE id = ?",
    name,
    color,
    id,
  );
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

export const updateVideoThumbnail = async (
  id: string,
  thumbnailUrl: string,
) => {
  const database = getDb();
  await database.runAsync(
    "UPDATE videos SET thumbnailUrl = ? WHERE id = ?",
    thumbnailUrl,
    id,
  );
};
