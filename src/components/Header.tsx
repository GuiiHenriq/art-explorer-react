import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Heart, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';

interface NavItem {
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  count?: number;
}

const Header = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const favorites = useStore((state) => state.favorites);

  const navItems: NavItem[] = [
    { path: '/', icon: Home, label: 'Gallery' },
    { path: '/favorites', icon: Heart, label: 'Favorites', count: favorites.length },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b-2 border-amber-600/30 sticky top-0 z-50 shadow-2xl"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center space-x-4"
        >
          <div className="flex flex-col">
            <span className="text-2xl font-serif font-bold text-amber-100 tracking-wide">
              API Museum
            </span>
            <span className="text-sm font-light text-amber-300 tracking-[0.2em] uppercase">
              Art Explorer
            </span>
          </div>
        </motion.div>

        <nav className="hidden md:flex items-center space-x-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div key={item.path} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to={item.path}
                  className={`relative flex items-center gap-3 px-6 py-3 rounded-none border-b-2 transition-all duration-500 text-sm font-medium tracking-wide ${
                    isActive(item.path)
                      ? 'text-amber-300 border-amber-400 bg-slate-800/50'
                      : 'text-amber-100/80 border-transparent hover:text-amber-200 hover:border-amber-500/50 hover:bg-slate-700/30'
                  }`}
                >
                  <Icon size={20} className="stroke-2" />
                  <span className="font-serif">{item.label}</span>
                  {item.count && item.count > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-amber-300 text-slate-900 text-xs font-bold px-2 py-1 rounded-full min-w-[20px] flex items-center justify-center border border-amber-500"
                    >
                      {item.count}
                    </motion.span>
                  )}
                  {isActive(item.path) && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-slate-800/30 rounded-none -z-10 border-b-2 border-amber-400"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="md:hidden p-3 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 border border-amber-600/30 transition-all duration-300"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait">
            {menuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={24} className="text-amber-200" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={24} className="text-amber-200" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute top-full left-0 right-0 bg-gradient-to-b from-slate-800 to-slate-900 border-b-2 border-amber-600/30 shadow-2xl md:hidden"
            >
              <nav className="px-8 py-6 space-y-3">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={item.path}
                        className={`flex items-center gap-4 px-6 py-4 border-l-4 transition-all duration-300 text-base font-medium ${
                          isActive(item.path)
                            ? 'text-amber-300 border-amber-400 bg-slate-700/50'
                            : 'text-amber-100/80 border-transparent hover:text-amber-200 hover:border-amber-500/50 hover:bg-slate-700/30'
                        }`}
                        onClick={() => setMenuOpen(false)}
                      >
                        <Icon size={22} className="stroke-2" />
                        <span className="font-serif">{item.label}</span>
                        {item.count && item.count > 0 && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="bg-amber-600 text-slate-900 text-xs font-bold px-2 py-1 rounded-full min-w-[20px] flex items-center justify-center ml-auto border border-amber-500"
                          >
                            {item.count}
                          </motion.span>
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;
