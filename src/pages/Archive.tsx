import React, { useState } from 'react';
import { Archive, Search, Play, ExternalLink, Calendar, Music, Tag, Plus, Trash2, Save, Edit } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNotification } from '../components/Notification';

const ArchivePage: React.FC = () => {
  const { songs, addSong, updateSong, deleteSong } = useAppContext();
  const { addNotification, showConfirm } = useNotification();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [sortBy, setSortBy] = useState<'title' | 'artist'>('title');
  const [isAddingSong, setIsAddingSong] = useState(false);
  const [playingSong, setPlayingSong] = useState<string | null>(null);
  const [playerType, setPlayerType] = useState<'youtube' | 'spotify' | null>(null);
  const [editingSong, setEditingSong] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [newSong, setNewSong] = useState({
    title: '',
    artist: '',
    youtubeUrl: '',
    spotifyUrl: '',
    key: '',
    style: '',
    lyrics: ''
  });
  const [editSong, setEditSong] = useState({
    title: '',
    artist: '',
    youtubeUrl: '',
    spotifyUrl: '',
    key: '',
    style: '',
    lyrics: ''
  });

  // Get all unique tags
  const allTags = Array.from(new Set(songs.flatMap(song => song.tags || [])));

  // Filter and sort songs
  const filteredSongs = songs
    .filter(song => {
      const matchesSearch = song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           song.artist?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTag = !selectedTag || song.tags?.includes(selectedTag);
      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'artist':
          return (a.artist || '').localeCompare(b.artist || '');
        default:
          return 0;
      }
    });

  // Paginação
  const totalPages = Math.ceil(filteredSongs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSongs = filteredSongs.slice(startIndex, endIndex);

  // Reset para página 1 quando filtros mudarem
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedTag, sortBy]);

  const getKeyColor = (key: string) => {
    const colors: { [key: string]: string } = {
      'C': 'bg-red-900/40 text-red-300 border-red-800',
      'D': 'bg-orange-900/40 text-orange-300 border-orange-800',
      'E': 'bg-yellow-900/40 text-yellow-300 border-yellow-800',
      'F': 'bg-green-900/40 text-green-300 border-green-800',
      'G': 'bg-blue-900/40 text-blue-300 border-blue-800',
      'A': 'bg-indigo-900/40 text-indigo-300 border-indigo-800',
      'B': 'bg-purple-900/40 text-purple-300 border-purple-800',
    };
    return colors[key] || 'bg-zinc-800 text-zinc-300 border-zinc-700';
  };

  const handleAddSong = () => {
    if (newSong.title.trim() && newSong.artist.trim()) {
      const song = {
        id: Date.now().toString(),
        title: newSong.title,
        artist: newSong.artist,
        youtubeUrl: newSong.youtubeUrl || undefined,
        spotifyUrl: newSong.spotifyUrl || undefined,
        key: newSong.key || undefined,
        tempo: undefined,
        tags: newSong.style ? [newSong.style] : undefined,
        lyrics: newSong.lyrics || undefined
      };
      addSong(song);
      setNewSong({
        title: '',
        artist: '',
        youtubeUrl: '',
        spotifyUrl: '',
        key: '',
        style: '',
        lyrics: ''
      });
      setIsAddingSong(false);
      
      addNotification({
        type: 'success',
        title: 'Música adicionada!',
        message: `${song.title} foi adicionada ao acervo com sucesso.`
      });
    } else {
      addNotification({
        type: 'warning',
        title: 'Campos obrigatórios',
        message: 'Por favor, informe o título e o artista da música.'
      });
    }
  };

  const playSong = (songId: string, type: 'youtube' | 'spotify') => {
    if (playingSong === songId && playerType === type) {
      // Se já está tocando a mesma música, para
      setPlayingSong(null);
      setPlayerType(null);
    } else {
      // Toca a nova música
      setPlayingSong(songId);
      setPlayerType(type);
    }
  };

  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const getSpotifyTrackId = (url: string) => {
    // Supports: https://open.spotify.com/track/{id}?si=..., https://spotify.com/track/{id}
    const match = url.match(/(?:open\.)?spotify\.com\/track\/([a-zA-Z0-9]+)(?:\?[^#]*)?/);
    return match ? match[1] : null;
  };

  const startEditing = (song: Song) => {
    setEditingSong(song.id);
    setEditSong({
      title: song.title,
      artist: song.artist || '',
      youtubeUrl: song.youtubeUrl || '',
      spotifyUrl: song.spotifyUrl || '',
      key: song.key || '',
      style: song.tags?.[0] || '',
      lyrics: song.lyrics || ''
    });
  };

  const saveEdit = () => {
    if (editingSong && editSong.title.trim() && editSong.artist.trim()) {
      const updatedSong = {
        id: editingSong,
        title: editSong.title,
        artist: editSong.artist,
        youtubeUrl: editSong.youtubeUrl || undefined,
        spotifyUrl: editSong.spotifyUrl || undefined,
        key: editSong.key || undefined,
        tempo: undefined,
        tags: editSong.style ? [editSong.style] : undefined,
        lyrics: editSong.lyrics || undefined
      };
      updateSong(editingSong, updatedSong);
      setEditingSong(null);
      setEditSong({
        title: '',
        artist: '',
        youtubeUrl: '',
        spotifyUrl: '',
        key: '',
        style: '',
        lyrics: ''
      });
      
      addNotification({
        type: 'success',
        title: 'Música atualizada!',
        message: `${updatedSong.title} foi atualizada com sucesso.`
      });
    } else {
      addNotification({
        type: 'warning',
        title: 'Campos obrigatórios',
        message: 'Por favor, informe o título e o artista da música.'
      });
    }
  };

  const cancelEdit = () => {
    setEditingSong(null);
    setEditSong({
      title: '',
      artist: '',
      youtubeUrl: '',
      spotifyUrl: '',
      key: '',
      style: '',
      lyrics: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3 md:space-x-4">
            <Archive className="h-6 w-6 md:h-8 md:w-8 text-indigo-400" />
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-zinc-100">Acervo Musical</h1>
              <p className="text-sm md:text-base text-zinc-400">Todas as músicas do ministério</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddingSong(!isAddingSong)}
            className="btn-primary self-start sm:self-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">{isAddingSong ? 'Cancelar' : 'Adicionar Música'}</span>
            <span className="sm:hidden">{isAddingSong ? 'Cancelar' : 'Adicionar'}</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        <div className="glass p-6 text-center">
          <Music className="h-8 w-8 text-indigo-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-zinc-100">{songs.length}</div>
          <div className="text-sm text-zinc-400">Total de Músicas</div>
        </div>
        <div className="glass p-6 text-center">
          <Tag className="h-8 w-8 text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-zinc-100">{allTags.length}</div>
          <div className="text-sm text-zinc-400">Categorias</div>
        </div>
        <div className="glass p-6 text-center">
          <Calendar className="h-8 w-8 text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-zinc-100">
            {songs.filter(song => song.tags?.includes('celebração')).length}
          </div>
          <div className="text-sm text-zinc-400">Celebração</div>
        </div>
        <div className="glass p-6 text-center">
          <ExternalLink className="h-8 w-8 text-purple-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-zinc-100">
            {songs.filter(song => song.tags?.includes('adoração')).length}
          </div>
          <div className="text-sm text-zinc-400">Adoração</div>
        </div>
      </div>

      {/* Add Song Form */}
      {isAddingSong && (
        <div className="glass p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-zinc-100 mb-4">Adicionar Nova Música</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Título da música *"
                value={newSong.title}
                onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                placeholder="Artista *"
                value={newSong.artist}
                onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                placeholder="URL do YouTube (opcional)"
                value={newSong.youtubeUrl}
                onChange={(e) => setNewSong({ ...newSong, youtubeUrl: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                placeholder="URL do Spotify (opcional)"
                value={newSong.spotifyUrl}
                onChange={(e) => setNewSong({ ...newSong, spotifyUrl: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Tom (ex: C, D, E, F, G, A, B)"
                value={newSong.key}
                onChange={(e) => setNewSong({ ...newSong, key: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <select
                value={newSong.style}
                onChange={(e) => setNewSong({ ...newSong, style: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Selecionar estilo</option>
                <option value="celebração">Celebração</option>
                <option value="adoração">Adoração</option>
              </select>
              <textarea
                placeholder="Letra da música (opcional)"
                value={newSong.lyrics}
                onChange={(e) => setNewSong({ ...newSong, lyrics: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
                rows={4}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={() => setIsAddingSong(false)}
              className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleAddSong}
              className="btn-primary"
            >
              <Save className="h-4 w-4 mr-2" />
              Adicionar Música
            </button>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="glass p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar por título ou artista..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 md:pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="px-3 md:px-4 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base"
          >
            <option value="">Todas as categorias</option>
            <option value="celebração">Celebração</option>
            <option value="adoração">Adoração</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'title' | 'artist')}
            className="px-3 md:px-4 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base"
          >
            <option value="title">Ordenar por Título</option>
            <option value="artist">Ordenar por Artista</option>
          </select>
        </div>

        {/* Songs List */}
        {filteredSongs.length > 0 ? (
          <>
          <div className="space-y-2">
            {paginatedSongs.map((song, index) => (
              <div key={song.id} className="bg-zinc-800 rounded-lg p-3 md:p-4 border border-zinc-700 hover:border-zinc-600 transition-colors">
                {/* Layout responsivo */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  {/* Número e Info da Música */}
                  <div className="flex items-start sm:items-center gap-3 flex-1">
                    <span className="text-lg md:text-xl font-bold text-indigo-400 min-w-[30px] md:min-w-[40px]">
                      {startIndex + index + 1}.
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm md:text-base font-semibold text-zinc-100 truncate">{song.title}</h3>
                        {song.tags && song.tags.length > 0 && (
                          <span className="px-2 py-0.5 bg-zinc-700 text-zinc-300 rounded text-xs flex-shrink-0">
                            {song.tags[0]}
                          </span>
                        )}
                      </div>
                      <p className="text-xs md:text-sm text-zinc-400 truncate">{song.artist}</p>
                    </div>
                  </div>

                  {/* Tom e Botões - Linha separada em mobile */}
                  <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
                    {/* Tom */}
                    {song.key && (
                      <div className="px-2 md:px-3 py-1 bg-zinc-700 rounded-lg text-center min-w-[50px] md:min-w-[60px]">
                        <div className="text-xs text-zinc-500">Tom</div>
                        <div className="text-sm md:text-base font-bold text-zinc-300">{song.key}</div>
                      </div>
                    )}

                    {/* Botões de Ação */}
                    <div className="flex items-center gap-1">
                      {song.youtubeUrl && (
                        <button
                          onClick={() => playSong(song.id, 'youtube')}
                          className={`p-1.5 md:p-2 rounded-lg transition-colors border ${
                            playingSong === song.id && playerType === 'youtube'
                              ? 'bg-red-600 text-white border-red-500'
                              : 'bg-red-900/40 text-red-300 border-red-800 hover:bg-red-900/60'
                          }`}
                          title="YouTube"
                        >
                          <Play className="h-3.5 w-3.5 md:h-4 md:w-4" />
                        </button>
                      )}
                      {song.spotifyUrl && (
                        <button
                          type="button"
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); playSong(song.id, 'spotify'); }}
                          className={`p-1.5 md:p-2 rounded-lg transition-colors border ${
                            playingSong === song.id && playerType === 'spotify'
                              ? 'bg-green-600 text-white border-green-500'
                              : 'bg-green-900/40 text-green-300 border-green-800 hover:bg-green-900/60'
                          }`}
                          title="Spotify"
                        >
                          <ExternalLink className="h-3.5 w-3.5 md:h-4 md:w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => startEditing(song)}
                        className="p-1.5 md:p-2 text-blue-400 hover:bg-blue-900/20 rounded-lg transition-colors border border-zinc-700"
                        title="Editar música"
                      >
                        <Edit className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      </button>
                      <button
                        onClick={async () => {
                          const confirmed = await showConfirm(
                            'Excluir Música',
                            `Tem certeza que deseja excluir "${song.title}"? Esta ação não pode ser desfeita.`
                          );
                          if (confirmed) {
                            deleteSong(song.id);
                            addNotification({
                              type: 'success',
                              title: 'Música excluída!',
                              message: `${song.title} foi removida do acervo.`
                            });
                          }
                        }}
                        className="p-1.5 md:p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors border border-zinc-700"
                        title="Deletar música"
                      >
                        <Trash2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Player Embebido */}
                {playingSong === song.id && (
                  <div className="mt-4">
                    {playerType === 'youtube' && song.youtubeUrl && (
                      <div className="w-full">
                        <iframe
                          width="100%"
                          height="200"
                          src={`https://www.youtube.com/embed/${getYouTubeVideoId(song.youtubeUrl)}?autoplay=1`}
                          title={song.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="rounded-lg"
                        ></iframe>
                      </div>
                    )}
                    {playerType === 'spotify' && song.spotifyUrl && (
                      <div className="w-full">
                        <iframe
                          src={`https://open.spotify.com/embed/track/${getSpotifyTrackId(song.spotifyUrl)}`}
                          width="100%"
                          height="200"
                          frameBorder="0"
                          allowtransparency="true"
                          allow="encrypted-media"
                          className="rounded-lg"
                        ></iframe>
                      </div>
                    )}
                  </div>
                )}

                {/* Formulário de Edição */}
                {editingSong === song.id && (
                  <div className="mt-3 md:mt-4 p-3 md:p-4 bg-zinc-900/50 rounded-lg border border-zinc-600">
                    <h4 className="text-base md:text-lg font-semibold text-zinc-100 mb-3 md:mb-4">Editar Música</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Título da música *"
                          value={editSong.title}
                          onChange={(e) => setEditSong({ ...editSong, title: e.target.value })}
                          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                        <input
                          type="text"
                          placeholder="Artista *"
                          value={editSong.artist}
                          onChange={(e) => setEditSong({ ...editSong, artist: e.target.value })}
                          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                        <input
                          type="text"
                          placeholder="URL do YouTube (opcional)"
                          value={editSong.youtubeUrl}
                          onChange={(e) => setEditSong({ ...editSong, youtubeUrl: e.target.value })}
                          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                        <input
                          type="text"
                          placeholder="URL do Spotify (opcional)"
                          value={editSong.spotifyUrl}
                          onChange={(e) => setEditSong({ ...editSong, spotifyUrl: e.target.value })}
                          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Tom (ex: C, D, E, F, G, A, B)"
                          value={editSong.key}
                          onChange={(e) => setEditSong({ ...editSong, key: e.target.value })}
                          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                        <select
                          value={editSong.style}
                          onChange={(e) => setEditSong({ ...editSong, style: e.target.value })}
                          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">Selecionar estilo</option>
                          <option value="celebração">Celebração</option>
                          <option value="adoração">Adoração</option>
                        </select>
                        <textarea
                          placeholder="Letra da música (opcional)"
                          value={editSong.lyrics}
                          onChange={(e) => setEditSong({ ...editSong, lyrics: e.target.value })}
                          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          rows={3}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4">
                      <button
                        onClick={cancelEdit}
                        className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-100 rounded-lg transition-colors text-sm md:text-base"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={saveEdit}
                        className="btn-primary text-sm md:text-base"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Salvar
                      </button>
                    </div>
                  </div>
                )}

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

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg transition-colors text-sm md:text-base ${
                  currentPage === 1
                    ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed border border-zinc-700'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'
                }`}
              >
                Anterior
              </button>
              
              <div className="flex items-center gap-1 md:gap-2 flex-wrap justify-center">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 md:px-4 py-2 rounded-lg transition-colors text-sm md:text-base ${
                      currentPage === page
                        ? 'bg-indigo-600 text-white'
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg transition-colors text-sm md:text-base ${
                  currentPage === totalPages
                    ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed border border-zinc-700'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'
                }`}
              >
                Próxima
              </button>
            </div>
          )}

          {/* Info de paginação */}
          <div className="text-center text-xs md:text-sm text-zinc-400 mt-3 md:mt-4">
            Mostrando {startIndex + 1} - {Math.min(endIndex, filteredSongs.length)} de {filteredSongs.length} música{filteredSongs.length !== 1 ? 's' : ''}
          </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Archive className="h-16 w-16 text-zinc-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-zinc-100 mb-2">
              Nenhuma música encontrada
            </h3>
            <p className="text-zinc-400 mb-6">
              {searchTerm || selectedTag 
                ? 'Tente ajustar os filtros de busca'
                : 'Nenhuma música foi adicionada ao acervo ainda'
              }
            </p>
            {!searchTerm && !selectedTag && (
              <p className="text-zinc-500">
                Clique em "Adicionar Música" para começar a construir o acervo
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchivePage;
