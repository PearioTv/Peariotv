// pages/index.js

import Link from 'next/link';

export default function Home() {
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

  const sampleShows = [
    { id: 1, name: 'لعبة الحبّار', poster: 'https://image.tmdb.org/t/p/w500/6f0Uokj58OGzgYjGobeJZDtTcUX.jpg' },
    { id: 2, name: 'ذا بير', poster: 'https://image.tmdb.org/t/p/w500/eKfVzzEazSIjJMrw9ADa2x8ksLz.jpg' }
  ];

  const sampleMovies = [
    { id: 3, title: 'The Ritual', poster: 'https://image.tmdb.org/t/p/w500/uubL8yvtEBjz3V7DFQHjCuSQO8w.jpg' },
    { id: 4, title: 'ميغان ٢.٠', poster: 'https://image.tmdb.org/t/p/w500/rugqCpq8yBGWaQW6dMY2DVOEW7e.jpg' }
  ];

  return (
    <div style={{ backgroundColor: '#0d0d0d', color: '#fff', minHeight: '100vh', padding: '2rem' }}>
      <div style={sectionStyle}>
        <h2 style={{ color: '#00ffc3', marginBottom: '1rem' }}>📺 المسلسلات الشائعة</h2>
        <div style={gridStyle}>
          {sampleShows.map(show => (
            <Link key={show.id} href="#" style={{ textDecoration: 'none' }}>
              <div style={cardStyle}>
                <img src={show.poster} alt={show.name} style={imageStyle} />
                <div style={titleStyle}>{show.name}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <h2 style={{ color: '#00ffc3', marginBottom: '1rem' }}>🎬 الأفلام الشائعة</h2>
        <div style={gridStyle}>
          {sampleMovies.map(movie => (
            <Link key={movie.id} href="#" style={{ textDecoration: 'none' }}>
              <div style={cardStyle}>
                <img src={movie.poster} alt={movie.title} style={imageStyle} />
                <div style={titleStyle}>{movie.title}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
