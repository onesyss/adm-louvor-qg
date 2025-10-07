import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Music, 
  Archive, 
  Settings,
  Menu,
  X,
  User,
  Users
} from 'lucide-react';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Início', href: '/', icon: Home },
    { name: 'Colaboradores', href: '/musicians', icon: Users },
    { name: 'Escalas', href: '/scales', icon: Calendar },
    { name: 'Agenda', href: '/agenda', icon: Calendar },
    { name: 'Repertório', href: '/repertoire', icon: Music },
    { name: 'Acervo', href: '/archive', icon: Archive },
    { name: 'Admin', href: '/login', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-zinc-100">
      {/* Top Navbar */}
      <div className="sticky top-0 z-30 bg-zinc-900/70 backdrop-blur border-b border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Brand */}
            <div className="flex items-center gap-2">
              <Music className="h-7 w-7 text-indigo-400" />
              <span className="text-lg font-semibold">QG WORSHIP</span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${active ? 'bg-zinc-800 text-zinc-100 ring-1 ring-zinc-700' : 'text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800'} flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors`}
                  >
                    <Icon className={`h-4 w-4 ${active ? 'text-indigo-400' : 'text-zinc-400'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right side */}
            <div className="hidden md:flex text-sm text-zinc-400">
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
            >
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {sidebarOpen && (
          <div className="md:hidden border-t border-zinc-800 bg-zinc-900/80 backdrop-blur">
            <div className="px-4 py-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`${active ? 'bg-zinc-800 text-zinc-100 ring-1 ring-zinc-700' : 'text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800'} flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors`}
                  >
                    <Icon className={`h-4 w-4 ${active ? 'text-indigo-400' : 'text-zinc-400'}`} />
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
    </div>
  );
};

export default Layout;
