// pages/index.js

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [shows, setShows] = useState([]);

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ar`)
      .then(res => res.json())
      .then(data => setShows(data.results || []))
      .catch(() => setShows([]));
  }, []);

  return (
    <div style={{ backgroundColor: '#0f0f0f', color: '#fff', minHeight: '100vh', padding: '2rem' }}>
      <h1 style={{ color: '#00ffc3' }}>المسلسلات الشائعة</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
        {shows.map(show => (
          <Link key={show.id} href={`/info/${encodeURIComponent('tv')}?id=${show.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ backgroundColor: '#1e1e1e', borderRadius: '10px', overflow: 'hidden', textAlign: 'center' }}>
              <img
                src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                alt={show.name}
                style={{ width: '100%', height: '270px', objectFit: 'cover' }}
              />
              <p style={{ padding: '0.5rem' }}>{show.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
