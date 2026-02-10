import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, favorites, watchlist, watchProgress, userPreferences } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Favorites queries
export async function addFavorite(userId: number, tmdbId: number, mediaType: "movie" | "tv", title: string, posterPath?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db
    .select()
    .from(favorites)
    .where(
      and(
        eq(favorites.userId, userId),
        eq(favorites.tmdbId, tmdbId),
        eq(favorites.mediaType, mediaType)
      )
    )
    .limit(1);

  if (existing.length > 0) return existing[0];

  const result = await db.insert(favorites).values({
    userId,
    tmdbId,
    mediaType,
    title,
    posterPath,
  });

  return { id: result[0].insertId, userId, tmdbId, mediaType, title, posterPath };
}

export async function removeFavorite(userId: number, tmdbId: number, mediaType: "movie" | "tv") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .delete(favorites)
    .where(
      and(
        eq(favorites.userId, userId),
        eq(favorites.tmdbId, tmdbId),
        eq(favorites.mediaType, mediaType)
      )
    );
}

export async function getUserFavorites(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.select().from(favorites).where(eq(favorites.userId, userId));
}

export async function isFavorite(userId: number, tmdbId: number, mediaType: "movie" | "tv") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(favorites)
    .where(
      and(
        eq(favorites.userId, userId),
        eq(favorites.tmdbId, tmdbId),
        eq(favorites.mediaType, mediaType)
      )
    )
    .limit(1);

  return result.length > 0;
}

// Watchlist queries
export async function addToWatchlist(userId: number, tmdbId: number, mediaType: "movie" | "tv", title: string, posterPath?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db
    .select()
    .from(watchlist)
    .where(
      and(
        eq(watchlist.userId, userId),
        eq(watchlist.tmdbId, tmdbId),
        eq(watchlist.mediaType, mediaType)
      )
    )
    .limit(1);

  if (existing.length > 0) return existing[0];

  const result = await db.insert(watchlist).values({
    userId,
    tmdbId,
    mediaType,
    title,
    posterPath,
  });

  return { id: result[0].insertId, userId, tmdbId, mediaType, title, posterPath };
}

export async function removeFromWatchlist(userId: number, tmdbId: number, mediaType: "movie" | "tv") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .delete(watchlist)
    .where(
      and(
        eq(watchlist.userId, userId),
        eq(watchlist.tmdbId, tmdbId),
        eq(watchlist.mediaType, mediaType)
      )
    );
}

export async function getUserWatchlist(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.select().from(watchlist).where(eq(watchlist.userId, userId));
}

export async function isInWatchlist(userId: number, tmdbId: number, mediaType: "movie" | "tv") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(watchlist)
    .where(
      and(
        eq(watchlist.userId, userId),
        eq(watchlist.tmdbId, tmdbId),
        eq(watchlist.mediaType, mediaType)
      )
    )
    .limit(1);

  return result.length > 0;
}

// Watch progress queries
export async function updateWatchProgress(
  userId: number,
  tmdbId: number,
  mediaType: "movie" | "tv",
  season?: number,
  episode?: number
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db
    .select()
    .from(watchProgress)
    .where(
      and(
        eq(watchProgress.userId, userId),
        eq(watchProgress.tmdbId, tmdbId),
        eq(watchProgress.mediaType, mediaType)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(watchProgress)
      .set({
        lastWatchedSeason: season,
        lastWatchedEpisode: episode,
        lastWatchedAt: new Date(),
      })
      .where(
        and(
          eq(watchProgress.userId, userId),
          eq(watchProgress.tmdbId, tmdbId),
          eq(watchProgress.mediaType, mediaType)
        )
      );
  } else {
    await db.insert(watchProgress).values({
      userId,
      tmdbId,
      mediaType,
      lastWatchedSeason: season,
      lastWatchedEpisode: episode,
    });
  }
}

export async function getWatchProgress(userId: number, tmdbId: number, mediaType: "movie" | "tv") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(watchProgress)
    .where(
      and(
        eq(watchProgress.userId, userId),
        eq(watchProgress.tmdbId, tmdbId),
        eq(watchProgress.mediaType, mediaType)
      )
    )
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

// User preferences queries
export async function getUserPreferences(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(userPreferences).where(eq(userPreferences.userId, userId)).limit(1);

  if (result.length > 0) return result[0];

  // Create default preferences if not exists
  await db.insert(userPreferences).values({ userId });
  return { id: 0, userId, language: "en", theme: "dark", autoPlayNextEpisode: 1, updatedAt: new Date() };
}

export async function updateUserPreferences(
  userId: number,
  language?: string,
  theme?: string,
  autoPlayNextEpisode?: number
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const updateData: Record<string, unknown> = {};
  if (language !== undefined) updateData.language = language;
  if (theme !== undefined) updateData.theme = theme;
  if (autoPlayNextEpisode !== undefined) updateData.autoPlayNextEpisode = autoPlayNextEpisode;

  const existing = await db.select().from(userPreferences).where(eq(userPreferences.userId, userId)).limit(1);

  if (existing.length > 0) {
    await db.update(userPreferences).set(updateData).where(eq(userPreferences.userId, userId));
  } else {
    await db.insert(userPreferences).values({ userId, ...updateData });
  }
}
