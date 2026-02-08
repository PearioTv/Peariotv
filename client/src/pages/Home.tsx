import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import MovieSlider from '@/components/MovieSlider';

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <div className="bg-black">
        <div className="container mx-auto px-4 py-12 space-y-12">
          {/* Trending Today */}
          <MovieSlider
            title="Trending Today"
            category="trending"
            type="movie"
          />

          {/* Popular Movies */}
          <MovieSlider
            title="Popular Movies"
            category="popular"
            type="movie"
          />

          {/* Top Rated Movies */}
          <MovieSlider
            title="Top Rated Movies"
            category="top_rated"
            type="movie"
          />

          {/* Popular Series */}
          <MovieSlider
            title="Popular Series"
            category="popular"
            type="tv"
          />

          {/* Top Rated Series */}
          <MovieSlider
            title="Top Rated Series"
            category="top_rated"
            type="tv"
          />

          {/* Streaming Platform Sections */}
          <div className="pt-8">
            <h2 className="text-3xl font-bold text-white mb-8">Streaming Platforms</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { name: 'Netflix', color: 'bg-red-700' },
                { name: 'Prime Video', color: 'bg-blue-700' },
                { name: 'Max', color: 'bg-purple-700' },
                { name: 'Disney+', color: 'bg-cyan-700' },
                { name: 'Apple TV', color: 'bg-gray-700' },
                { name: 'Paramount', color: 'bg-indigo-700' },
              ].map((platform) => (
                <div
                  key={platform.name}
                  className={`${platform.color} rounded-lg p-6 text-center cursor-pointer hover:opacity-80 transition`}
                >
                  <p className="text-white font-semibold">{platform.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-black border-t border-gray-800 mt-16">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="text-white font-bold text-lg mb-4">Cineby</h3>
                <p className="text-gray-400 text-sm">
                  Your ultimate streaming platform for movies and TV series.
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><a href="/" className="hover:text-red-500 transition">Home</a></li>
                  <li><a href="/browse" className="hover:text-red-500 transition">Browse</a></li>
                  <li><a href="#" className="hover:text-red-500 transition">Trending</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><a href="#" className="hover:text-red-500 transition">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-red-500 transition">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-red-500 transition">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">About</h4>
                <p className="text-gray-400 text-sm">
                  Powered by TMDB API. This site does not host any videos.
                </p>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
              <p>© 2024 Cineby. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
