import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/lib/i18n";
import { MediaCard } from "@/components/MediaCard";
import { Loader2 } from "lucide-react";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
}

interface TVShow {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
}

export default function Home() {
  const { language } = useLanguage();
  const [heroBackdrop, setHeroBackdrop] = useState<string | null>(null);

  // Fetch popular movies
  const popularMovies = trpc.movies.popular.useQuery();
  const trendingMovies = trpc.movies.trending.useQuery();
  const upcomingMovies = trpc.movies.upcoming.useQuery();

  // Fetch popular TV shows
  const popularShows = trpc.tv.popular.useQuery();
  const trendingShows = trpc.tv.trending.useQuery();

  // Set hero backdrop from first trending movie
  useEffect(() => {
    if (trendingMovies.data?.[0]?.backdrop_path) {
      setHeroBackdrop(trendingMovies.data[0].backdrop_path);
    }
  }, [trendingMovies.data]);

  const isLoading =
    popularMovies.isLoading ||
    trendingMovies.isLoading ||
    upcomingMovies.isLoading ||
    popularShows.isLoading ||
    trendingShows.isLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      {heroBackdrop && (
        <div
          className="relative h-96 w-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroBackdrop})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950" />
          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-4 pb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {t("trendingMovies", language)}
              </h1>
              <p className="text-slate-300">{t("newReleases", language)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Content Sections */}
      <div className="container mx-auto px-4 py-12">
        {/* Trending Movies */}
        <Section
          title={t("trendingMovies", language)}
          items={trendingMovies.data || []}
          mediaType="movie"
        />

        {/* Popular Movies */}
        <Section
          title={t("popularMovies", language)}
          items={popularMovies.data || []}
          mediaType="movie"
        />

        {/* Upcoming Movies */}
        <Section
          title={t("upcomingMovies", language)}
          items={upcomingMovies.data || []}
          mediaType="movie"
        />

        {/* Popular TV Shows */}
        <Section
          title={t("popularShows", language)}
          items={popularShows.data || []}
          mediaType="tv"
        />

        {/* Trending TV Shows */}
        <Section
          title={t("trendingShows", language)}
          items={trendingShows.data || []}
          mediaType="tv"
        />
      </div>
    </div>
  );
}

function Section({
  title,
  items,
  mediaType,
}: {
  title: string;
  items: (Movie | TVShow)[];
  mediaType: "movie" | "tv";
}) {
  return (
    <section className="mb-12">
      <h2 className="mb-6 text-2xl font-bold text-white">{title}</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {items.slice(0, 12).map((item) => (
          <MediaCard
            key={item.id}
            id={item.id}
            title={"title" in item ? item.title : item.name}
            posterPath={item.poster_path}
            rating={item.vote_average}
            mediaType={mediaType}
          />
        ))}
      </div>
    </section>
  );
}
