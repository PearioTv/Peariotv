// pages/details/[id].js

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DetailsPage() {
  const router = useRouter();
  const { id, type } = router.query;
  const [data, setData] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const API_KEY = '9597713c8465b4d0e1eafdcf8db693a2';

  useEffect(() => {
    if (!router.isReady || !id || !type) return;

    const fetchDetails = async () => {
      try {
        const res = await fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}&language=ar`);
        const result = await res.json();
        if (result.success === false) {
          console.error("TMDB Error:", result.status_message);
          return;
        }
        setData(result);
        if (type === 'tv') {
          setSeasons(result.seasons || []);
        }
      } catch (err) {
        console.error("فشل في جلب البيانات:", err);
      }
    };

    fetchDetails();
  }, [router.isReady, id, type]);

  if (!data) {
    return <div style={{ color: 'white', textAlign: 'center', paddingTop: '2rem' }}>جارٍ تحميل المعلومات...</div>;
  }

  const vidsrcUrl = `https://vidsrc.to/embed/${type === 'tv' ? 'tv' : 'movie'}/${id}`;

  return (
    <div
      style={{
        backgroundColor: '#000',
        color: '#fff',
        minHeight: '100vh',
        padding: '1rem',
        fontFamily: 'sans-serif'
      }}
    >
      <Link href="/">
        <button style={{ marginBottom: '1rem', backgroundColor: '#111', color: '#fff', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer' }}>
          ← رجوع
        </button>
      </Link>

      <div style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${data.backdrop_path})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '2rem',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <img
          src={`https://image.tmdb.org/t/p/w300${data.poster_path}`}
          alt={data.title || data.name}
          style={{ borderRadius: '15px', marginBottom: '1rem', boxShadow: '0 0 20px rgba(0,0,0,0.7)' }}
        />
        <h1 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '0.5rem' }}>{data.title || data.name}</h1>
        <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
          🗓️ {data.first_air_date || data.release_date} | ⭐ {data.vote_average}
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
          {data.genres && data.genres.map((genre) => (
            <span key={genre.id} style={{ backgroundColor: '#ff1744', padding: '0.3rem 0.6rem', borderRadius: '5px', fontSize: '13px' }}>
              {genre.name}
            </span>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '2rem', backgroundColor: '#111', padding: '1.5rem', borderRadius: '12px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>القصة</h2>
        <p style={{ lineHeight: '1.7', fontSize: '15px', color: '#ccc' }}>{data.overview}</p>

        {type === 'tv' && seasons.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>المواسم ({seasons.length})</h3>
            <ul style={{ padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {seasons.map((season) => (
                <li key={season.id} style={{ backgroundColor: '#222', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                  📺 {season.name} — {season.episode_count} حلقات
                </li>
              ))}
            </ul>
          </div>
        )}

        <a href={vidsrcUrl} target="_blank" rel="noopener noreferrer">
          <button
            style={{
              marginTop: '2rem',
              backgroundColor: '#ff1744',
              color: 'white',
              padding: '0.8rem 2rem',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            ▶ مشاهدة الآن
          </button>
        </a>
      </div>
    </div>
  );
}
