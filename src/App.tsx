import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FavoritesPage from './pages/FavoritesPage';
import ArtworkDetailsPage from './pages/ArtworkDetailsPage';
import Header from './components/Header';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-amber-50/30">
        <Header />
        <main>
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
