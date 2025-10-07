import React, { useState } from 'react';
import { Users, Guitar, Mic, Music, Volume2, Plus, Save, X, Edit, Trash2, Search } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNotification } from '../components/Notification';

const Musicians: React.FC = () => {
  const { musicians, addMusician, updateMusician, deleteMusician } = useAppContext();
  const { addNotification, showConfirm } = useNotification();
  
  // Estados para o formulário de cadastro
  const [isAddingMusician, setIsAddingMusician] = useState(false);
  const [newMusician, setNewMusician] = useState({
    name: '',
    instrument: 'Guitarra' as const,
    photoUrl: ''
  });
  const [photoPreview, setPhotoPreview] = useState<string>('');

  // Estados para edição
  const [editingMusicianId, setEditingMusicianId] = useState<string | null>(null);
  const [editMusician, setEditMusician] = useState({
    name: '',
    instrument: 'Guitarra' as const,
    photoUrl: ''
  });
  const [editPhotoPreview, setEditPhotoPreview] = useState<string>('');

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'musicians' | 'vocals' | 'technicians'>('all');
  
  // Separar músicos, cantores e técnicos
  const instrumentMusicians = musicians.filter(m => m.instrument !== 'Vocal' && m.instrument !== 'Técnico de Som');
  const vocals = musicians.filter(m => m.instrument === 'Vocal');
  const soundTechnicians = musicians.filter(m => m.instrument === 'Técnico de Som');

  // Aplicar filtros
  const getFilteredMusicians = (musicianList: any[]) => {
    return musicianList.filter(musician => {
      const matchesSearch = musician.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  };

  const filteredInstrumentMusicians = getFilteredMusicians(instrumentMusicians);
  const filteredVocals = getFilteredMusicians(vocals);
  const filteredSoundTechnicians = getFilteredMusicians(soundTechnicians);

  // Determinar quais seções mostrar baseado no filtro
  const showMusicians = filterType === 'all' || filterType === 'musicians';
  const showVocals = filterType === 'all' || filterType === 'vocals';
  const showTechnicians = filterType === 'all' || filterType === 'technicians';

  const getInstrumentIcon = (instrument: string) => {
    switch (instrument) {
      case 'Guitarra':
        return <Guitar className="h-5 w-5" />;
      case 'Violão':
        return <Guitar className="h-5 w-5" />;
      case 'Vocal':
        return <Mic className="h-5 w-5" />;
      case 'Técnico de Som':
        return <Volume2 className="h-5 w-5" />;
      default:
        return <Music className="h-5 w-5" />;
    }
  };

  const getInstrumentColor = (instrument: string) => {
    switch (instrument) {
      case 'Guitarra':
        return 'bg-blue-900/40 text-blue-300 border-blue-800';
      case 'Violão':
        return 'bg-cyan-900/40 text-cyan-300 border-cyan-800';
      case 'Teclado':
        return 'bg-purple-900/40 text-purple-300 border-purple-800';
      case 'Bateria':
        return 'bg-orange-900/40 text-orange-300 border-orange-800';
      case 'Baixo':
        return 'bg-green-900/40 text-green-300 border-green-800';
      case 'Vocal':
        return 'bg-pink-900/40 text-pink-300 border-pink-800';
      case 'Técnico de Som':
        return 'bg-yellow-900/40 text-yellow-300 border-yellow-800';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      // Limpar URL se arquivo foi selecionado
      setNewMusician({ ...newMusician, photoUrl: '' });
    }
  };

  const handleUrlChange = (url: string) => {
    setNewMusician({ ...newMusician, photoUrl: url });
    // Limpar preview se URL foi inserida
    setPhotoPreview('');
  };

  const handleAddMusician = () => {
    if (newMusician.name.trim()) {
      const musician = {
        id: Date.now().toString(),
        name: newMusician.name,
        instrument: newMusician.instrument,
        photoUrl: photoPreview || newMusician.photoUrl || undefined
      };
      addMusician(musician);
      setNewMusician({ name: '', instrument: 'Guitarra', photoUrl: '' });
      setPhotoPreview('');
      setIsAddingMusician(false);
      
      addNotification({
        type: 'success',
        title: 'Colaborador adicionado!',
        message: `${musician.name} foi cadastrado com sucesso.`
      });
    } else {
      addNotification({
        type: 'warning',
        title: 'Nome obrigatório',
        message: 'Por favor, informe o nome do colaborador.'
      });
    }
  };

  const handleCancelAdd = () => {
    setNewMusician({ name: '', instrument: 'Guitarra', photoUrl: '' });
    setPhotoPreview('');
    setIsAddingMusician(false);
  };

  // Funções para edição
  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setEditMusician({ ...editMusician, photoUrl: '' });
    }
  };

  const handleEditUrlChange = (url: string) => {
    setEditMusician({ ...editMusician, photoUrl: url });
    setEditPhotoPreview('');
  };

  const startEditMusician = (musician: any) => {
    setEditingMusicianId(musician.id);
    setEditMusician({
      name: musician.name,
      instrument: musician.instrument,
      photoUrl: musician.photoUrl || ''
    });
    setEditPhotoPreview('');
  };

  const saveEditMusician = () => {
    if (!editingMusicianId) return;
    
    if (editMusician.name.trim()) {
      const updated = {
        id: editingMusicianId,
        name: editMusician.name,
        instrument: editMusician.instrument,
        photoUrl: editPhotoPreview || editMusician.photoUrl || undefined
      };
      updateMusician(editingMusicianId, updated);
      setEditingMusicianId(null);
      
      addNotification({
        type: 'success',
        title: 'Colaborador atualizado!',
        message: `${updated.name} foi atualizado com sucesso.`
      });
    } else {
      addNotification({
        type: 'warning',
        title: 'Nome obrigatório',
        message: 'Por favor, informe o nome do colaborador.'
      });
    }
  };

  const cancelEditMusician = () => {
    setEditingMusicianId(null);
    setEditMusician({ name: '', instrument: 'Guitarra', photoUrl: '' });
    setEditPhotoPreview('');
  };

  const handleDeleteMusician = async (id: string) => {
    console.log('🔴 handleDeleteMusician chamado! ID:', id);
    const musician = musicians.find(m => m.id === id);
    const musicianName = musician?.name || 'este colaborador';
    console.log('👤 Musician encontrado:', musicianName);
    
    console.log('💬 Mostrando confirmação...');
    const confirmed = await showConfirm(
      'Excluir Colaborador',
      `Tem certeza que deseja excluir ${musicianName}? Esta ação não pode ser desfeita.`
    );
    console.log('✅ Usuário confirmou:', confirmed);

    if (confirmed) {
      console.log('🚀 Chamando deleteMusician...');
      await deleteMusician(id);
      console.log('✅ deleteMusician completou!');
      addNotification({
        type: 'success',
        title: 'Colaborador excluído!',
        message: `${musicianName} foi removido com sucesso.`
      });
    } else {
      console.log('❌ Usuário cancelou a exclusão');
    }
  };

  // Componente para renderizar card de colaborador
  const MusicianCard = ({ musician }: { musician: any }) => {
    if (editingMusicianId === musician.id) {
      return (
        <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
          <div className="space-y-4">
            <input
              type="text"
              value={editMusician.name}
              onChange={(e) => setEditMusician({ ...editMusician, name: e.target.value })}
              className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 text-zinc-100 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            <select
              value={editMusician.instrument}
              onChange={(e) => setEditMusician({ ...editMusician, instrument: e.target.value as any })}
              className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 text-zinc-100 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Guitarra">Guitarra</option>
              <option value="Violão">Violão</option>
              <option value="Teclado">Teclado</option>
              <option value="Bateria">Bateria</option>
              <option value="Baixo">Baixo</option>
              <option value="Vocal">Vocal</option>
              <option value="Técnico de Som">Técnico de Som</option>
            </select>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEditFileChange}
                  className="flex-1 px-2 py-1 bg-zinc-700 border border-zinc-600 text-zinc-100 rounded text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-medium file:bg-indigo-600 file:text-white"
                />
                <span className="text-zinc-400 text-xs">ou</span>
                <input
                  type="url"
                  placeholder="URL"
                  value={editMusician.photoUrl}
                  onChange={(e) => handleEditUrlChange(e.target.value)}
                  className="flex-1 px-2 py-1 bg-zinc-700 border border-zinc-600 text-zinc-100 placeholder-zinc-500 rounded text-xs focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              
              {(editPhotoPreview || editMusician.photoUrl) && (
                <div className="flex items-center space-x-2">
                  <img
                    src={editPhotoPreview || editMusician.photoUrl}
                    alt="Preview"
                    className="w-8 h-8 rounded-full object-cover border border-zinc-600"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setEditPhotoPreview('');
                      setEditMusician({ ...editMusician, photoUrl: '' });
                    }}
                    className="text-red-400 hover:text-red-300 text-xs"
                  >
                    Remover
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex space-x-2">
              <button onClick={saveEditMusician} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm py-1 px-2 rounded transition-colors">
                <Save className="h-3 w-3 mr-1 inline" />
                Salvar
              </button>
              <button onClick={cancelEditMusician} className="flex-1 bg-zinc-600 hover:bg-zinc-700 text-white text-sm py-1 px-2 rounded transition-colors">
                <X className="h-3 w-3 mr-1 inline" />
                Cancelar
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {musician.photoUrl ? (
              <img 
                src={musician.photoUrl} 
                alt={musician.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-zinc-600"
              />
            ) : (
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getInstrumentColor(musician.instrument)}`}>
                {getInstrumentIcon(musician.instrument)}
              </div>
            )}
            <div>
              <h3 className="font-semibold text-zinc-100">{musician.name}</h3>
              <p className="text-sm text-zinc-400">{musician.instrument}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => startEditMusician(musician)}
              className="p-2 text-zinc-400 hover:text-indigo-400 hover:bg-indigo-900/20 rounded-lg transition-colors"
              title="Editar"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                console.log('🖱️ Botão Delete clicado! Musician ID:', musician.id);
                handleDeleteMusician(musician.id);
              }}
              className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
              title="Excluir"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3 md:space-x-4">
            <Users className="h-6 w-6 md:h-8 md:w-8 text-indigo-400" />
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-zinc-100">Colaboradores</h1>
              <p className="text-sm md:text-base text-zinc-400">Músicos, cantores e técnicos</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddingMusician(true)}
            className="btn-primary self-start sm:self-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Cadastrar-se</span>
            <span className="sm:hidden">Cadastrar</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 text-center">
          <Guitar className="h-8 w-8 text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-zinc-100">{instrumentMusicians.length}</div>
          <div className="text-sm text-zinc-400">Músicos</div>
        </div>
        <div className="glass p-6 text-center">
          <Mic className="h-8 w-8 text-pink-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-zinc-100">{vocals.length}</div>
          <div className="text-sm text-zinc-400">Cantores</div>
        </div>
        <div className="glass p-6 text-center">
          <Volume2 className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-zinc-100">{soundTechnicians.length}</div>
          <div className="text-sm text-zinc-400">Técnicos de Som</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="glass p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Busca por nome */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Buscar por nome
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-400" />
              <input
                type="text"
                placeholder="Digite o nome do colaborador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtro por tipo */}
          <div className="md:w-64">
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Filtrar por tipo
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">Todos</option>
              <option value="musicians">Músicos</option>
              <option value="vocals">Cantores</option>
              <option value="technicians">Técnicos de Som</option>
            </select>
          </div>
        </div>

        {/* Contador de resultados */}
        {(searchTerm || filterType !== 'all') && (
          <div className="mt-4 text-sm text-zinc-400">
            {(() => {
              const total = filteredInstrumentMusicians.length + filteredVocals.length + filteredSoundTechnicians.length;
              return `Mostrando ${total} colaborador${total !== 1 ? 'es' : ''}`;
            })()}
          </div>
        )}
      </div>

      {/* Formulário de Cadastro */}
      {isAddingMusician && (
        <div className="glass p-4 md:p-6">
          <h2 className="text-xl md:text-2xl font-bold text-zinc-100 mb-4 md:mb-6">Cadastrar-se como Colaborador</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nome e sobrenome"
                value={newMusician.name}
                onChange={(e) => setNewMusician({ ...newMusician, name: e.target.value })}
                className="px-3 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <select
                value={newMusician.instrument}
                onChange={(e) => setNewMusician({ ...newMusician, instrument: e.target.value as any })}
                className="px-3 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Guitarra">Guitarra</option>
                <option value="Violão">Violão</option>
                <option value="Teclado">Teclado</option>
                <option value="Bateria">Bateria</option>
                <option value="Baixo">Baixo</option>
                <option value="Vocal">Vocal</option>
                <option value="Técnico de Som">Técnico de Som</option>
              </select>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Foto (opcional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg focus:ring-2 focus:ring-indigo-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
                  />
                </div>
                <div className="text-zinc-400 text-sm">ou</div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    URL da foto
                  </label>
                  <input
                    type="url"
                    placeholder="https://exemplo.com/foto.jpg"
                    value={newMusician.photoUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              
              {/* Preview da foto */}
              {(photoPreview || newMusician.photoUrl) && (
                <div className="flex items-center space-x-4">
                  <img
                    src={photoPreview || newMusician.photoUrl}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover border-2 border-zinc-600"
                  />
                  <div className="text-sm text-zinc-400">
                    <p>Preview da foto</p>
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoPreview('');
                        setNewMusician({ ...newMusician, photoUrl: '' });
                      }}
                      className="text-red-400 hover:text-red-300 mt-1"
                    >
                      Remover foto
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleAddMusician}
                className="btn-primary"
              >
                <Save className="h-4 w-4 mr-2" />
                Cadastrar
              </button>
              <button
                onClick={handleCancelAdd}
                className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-100 rounded-lg transition-colors"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Músicos */}
      {showMusicians && (
        <div className="glass p-4 md:p-6">
          <h2 className="text-xl md:text-2xl font-bold text-zinc-100 mb-4 md:mb-6 flex items-center">
            <Guitar className="h-5 w-5 md:h-6 md:w-6 mr-2 md:mr-3 text-blue-400" />
            Músicos
            {filteredInstrumentMusicians.length !== instrumentMusicians.length && (
              <span className="ml-2 text-sm text-zinc-400">
                ({filteredInstrumentMusicians.length} de {instrumentMusicians.length})
              </span>
            )}
          </h2>
          {filteredInstrumentMusicians.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredInstrumentMusicians.map((musician) => (
                <MusicianCard key={musician.id} musician={musician} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Guitar className="h-12 w-12 text-zinc-400 mx-auto mb-4" />
              <p className="text-zinc-400">
                {searchTerm ? 'Nenhum músico encontrado com esse nome.' : 'Nenhum músico cadastrado ainda.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Cantores */}
      {showVocals && (
        <div className="glass p-4 md:p-6">
          <h2 className="text-xl md:text-2xl font-bold text-zinc-100 mb-4 md:mb-6 flex items-center">
            <Mic className="h-5 w-5 md:h-6 md:w-6 mr-2 md:mr-3 text-pink-400" />
            Cantores
            {filteredVocals.length !== vocals.length && (
              <span className="ml-2 text-sm text-zinc-400">
                ({filteredVocals.length} de {vocals.length})
              </span>
            )}
          </h2>
          {filteredVocals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVocals.map((vocal) => (
                <MusicianCard key={vocal.id} musician={vocal} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Mic className="h-12 w-12 text-zinc-400 mx-auto mb-4" />
              <p className="text-zinc-400">
                {searchTerm ? 'Nenhum cantor encontrado com esse nome.' : 'Nenhum cantor cadastrado ainda.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Técnicos de Som */}
      {showTechnicians && (
        <div className="glass p-4 md:p-6">
          <h2 className="text-xl md:text-2xl font-bold text-zinc-100 mb-4 md:mb-6 flex items-center">
            <Volume2 className="h-5 w-5 md:h-6 md:w-6 mr-2 md:mr-3 text-yellow-400" />
            Técnicos de Som
            {filteredSoundTechnicians.length !== soundTechnicians.length && (
              <span className="ml-2 text-sm text-zinc-400">
                ({filteredSoundTechnicians.length} de {soundTechnicians.length})
              </span>
            )}
          </h2>
          {filteredSoundTechnicians.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSoundTechnicians.map((technician) => (
                <MusicianCard key={technician.id} musician={technician} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Volume2 className="h-12 w-12 text-zinc-400 mx-auto mb-4" />
              <p className="text-zinc-400">
                {searchTerm ? 'Nenhum técnico encontrado com esse nome.' : 'Nenhum técnico cadastrado ainda.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Musicians;
