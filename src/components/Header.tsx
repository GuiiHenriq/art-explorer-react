import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Heart } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-3xl mx-auto flex items-center justify-between px-4 py-2 relative">
        <span className="text-xl font-bold tracking-wide">Art Explorer</span>
        {/* Menu desktop */}
        <nav className="hidden sm:flex gap-4">
          <Link
            to="/"
            className={`flex items-center gap-1 px-3 py-2 rounded-md transition-colors text-gray-800 hover:bg-gray-100 hover:text-blue-600${location.pathname === '/' ? ' bg-gray-100 text-blue-600' : ''}`}
          >
            <Home size={20} /> <span>Início</span>
          </Link>
          <Link
            to="/favorites"
            className={`flex items-center gap-1 px-3 py-2 rounded-md transition-colors text-gray-800 hover:bg-gray-100 hover:text-blue-600${location.pathname === '/favorites' ? ' bg-gray-100 text-blue-600' : ''}`}
          >
            <Heart size={20} /> <span>Favoritos</span>
          </Link>
        </nav>
        {/* Botão menu mobile */}
        <button
          className="sm:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none"
          aria-label="Abrir menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
        </button>
        {/* Menu mobile */}
        {menuOpen && (
          <nav className="sm:hidden absolute right-4 top-14 bg-white border border-gray-200 rounded-lg shadow-md flex flex-col w-44 z-50 animate-fade-in">
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-3 rounded-t-lg transition-colors text-gray-800 hover:bg-gray-100 hover:text-blue-600${location.pathname === '/' ? ' bg-gray-100 text-blue-600' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              <Home size={20} /> <span>Início</span>
            </Link>
            <Link
              to="/favorites"
              className={`flex items-center gap-2 px-4 py-3 rounded-b-lg transition-colors text-gray-800 hover:bg-gray-100 hover:text-blue-600${location.pathname === '/favorites' ? ' bg-gray-100 text-blue-600' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              <Heart size={20} /> <span>Favoritos</span>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
