import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Play, Info } from 'lucide-react';
import { fetchTrending, getBackdropUrl, type Movie, type TVSeries } from '@shared/tmdb';

type Content = Movie | TVSeries;

export default function HeroSection() {
  const [featured, setFeatured] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await fetchTrending('movie', 'week');
        if (data.results && data.results.length > 0) {
          // Get a random featured item
          const randomIndex = Math.floor(Math.random() * Math.min(5, data.results.length));
          setFeatured(data.results[randomIndex]);
        }
      } catch (error) {
        console.error('Error fetching featured content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  if (loading || !featured) {
    return (
      <div className="relative w-full h-screen bg-gray-900 animate-pulse" />
    );
  }

  const backdropUrl = getBackdropUrl(featured.backdrop_path, 'w1280');
  const title = 'title' in featured ? featured.title : featured.name;
  const year = new Date(
    'release_date' in featured ? featured.release_date : featured.first_air_date
  ).getFullYear();

  return (
    <div
      className="relative w-full h-screen bg-cover bg-center pt-20"
      style={{
        backgroundImage: `url(${backdropUrl})`,
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="space-y-6">
            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              {title}
            </h1>

            {/* Meta Info */}
            <div className="flex items-center gap-4 text-gray-300">
              <span className="text-lg font-semibold text-yellow-400">
                ⭐ {featured.vote_average.toFixed(1)}/10
              </span>
              <span className="text-lg">{year}</span>
              <span className="text-lg">
                {'title' in featured ? 'Movie' : 'TV Series'}
              </span>
            </div>

            {/* Overview */}
            <p className="text-gray-200 text-lg leading-relaxed line-clamp-3 max-w-2xl">
              {featured.overview}
            </p>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <Link
                href={`/details/${featured.id}?type=${'title' in featured ? 'movie' : 'tv'}`}
              >
                <button className="flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition transform hover:scale-105">
                  <Play size={20} fill="currentColor" />
                  Play Now
                </button>
              </Link>

              <Link
                href={`/details/${featured.id}?type=${'title' in featured ? 'movie' : 'tv'}`}
              >
                <button className="flex items-center gap-2 px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition transform hover:scale-105">
                  <Info size={20} />
                  More Info
                </button>
              </Link>
            </div>

            {/* Genres (if available) */}
            <div className="flex gap-2 pt-4 flex-wrap">
              {featured.genre_ids?.slice(0, 3).map((genreId) => (
                <span
                  key={genreId}
                  className="px-3 py-1 bg-red-600/30 border border-red-600 text-red-400 rounded-full text-sm"
                >
                  {getGenreName(genreId)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </div>
  );
}

// Simple genre mapping
function getGenreName(id: number): string {
  const genres: Record<number, string> = {
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
  return genres[id] || 'Unknown';
}
