import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';
import {
  fetchTrending,
  fetchPopular,
  fetchTopRated,
  discoverMovies,
  discoverTV,
  type Movie,
  type TVSeries,
} from '@shared/tmdb';

interface MovieSliderProps {
  title: string;
  category: 'trending' | 'popular' | 'top_rated' | 'discover';
  type: 'movie' | 'tv';
  genreId?: number;
}

type Content = Movie | TVSeries;

export default function MovieSlider({
  title,
  category,
  type,
  genreId,
}: MovieSliderProps) {
  const [items, setItems] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let data;

        if (category === 'trending') {
          data = await fetchTrending(type);
        } else if (category === 'popular') {
          data = await fetchPopular(type);
        } else if (category === 'top_rated') {
          data = await fetchTopRated(type);
        } else if (category === 'discover') {
          if (type === 'movie') {
            data = await discoverMovies(genreId);
          } else {
            data = discoverTV(genreId);
          }
        }

        setItems(data?.results?.slice(0, 20) || []);
      } catch (error) {
        console.error(`Error fetching ${category}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category, type, genreId]);

  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scrollAmount = 400;
    const newScrollLeft =
      direction === 'left'
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    });

    // Update button states after scroll
    setTimeout(() => updateScrollButtons(), 300);
  };

  const updateScrollButtons = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  useEffect(() => {
    updateScrollButtons();
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', updateScrollButtons);
      return () => container.removeEventListener('scroll', updateScrollButtons);
    }
  }, [items]);

  if (loading) {
    return (
      <section className="py-8">
        <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-40 h-60 bg-gray-800 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="p-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white transition"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="p-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white transition"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex gap-4 overflow-x-auto pb-4 scroll-smooth"
        style={{ scrollBehavior: 'smooth' }}
      >
        {items.map((item) => (
          <div key={item.id} className="flex-shrink-0 w-40">
            <MovieCard
              id={item.id}
              title={'title' in item ? item.title : item.name}
              posterPath={item.poster_path}
              rating={item.vote_average}
              type={type}
              year={new Date(
                'release_date' in item ? item.release_date : item.first_air_date
              ).getFullYear().toString()}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
