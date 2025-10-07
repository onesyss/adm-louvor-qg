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

  // Carregar músicos do Firestore com sincronização em tempo real
  useEffect(() => {
    console.log('🔄 Configurando sincronização em tempo real para musicians...');
    console.log('📍 Estado atual de musicians:', musicians.length);
    
    let unsubscribe: (() => void) | null = null;
    
    try {
      unsubscribe = subscribeToCollection('musicians', (data) => {
        console.log('🔔 CALLBACK MUSICIANS DISPAROU! Dados:', data.length, 'documentos');
        console.log('📊 Dados recebidos:', data);
        console.log('🔄 Atualizando estado de musicians...');
        setMusicians(data as Musician[]);
        console.log('✅ Estado de musicians atualizado para:', data.length, 'documentos');
      });
      console.log('✅ onSnapshot de musicians configurado com sucesso!');
    } catch (error) {
      console.error('❌ Error setting up musicians sync:', error);
    }
    
    return () => {
      if (unsubscribe) {
        console.log('❌ Cancelando sincronização de musicians');
        unsubscribe();
      }
    };
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

  // Carregar músicas do Firestore com sincronização em tempo real
  useEffect(() => {
    console.log('🔄 Configurando sincronização em tempo real para songs...');
    try {
      const unsubscribe = subscribeToCollection('songs', (data) => {
        console.log('✅ Dados de songs atualizados:', data.length, 'documentos');
        // Se não tem dados no Firestore, manter dados iniciais
        if (data.length === 0) {
          console.log('⚠️ Collection songs vazia, mantendo dados iniciais');
        } else {
          setSongs(data as Song[]);
        }
      });
      return () => {
        console.log('❌ Cancelando sincronização de songs');
        unsubscribe();
      };
    } catch (error) {
      console.error('Error setting up songs sync:', error);
    }
  }, []);

  // Estado da agenda
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
  
  // Estado das escalas
  const [schedules, setSchedules] = useState<MonthSchedule[]>([]);
  
  // Estado dos repertórios
  const [repertoires, setRepertoires] = useState<Repertoire[]>([]);

  // Estado das atividades
  const [activities, setActivities] = useState<Activity[]>([]);

  // Carregar agenda do Firestore com sincronização em tempo real
  useEffect(() => {
    console.log('🔄 Configurando sincronização em tempo real para agendaItems...');
    try {
      const unsubscribe = subscribeToCollection('agendaItems', (data) => {
        console.log('✅ Dados de agendaItems atualizados:', data.length, 'documentos');
        setAgendaItems(data as AgendaItem[]);
      });
      return () => {
        console.log('❌ Cancelando sincronização de agendaItems');
        unsubscribe();
      };
    } catch (error) {
      console.error('Error setting up agendaItems sync:', error);
    }
  }, []);

  // Carregar escalas do Firestore com sincronização em tempo real
  useEffect(() => {
    console.log('🔄 Configurando sincronização em tempo real para schedules...');
    try {
      const unsubscribe = subscribeToCollection('schedules', (data) => {
        console.log('✅ Dados de schedules atualizados:', data.length, 'documentos');
        if (data.length === 0) {
          console.log('⚠️ Collection schedules vazia');
        } else {
          setSchedules(data as MonthSchedule[]);
        }
      });
      return () => {
        console.log('❌ Cancelando sincronização de schedules');
        unsubscribe();
      };
    } catch (error) {
      console.error('Error setting up schedules sync:', error);
    }
  }, []);

  // Carregar repertórios do Firestore com sincronização em tempo real
  useEffect(() => {
    console.log('🔄 Configurando sincronização em tempo real para repertoires...');
    try {
      const unsubscribe = subscribeToCollection('repertoires', (data) => {
        console.log('✅ Dados de repertoires atualizados:', data.length, 'documentos');
        if (data.length === 0) {
          console.log('⚠️ Collection repertoires vazia');
        } else {
          setRepertoires(data as Repertoire[]);
        }
      });
      return () => {
        console.log('❌ Cancelando sincronização de repertoires');
        unsubscribe();
      };
    } catch (error) {
      console.error('Error setting up repertoires sync:', error);
    }
  }, []);

  // Carregar atividades do Firestore com sincronização em tempo real
  useEffect(() => {
    console.log('🔄 Configurando sincronização em tempo real para activities...');
    try {
      const unsubscribe = subscribeToCollection('activities', (data) => {
        console.log('✅ Dados de activities atualizados:', data.length, 'documentos');
        setActivities(data as Activity[]);
      }, 'timestamp');
      return () => {
        console.log('❌ Cancelando sincronização de activities');
        unsubscribe();
      };
    } catch (error) {
      console.error('Error setting up activities sync:', error);
    }
  }, []);

  // Funções para músicos
  const addMusician = async (musician: Musician) => {
    try {
      console.log('➕ Adicionando musician ao Firestore...');
      await addDocument('musicians', musician);
      console.log('✅ Musician adicionado! onSnapshot vai atualizar');
      addActivity('musician', 'added', `${musician.name} adicionado como ${musician.instrument}`);
    } catch (error) {
      console.error('❌ Error adding musician to Firestore:', error);
    }
  };

  const updateMusician = async (id: string, updatedMusician: Musician) => {
    try {
      console.log('✏️ Atualizando musician no Firestore...');
      await updateDocument('musicians', id, updatedMusician);
      console.log('✅ Musician atualizado! onSnapshot vai atualizar');
      addActivity('musician', 'updated', `Dados de ${updatedMusician.name} atualizados`);
    } catch (error) {
      console.error('❌ Error updating musician in Firestore:', error);
    }
  };

  const deleteMusician = async (id: string) => {
    const musician = musicians.find(m => m.id === id);
    console.log('🗑️ Deletando musician:', id, musician?.name);
    
    try {
      console.log('🔥 Deletando do Firestore...');
      await deleteDocument('musicians', id);
      console.log('✅ Deletado do Firestore! onSnapshot vai atualizar automaticamente');
      if (musician) {
        addActivity('musician', 'deleted', `${musician.name} removido do ministério`);
      }
    } catch (error) {
      console.error('❌ Error deleting musician from Firestore:', error);
    }
  };

  // Funções para músicas
  const addSong = async (song: Song) => {
    try {
      console.log('➕ Adicionando song ao Firestore...');
      await addDocument('songs', song);
      console.log('✅ Song adicionado! onSnapshot vai atualizar');
      addActivity('song', 'added', `"${song.title}" adicionada ao acervo`);
    } catch (error) {
      console.error('❌ Error adding song to Firestore:', error);
    }
  };

  const updateSong = async (id: string, updatedSong: Song) => {
    try {
      console.log('✏️ Atualizando song no Firestore...');
      await updateDocument('songs', id, updatedSong);
      console.log('✅ Song atualizado! onSnapshot vai atualizar');
      addActivity('song', 'updated', `"${updatedSong.title}" atualizada`);
    } catch (error) {
      console.error('❌ Error updating song in Firestore:', error);
    }
  };

  const deleteSong = async (id: string) => {
    const song = songs.find(s => s.id === id);
    console.log('🗑️ Deletando song:', id, song?.title);
    
    try {
      console.log('🔥 Deletando do Firestore...');
      await deleteDocument('songs', id);
      console.log('✅ Deletado do Firestore! onSnapshot vai atualizar automaticamente');
      if (song) {
        addActivity('song', 'deleted', `"${song.title}" removida do acervo`);
      }
    } catch (error) {
      console.error('❌ Error deleting song from Firestore:', error);
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
    try {
      console.log('➕ Adicionando agenda item ao Firestore...');
      await addDocument('agendaItems', item);
      console.log('✅ Agenda item adicionado! onSnapshot vai atualizar');
      addActivity('agenda', 'added', `Evento "${item.title}" adicionado à agenda`);
    } catch (error) {
      console.error('❌ Error adding agenda item to Firestore:', error);
    }
  };

  const updateAgendaItem = async (id: string, updatedItem: AgendaItem) => {
    try {
      console.log('✏️ Atualizando agenda item no Firestore...');
      await updateDocument('agendaItems', id, updatedItem);
      console.log('✅ Agenda item atualizado! onSnapshot vai atualizar');
      addActivity('agenda', 'updated', `Evento "${updatedItem.title}" atualizado`);
    } catch (error) {
      console.error('❌ Error updating agenda item in Firestore:', error);
    }
  };

  const deleteAgendaItem = async (id: string) => {
    const item = agendaItems.find(i => i.id === id);
    
    try {
      await deleteDocument('agendaItems', id);
      console.log('✅ AgendaItem deletado! onSnapshot vai atualizar');
      if (item) {
        addActivity('agenda', 'deleted', `Evento "${item.title}" removido da agenda`);
      }
    } catch (error) {
      console.error('Error deleting agenda item from Firestore:', error);
    }
  };

  // Funções para repertórios
  const addRepertoire = async (repertoire: Repertoire) => {
    try {
      console.log('➕ Adicionando repertoire ao Firestore...');
      await addDocument('repertoires', repertoire);
      console.log('✅ Repertoire adicionado! onSnapshot vai atualizar');
      addActivity('repertoire', 'added', `Repertório "${repertoire.title}" criado`);
    } catch (error) {
      console.error('❌ Error adding repertoire to Firestore:', error);
    }
  };

  const updateRepertoire = async (id: string, updatedRepertoire: Repertoire) => {
    try {
      console.log('✏️ Atualizando repertoire no Firestore...');
      await updateDocument('repertoires', id, updatedRepertoire);
      console.log('✅ Repertoire atualizado! onSnapshot vai atualizar');
      addActivity('repertoire', 'updated', `Repertório "${updatedRepertoire.title}" atualizado`);
    } catch (error) {
      console.error('❌ Error updating repertoire in Firestore:', error);
    }
  };

  const deleteRepertoire = async (id: string) => {
    const repertoire = repertoires.find(r => r.id === id);
    
    try {
      await deleteDocument('repertoires', id);
      console.log('✅ Repertoire deletado! onSnapshot vai atualizar');
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
