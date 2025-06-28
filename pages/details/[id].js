// pages/details/[id].js

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DetailsPage() {
  const router = useRouter();
  const { id, type } = router.query;
  const [data, setData] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
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

  const fetchEpisodes = async (seasonNumber) => {
    try {
      const res = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?api_key=${API_KEY}&language=ar`);
      const result = await res.json();
      setEpisodes(result.episodes || []);
      setSelectedSeason(seasonNumber);
    } catch (err) {
      console.error("فشل في جلب الحلقات:", err);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&language=ar&query=${encodeURIComponent(searchQuery.trim())}`);
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

  if (!data) {
    return <div style={{ color: 'white', textAlign: 'center', paddingTop: '2rem' }}>جارٍ تحميل المعلومات...</div>;
  }

  const vidsrcUrl = (season, episode) => {
    if (type === 'tv') {
      return `https://vidsrc.to/embed/tv/${id}/${season}/${episode}`;
    }
    return `https://vidsrc.to/embed/movie/${id}`;
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
        <Link href="/">
          <button style={{ backgroundColor: '#111', color: '#fff', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer' }}>
            ← رجوع
          </button>
        </Link>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
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
      </div>

      <div style={{ padding: '1rem' }}>
        <div style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${data.backdrop_path})`, backgroundSize: 'cover', backgroundPosition: 'center', padding: '2rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src={`https://image.tmdb.org/t/p/w300${data.poster_path}`} alt={data.title || data.name} style={{ borderRadius: '15px', marginBottom: '1rem', boxShadow: '0 0 20px rgba(0,0,0,0.7)' }} />
          <h1 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '0.5rem' }}>{data.title || data.name}</h1>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>🗓️ {data.first_air_date || data.release_date} | ⭐ {data.vote_average}</div>
          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
            {data.genres?.map((genre) => (
              <span key={genre.id} style={{ backgroundColor: '#ff1744', padding: '0.3rem 0.6rem', borderRadius: '5px', fontSize: '13px' }}>{genre.name}</span>
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
                  <li key={season.id} style={{ backgroundColor: '#222', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }} onClick={() => fetchEpisodes(season.season_number)}>
                    📺 {season.name} — {season.episode_count} حلقات
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selectedSeason && episodes.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <h3>اختر حلقة للمشاهدة:</h3>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                {episodes.map((ep) => (
                  <li key={ep.id}>
                    <a href={vidsrcUrl(selectedSeason, ep.episode_number)} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#333', padding: '0.4rem 0.8rem', borderRadius: '6px', color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                      ▶ {ep.episode_number}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {type === 'movie' && (
            <a href={vidsrcUrl()} target="_blank" rel="noopener noreferrer">
              <button style={{ marginTop: '2rem', backgroundColor: '#ff1744', color: 'white', padding: '0.8rem 2rem', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer' }}>
                ▶ مشاهدة الآن
              </button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
