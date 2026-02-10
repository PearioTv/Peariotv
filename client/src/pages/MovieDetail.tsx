import { useParams } from "wouter";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/lib/i18n";
import { Heart, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";

export default function MovieDetail() {
  const { id } = useParams();
  const { language } = useLanguage();
  const { user } = useAuth();
  const movieId = parseInt(id || "0");

  const movieQuery = trpc.movies.detail.useQuery(movieId);
  const isFavoriteQuery = trpc.favorites.isFavorite.useQuery(
    { tmdbId: movieId, mediaType: "movie" },
    { enabled: !!user }
  );
  const isInWatchlistQuery = trpc.watchlist.isInWatchlist.useQuery(
    { tmdbId: movieId, mediaType: "movie" },
    { enabled: !!user }
  );

  const addFavoriteMutation = trpc.favorites.add.useMutation();
  const removeFavoriteMutation = trpc.favorites.remove.useMutation();
  const addToWatchlistMutation = trpc.watchlist.add.useMutation();
  const removeFromWatchlistMutation = trpc.watchlist.remove.useMutation();

  const [isFavorite, setIsFavorite] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    if (isFavoriteQuery.data !== undefined) {
      setIsFavorite(isFavoriteQuery.data);
    }
  }, [isFavoriteQuery.data]);

  useEffect(() => {
    if (isInWatchlistQuery.data !== undefined) {
      setIsInWatchlist(isInWatchlistQuery.data);
    }
  }, [isInWatchlistQuery.data]);

  const handleToggleFavorite = async () => {
    if (!user) return;
    if (!movieQuery.data) return;

    if (isFavorite) {
      await removeFavoriteMutation.mutateAsync({
        tmdbId: movieId,
        mediaType: "movie",
      });
    } else {
      await addFavoriteMutation.mutateAsync({
        tmdbId: movieId,
        mediaType: "movie",
        title: movieQuery.data.title,
        posterPath: movieQuery.data.poster_path || undefined,
      });
    }
    setIsFavorite(!isFavorite);
  };

  const handleToggleWatchlist = async () => {
    if (!user) return;
    if (!movieQuery.data) return;

    if (isInWatchlist) {
      await removeFromWatchlistMutation.mutateAsync({
        tmdbId: movieId,
        mediaType: "movie",
      });
    } else {
      await addToWatchlistMutation.mutateAsync({
        tmdbId: movieId,
        mediaType: "movie",
        title: movieQuery.data.title,
        posterPath: movieQuery.data.poster_path || undefined,
      });
    }
    setIsInWatchlist(!isInWatchlist);
  };

  if (movieQuery.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!movieQuery.data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white">{t("error", language)}</p>
      </div>
    );
  }

  const movie = movieQuery.data;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      {movie.backdrop_path && (
        <div
          className="relative h-96 w-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${movie.backdrop_path})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950" />
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Poster */}
          <div className="md:col-span-1">
            {movie.poster_path && (
              <img
                src={movie.poster_path}
                alt={movie.title}
                className="w-full rounded-lg shadow-lg"
              />
            )}
          </div>

          {/* Info */}
          <div className="md:col-span-2">
            <h1 className="mb-2 text-4xl font-bold text-white">{movie.title}</h1>
            <div className="mb-4 flex flex-wrap gap-4 text-sm text-slate-300">
              <span>⭐ {movie.vote_average.toFixed(1)}</span>
              <span>{movie.release_date?.split("-")[0]}</span>
              <span>{movie.runtime} {t("duration", language)}</span>
            </div>

            {/* Genres */}
            <div className="mb-4 flex flex-wrap gap-2">
              {movie.genres?.map((genre) => (
                <span
                  key={genre.id}
                  className="rounded-full bg-blue-600/20 px-3 py-1 text-xs font-semibold text-blue-300"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Overview */}
            <p className="mb-6 text-slate-300">{movie.overview}</p>

            {/* Action Buttons */}
            <div className="mb-8 flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  window.open(`https://vidfast.pro/movie/${movie.id}?autoPlay=true`, "_blank");
                }}
              >
                {t("watchNow", language)}
              </Button>
              {user && (
                <>
                  <Button
                    size="lg"
                    variant={isFavorite ? "default" : "outline"}
                    onClick={handleToggleFavorite}
                  >
                    <Heart className={`mr-2 h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
                    {isFavorite ? t("removeFromFavorites", language) : t("addToFavorites", language)}
                  </Button>
                  <Button
                    size="lg"
                    variant={isInWatchlist ? "default" : "outline"}
                    onClick={handleToggleWatchlist}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {isInWatchlist ? t("removeFromWatchlist", language) : t("addToWatchlist", language)}
                  </Button>
                </>
              )}
            </div>

            {/* Cast */}
            {movie.credits?.cast && movie.credits.cast.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-bold text-white">{t("cast", language)}</h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {movie.credits.cast.slice(0, 8).map((actor) => (
                    <div key={actor.id} className="text-center">
                      {actor.profile_path && (
                        <img
                          src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                          alt={actor.name}
                          className="mb-2 w-full rounded-lg"
                        />
                      )}
                      <p className="text-sm font-semibold text-white">{actor.name}</p>
                      <p className="text-xs text-slate-400">{actor.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Embedded Player */}
        <div className="mt-12">
          <h2 className="mb-4 text-2xl font-bold text-white">{t("watchNow", language)}</h2>
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-slate-900">
            <iframe
              src={`https://vidfast.pro/movie/${movie.id}?autoPlay=true&title=true&poster=true&nextButton=false`}
              className="h-full w-full border-0"
              allowFullScreen
              allow="autoplay"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
