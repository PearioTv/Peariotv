import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Favorites table for storing user's favorite movies and TV shows
 */
export const favorites = mysqlTable("favorites", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  tmdbId: int("tmdbId").notNull(),
  mediaType: mysqlEnum("mediaType", ["movie", "tv"]).notNull(),
  title: text("title").notNull(),
  posterPath: text("posterPath"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = typeof favorites.$inferInsert;

/**
 * Watchlist table for storing movies and TV shows to watch later
 */
export const watchlist = mysqlTable("watchlist", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  tmdbId: int("tmdbId").notNull(),
  mediaType: mysqlEnum("mediaType", ["movie", "tv"]).notNull(),
  title: text("title").notNull(),
  posterPath: text("posterPath"),
  addedAt: timestamp("addedAt").defaultNow().notNull(),
});

export type WatchlistItem = typeof watchlist.$inferSelect;
export type InsertWatchlistItem = typeof watchlist.$inferInsert;

/**
 * Watch progress table for tracking user's viewing progress on series
 */
export const watchProgress = mysqlTable("watchProgress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  tmdbId: int("tmdbId").notNull(),
  mediaType: mysqlEnum("mediaType", ["movie", "tv"]).notNull(),
  lastWatchedSeason: int("lastWatchedSeason"),
  lastWatchedEpisode: int("lastWatchedEpisode"),
  lastWatchedAt: timestamp("lastWatchedAt").defaultNow().onUpdateNow().notNull(),
});

export type WatchProgress = typeof watchProgress.$inferSelect;
export type InsertWatchProgress = typeof watchProgress.$inferInsert;

/**
 * User preferences table for language and theme settings
 */
export const userPreferences = mysqlTable("userPreferences", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  language: varchar("language", { length: 10 }).default("en").notNull(),
  theme: varchar("theme", { length: 20 }).default("dark").notNull(),
  autoPlayNextEpisode: int("autoPlayNextEpisode").default(1).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserPreference = typeof userPreferences.$inferSelect;
export type InsertUserPreference = typeof userPreferences.$inferInsert;