import Head from 'next/head';
import Link from 'next/link';


export default function Home({ movies }) {
  return (
    <div>
      <Head>
        <title>Cineby Clone</title>
      </Head>
      <header className="header">Cineby Clone</header>
      <div className="grid">
        {movies.map((item) => (
          <Link href={`/info?id=${item.id}&type=${item.media_type}`} key={item.id}>
            <a className="card">
              <img src={`https://image.tmdb.org/t/p/w500${item.poster}`} alt={item.title} />
              <div className="card-title">{item.title}</div>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/popular`);
  const data = await res.json();

  return {
    props: {
      movies: data,
    },
  };
}