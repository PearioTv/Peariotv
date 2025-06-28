// pages/info/[type].js

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function InfoPage() {
  const router = useRouter();
  const { id, type } = router.query;
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!id || !type) return;

    fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ar`)
      .then(res => res.json())
      .then(setData)
      .catch(() => setData(null));
  }, [id, type]);

  if (!data) return <div style={{ color: 'white', padding: '2rem' }}>جارٍ تحميل البيانات...</div>;

  return (
    <div style={{ padding: '2rem', color: 'white', backgroundColor: '#111', minHeight: '100vh' }}>
      <h1 style={{ color: '#00ffc3' }}>{data.title || data.name}</h1>
      <img src={`https://image.tmdb.org/t/p/w500${data.poster_path}`} alt={data.title || data.name} style={{ maxWidth: '300px', borderRadius: '10px' }} />
      <p><strong>الوصف:</strong> {data.overview}</p>
      <p><strong>تاريخ الإصدار:</strong> {data.release_date || data.first_air_date}</p>
      <p><strong>التقييم:</strong> ⭐ {data.vote_average}</p>
      <p><strong>عدد الأصوات:</strong> {data.vote_count}</p>
      <p><strong>اللغة:</strong> {data.original_language}</p>
    </div>
  );
}
