
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function InfoPage() {
  const router = useRouter();
  const { type } = router.query;
  const { id } = router.query;

  const [data, setData] = useState(null);

  useEffect(() => {
    if (type && id) {
      fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ar`)
        .then(res => res.json())
        .then(setData)
        .catch(() => setData({ error: true }));
    }
  }, [type, id]);

  if (!data) return <p style={{ padding: "2rem", color: "#fff" }}>جارٍ تحميل التفاصيل...</p>;

  if (data.error || data.success === false)
    return <p style={{ padding: "2rem", color: "red" }}>تعذر تحميل البيانات.</p>;

  return (
    <div style={{ padding: "2rem", color: "#fff" }}>
      <h1>{data.title || data.name}</h1>
      <img
        src={
          data.poster_path
            ? \`https://image.tmdb.org/t/p/w500\${data.poster_path}\`
            : 'https://via.placeholder.com/300x450?text=No+Image'
        }
        alt="Poster"
        style={{ maxWidth: "300px", borderRadius: "10px" }}
      />
      <p><strong>الوصف:</strong> {data.overview || "لا يوجد وصف."}</p>
      <p><strong>تاريخ الإصدار:</strong> {data.release_date || data.first_air_date || "غير متوفر"}</p>
      <p><strong>التقييم:</strong> ⭐ {data.vote_average}</p>
      <p><strong>اللغة:</strong> {data.original_language}</p>
    </div>
  );
}
