
import { useEffect, useState } from 'react';

export default function Home() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch('/api/popular')
      .then(res => res.json())
      .then(data => setMovies(data.map(m => ({ ...m, id: m.id, type: m.media_type }))))
      .catch(err => console.error('Error fetching movies:', err));
  }, []);

  return (
    <div className="grid">
      {movies.map((m, i) => (
        <div className="card" key={i} onClick={() => window.location.href=`/info/${m.type}?id=${m.id}` } style={{ cursor: "pointer" }}>
          <img src={m.poster} alt={m.title} />
          <div className="card-title">{m.title}</div>
        </div>
      ))}
    </div>
  );
}
