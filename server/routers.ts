import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import {
  getPopularMovies,
  getTrendingMovies,
  getUpcomingMovies,
  getMoviesByGenre,
  getMovieDetail,
  searchMovies,
  getPopularTVShows,
  getTrendingTVShows,
  getTVShowsByGenre,
  getTVShowDetail,
  getTVShowSeasons,
  getTVShowSeason,
  getTVShowEpisode,
  searchTVShows,
  getMovieGenres,
  getTVGenres,
  getTMDBImageUrl,
} from "./tmdb";
import {
  getUserFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,
  getUserWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  isInWatchlist,
  getUserPreferences,
  updateUserPreferences,
} from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Movies
  movies: router({
    popular: publicProcedure.query(async () => {
      const movies = await getPopularMovies();
      return movies.map(m => ({
        ...m,
        poster_path: getTMDBImageUrl(m.poster_path),
        backdrop_path: getTMDBImageUrl(m.backdrop_path, "w1280"),
      }));
    }),
    trending: publicProcedure.query(async () => {
      const movies = await getTrendingMovies();
      return movies.map(m => ({
        ...m,
        poster_path: getTMDBImageUrl(m.poster_path),
        backdrop_path: getTMDBImageUrl(m.backdrop_path, "w1280"),
      }));
    }),
    upcoming: publicProcedure.query(async () => {
      const movies = await getUpcomingMovies();
      return movies.map(m => ({
        ...m,
        poster_path: getTMDBImageUrl(m.poster_path),
        backdrop_path: getTMDBImageUrl(m.backdrop_path, "w1280"),
      }));
    }),
    detail: publicProcedure.input(z.number()).query(async ({ input }) => {
      const movie = await getMovieDetail(input);
      return {
        ...movie,
        poster_path: getTMDBImageUrl(movie.poster_path),
        backdrop_path: getTMDBImageUrl(movie.backdrop_path, "w1280"),
      };
    }),
    search: publicProcedure
      .input(
        z.object({
          query: z.string(),
          page: z.number().optional(),
        })
      )
      .query(async ({ input }) => {
        const movies = await searchMovies(input.query, input.page || 1);
        return movies.map(m => ({
          ...m,
          poster_path: getTMDBImageUrl(m.poster_path),
          backdrop_path: getTMDBImageUrl(m.backdrop_path, "w1280"),
        }));
      }),
    byGenre: publicProcedure
      .input(
        z.object({
          genreId: z.number(),
          page: z.number().optional(),
        })
      )
      .query(async ({ input }) => {
        const movies = await getMoviesByGenre(input.genreId, input.page || 1);
        return movies.map(m => ({
          ...m,
          poster_path: getTMDBImageUrl(m.poster_path),
          backdrop_path: getTMDBImageUrl(m.backdrop_path, "w1280"),
        }));
      }),
  }),

  // TV Shows
  tv: router({
    popular: publicProcedure.query(async () => {
      const shows = await getPopularTVShows();
      return shows.map(s => ({
        ...s,
        poster_path: getTMDBImageUrl(s.poster_path),
        backdrop_path: getTMDBImageUrl(s.backdrop_path, "w1280"),
      }));
    }),
    trending: publicProcedure.query(async () => {
      const shows = await getTrendingTVShows();
      return shows.map(s => ({
        ...s,
        poster_path: getTMDBImageUrl(s.poster_path),
        backdrop_path: getTMDBImageUrl(s.backdrop_path, "w1280"),
      }));
    }),
    detail: publicProcedure.input(z.number()).query(async ({ input }) => {
      const show = await getTVShowDetail(input);
      return {
        ...show,
        poster_path: getTMDBImageUrl(show.poster_path),
        backdrop_path: getTMDBImageUrl(show.backdrop_path, "w1280"),
      };
    }),
    seasons: publicProcedure.input(z.number()).query(async ({ input }) => {
      const seasons = await getTVShowSeasons(input);
      return seasons.map(s => ({
        ...s,
        poster_path: getTMDBImageUrl(s.poster_path),
      }));
    }),
    season: publicProcedure
      .input(
        z.object({
          tvId: z.number(),
          seasonNumber: z.number(),
        })
      )
      .query(async ({ input }) => {
        const episodes = await getTVShowSeason(input.tvId, input.seasonNumber);
        return episodes.map(e => ({
          ...e,
          still_path: getTMDBImageUrl(e.still_path),
        }));
      }),
    episode: publicProcedure
      .input(
        z.object({
          tvId: z.number(),
          seasonNumber: z.number(),
          episodeNumber: z.number(),
        })
      )
      .query(async ({ input }) => {
        const episode = await getTVShowEpisode(input.tvId, input.seasonNumber, input.episodeNumber);
        return {
          ...episode,
          still_path: getTMDBImageUrl(episode.still_path),
        };
      }),
    search: publicProcedure
      .input(
        z.object({
          query: z.string(),
          page: z.number().optional(),
        })
      )
      .query(async ({ input }) => {
        const shows = await searchTVShows(input.query, input.page || 1);
        return shows.map(s => ({
          ...s,
          poster_path: getTMDBImageUrl(s.poster_path),
          backdrop_path: getTMDBImageUrl(s.backdrop_path, "w1280"),
        }));
      }),
    byGenre: publicProcedure
      .input(
        z.object({
          genreId: z.number(),
          page: z.number().optional(),
        })
      )
      .query(async ({ input }) => {
        const shows = await getTVShowsByGenre(input.genreId, input.page || 1);
        return shows.map(s => ({
          ...s,
          poster_path: getTMDBImageUrl(s.poster_path),
          backdrop_path: getTMDBImageUrl(s.backdrop_path, "w1280"),
        }));
      }),
  }),

  // Genres
  genres: router({
    movies: publicProcedure.query(async () => {
      return getMovieGenres();
    }),
    tv: publicProcedure.query(async () => {
      return getTVGenres();
    }),
  }),

  // Favorites
  favorites: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return getUserFavorites(ctx.user.id);
    }),
    add: protectedProcedure
      .input(
        z.object({
          tmdbId: z.number(),
          mediaType: z.enum(["movie", "tv"]),
          title: z.string(),
          posterPath: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return addFavorite(ctx.user.id, input.tmdbId, input.mediaType, input.title, input.posterPath);
      }),
    remove: protectedProcedure
      .input(
        z.object({
          tmdbId: z.number(),
          mediaType: z.enum(["movie", "tv"]),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await removeFavorite(ctx.user.id, input.tmdbId, input.mediaType);
        return { success: true };
      }),
    isFavorite: protectedProcedure
      .input(
        z.object({
          tmdbId: z.number(),
          mediaType: z.enum(["movie", "tv"]),
        })
      )
      .query(async ({ ctx, input }) => {
        return isFavorite(ctx.user.id, input.tmdbId, input.mediaType);
      }),
  }),

  // Watchlist
  watchlist: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return getUserWatchlist(ctx.user.id);
    }),
    add: protectedProcedure
      .input(
        z.object({
          tmdbId: z.number(),
          mediaType: z.enum(["movie", "tv"]),
          title: z.string(),
          posterPath: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return addToWatchlist(ctx.user.id, input.tmdbId, input.mediaType, input.title, input.posterPath);
      }),
    remove: protectedProcedure
      .input(
        z.object({
          tmdbId: z.number(),
          mediaType: z.enum(["movie", "tv"]),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await removeFromWatchlist(ctx.user.id, input.tmdbId, input.mediaType);
        return { success: true };
      }),
    isInWatchlist: protectedProcedure
      .input(
        z.object({
          tmdbId: z.number(),
          mediaType: z.enum(["movie", "tv"]),
        })
      )
      .query(async ({ ctx, input }) => {
        return isInWatchlist(ctx.user.id, input.tmdbId, input.mediaType);
      }),
  }),

  // User Preferences
  preferences: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      return getUserPreferences(ctx.user.id);
    }),
    update: protectedProcedure
      .input(
        z.object({
          language: z.string().optional(),
          theme: z.string().optional(),
          autoPlayNextEpisode: z.number().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await updateUserPreferences(ctx.user.id, input.language, input.theme, input.autoPlayNextEpisode);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
