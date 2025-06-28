
export default async function handler(req, res) {
  const apiKey = process.env.TMDB_API_KEY;
  const response = await fetch(`https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&language=ar`);
  const data = await response.json();

  const results = (data.results || []).map(item => ({
    title: item.title || item.name,
    poster: item.poster_path
      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
      : 'https://via.placeholder.com/300x450?text=No+Image'
  }));

  res.status(200).json(results);
}
