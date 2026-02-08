import { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';
import {
  discoverMovies,
  discoverTV,
  fetchMovieGenres,
  fetchTVGenres,
  type Genre,
} from '@shared/tmdb';

const GENRES_LIST: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

export default function Browse() {
  const [contentType, setContentType] = useState<'movie' | 'tv'>('movie');
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [genres, setGenres] = useState<Genre[]>([]);

  // Fetch genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data =
          contentType === 'movie'
            ? await fetchMovieGenres()
            : await fetchTVGenres();
        setGenres(data.genres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, [contentType]);

  // Fetch content
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const data =
          contentType === 'movie'
            ? await discoverMovies(selectedGenre || undefined, page)
            : await discoverTV(selectedGenre || undefined, page);

        setResults(data.results);
        setTotalPages(data.total_pages);
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [contentType, selectedGenre, page]);

  const handleTypeChange = (type: 'movie' | 'tv') => {
    setContentType(type);
    setSelectedGenre(null);
    setPage(1);
  };

  const handleGenreChange = (genreId: number | null) => {
    setSelectedGenre(genreId);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="container mx-auto px-4 pt-32 pb-12">
        {/* Filters */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Filter size={24} className="text-red-600" />
            <h2 className="text-2xl font-bold text-white">Filters</h2>
          </div>

          {/* Content Type */}
          <div className="mb-8">
            <h3 className="text-white font-semibold mb-4">Content Type</h3>
            <div className="flex gap-4">
              <button
                onClick={() => handleTypeChange('movie')}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  contentType === 'movie'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Movies
              </button>
              <button
                onClick={() => handleTypeChange('tv')}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  contentType === 'tv'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                TV Series
              </button>
            </div>
          </div>

          {/* Genres */}
          <div>
            <h3 className="text-white font-semibold mb-4">Genres</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleGenreChange(null)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  selectedGenre === null
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                All
              </button>
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => handleGenreChange(genre.id)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    selectedGenre === genre.id
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-600"></div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white">
                {contentType === 'movie' ? 'Movies' : 'TV Series'}
                {selectedGenre && ` - ${genres.find((g) => g.id === selectedGenre)?.name}`}
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-12">
              {results.map((item) => (
                <MovieCard
                  key={item.id}
                  id={item.id}
                  title={item.title || item.name}
                  posterPath={item.poster_path}
                  rating={item.vote_average}
                  type={contentType}
                  year={new Date(
                    item.release_date || item.first_air_date
                  )
                    .getFullYear()
                    .toString()}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 text-white rounded-lg transition"
                >
                  Previous
                </button>
                <span className="px-6 py-2 text-white">
                  Page {page} of {Math.min(totalPages, 500)}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page >= totalPages || page >= 500}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 text-white rounded-lg transition"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
