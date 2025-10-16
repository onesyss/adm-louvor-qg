import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Calendar, 
  Music, 
  Archive, 
  Settings,
  Menu,
  X,
  Users,
  Sun,
  Moon
} from 'lucide-react';
import Footer from './Footer';
import { useTheme } from '../context/ThemeContext';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const navigation = [
    { name: 'Colaboradores', href: '/musicians', icon: Users },
    { name: 'Escalas', href: '/scales', icon: Calendar },
    { name: 'Agenda', href: '/agenda', icon: Calendar },
    { name: 'Repertório', href: '/repertoire', icon: Music },
    { name: 'Acervo', href: '/archive', icon: Archive },
    { name: 'Admin', href: '/login', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-zinc-100' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900'
    }`}>
      {/* Top Navbar */}
      <div className={`sticky top-0 z-30 backdrop-blur border-b transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-zinc-900/70 border-zinc-800' 
          : 'bg-white/70 border-gray-200'
      }`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Brand */}
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Music className="h-7 w-7 text-indigo-500" />
              <span className={`text-lg font-semibold ${theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'}`}>
                QG WORSHIP
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                      active 
                        ? theme === 'dark'
                          ? 'bg-zinc-800 text-zinc-100 ring-1 ring-zinc-700'
                          : 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200'
                        : theme === 'dark'
                          ? 'text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${
                      active 
                        ? 'text-indigo-500' 
                        : theme === 'dark' ? 'text-zinc-400' : 'text-gray-500'
                    }`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-3">
              <span className={`text-sm ${theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'}`}>
                {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors border ${
                  theme === 'dark'
                    ? 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700'
                    : 'bg-gray-100 hover:bg-gray-200 border-gray-300'
                }`}
                title={theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-yellow-400" />
                ) : (
                  <Moon className="h-5 w-5 text-indigo-500" />
                )}
              </button>
            </div>

            {/* Mobile buttons */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-md transition-colors ${
                  theme === 'dark'
                    ? 'bg-zinc-800 hover:bg-zinc-700'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                title={theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-yellow-400" />
                ) : (
                  <Moon className="h-5 w-5 text-indigo-500" />
                )}
              </button>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`p-2 rounded-md transition-colors ${
                  theme === 'dark'
                    ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {sidebarOpen && (
          <div className={`md:hidden border-t backdrop-blur ${
            theme === 'dark' 
              ? 'border-zinc-800 bg-zinc-900/80' 
              : 'border-gray-200 bg-white/80'
          }`}>
            <div className="px-4 py-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                      active 
                        ? theme === 'dark'
                          ? 'bg-zinc-800 text-zinc-100 ring-1 ring-zinc-700'
                          : 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200'
                        : theme === 'dark'
                          ? 'text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${
                      active 
                        ? 'text-indigo-500' 
                        : theme === 'dark' ? 'text-zinc-400' : 'text-gray-500'
                    }`} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <main className="px-4 sm:px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Footer - exceto na Home */}
      {location.pathname !== '/' && <Footer />}
    </div>
  );
};

export default Layout;
