// pages/index.js

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ar`)
      .then(res => res.json())
      .then(data => setMovies(data.results || []));

    fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ar`)
      .then(res => res.json())
      .then(data => setShows(data.results || []));
  }, []);

  const sectionStyle = {
    marginBottom: '3rem'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '1rem'
  };

  const cardStyle = {
    backgroundColor: '#1c1c1c',
    borderRadius: '10px',
    overflow: 'hidden',
    textAlign: 'center',
    boxShadow: '0 0 10px rgba(0,0,0,0.3)'
  };

  const imageStyle = {
    width: '100%',
    height: '220px',
    objectFit: 'cover'
  };

  const titleStyle = {
    padding: '0.5rem',
    color: '#fff',
    fontSize: '14px'
  };

  return (
    <div style={{ backgroundColor: '#0d0d0d', color: '#fff', minHeight: '100vh', padding: '2rem' }}>
      <div style={sectionStyle}>
        <h2 style={{ color: '#00ffc3', marginBottom: '1rem' }}>📺 المسلسلات الشائعة</h2>
        <div style={gridStyle}>
          {shows.map(show => (
            <Link key={show.id} href={`/info/tv?id=${show.id}`} style={{ textDecoration: 'none' }}>
              <div style={cardStyle}>
                <img src={`https://image.tmdb.org/t/p/w500${show.poster_path}`} alt={show.name} style={imageStyle} />
                <div style={titleStyle}>{show.name}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <h2 style={{ color: '#00ffc3', marginBottom: '1rem' }}>🎬 الأفلام الشائعة</h2>
        <div style={gridStyle}>
          {movies.map(movie => (
            <Link key={movie.id} href={`/info/movie?id=${movie.id}`} style={{ textDecoration: 'none' }}>
              <div style={cardStyle}>
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} style={imageStyle} />
                <div style={titleStyle}>{movie.title}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
