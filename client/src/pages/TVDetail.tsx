import { useParams } from "wouter";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/lib/i18n";
import { Heart, Plus, Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";

export default function TVDetail() {
  const { id } = useParams();
  const { language } = useLanguage();
  const { user } = useAuth();
  const tvId = parseInt(id || "0");

  const tvQuery = trpc.tv.detail.useQuery(tvId);
  const seasonsQuery = trpc.tv.seasons.useQuery(tvId);
  const isFavoriteQuery = trpc.favorites.isFavorite.useQuery(
    { tmdbId: tvId, mediaType: "tv" },
    { enabled: !!user }
  );
  const isInWatchlistQuery = trpc.watchlist.isInWatchlist.useQuery(
    { tmdbId: tvId, mediaType: "tv" },
    { enabled: !!user }
  );

  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  const seasonEpisodesQuery = trpc.tv.season.useQuery({
    tvId,
    seasonNumber: selectedSeason,
  });

  const addFavoriteMutation = trpc.favorites.add.useMutation();
  const removeFavoriteMutation = trpc.favorites.remove.useMutation();
  const addToWatchlistMutation = trpc.watchlist.add.useMutation();
  const removeFromWatchlistMutation = trpc.watchlist.remove.useMutation();

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
    if (!tvQuery.data) return;

    if (isFavorite) {
      await removeFavoriteMutation.mutateAsync({
        tmdbId: tvId,
        mediaType: "tv",
      });
    } else {
      await addFavoriteMutation.mutateAsync({
        tmdbId: tvId,
        mediaType: "tv",
        title: tvQuery.data.name,
        posterPath: tvQuery.data.poster_path || undefined,
      });
    }
    setIsFavorite(!isFavorite);
  };

  const handleToggleWatchlist = async () => {
    if (!user) return;
    if (!tvQuery.data) return;

    if (isInWatchlist) {
      await removeFromWatchlistMutation.mutateAsync({
        tmdbId: tvId,
        mediaType: "tv",
      });
    } else {
      await addToWatchlistMutation.mutateAsync({
        tmdbId: tvId,
        mediaType: "tv",
        title: tvQuery.data.name,
        posterPath: tvQuery.data.poster_path || undefined,
      });
    }
    setIsInWatchlist(!isInWatchlist);
  };

  if (tvQuery.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!tvQuery.data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white">{t("error", language)}</p>
      </div>
    );
  }

  const tv = tvQuery.data;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      {tv.backdrop_path && (
        <div
          className="relative h-96 w-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${tv.backdrop_path})`,
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
            {tv.poster_path && (
              <img
                src={tv.poster_path}
                alt={tv.name}
                className="w-full rounded-lg shadow-lg"
              />
            )}
          </div>

          {/* Info */}
          <div className="md:col-span-2">
            <h1 className="mb-2 text-4xl font-bold text-white">{tv.name}</h1>
            <div className="mb-4 flex flex-wrap gap-4 text-sm text-slate-300">
              <span>⭐ {tv.vote_average.toFixed(1)}</span>
              <span>{tv.first_air_date?.split("-")[0]}</span>
              <span>{tv.number_of_seasons} {t("seasons", language)}</span>
              <span>{tv.number_of_episodes} {t("episodes", language)}</span>
            </div>

            {/* Genres */}
            <div className="mb-4 flex flex-wrap gap-2">
              {tv.genres?.map((genre) => (
                <span
                  key={genre.id}
                  className="rounded-full bg-blue-600/20 px-3 py-1 text-xs font-semibold text-blue-300"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Overview */}
            <p className="mb-6 text-slate-300">{tv.overview}</p>

            {/* Action Buttons */}
            <div className="mb-8 flex flex-wrap gap-4">
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
            {tv.credits?.cast && tv.credits.cast.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-bold text-white">{t("cast", language)}</h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {tv.credits.cast.slice(0, 8).map((actor) => (
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

        {/* Season and Episode Selection */}
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-white">{t("episodes", language)}</h2>

          <div className="mb-6 flex flex-wrap gap-2">
            {seasonsQuery.data?.map((season) => (
              <Button
                key={season.season_number}
                variant={selectedSeason === season.season_number ? "default" : "outline"}
                onClick={() => {
                  setSelectedSeason(season.season_number);
                  setSelectedEpisode(1);
                }}
              >
                {t("season", language)} {season.season_number}
              </Button>
            ))}
          </div>

          {/* Episodes Grid */}
          {seasonEpisodesQuery.isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {seasonEpisodesQuery.data?.map((episode) => (
                <div
                  key={episode.episode_number}
                  className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                    selectedEpisode === episode.episode_number
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-slate-700 hover:border-slate-600"
                  }`}
                  onClick={() => setSelectedEpisode(episode.episode_number)}
                >
                  <h3 className="font-semibold text-white">
                    {t("episode", language)} {episode.episode_number}: {episode.name}
                  </h3>
                  <p className="mt-2 text-sm text-slate-400">{episode.overview}</p>
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                    <span>{episode.air_date}</span>
                    <span>⭐ {episode.vote_average.toFixed(1)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Embedded Player */}
          <div className="mt-12">
            <h2 className="mb-4 text-2xl font-bold text-white">{t("watchNow", language)}</h2>
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-slate-900">
              <iframe
                src={`https://vidfast.pro/tv/${tv.id}/${selectedSeason}/${selectedEpisode}?autoPlay=true&title=true&poster=true&nextButton=true&autoNext=true`}
                className="h-full w-full border-0"
                allowFullScreen
                allow="autoplay"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
