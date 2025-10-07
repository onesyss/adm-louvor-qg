import React, { useState } from 'react';
import { Music, Tag, Search, Play, ExternalLink } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Songs: React.FC = () => {
  const { songs } = useAppContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');

  // Filter songs
  const filteredSongs = songs.filter(song => {
    const matchesSearch = song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         song.artist?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || song.tags?.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const getStyleColor = (style: string) => {
    switch (style) {
      case 'celebração':
        return 'bg-blue-900/40 text-blue-300 border-blue-800';
      case 'adoração':
        return 'bg-purple-900/40 text-purple-300 border-purple-800';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass p-6">
        <div className="flex items-center space-x-4">
          <Music className="h-8 w-8 text-indigo-400" />
          <div>
            <h1 className="text-3xl font-bold text-zinc-100">Cantos Cadastrados</h1>
            <p className="text-zinc-400">Músicas de celebração e adoração do ministério</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 text-center">
          <Music className="h-8 w-8 text-indigo-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-zinc-100">{songs.length}</div>
          <div className="text-sm text-zinc-400">Total de Músicas</div>
        </div>
        <div className="glass p-6 text-center">
          <Tag className="h-8 w-8 text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-zinc-100">
            {songs.filter(song => song.tags?.includes('celebração')).length}
          </div>
          <div className="text-sm text-zinc-400">Celebração</div>
        </div>
        <div className="glass p-6 text-center">
          <Tag className="h-8 w-8 text-purple-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-zinc-100">
            {songs.filter(song => song.tags?.includes('adoração')).length}
          </div>
          <div className="text-sm text-zinc-400">Adoração</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="glass p-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar por título ou artista..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="px-4 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Todas as categorias</option>
            <option value="celebração">Celebração</option>
            <option value="adoração">Adoração</option>
          </select>
        </div>

        {/* Songs Grid */}
        {filteredSongs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSongs.map((song) => (
              <div key={song.id} className="bg-zinc-800 rounded-lg p-6 border border-zinc-700 hover:shadow-lg transition-shadow">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-zinc-100 mb-1">{song.title}</h3>
                  <p className="text-zinc-400 mb-2">{song.artist}</p>
                  {song.tags && song.tags.length > 0 && (
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStyleColor(song.tags[0])}`}>
                      {song.tags[0]}
                    </span>
                  )}
                </div>

                <div className="flex space-x-2">
                  {song.youtubeUrl && (
                    <a
                      href={song.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-red-900/40 text-red-300 rounded-lg hover:bg-red-900/60 transition-colors border border-red-800"
                    >
                      <Play className="h-4 w-4" />
                      <span>YouTube</span>
                    </a>
                  )}
                  {song.spotifyUrl && (
                    <a
                      href={song.spotifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-green-900/40 text-green-300 rounded-lg hover:bg-green-900/60 transition-colors border border-green-800"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Spotify</span>
                    </a>
                  )}
                </div>

                {song.lyrics && (
                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm text-zinc-400 hover:text-zinc-200">
                      Ver letra
                    </summary>
                    <div className="mt-2 p-3 bg-zinc-900 rounded-lg text-sm text-zinc-300 whitespace-pre-line">
                      {song.lyrics}
                    </div>
                  </details>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Music className="h-16 w-16 text-zinc-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-zinc-100 mb-2">
              Nenhuma música encontrada
            </h3>
            <p className="text-zinc-400 mb-6">
              {searchTerm || selectedTag 
                ? 'Tente ajustar os filtros de busca'
                : 'Nenhuma música foi cadastrada ainda'
              }
            </p>
            {!searchTerm && !selectedTag && (
              <p className="text-zinc-500">
                As músicas são cadastradas pelo administrador
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Songs;
