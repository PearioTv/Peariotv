// pages/index.js

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const API_KEY = '9597713c8465b4d0e1eafdcf8db693a2';
    const fetchData = async () => {
      try {
        const showsRes = await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=ar`);
        const showsData = await showsRes.json();
        setShows(showsData.results.slice(0, 10));

        const moviesRes = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=ar`);
        const moviesData = await moviesRes.json();
        setMovies(moviesData.results.slice(0, 10));
      } catch (error) {
        console.error('حدث خطأ أثناء تحميل البيانات:', error);
      }
    };

    fetchData();
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
            <Link key={show.id} href={`/details/${show.id}?type=tv`} style={{ textDecoration: 'none' }}>
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
            <Link key={movie.id} href={`/details/${movie.id}?type=movie`} style={{ textDecoration: 'none' }}>
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
