// pages/details/[id].js

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DetailsPage() {
  const router = useRouter();
  const { id, type } = router.query;
  const [data, setData] = useState(null);
  const API_KEY = '9597713c8465b4d0e1eafdcf8db693a2';

  useEffect(() => {
    if (!id || !type) return;

    const fetchDetails = async () => {
      const res = await fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}&language=ar`);
      const result = await res.json();
      setData(result);
    };

    fetchDetails();
  }, [id, type]);

  if (!data) {
    return <div style={{ color: 'white', textAlign: 'center', paddingTop: '2rem' }}>جارٍ تحميل المعلومات...</div>;
  }

  return (
    <div
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${data.backdrop_path})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#fff',
        minHeight: '100vh',
        padding: '2rem',
        backdropFilter: 'blur(5px)'
      }}
    >
      <Link href="/">
        <button style={{ marginBottom: '2rem', backgroundColor: '#111', color: '#fff', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer' }}>
          ← رجوع
        </button>
      </Link>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-start' }}>
        <img
          src={`https://image.tmdb.org/t/p/w500${data.poster_path}`}
          alt={data.title || data.name}
          style={{ width: '200px', borderRadius: '10px' }}
        />
        <div style={{ maxWidth: '600px' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{data.title || data.name}</h1>
          <p style={{ marginBottom: '1rem' }}>
            🗓️ {data.first_air_date || data.release_date} &nbsp;&nbsp; ⭐ {data.vote_average}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            {data.genres && data.genres.map((genre) => (
              <span key={genre.id} style={{ backgroundColor: '#ff1744', padding: '0.3rem 0.6rem', borderRadius: '5px', fontSize: '14px' }}>
                {genre.name}
              </span>
            ))}
          </div>
          <p style={{ lineHeight: '1.6', marginBottom: '1.5rem' }}>{data.overview}</p>

          <button style={{ backgroundColor: '#ff1744', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            ▶ مشاهدة الآن
          </button>
        </div>
      </div>
    </div>
  );
}
