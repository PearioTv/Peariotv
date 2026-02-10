import { useState } from "react";
import { Heart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/lib/i18n";
import { useLocation } from "wouter";

interface MediaCardProps {
  id: number;
  title: string;
  posterPath: string | null;
  rating: number;
  mediaType: "movie" | "tv";
  isFavorite?: boolean;
  isInWatchlist?: boolean;
  onFavoriteToggle?: () => void;
  onWatchlistToggle?: () => void;
}

export function MediaCard({
  id,
  title,
  posterPath,
  rating,
  mediaType,
  isFavorite = false,
  isInWatchlist = false,
  onFavoriteToggle,
  onWatchlistToggle,
}: MediaCardProps) {
  const { language } = useLanguage();
  const [showActions, setShowActions] = useState(false);
  const [, navigate] = useLocation();

  const detailPath = mediaType === "movie" ? `/movie/${id}` : `/tv/${id}`;

  const handleCardClick = () => {
    navigate(detailPath);
  };

  return (
    <div
      className="group relative overflow-hidden rounded-lg bg-slate-900 shadow-lg transition-transform duration-300 hover:scale-105 cursor-pointer"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={handleCardClick}
    >
      {/* Poster Image */}
      <div className="relative h-64 w-full overflow-hidden bg-slate-800 sm:h-72">
        {posterPath ? (
          <img
            src={posterPath}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900">
            <span className="text-sm text-slate-400">{t("noResults", language)}</span>
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Rating Badge */}
        <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-yellow-500/90 px-2 py-1 text-xs font-bold text-white">
          ⭐ {rating.toFixed(1)}
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="absolute inset-0 flex items-center justify-center gap-2">
            <Button
              size="sm"
              variant={isFavorite ? "default" : "outline"}
              className="rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                onFavoriteToggle?.();
              }}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
            </Button>
            <Button
              size="sm"
              variant={isInWatchlist ? "default" : "outline"}
              className="rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                onWatchlistToggle?.();
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Title and Info */}
      <div className="p-3">
        <h3 className="line-clamp-2 text-sm font-semibold text-white hover:text-blue-400">
          {title}
        </h3>
      </div>
    </div>
  );
}
