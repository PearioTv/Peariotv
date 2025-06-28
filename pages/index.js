
import { useEffect, useState } from 'react';

export default function Home() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch('/api/popular')
      .then(res => res.json())
      .then(setMovies)
      .catch(err => console.error('Error fetching movies:', err));
  }, []);

  return (
    <div className="grid">
      {movies.map((m, i) => (
        <div className="card" key={i}>
          <img src={m.poster} alt={m.title} />
          <div className="card-title">{m.title}</div>
        </div>
      ))}
    </div>
  );
}
