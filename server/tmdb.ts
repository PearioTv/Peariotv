import { ENV } from './_core/env';

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_API_KEY = process.env.VITE_TMDB_API_KEY || "";

interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  overview: string;
  genre_ids: number[];
}

interface TMDBTVShow {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  overview: string;
  genre_ids: number[];
}

interface TMDBGenre {
  id: number;
  name: string;
}

interface TMDBMovieDetail extends TMDBMovie {
  runtime: number;
  genres: TMDBGenre[];
  credits?: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }>;
  };
}

interface TMDBTVDetail extends TMDBTVShow {
  number_of_seasons: number;
  number_of_episodes: number;
  genres: TMDBGenre[];
  credits?: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }>;
  };
}

interface TMDBSeason {
  id: number;
  season_number: number;
  name: string;
  episode_count: number;
  poster_path: string | null;
}

interface TMDBEpisode {
  id: number;
  episode_number: number;
  name: string;
  overview: string;
  still_path: string | null;
  air_date: string;
  vote_average: number;
}

async function fetchTMDB<T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T> {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.append("api_key", TMDB_API_KEY);
  url.searchParams.append("language", "en-US");

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Movies
export async function getPopularMovies(page = 1) {
  const response = await fetchTMDB<{ results: TMDBMovie[] }>("/movie/popular", { page });
  return response.results;
}

export async function getTrendingMovies(page = 1) {
  const response = await fetchTMDB<{ results: TMDBMovie[] }>("/trending/movie/week", { page });
  return response.results;
}

export async function getUpcomingMovies(page = 1) {
  const response = await fetchTMDB<{ results: TMDBMovie[] }>("/movie/upcoming", { page });
  return response.results;
}

export async function getMoviesByGenre(genreId: number, page = 1) {
  const response = await fetchTMDB<{ results: TMDBMovie[] }>("/discover/movie", {
    with_genres: genreId,
    page,
  });
  return response.results;
}

export async function getMovieDetail(movieId: number) {
  const response = await fetchTMDB<TMDBMovieDetail>(`/movie/${movieId}`, {
    append_to_response: "credits",
  });
  return response;
}

export async function searchMovies(query: string, page = 1) {
  const response = await fetchTMDB<{ results: TMDBMovie[] }>("/search/movie", {
    query,
    page,
  });
  return response.results;
}

// TV Shows
export async function getPopularTVShows(page = 1) {
  const response = await fetchTMDB<{ results: TMDBTVShow[] }>("/tv/popular", { page });
  return response.results;
}

export async function getTrendingTVShows(page = 1) {
  const response = await fetchTMDB<{ results: TMDBTVShow[] }>("/trending/tv/week", { page });
  return response.results;
}

export async function getTVShowsByGenre(genreId: number, page = 1) {
  const response = await fetchTMDB<{ results: TMDBTVShow[] }>("/discover/tv", {
    with_genres: genreId,
    page,
  });
  return response.results;
}

export async function getTVShowDetail(tvId: number) {
  const response = await fetchTMDB<TMDBTVDetail>(`/tv/${tvId}`, {
    append_to_response: "credits",
  });
  return response;
}

export async function getTVShowSeasons(tvId: number) {
  const response = await fetchTMDB<{ seasons: TMDBSeason[] }>(`/tv/${tvId}`);
  return response.seasons;
}

export async function getTVShowSeason(tvId: number, seasonNumber: number) {
  const response = await fetchTMDB<{ episodes: TMDBEpisode[] }>(
    `/tv/${tvId}/season/${seasonNumber}`
  );
  return response.episodes;
}

export async function getTVShowEpisode(tvId: number, seasonNumber: number, episodeNumber: number) {
  const response = await fetchTMDB<TMDBEpisode>(
    `/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}`
  );
  return response;
}

export async function searchTVShows(query: string, page = 1) {
  const response = await fetchTMDB<{ results: TMDBTVShow[] }>("/search/tv", {
    query,
    page,
  });
  return response.results;
}

// Genres
export async function getMovieGenres() {
  const response = await fetchTMDB<{ genres: TMDBGenre[] }>("/genre/movie/list");
  return response.genres;
}

export async function getTVGenres() {
  const response = await fetchTMDB<{ genres: TMDBGenre[] }>("/genre/tv/list");
  return response.genres;
}

// Image utilities
export function getTMDBImageUrl(path: string | null, size = "w500") {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
