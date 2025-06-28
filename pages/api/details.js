export default async function handler(req, res) {
  const { id, type } = req.query;
  const response = await fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${process.env.TMDB_API_KEY}&language=ar`);
  const data = await response.json();
  res.status(200).json(data);
}