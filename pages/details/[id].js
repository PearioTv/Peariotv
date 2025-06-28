// pages/details/[id].js

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Details() {
  const router = useRouter();
  const { id, type } = router.query;
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!id || !type) return;

    const fetchDetails = async () => {
      const API_KEY = '9597713c8465b4d0e1eafdcf8db693a2';
      const endpoint = `https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}&language=ar`;
      const res = await fetch(endpoint);
      const json = await res.json();
      setData(json);
    };

    fetchDetails();
  }, [id, type]);

  if (!data) return <p style={{ color: 'white', textAlign: 'center' }}>جارٍ تحميل البيانات...</p>;

  return (
    <div style={{ backgroundColor: '#0d0d0d', color: 'white', minHeight: '100vh', padding: '2rem' }}>
      <h1>{type === 'movie' ? data.title : data.name}</h1>
      <img src={`https://image.tmdb.org/t/p/w500${data.poster_path}`} alt={data.title || data.name} style={{ maxWidth: '300px', borderRadius: '10px' }} />
      <p style={{ marginTop: '1rem' }}>{data.overview}</p>
      <p><strong>التقييم:</strong> ⭐ {data.vote_average}</p>
      <p><strong>تاريخ الإصدار:</strong> {data.release_date || data.first_air_date}</p>
    </div>
  );
}
