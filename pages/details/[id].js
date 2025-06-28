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

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
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
    <div
      style={{
        backgroundColor: '#000',
        color: '#fff',
        minHeight: '100vh',
        padding: '1rem',
        fontFamily: 'sans-serif'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
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
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: '1px solid #444',
              backgroundColor: '#111',
              color: '#fff',
              minWidth: '250px'
            }}
          />
          <button onClick={handleSearch} style={{ backgroundColor: '#ff1744', border: 'none', color: 'white', borderRadius: '8px', padding: '0.5rem 1rem' }}>
            بحث
          </button>
        </div>
      </div>

      {/* بقية تفاصيل الفيلم أو المسلسل */}
      {/* ... */}
    </div>
  );
}
