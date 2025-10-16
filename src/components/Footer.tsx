import React from 'react';
import { Crown, Heart, Instagram } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Footer: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <footer className={`mt-12 border-t backdrop-blur transition-colors duration-300 ${
      theme === 'dark' 
        ? 'border-zinc-800 bg-zinc-900/50' 
        : 'border-gray-200 bg-white/50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Liderança */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
              <Crown className="h-5 w-5 text-yellow-500" />
              <h3 className={`text-sm font-semibold ${theme === 'dark' ? 'text-zinc-300' : 'text-gray-700'}`}>
                Liderança do Ministério
              </h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <img 
                  src="/src/assets/img/cassio.jpeg" 
                  alt="Pastor Cassio Calderaro" 
                  className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500/50"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="text-left">
                  <p className={`text-sm ${theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'}`}>
                    <span className={`font-medium ${theme === 'dark' ? 'text-zinc-300' : 'text-gray-800'}`}>
                      Pastor Cassio Calderaro
                    </span>
                  </p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-500'}`}>
                    Pastor do QGW
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-3">
                <img 
                  src="/src/assets/img/vanessa.jpeg" 
                  alt="Vanessa Calderaro" 
                  className="w-10 h-10 rounded-full object-cover border-2 border-purple-500/50"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="text-left">
                  <p className={`text-sm ${theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'}`}>
                    <span className={`font-medium ${theme === 'dark' ? 'text-zinc-300' : 'text-gray-800'}`}>
                      Vanessa Calderaro
                    </span>
                  </p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-500'}`}>
                    Líder
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Frase de Louvor */}
          <div className="text-center md:text-right">
            <div className="flex items-center justify-center md:justify-end gap-2 mb-3">
              <Heart className="h-5 w-5 text-pink-500" />
              <p className={`text-sm font-medium italic ${theme === 'dark' ? 'text-zinc-300' : 'text-gray-700'}`}>
                "Louvai ao Senhor, porque Ele é bom"
              </p>
            </div>
            <p className={`text-xs mb-3 ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-500'}`}>
              Salmos 135:3
            </p>
            
            {/* Instagram */}
            <a
              href="https://www.instagram.com/qgworship/?igsh=MWllemtiemo4d3QzYQ%3D%3D#"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-medium transition-all duration-300 transform hover:scale-105"
            >
              <Instagram className="h-4 w-4" />
              @qgworship
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className={`mt-6 pt-6 border-t text-center ${
          theme === 'dark' ? 'border-zinc-800' : 'border-gray-200'
        }`}>
          <p className={`text-xs ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-500'}`}>
            © {new Date().getFullYear()} QG WORSHIP - Ministério de Louvor. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

