// pages/index.js

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Home() {
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [iframeSrc, setIframeSrc] = useState(null);
  const router = useRouter();

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

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=9597713c8465b4d0e1eafdcf8db693a2&language=ar&query=${encodeURIComponent(searchQuery.trim())}`);
      const result = await res.json();
      if (result.results && result.results.length > 0) {
        const first = result.results.find(item => item.media_type === 'tv' || item.media_type === 'movie');
        if (first) {
          router.push(`/details/${first.id}?type=${first.media_type}`);
        } else {
          alert("لم يتم العثور على نتيجة صالحة.");
        }
      } else {
        alert("لا توجد نتائج.");
      }
    } catch (err) {
      console.error("فشل في البحث:", err);
      alert("حدث خطأ أثناء البحث.");
    }
  };

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
    boxShadow: '0 0 10px rgba(0,0,0,0.3)',
    cursor: 'pointer'
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

  const iframeStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    height: '70vh',
    backgroundColor: '#000',
    border: 'none',
    zIndex: 9999
  };

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: 9998
  };

  return (
    <div style={{ backgroundColor: '#0d0d0d', color: '#fff', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث عن فيلم أو مسلسل..."
          style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#111', color: '#fff', minWidth: '250px' }}
        />
        <button onClick={handleSearch} style={{ backgroundColor: '#ff1744', border: 'none', color: 'white', borderRadius: '8px', padding: '0.5rem 1rem' }}>
          بحث
        </button>
      </div>

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

      {iframeSrc && (
        <>
          <div style={overlayStyle} onClick={() => setIframeSrc(null)} />
          <iframe style={iframeStyle} src={iframeSrc} allowFullScreen></iframe>
        </>
      )}
    </div>
  );
}
