import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FavoritesPage from './pages/FavoritesPage';
import ArtworkDetailsPage from './pages/ArtworkDetailsPage';
import Header from './components/Header';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/artwork/:objectID" element={<ArtworkDetailsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
