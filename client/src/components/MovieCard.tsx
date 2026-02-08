import { Link } from 'wouter';
import { Play, Star } from 'lucide-react';
import { getImageUrl } from '@shared/tmdb';

interface MovieCardProps {
  id: number;
  title: string;
  posterPath: string | null;
  rating: number;
  type?: 'movie' | 'tv';
  year?: string;
}

export default function MovieCard({
  id,
  title,
  posterPath,
  rating,
  type = 'movie',
  year,
}: MovieCardProps) {
  const imageUrl = getImageUrl(posterPath, 'w342');

  return (
    <Link href={`/details/${id}?type=${type}`}>
      <div className="group cursor-pointer">
        <div className="relative overflow-hidden rounded-lg bg-gray-900 aspect-[2/3]">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <span className="text-gray-600">No Image</span>
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-300 flex items-center justify-center">
            <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-red-600 hover:bg-red-700 text-white rounded-full p-3 transform scale-75 group-hover:scale-100 transition-transform duration-300">
              <Play size={24} fill="currentColor" />
            </button>
          </div>

          {/* Rating Badge */}
          <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded-lg flex items-center gap-1">
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
            <span className="text-white text-sm font-semibold">{rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Info */}
        <div className="mt-3">
          <h3 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-red-500 transition">
            {title}
          </h3>
          {year && (
            <p className="text-gray-400 text-xs mt-1">{year}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
