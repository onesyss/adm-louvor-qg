import React, { useState } from 'react';
import { Music, Play, ExternalLink } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

const RepertoirePage: React.FC = () => {
  const { repertoires } = useAppContext();
  const { theme } = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<string>('');

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const formatDate = (dateString: string) => {
    // Usar UTC para garantir que o dia não mude
    const date = new Date(dateString + 'T12:00:00');
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      timeZone: 'America/Sao_Paulo'
    });
  };

  // Filtrar repertórios do mês/ano atual e ordenar por data
  const currentMonthRepertoires = repertoires
    .filter(repertoire => {
      const [year, month] = repertoire.weekDate.split('-').map(Number);
      const matchesMonth = year === currentYear && (month - 1) === currentMonth;
      const matchesDate = !selectedDate || repertoire.weekDate === selectedDate;
      return matchesMonth && matchesDate;
    })
    .sort((a, b) => {
      const [yearA, monthA, dayA] = a.weekDate.split('-').map(Number);
      const [yearB, monthB, dayB] = b.weekDate.split('-').map(Number);
      const dateA = new Date(yearA, monthA - 1, dayA);
      const dateB = new Date(yearB, monthB - 1, dayB);
      return dateA.getTime() - dateB.getTime(); // Ordem cronológica (mais antigo primeiro)
    });

  // Pegar datas únicas do mês atual para o filtro
  const availableDates = repertoires
    .filter(repertoire => {
      const [year, month] = repertoire.weekDate.split('-').map(Number);
      return year === currentYear && (month - 1) === currentMonth;
    })
    .map(r => r.weekDate)
    .filter((date, index, self) => self.indexOf(date) === index)
    .sort();

  // Limpar filtro de data ao mudar de mês
  React.useEffect(() => {
    setSelectedDate('');
  }, [currentMonth, currentYear]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass p-4 md:p-6">
        <div className="flex items-center space-x-3 md:space-x-4">
          <Music className="h-6 w-6 md:h-8 md:w-8 text-indigo-500" />
          <div>
            <h1 className={`text-xl md:text-3xl font-bold ${theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'}`}>
              Repertórios
            </h1>
            <p className={`text-sm md:text-base ${theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'}`}>
              Músicas programadas para os cultos
            </p>
          </div>
        </div>
      </div>

      {/* Month Navigation */}
      <div className="glass p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigateMonth('prev')}
            className={`p-2 rounded-lg transition-colors border ${
              theme === 'dark'
                ? 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700'
                : 'bg-white hover:bg-gray-50 border-gray-300'
            }`}
          >
            <svg className={`h-5 w-5 md:h-6 md:w-6 ${theme === 'dark' ? 'text-zinc-300' : 'text-gray-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <h2 className={`text-lg md:text-2xl font-bold ${theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'}`}>
            {monthNames[currentMonth]} {currentYear}
          </h2>
          
          <button
            onClick={() => navigateMonth('next')}
            className={`p-2 rounded-lg transition-colors border ${
              theme === 'dark'
                ? 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700'
                : 'bg-white hover:bg-gray-50 border-gray-300'
            }`}
          >
            <svg className={`h-5 w-5 md:h-6 md:w-6 ${theme === 'dark' ? 'text-zinc-300' : 'text-gray-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Filtro por Data */}
        {availableDates.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
            <label className={`text-sm ${theme === 'dark' ? 'text-zinc-300' : 'text-gray-700'}`}>
              Filtrar por data:
            </label>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className={`w-full sm:w-auto px-3 md:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm md:text-base ${
                theme === 'dark'
                  ? 'bg-zinc-800 border-zinc-700 text-zinc-100'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="">Todas as datas</option>
              {availableDates.map(date => {
                const formattedDate = formatDate(date);
                return (
                  <option key={date} value={date}>
                    {formattedDate}
                  </option>
                );
              })}
            </select>
          </div>
        )}
      </div>

      {currentMonthRepertoires.length > 0 ? (
        <div className="space-y-4 md:space-y-6">
          {currentMonthRepertoires.map((repertoire) => (
            <div key={repertoire.id} className="glass p-4 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className={`text-lg md:text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'}`}>
                    {repertoire.title}
                  </h2>
                  <div className={`flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm ${theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'}`}>
                    <span>📅 {formatDate(repertoire.weekDate)}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>{repertoire.songs.length} música{repertoire.songs.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
                {repertoire.playlistUrl && (
                  <a
                    href={repertoire.playlistUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary flex items-center justify-center space-x-2 self-start sm:self-auto"
                  >
                    <Play className="h-4 w-4 md:h-5 md:w-5" />
                    <span className="text-sm md:text-base">Ver Playlist</span>
                    <ExternalLink className="h-3 w-3 md:h-4 md:w-4" />
                  </a>
                )}
              </div>

              {/* Songs */}
              <div>
                <h3 className={`text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center ${theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'}`}>
                  <Music className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                  Repertório Musical
                </h3>
                <div className="space-y-2 md:space-y-3">
                  {repertoire.songs.map((repSong, index) => (
                    <div key={repSong.id} className={`rounded-lg p-3 md:p-4 border ${
                      theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-gray-200'
                    }`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                        {/* Número e Info da Música */}
                        <div className="flex items-start sm:items-center gap-3 md:gap-4 flex-1">
                          <span className="text-lg md:text-2xl font-bold text-indigo-400 min-w-[30px] md:min-w-[40px]">
                            {index + 1}.
                          </span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h4 className={`text-base md:text-lg font-semibold ${theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'}`}>
                                {repSong.isInstrumental && !repSong.songs[0] ? 'Instrumental' :
                                 repSong.isMedley ? repSong.medleyTitle : repSong.songs[0]?.title}
                              </h4>
                              {repSong.moment && (
                                <span className="px-2 py-1 bg-green-900/40 text-green-300 border border-green-800 rounded text-xs font-medium">
                                  {repSong.moment}
                                </span>
                              )}
                              {repSong.isMedley && (
                                <span className="px-2 py-1 bg-purple-900/40 text-purple-300 border border-purple-800 rounded text-xs font-medium">
                                  Medley
                                </span>
                              )}
                              {repSong.isInstrumental && (
                                <span className="px-2 py-1 bg-amber-900/40 text-amber-300 border border-amber-800 rounded text-xs font-medium">
                                  Instrumental
                                </span>
                              )}
                            </div>
                            {!repSong.isMedley && !repSong.isInstrumental && repSong.songs[0] && (
                              <p className={`text-sm ${theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'}`}>
                                {repSong.songs[0].artist}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Tom */}
                        {!repSong.isInstrumental && (
                          <div className="flex items-center gap-3">
                            {repSong.customKey ? (
                              <div className={`px-4 py-2 border rounded-lg ${
                                theme === 'dark'
                                  ? 'bg-indigo-900/40 text-indigo-300 border-indigo-800'
                                  : 'bg-indigo-100 text-indigo-700 border-indigo-300'
                              }`}>
                                <div className={`text-xs ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>
                                  Tom
                                </div>
                                <div className="text-lg font-bold">{repSong.customKey}</div>
                              </div>
                            ) : !repSong.isMedley && repSong.songs[0]?.key && (
                              <div className={`px-4 py-2 rounded-lg border ${
                                theme === 'dark' 
                                  ? 'bg-zinc-700 border-zinc-600' 
                                  : 'bg-indigo-100 border-indigo-300'
                              }`}>
                                <div className={`text-xs ${theme === 'dark' ? 'text-zinc-500' : 'text-indigo-600'}`}>
                                  Tom
                                </div>
                                <div className={`text-lg font-bold ${theme === 'dark' ? 'text-zinc-300' : 'text-indigo-700'}`}>
                                  {repSong.songs[0].key}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Links */}
                        {!repSong.isMedley && !repSong.isInstrumental && repSong.songs[0] && (
                          <div className="flex items-center gap-2">
                            {repSong.songs[0].youtubeUrl && (
                              <a
                                href={repSong.songs[0].youtubeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`p-2 rounded-lg transition-colors border ${
                                  theme === 'dark'
                                    ? 'bg-red-900/40 text-red-300 border-red-800 hover:bg-red-900/60'
                                    : 'bg-red-500 text-white border-red-600 hover:bg-red-600'
                                }`}
                                title="Ver no YouTube"
                              >
                                <Play className="h-5 w-5" />
                              </a>
                            )}
                            {repSong.songs[0].spotifyUrl && (
                              <a
                                href={repSong.songs[0].spotifyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`p-2 rounded-lg transition-colors border ${
                                  theme === 'dark'
                                    ? 'bg-green-900/40 text-green-300 border-green-800 hover:bg-green-900/60'
                                    : 'bg-green-500 text-white border-green-600 hover:bg-green-600'
                                }`}
                                title="Ver no Spotify"
                              >
                                <ExternalLink className="h-5 w-5" />
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass p-12 text-center">
          <Music className={`h-16 w-16 mx-auto mb-4 ${theme === 'dark' ? 'text-zinc-400' : 'text-gray-400'}`} />
          <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'}`}>
            Nenhum repertório para {monthNames[currentMonth]} {currentYear}
          </h3>
          <p className={`mb-6 ${theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'}`}>
            Não há repertórios cadastrados para este mês
          </p>
          <p className={theme === 'dark' ? 'text-zinc-500' : 'text-gray-500'}>
            Use as setas para navegar entre os meses ou aguarde o administrador cadastrar
          </p>
        </div>
      )}
    </div>
  );
};

export default RepertoirePage;
