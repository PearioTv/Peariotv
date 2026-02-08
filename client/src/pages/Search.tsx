import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Search as SearchIcon } from 'lucide-react';
import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';
import { searchMulti, type Movie, type TVSeries } from '@shared/tmdb';

type Content = Movie | TVSeries;

export default function Search() {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const query = searchParams.get('q') || '';

  const [results, setResults] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(query);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (query) {
      const fetchResults = async () => {
        try {
          setLoading(true);
          const data = await searchMulti(query, page);
          // Filter to only movies and TV series
          const filtered = data.results.filter(
            (item: any) => item.media_type === 'movie' || item.media_type === 'tv'
          );
          setResults(filtered);
          setTotalPages(data.total_pages);
        } catch (error) {
          console.error('Error searching:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchResults();
    }
  }, [query, page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchInput)}`);
      setPage(1);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="container mx-auto px-4 pt-32 pb-12">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-12">
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search movies and TV series..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full px-6 py-4 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-red-600 focus:outline-none transition text-lg"
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:text-red-500 transition"
            >
              <SearchIcon size={24} className="text-gray-400" />
            </button>
          </div>
        </form>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-600"></div>
          </div>
        ) : results.length > 0 ? (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                Search Results for "{query}"
              </h1>
              <p className="text-gray-400">Found {results.length} results</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-12">
              {results.map((item) => (
                <MovieCard
                  key={item.id}
                  id={item.id}
                  title={'title' in item ? item.title : item.name}
                  posterPath={item.poster_path}
                  rating={item.vote_average}
                  type={item.media_type === 'tv' ? 'tv' : 'movie'}
                  year={new Date(
                    'release_date' in item ? item.release_date : item.first_air_date
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
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 text-white rounded-lg transition"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : query ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No results found for "{query}"</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Enter a search query to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
