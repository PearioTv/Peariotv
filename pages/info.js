import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import '../styles/globals.css';

export default function Info() {
  const router = useRouter();
  const { id, type } = router.query;
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    if (id && type) {
      fetch(`/api/details?id=${id}&type=${type}`)
        .then((res) => res.json())
        .then(setMovie);
    }
  }, [id, type]);

  if (!movie) return <p className="loading">جارٍ تحميل البيانات...</p>;

  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/300x450?text=No+Image';

  return (
    <div className="details-container">
      <Head>
        <title>{movie.title || movie.name}</title>
      </Head>
      <div className="poster">
        <img src={poster} alt={movie.title || movie.name} />
      </div>
      <div className="info">
        <h2>{movie.title || movie.name}</h2>
        <p><strong>الوصف:</strong> {movie.overview || 'لا يوجد وصف.'}</p>
        <p><strong>تاريخ الإصدار:</strong> {movie.release_date || movie.first_air_date || 'غير معروف'}</p>
        <p><strong>التقييم:</strong> ⭐ {movie.vote_average || 'غير متوفر'}</p>
        <p><strong>عدد الأصوات:</strong> {movie.vote_count || 0}</p>
        <p><strong>اللغة:</strong> {movie.original_language || '-'}</p>
      </div>
    </div>
  );
}