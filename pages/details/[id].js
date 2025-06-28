// pages/details/[id].js

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function DetailsPage() {
  const router = useRouter();
  const { id, type } = router.query;
  const [details, setDetails] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [iframeSrc, setIframeSrc] = useState(null);

  useEffect(() => {
    if (!id || !type) return;

    const fetchDetails = async () => {
      try {
        const API_KEY = '9597713c8465b4d0e1eafdcf8db693a2';
        const res = await fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}&language=ar`);
        if (!res.ok) throw new Error('فشل في تحميل التفاصيل');
        const data = await res.json();
        setDetails(data);

        if (type === 'tv') {
          setSeasons(data.seasons || []);
        }
      } catch (error) {
        console.error('خطأ في تحميل المعلومات:', error);
        setDetails(null);
      }
    };

    fetchDetails();
  }, [id, type]);

  const loadEpisodes = async (seasonNumber) => {
    setSelectedSeason(seasonNumber);
    try {
      const API_KEY = '9597713c8465b4d0e1eafdcf8db693a2';
      const res = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?api_key=${API_KEY}&language=ar`);
      if (!res.ok) throw new Error('فشل في تحميل الحلقات');
      const data = await res.json();
      setEpisodes(data.episodes || []);
    } catch (err) {
      console.error('خطأ في تحميل الحلقات:', err);
      setEpisodes([]);
    }
  };

  const handlePlay = (episodeNumber = null) => {
    let src = `https://vidsrc.to/embed/${type}/${id}`;
    if (type === 'tv' && selectedSeason && episodeNumber) {
      src += `/${selectedSeason}/${episodeNumber}`;
    }
    setIframeSrc(src);
  };

  const containerStyle = {
    backgroundColor: '#0d0d0d',
    color: '#fff',
    minHeight: '100vh',
    padding: '2rem'
  };

  const posterStyle = {
    width: '200px',
    borderRadius: '10px',
    marginBottom: '1rem'
  };

  const sectionStyle = {
    marginTop: '2rem'
  };

  const buttonStyle = {
    backgroundColor: '#ff1744',
    border: 'none',
    color: 'white',
    borderRadius: '8px',
    padding: '0.5rem 1rem',
    margin: '0.2rem',
    cursor: 'pointer'
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
    <div style={containerStyle}>
      {details ? (
        <>
          <img src={`https://image.tmdb.org/t/p/w500${details.poster_path}`} alt={details.title || details.name} style={posterStyle} />
          <h1>{details.title || details.name}</h1>
          <p>{details.overview}</p>

          {type === 'movie' && (
            <button style={buttonStyle} onClick={() => handlePlay()}>🎬 مشاهدة الفيلم</button>
          )}

          {type === 'tv' && (
            <div style={sectionStyle}>
              <h3>📚 المواسم</h3>
              {seasons.map(season => (
                <button key={season.season_number} style={buttonStyle} onClick={() => loadEpisodes(season.season_number)}>
                  الموسم {season.season_number}
                </button>
              ))}

              {episodes.length > 0 && (
                <div style={sectionStyle}>
                  <h4>📺 الحلقات</h4>
                  {episodes.map(ep => (
                    <button key={ep.id} style={buttonStyle} onClick={() => handlePlay(ep.episode_number)}>
                      الحلقة {ep.episode_number}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <p>❌ لم يتم العثور على معلومات هذا العنوان أو يوجد خطأ في الاتصال بالـ API.</p>
      )}

      {iframeSrc && (
        <>
          <div style={overlayStyle} onClick={() => setIframeSrc(null)} />
          <iframe style={iframeStyle} src={iframeSrc} allowFullScreen></iframe>
        </>
      )}
    </div>
  );
}
