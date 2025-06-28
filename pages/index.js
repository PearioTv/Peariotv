import { useEffect, useState } from 'react';

export default function Home() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        setMovies(data.map(m => ({ ...m, type: 'tv' })));
      });
  }, []);

  return (
    <div style={{ padding: '2rem', background: '#000', color: '#fff' }}>
      <h1 style={{ color: '#0f0' }}>أحدث المسلسلات</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {movies.map((m, i) => (
          <div
            key={i}
            style={{ background: '#111', borderRadius: '10px', overflow: 'hidden', cursor: 'pointer' }}
            onClick={() => window.location.href = `/info/${m.type}?id=${m.id}`}
          >
            <img src={m.poster} alt={m.title} style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
            <div style={{ padding: '0.5rem', textAlign: 'center' }}>{m.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}