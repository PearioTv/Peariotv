/**
 * TMDB API utilities for fetching movies and TV series data
 */

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  overview: string;
  genre_ids: number[];
  popularity: number;
  original_language: string;
  media_type?: string;
}

export interface TVSeries {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  overview: string;
  genre_ids: number[];
  popularity: number;
  original_language: string;
  media_type?: string;
}

export interface MovieDetails extends Movie {
  runtime: number;
  genres: Array<{ id: number; name: string }>;
  credits: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }>;
  };
  tagline: string;
  budget: number;
  revenue: number;
  production_companies: Array<{ id: number; name: string; logo_path: string | null }>;
  production_countries: Array<{ iso_3166_1: string; name: string }>;
  spoken_languages: Array<{ iso_639_1: string; name: string }>;
}

export interface TVSeriesDetails extends TVSeries {
  number_of_seasons: number;
  number_of_episodes: number;
  genres: Array<{ id: number; name: string }>;
  credits: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }>;
  };
  created_by: Array<{ id: number; name: string }>;
  seasons: Array<{
    id: number;
    name: string;
    season_number: number;
    episode_count: number;
    poster_path: string | null;
    air_date: string;
  }>;
  tagline: string;
  production_companies: Array<{ id: number; name: string; logo_path: string | null }>;
  production_countries: Array<{ iso_3166_1: string; name: string }>;
  spoken_languages: Array<{ iso_639_1: string; name: string }>;
}

export interface SearchResult {
  results: (Movie | TVSeries)[];
  total_pages: number;
  total_results: number;
  page: number;
}

export interface Genre {
  id: number;
  name: string;
}

/**
 * Fetch trending movies or TV series
 */
export async function fetchTrending(type: 'movie' | 'tv' = 'movie', timeWindow: 'day' | 'week' = 'day') {
  try {
    const response = await fetch(
      `${BASE_URL}/trending/${type}/${timeWindow}?api_key=${API_KEY}&language=en-US`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching trending:', error);
    throw error;
  }
}

/**
 * Fetch popular movies or TV series
 */
export async function fetchPopular(type: 'movie' | 'tv' = 'movie', page = 1) {
  try {
    const response = await fetch(
      `${BASE_URL}/${type}/popular?api_key=${API_KEY}&language=en-US&page=${page}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching popular:', error);
    throw error;
  }
}

/**
 * Fetch top-rated movies or TV series
 */
export async function fetchTopRated(type: 'movie' | 'tv' = 'movie', page = 1) {
  try {
    const response = await fetch(
      `${BASE_URL}/${type}/top_rated?api_key=${API_KEY}&language=en-US&page=${page}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching top-rated:', error);
    throw error;
  }
}

/**
 * Fetch movie details
 */
export async function fetchMovieDetails(movieId: number): Promise<MovieDetails> {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US&append_to_response=credits`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
}

/**
 * Fetch TV series details
 */
export async function fetchTVDetails(seriesId: number): Promise<TVSeriesDetails> {
  try {
    const response = await fetch(
      `${BASE_URL}/tv/${seriesId}?api_key=${API_KEY}&language=en-US&append_to_response=credits`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching TV details:', error);
    throw error;
  }
}

/**
 * Fetch season details
 */
export async function fetchSeasonDetails(seriesId: number, seasonNumber: number) {
  try {
    const response = await fetch(
      `${BASE_URL}/tv/${seriesId}/season/${seasonNumber}?api_key=${API_KEY}&language=en-US`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching season details:', error);
    throw error;
  }
}

/**
 * Search for movies and TV series
 */
export async function searchMulti(query: string, page = 1): Promise<SearchResult> {
  try {
    const response = await fetch(
      `${BASE_URL}/search/multi?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=${page}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching:', error);
    throw error;
  }
}

/**
 * Discover movies by genre
 */
export async function discoverMovies(genreId?: number, page = 1) {
  try {
    let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&page=${page}`;
    if (genreId) {
      url += `&with_genres=${genreId}`;
    }
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error discovering movies:', error);
    throw error;
  }
}

/**
 * Discover TV series by genre
 */
export async function discoverTV(genreId?: number, page = 1) {
  try {
    let url = `${BASE_URL}/discover/tv?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&page=${page}`;
    if (genreId) {
      url += `&with_genres=${genreId}`;
    }
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error discovering TV:', error);
    throw error;
  }
}

/**
 * Fetch similar movies
 */
export async function fetchSimilarMovies(movieId: number) {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}/similar?api_key=${API_KEY}&language=en-US`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching similar movies:', error);
    throw error;
  }
}

/**
 * Fetch similar TV series
 */
export async function fetchSimilarTV(seriesId: number) {
  try {
    const response = await fetch(
      `${BASE_URL}/tv/${seriesId}/similar?api_key=${API_KEY}&language=en-US`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching similar TV:', error);
    throw error;
  }
}

/**
 * Get movie genres
 */
export async function fetchMovieGenres(): Promise<{ genres: Genre[] }> {
  try {
    const response = await fetch(
      `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching movie genres:', error);
    throw error;
  }
}

/**
 * Get TV genres
 */
export async function fetchTVGenres(): Promise<{ genres: Genre[] }> {
  try {
    const response = await fetch(
      `${BASE_URL}/genre/tv/list?api_key=${API_KEY}&language=en-US`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching TV genres:', error);
    throw error;
  }
}

/**
 * Get image URL
 */
export function getImageUrl(path: string | null, size: 'w342' | 'w500' | 'w780' | 'original' = 'w500') {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${size}${path}`;
}

/**
 * Get backdrop image URL
 */
export function getBackdropUrl(path: string | null, size: 'w780' | 'w1280' | 'original' = 'w1280') {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${size}${path}`;
}
