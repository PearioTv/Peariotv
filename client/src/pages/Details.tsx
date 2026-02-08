import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Link } from 'wouter';
import { Play, Star, Calendar, Clock, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import {
  fetchMovieDetails,
  fetchTVDetails,
  fetchSeasonDetails,
  fetchSimilarMovies,
  fetchSimilarTV,
  getImageUrl,
  getBackdropUrl,
  type MovieDetails,
  type TVSeriesDetails,
} from '@shared/tmdb';
import MovieCard from '@/components/MovieCard';

type ContentDetails = MovieDetails | TVSeriesDetails;

export default function Details() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const contentId = parseInt(location.split('/')[2]);
  const contentType = searchParams.get('type') || 'movie';

  const [details, setDetails] = useState<ContentDetails | null>(null);
  const [similar, setSimilar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState(1);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        let data;
        let similarData;

        if (contentType === 'movie') {
          data = await fetchMovieDetails(contentId);
          similarData = await fetchSimilarMovies(contentId);
        } else {
          data = await fetchTVDetails(contentId);
          similarData = await fetchSimilarTV(contentId);
          
          // Load first season episodes
          if (data.seasons && data.seasons.length > 0) {
            const firstSeason = data.seasons.find((s: any) => s.season_number > 0) || data.seasons[0];
            const seasonData = await fetchSeasonDetails(contentId, firstSeason.season_number);
            setEpisodes(seasonData.episodes || []);
            setSelectedSeason(firstSeason.season_number);
          }
        }

        setDetails(data);
        setSimilar(similarData?.results?.slice(0, 10) || []);
      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (contentId) {
      fetchDetails();
    }
  }, [contentId, contentType]);

  const handleSeasonChange = async (seasonNumber: number) => {
    try {
      const seasonData = await fetchSeasonDetails(contentId, seasonNumber);
      setEpisodes(seasonData.episodes || []);
      setSelectedSeason(seasonNumber);
      setSelectedEpisode(1);
    } catch (error) {
      console.error('Error loading season:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-white text-2xl">Content not found</div>
        </div>
      </div>
    );
  }

  const isMovie = contentType === 'movie';
  const title = 'title' in details ? details.title : details.name;
  const releaseDate = 'release_date' in details ? details.release_date : details.first_air_date;
  const year = new Date(releaseDate).getFullYear();
  const backdropUrl = getBackdropUrl(details.backdrop_path);
  const posterUrl = getImageUrl(details.poster_path, 'w500');

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      {/* Hero Section */}
      <div
        className="relative w-full h-96 bg-cover bg-center pt-20"
        style={{ backgroundImage: `url(${backdropUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 -mt-32 relative z-10 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Poster */}
          <div className="md:col-span-1">
            {posterUrl && (
              <img
                src={posterUrl}
                alt={title}
                className="w-full rounded-lg shadow-lg"
              />
            )}
          </div>

          {/* Info */}
          <div className="md:col-span-3">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{title}</h1>

            {/* Meta */}
            <div className="flex flex-wrap gap-4 mb-6 text-gray-300">
              <div className="flex items-center gap-2">
                <Star className="text-yellow-400 fill-yellow-400" size={20} />
                <span className="text-lg font-semibold">{details.vote_average.toFixed(1)}/10</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={20} />
                <span>{year}</span>
              </div>
              {isMovie && 'runtime' in details && (
                <div className="flex items-center gap-2">
                  <Clock size={20} />
                  <span>{details.runtime} min</span>
                </div>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {details.genres?.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 bg-red-600/30 border border-red-600 text-red-400 rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Overview */}
            <p className="text-gray-300 mb-6 leading-relaxed">{details.overview}</p>

            {/* Play Button */}
            <button
              onClick={() => setPlayerOpen(true)}
              className="flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition transform hover:scale-105"
            >
              <Play size={20} fill="currentColor" />
              {isMovie ? 'Play Movie' : 'Play Series'}
            </button>
          </div>
        </div>

        {/* Cast */}
        {details.credits?.cast && details.credits.cast.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {details.credits.cast.slice(0, 10).map((actor) => {
                const actorImageUrl = getImageUrl(actor.profile_path, 'w342');
                return (
                  <div key={actor.id} className="text-center">
                    {actorImageUrl && (
                      <img
                        src={actorImageUrl}
                        alt={actor.name}
                        className="w-full rounded-lg mb-2"
                      />
                    )}
                    <p className="text-white font-semibold text-sm">{actor.name}</p>
                    <p className="text-gray-400 text-xs">{actor.character}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Seasons (for TV) */}
        {!isMovie && 'seasons' in details && episodes.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Seasons & Episodes</h2>

            {/* Season Selector */}
            <div className="mb-6 flex flex-wrap gap-2">
              {('seasons' in details ? details.seasons : [])
                .filter((s: any) => s.season_number > 0)
                .map((season: any) => (
                  <button
                    key={season.season_number}
                    onClick={() => handleSeasonChange(season.season_number)}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      selectedSeason === season.season_number
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    Season {season.season_number}
                  </button>
                ))}
            </div>

            {/* Episodes */}
            <div className="space-y-4">
              {episodes.map((episode) => {
                const episodeImageUrl = getImageUrl(episode.still_path, 'w342');
                return (
                  <div
                    key={episode.id}
                    className="bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition cursor-pointer"
                    onClick={() => {
                      setSelectedEpisode(episode.episode_number);
                      setPlayerOpen(true);
                    }}
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-24 h-14 bg-gray-800 rounded">
                        {episodeImageUrl && (
                          <img
                            src={episodeImageUrl}
                            alt={episode.name}
                            className="w-full h-full object-cover rounded"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold">
                          Episode {episode.episode_number}: {episode.name}
                        </h3>
                        <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                          {episode.overview}
                        </p>
                      </div>
                      <button className="flex-shrink-0 p-2 hover:bg-red-600 rounded-lg transition">
                        <Play size={20} className="text-red-500" fill="currentColor" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Similar Content */}
        {similar.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Similar {isMovie ? 'Movies' : 'Series'}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {similar.map((item) => (
                <MovieCard
                  key={item.id}
                  id={item.id}
                  title={item.title || item.name}
                  posterPath={item.poster_path}
                  rating={item.vote_average}
                  type={contentType as 'movie' | 'tv'}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Player Modal */}
      {playerOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl">
            <button
              onClick={() => setPlayerOpen(false)}
              className="absolute top-4 right-4 p-2 bg-red-600 hover:bg-red-700 rounded-full text-white z-51"
            >
              <X size={24} />
            </button>

            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                src={
                  isMovie
                    ? `https://vidfast.net/movie/${contentId}?autoPlay=true`
                    : `https://vidfast.net/tv/${contentId}/${selectedSeason}/${selectedEpisode}?autoPlay=true`
                }
                className="w-full h-full"
                allowFullScreen
                allow="autoplay; fullscreen"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
