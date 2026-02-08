import { useAuth } from '@/_core/hooks/useAuth';
import { getLoginUrl } from '@/const';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'wouter';
import { Menu, X, Search, User, LogOut } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 border-b border-red-600/30">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-pink-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-lg">▶</span>
            </div>
            <span className="text-white font-bold text-xl hidden sm:inline">Cineby</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-white hover:text-red-500 transition">
              Home
            </Link>
            <Link href="/browse" className="text-white hover:text-red-500 transition">
              Browse
            </Link>
            <a 
              href="https://www.themoviedb.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-red-500 transition"
            >
              API
            </a>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-xs">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search movies, series..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-red-600 focus:outline-none transition"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition"
              >
                <Search size={18} />
              </button>
            </div>
          </form>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="relative group hidden sm:block">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 hover:bg-gray-800 transition">
                  <User size={18} className="text-red-500" />
                  <span className="text-white text-sm truncate max-w-[120px]">{user.name || 'User'}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="px-4 py-3 border-b border-gray-700">
                    <p className="text-white text-sm font-semibold">{user.name}</p>
                    <p className="text-gray-400 text-xs">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-white hover:bg-gray-800 flex items-center gap-2 transition"
                  >
                    <LogOut size={16} className="text-red-500" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <a href={getLoginUrl()}>
                <Button className="hidden sm:inline-flex bg-red-600 hover:bg-red-700 text-white">
                  Sign In
                </Button>
              </a>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white hover:text-red-500 transition"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-700 space-y-4">
            <form onSubmit={handleSearch} className="sm:hidden">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-red-600 focus:outline-none transition"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition"
                >
                  <Search size={18} />
                </button>
              </div>
            </form>

            <Link href="/" className="block text-white hover:text-red-500 transition py-2">
              Home
            </Link>
            <Link href="/browse" className="block text-white hover:text-red-500 transition py-2">
              Browse
            </Link>
            <a 
              href="https://www.themoviedb.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block text-white hover:text-red-500 transition py-2"
            >
              API
            </a>

            {isAuthenticated && user ? (
              <div className="pt-4 border-t border-gray-700 space-y-2">
                <p className="text-white text-sm font-semibold">{user.name}</p>
                <p className="text-gray-400 text-xs mb-3">{user.email}</p>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-white hover:bg-gray-800 flex items-center gap-2 transition rounded"
                >
                  <LogOut size={16} className="text-red-500" />
                  Logout
                </button>
              </div>
            ) : (
              <a href={getLoginUrl()} className="block">
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                  Sign In
                </Button>
              </a>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
