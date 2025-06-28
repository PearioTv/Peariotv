export default async function handler(req, res) {
  const response = await fetch(`https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.TMDB_API_KEY}&language=ar`);
  const data = await response.json();
  const results = data.results.map((item) => ({
    id: item.id,
    title: item.title || item.name,
    poster: item.poster_path,
    media_type: item.media_type,
  }));
  res.status(200).json(results);
}