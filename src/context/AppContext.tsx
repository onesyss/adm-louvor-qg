import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Musician, Song, AgendaItem, MonthSchedule, Repertoire, Activity } from '../types';
import { 
  addDocument, 
  updateDocument, 
  deleteDocument, 
  subscribeToCollection 
} from '../firebase/firestore';

interface AppContextType {
  // Músicos e Cantores
  musicians: Musician[];
  addMusician: (musician: Musician) => void;
  updateMusician: (id: string, musician: Musician) => void;
  deleteMusician: (id: string) => void;

  // Músicas
  songs: Song[];
  addSong: (song: Song) => void;
  updateSong: (id: string, song: Song) => void;
  deleteSong: (id: string) => void;

  // Agenda
  agendaItems: AgendaItem[];
  addAgendaItem: (item: AgendaItem) => void;
  updateAgendaItem: (id: string, item: AgendaItem) => void;
  deleteAgendaItem: (id: string) => void;

  // Escalas
  schedules: MonthSchedule[];
  setSchedules: (schedules: MonthSchedule[] | ((prev: MonthSchedule[]) => MonthSchedule[])) => void;

  // Repertórios
  repertoires: Repertoire[];
  addRepertoire: (repertoire: Repertoire) => void;
  updateRepertoire: (id: string, repertoire: Repertoire) => void;
  deleteRepertoire: (id: string) => void;

  // Atividades Recentes
  activities: Activity[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Dados iniciais dos músicos
  const initialMusicians: Musician[] = [
    { id: '1', name: 'João Silva', instrument: 'Guitarra', photoUrl: 'https://i.pravatar.cc/100?img=1' },
    { id: '2', name: 'Maria Santos', instrument: 'Teclado', photoUrl: 'https://i.pravatar.cc/100?img=2' },
    { id: '3', name: 'Pedro Costa', instrument: 'Bateria', photoUrl: 'https://i.pravatar.cc/100?img=3' },
    { id: '4', name: 'Ana Lima', instrument: 'Baixo', photoUrl: 'https://i.pravatar.cc/100?img=4' },
    { id: '5', name: 'Carlos Oliveira', instrument: 'Violão', photoUrl: 'https://i.pravatar.cc/100?img=5' },
    { id: '6', name: 'Fernanda Souza', instrument: 'Teclado', photoUrl: 'https://i.pravatar.cc/100?img=6' },
    { id: '7', name: 'Rafael Mendes', instrument: 'Bateria', photoUrl: 'https://i.pravatar.cc/100?img=7' },
    { id: '8', name: 'Juliana Costa', instrument: 'Baixo', photoUrl: 'https://i.pravatar.cc/100?img=8' },
    { id: '9', name: 'Lucas Alves', instrument: 'Vocal', photoUrl: 'https://i.pravatar.cc/100?img=9' },
    { id: '10', name: 'Beatriz Silva', instrument: 'Vocal', photoUrl: 'https://i.pravatar.cc/100?img=10' },
    { id: '11', name: 'Gabriel Santos', instrument: 'Vocal', photoUrl: 'https://i.pravatar.cc/100?img=11' },
    { id: '12', name: 'Camila Lima', instrument: 'Vocal', photoUrl: 'https://i.pravatar.cc/100?img=12' },
    { id: '13', name: 'Diego Costa', instrument: 'Vocal', photoUrl: 'https://i.pravatar.cc/100?img=13' },
    { id: '14', name: 'Roberto Almeida', instrument: 'Técnico de Som', photoUrl: 'https://i.pravatar.cc/100?img=14' },
    { id: '15', name: 'Patricia Mendes', instrument: 'Técnico de Som', photoUrl: 'https://i.pravatar.cc/100?img=15' },
    { id: '16', name: 'Marcos Silva', instrument: 'Técnico de Som', photoUrl: 'https://i.pravatar.cc/100?img=16' }
  ];

  // Estado dos músicos
  const [musicians, setMusicians] = useState<Musician[]>(initialMusicians);

  // Carregar músicos do Firestore apenas uma vez na inicialização
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const unsubscribe = subscribeToCollection('musicians', (data) => {
          if (data.length > 0) {
            setMusicians(data as Musician[]);
          }
          // Desinscrever após a primeira carga
          unsubscribe();
        });
      } catch (error) {
        console.error('Error loading musicians:', error);
      }
    };
    loadInitialData();
  }, []);

  // Dados iniciais das músicas
  const initialSongs: Song[] = [
    {
      id: '1',
      title: 'Grande é o Senhor',
      artist: 'Nívea Soares',
      youtubeUrl: 'https://youtube.com/watch?v=example1',
      spotifyUrl: 'https://spotify.com/track/example1',
      key: 'C',
      tempo: 120,
      tags: ['adoração'],
      lyrics: 'Grande é o Senhor, grande é o Senhor...'
    },
    {
      id: '2',
      title: 'Como é Grande o Meu Deus',
      artist: 'Chris Tomlin',
      youtubeUrl: 'https://youtube.com/watch?v=example2',
      spotifyUrl: 'https://spotify.com/track/example2',
      key: 'G',
      tempo: 110,
      tags: ['adoração'],
      lyrics: 'Como é grande o meu Deus, como é grande o meu Deus...'
    },
    {
      id: '3',
      title: 'Santo Espírito',
      artist: 'Ministério Zoe',
      youtubeUrl: 'https://youtube.com/watch?v=example3',
      spotifyUrl: 'https://spotify.com/track/example3',
      key: 'D',
      tempo: 95,
      tags: ['adoração'],
      lyrics: 'Santo Espírito, enche este lugar...'
    },
    {
      id: '4',
      title: 'Oceano',
      artist: 'Ministério Zoe',
      youtubeUrl: 'https://youtube.com/watch?v=example4',
      spotifyUrl: 'https://spotify.com/track/example4',
      key: 'F',
      tempo: 105,
      tags: ['adoração'],
      lyrics: 'Meu coração é um oceano...'
    },
    {
      id: '5',
      title: 'Rei dos Reis',
      artist: 'Hillsong Worship',
      youtubeUrl: 'https://youtube.com/watch?v=example5',
      spotifyUrl: 'https://spotify.com/track/example5',
      key: 'A',
      tempo: 130,
      tags: ['celebração'],
      lyrics: 'Rei dos Reis, Senhor dos senhores...'
    },
    {
      id: '6',
      title: 'Deus de Promessas',
      artist: 'Ministério Zoe',
      youtubeUrl: 'https://youtube.com/watch?v=example6',
      spotifyUrl: 'https://spotify.com/track/example6',
      key: 'E',
      tempo: 100,
      tags: ['celebração'],
      lyrics: 'Deus de promessas, tu és fiel...'
    }
  ];

  // Estado das músicas
  const [songs, setSongs] = useState<Song[]>(initialSongs);

  // Carregar músicas do Firestore apenas uma vez na inicialização
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const unsubscribe = subscribeToCollection('songs', (data) => {
          if (data.length > 0) {
            setSongs(data as Song[]);
          }
          // Desinscrever após a primeira carga
          unsubscribe();
        });
      } catch (error) {
        console.error('Error loading songs:', error);
      }
    };
    loadInitialData();
  }, []);

  // Estado da agenda
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
  
  // Estado das escalas
  const [schedules, setSchedules] = useState<MonthSchedule[]>([]);
  
  // Estado dos repertórios
  const [repertoires, setRepertoires] = useState<Repertoire[]>([]);

  // Estado das atividades
  const [activities, setActivities] = useState<Activity[]>([]);

  // Carregar agenda do Firestore apenas uma vez
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const unsubscribe = subscribeToCollection('agendaItems', (data) => {
          setAgendaItems(data as AgendaItem[]);
          unsubscribe();
        });
      } catch (error) {
        console.error('Error loading agenda:', error);
      }
    };
    loadInitialData();
  }, []);

  // Carregar escalas do Firestore apenas uma vez
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const unsubscribe = subscribeToCollection('schedules', (data) => {
          setSchedules(data as MonthSchedule[]);
          unsubscribe();
        });
      } catch (error) {
        console.error('Error loading schedules:', error);
      }
    };
    loadInitialData();
  }, []);

  // Carregar repertórios do Firestore apenas uma vez
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const unsubscribe = subscribeToCollection('repertoires', (data) => {
          setRepertoires(data as Repertoire[]);
          unsubscribe();
        });
      } catch (error) {
        console.error('Error loading repertoires:', error);
      }
    };
    loadInitialData();
  }, []);

  // Carregar atividades do Firestore apenas uma vez
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const unsubscribe = subscribeToCollection('activities', (data) => {
          setActivities(data as Activity[]);
          unsubscribe();
        }, 'timestamp');
      } catch (error) {
        console.error('Error loading activities:', error);
      }
    };
    loadInitialData();
  }, []);

  // Funções para músicos
  const addMusician = async (musician: Musician) => {
    // Atualizar estado local imediatamente
    setMusicians(prev => [...prev, musician]);
    
    // Tentar salvar no Firestore em background
    try {
      await addDocument('musicians', musician);
      addActivity('musician', 'added', `${musician.name} adicionado como ${musician.instrument}`);
    } catch (error) {
      console.error('Error adding musician to Firestore:', error);
      // Dados já foram salvos no localStorage via useEffect
    }
  };

  const updateMusician = async (id: string, updatedMusician: Musician) => {
    // Atualizar estado local imediatamente
    setMusicians(prev => prev.map(m => m.id === id ? { ...updatedMusician, id } : m));
    
    // Tentar salvar no Firestore em background
    try {
      await updateDocument('musicians', id, updatedMusician);
      addActivity('musician', 'updated', `Dados de ${updatedMusician.name} atualizados`);
    } catch (error) {
      console.error('Error updating musician in Firestore:', error);
      // Dados já foram salvos no localStorage via useEffect
    }
  };

  const deleteMusician = async (id: string) => {
    const musician = musicians.find(m => m.id === id);
    
    // Atualizar estado local imediatamente
    setMusicians(prev => prev.filter(m => m.id !== id));
    
    // Tentar deletar do Firestore em background
    try {
      await deleteDocument('musicians', id);
      if (musician) {
        addActivity('musician', 'deleted', `${musician.name} removido do ministério`);
      }
    } catch (error) {
      console.error('Error deleting musician from Firestore:', error);
      // Dados já foram removidos do localStorage via useEffect
    }
  };

  // Funções para músicas
  const addSong = async (song: Song) => {
    // Atualizar estado local imediatamente
    setSongs(prev => [...prev, song]);
    
    // Tentar salvar no Firestore em background
    try {
      await addDocument('songs', song);
      addActivity('song', 'added', `"${song.title}" adicionada ao acervo`);
    } catch (error) {
      console.error('Error adding song to Firestore:', error);
    }
  };

  const updateSong = async (id: string, updatedSong: Song) => {
    // Atualizar estado local imediatamente
    setSongs(prev => prev.map(s => s.id === id ? { ...updatedSong, id } : s));
    
    // Tentar salvar no Firestore em background
    try {
      await updateDocument('songs', id, updatedSong);
      addActivity('song', 'updated', `"${updatedSong.title}" atualizada`);
    } catch (error) {
      console.error('Error updating song in Firestore:', error);
    }
  };

  const deleteSong = async (id: string) => {
    const song = songs.find(s => s.id === id);
    
    // Atualizar estado local imediatamente
    setSongs(prev => prev.filter(s => s.id !== id));
    
    // Tentar deletar do Firestore em background
    try {
      await deleteDocument('songs', id);
      if (song) {
        addActivity('song', 'deleted', `"${song.title}" removida do acervo`);
      }
    } catch (error) {
      console.error('Error deleting song from Firestore:', error);
    }
  };


  // Função auxiliar para adicionar atividade
  const addActivity = async (type: Activity['type'], action: Activity['action'], description: string) => {
    const newActivity: Activity = {
      id: Date.now().toString(),
      type,
      action,
      description,
      timestamp: Date.now()
    };
    try {
      await addDocument('activities', newActivity);
    } catch (error) {
      console.error('Error adding activity:', error);
    }
  };

  // Funções para agenda
  const addAgendaItem = async (item: AgendaItem) => {
    // Atualizar estado local imediatamente
    setAgendaItems(prev => [...prev, item]);
    
    // Tentar salvar no Firestore em background
    try {
      await addDocument('agendaItems', item);
      addActivity('agenda', 'added', `Evento "${item.title}" adicionado à agenda`);
    } catch (error) {
      console.error('Error adding agenda item to Firestore:', error);
    }
  };

  const updateAgendaItem = async (id: string, updatedItem: AgendaItem) => {
    // Atualizar estado local imediatamente
    setAgendaItems(prev => prev.map(i => i.id === id ? { ...updatedItem, id } : i));
    
    // Tentar salvar no Firestore em background
    try {
      await updateDocument('agendaItems', id, updatedItem);
      addActivity('agenda', 'updated', `Evento "${updatedItem.title}" atualizado`);
    } catch (error) {
      console.error('Error updating agenda item in Firestore:', error);
    }
  };

  const deleteAgendaItem = async (id: string) => {
    const item = agendaItems.find(i => i.id === id);
    
    // Atualizar estado local imediatamente
    setAgendaItems(prev => prev.filter(i => i.id !== id));
    
    // Tentar deletar do Firestore em background
    try {
      await deleteDocument('agendaItems', id);
      if (item) {
        addActivity('agenda', 'deleted', `Evento "${item.title}" removido da agenda`);
      }
    } catch (error) {
      console.error('Error deleting agenda item from Firestore:', error);
    }
  };

  // Funções para repertórios
  const addRepertoire = async (repertoire: Repertoire) => {
    // Atualizar estado local imediatamente
    setRepertoires(prev => [...prev, repertoire]);
    
    // Tentar salvar no Firestore em background
    try {
      await addDocument('repertoires', repertoire);
      addActivity('repertoire', 'added', `Repertório "${repertoire.title}" criado`);
    } catch (error) {
      console.error('Error adding repertoire to Firestore:', error);
    }
  };

  const updateRepertoire = async (id: string, updatedRepertoire: Repertoire) => {
    // Atualizar estado local imediatamente
    setRepertoires(prev => prev.map(r => r.id === id ? { ...updatedRepertoire, id } : r));
    
    // Tentar salvar no Firestore em background
    try {
      await updateDocument('repertoires', id, updatedRepertoire);
      addActivity('repertoire', 'updated', `Repertório "${updatedRepertoire.title}" atualizado`);
    } catch (error) {
      console.error('Error updating repertoire in Firestore:', error);
    }
  };

  const deleteRepertoire = async (id: string) => {
    const repertoire = repertoires.find(r => r.id === id);
    
    // Atualizar estado local imediatamente
    setRepertoires(prev => prev.filter(r => r.id !== id));
    
    // Tentar deletar do Firestore em background
    try {
      await deleteDocument('repertoires', id);
      if (repertoire) {
        addActivity('repertoire', 'deleted', `Repertório "${repertoire.title}" removido`);
      }
    } catch (error) {
      console.error('Error deleting repertoire from Firestore:', error);
    }
  };

  const value: AppContextType = {
    // Músicos
    musicians,
    addMusician,
    updateMusician,
    deleteMusician,

    // Músicas
    songs,
    addSong,
    updateSong,
    deleteSong,

    // Agenda
    agendaItems,
    addAgendaItem,
    updateAgendaItem,
    deleteAgendaItem,

    // Escalas
    schedules,
    setSchedules,

    // Repertórios
    repertoires,
    addRepertoire,
    updateRepertoire,
    deleteRepertoire,

    // Atividades
    activities,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
