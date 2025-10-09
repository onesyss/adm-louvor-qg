import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, 
  Plus, 
  Music, 
  Calendar, 
  LogOut,
  Save,
  Trash2,
  Edit,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { AgendaItem, MonthSchedule, WeekSchedule } from '../types';
import { useAppContext } from '../context/AppContext';
import { useNotification } from '../components/Notification';
import { deleteDocument, upsertDocument } from '../firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import '../utils/cleanDuplicateSchedules';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'agenda' | 'scales' | 'repertoire' | 'settings'>('agenda');
  const { songs, musicians, schedules, agendaItems, addAgendaItem: addAgendaItemContext, updateAgendaItem, deleteAgendaItem: deleteAgendaItemContext, repertoires, addRepertoire: addRepertoireContext, updateRepertoire, deleteRepertoire: deleteRepertoireContext } = useAppContext();
  const { addNotification, showConfirm } = useNotification();

  // Estados para o formulário de escala
  const [newScale, setNewScale] = useState({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    weekNumber: 1,
    serviceName: '',
    selectedMusicians: [] as string[],
    date: ''
  });
  const [showCustomServiceName, setShowCustomServiceName] = useState(false);
  const [customServiceName, setCustomServiceName] = useState('');

  // Estado para edição
  const [editingWeek, setEditingWeek] = useState<string | null>(null);
  const [editScale, setEditScale] = useState({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    weekNumber: 1,
    serviceName: '',
    selectedMusicians: [] as string[],
    date: ''
  });
  const [showEditCustomServiceName, setShowEditCustomServiceName] = useState(false);
  const [editCustomServiceName, setEditCustomServiceName] = useState('');
  
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Estados para agenda
  const [newAgendaItem, setNewAgendaItem] = useState({
    title: '', 
    description: '',
    date: '',
    time: '',
    location: '',
    type: 'rehearsal' as AgendaItem['type']
  });

  const [editingAgendaId, setEditingAgendaId] = useState<string | null>(null);
  const [editAgendaItem, setEditAgendaItem] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    type: 'rehearsal' as AgendaItem['type']
  });

  const handleAddAgendaItem = () => {
    if (!newAgendaItem.title.trim() || !newAgendaItem.date) {
      addNotification({
        type: 'warning',
        title: 'Campos obrigatórios',
        message: 'Preencha o título e a data do evento.'
      });
      return;
    }

      const item: AgendaItem = {
        id: Date.now().toString(),
        title: newAgendaItem.title,
        description: newAgendaItem.description,
        date: newAgendaItem.date,
        time: newAgendaItem.time || undefined,
        location: newAgendaItem.location || undefined,
        type: newAgendaItem.type
      };
    
    addAgendaItemContext(item);
      setNewAgendaItem({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        type: 'rehearsal'
      });

    addNotification({
      type: 'success',
      title: 'Evento criado',
      message: 'Evento adicionado à agenda com sucesso!'
    });
  };

  const startEditAgenda = (item: AgendaItem) => {
    setEditingAgendaId(item.id);
    setEditAgendaItem({
      title: item.title,
      description: item.description,
      date: item.date,
      time: item.time || '',
      location: item.location || '',
      type: item.type
    });
  };

  const saveEditAgenda = () => {
    if (!editAgendaItem.title.trim() || !editAgendaItem.date) {
      addNotification({
        type: 'warning',
        title: 'Campos obrigatórios',
        message: 'Preencha o título e a data do evento.'
      });
      return;
    }

    const updatedItem: AgendaItem = {
      id: editingAgendaId!,
      title: editAgendaItem.title,
      description: editAgendaItem.description,
      date: editAgendaItem.date,
      time: editAgendaItem.time || undefined,
      location: editAgendaItem.location || undefined,
      type: editAgendaItem.type
    };

    updateAgendaItem(editingAgendaId!, updatedItem);
    setEditingAgendaId(null);

    addNotification({
      type: 'success',
      title: 'Evento atualizado',
      message: 'Evento atualizado com sucesso!'
    });
  };

  const cancelEditAgenda = () => {
    setEditingAgendaId(null);
  };

  const handleDeleteAgenda = async (id: string) => {
    const confirmed = await showConfirm(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este evento da agenda?'
    );

    if (confirmed) {
      deleteAgendaItemContext(id);
      addNotification({
        type: 'success',
        title: 'Evento excluído',
        message: 'Evento removido da agenda com sucesso!'
      });
    }
  };

  // Estados para repertório
  const [newRepertoire, setNewRepertoire] = useState({
    title: '',
    weekDate: '',
    playlistUrl: '',
    repertoireSongs: [] as any[] // Array de RepertoireSong
  });

  const [editingRepertoireId, setEditingRepertoireId] = useState<string | null>(null);
  const [editRepertoire, setEditRepertoire] = useState({
    title: '',
    weekDate: '',
    playlistUrl: '',
    repertoireSongs: [] as any[]
  });

  // Estados para adicionar música ao repertório
  const [showAddSongModal, setShowAddSongModal] = useState(false);
  const [showEditSongModal, setShowEditSongModal] = useState(false);
  const [editingRepertoireSongIndex, setEditingRepertoireSongIndex] = useState<number | null>(null);
  const [editingRepertoireSongIndexInEdit, setEditingRepertoireSongIndexInEdit] = useState<number | null>(null);
  const [currentSongForm, setCurrentSongForm] = useState({
    selectedSongs: [] as string[],
    customKey: '',
    isMedley: false,
    moment: '',
    isInstrumental: false
  });

  // Funções para escalas
  const handleMusicianToggle = (musicianId: string) => {
    setNewScale(prev => ({
      ...prev,
      selectedMusicians: prev.selectedMusicians.includes(musicianId)
        ? prev.selectedMusicians.filter(id => id !== musicianId)
        : [...prev.selectedMusicians, musicianId]
    }));
  };

  const saveScale = async () => {
    if (newScale.selectedMusicians.length === 0) {
      addNotification({
        type: 'warning',
        title: 'Colaboradores obrigatórios',
        message: 'Selecione pelo menos um colaborador para a escala.'
      });
      return;
    }

    const selectedMusiciansData = musicians.filter(m => newScale.selectedMusicians.includes(m.id));
    
    const newWeek = {
      id: `${newScale.month}-${newScale.year}-${newScale.weekNumber}-${Date.now()}`,
      weekNumber: newScale.weekNumber,
      date: newScale.date || new Date(newScale.year, newScale.month, 1 + (newScale.weekNumber - 1) * 7).toISOString().split('T')[0],
      serviceName: newScale.serviceName || undefined,
      musicians: selectedMusiciansData,
      vocals: []
    };

    const scheduleId = `${newScale.month}-${newScale.year}`;
    const existingSchedule = schedules.find((s: MonthSchedule) => s.month === newScale.month && s.year === newScale.year);
    
    if (existingSchedule) {
      // Verificar se já existe uma escala para esta semana E tipo de culto
      const existingWeek = existingSchedule.weeks.find((w: WeekSchedule) => 
        w.weekNumber === newScale.weekNumber && w.serviceName === newScale.serviceName
      );
      if (existingWeek) {
        addNotification({
          type: 'warning',
          title: 'Escala já cadastrada',
          message: `Já existe uma escala para ${newScale.serviceName} na ${newScale.weekNumber}ª semana deste mês.`
        });
        return;
      }
      
      // Atualizar schedule existente
      const updatedSchedule = {
        ...existingSchedule,
        weeks: [...existingSchedule.weeks, newWeek]
      };
      
      try {
        await upsertDocument('schedules', scheduleId, updatedSchedule);
        console.log('✅ Schedule criado/atualizado no Firestore');
      } catch (error) {
        console.error('❌ Erro ao criar/atualizar schedule:', error);
      }
    } else {
      // Criar novo schedule
      const newSchedule: MonthSchedule = {
        id: scheduleId,
        month: newScale.month,
        year: newScale.year,
        weeks: [newWeek]
      };
      
      try {
        await upsertDocument('schedules', scheduleId, newSchedule);
        console.log('✅ Schedule criado no Firestore');
      } catch (error) {
        console.error('❌ Erro ao criar schedule:', error);
      }
    }

    // Resetar formulário
    setNewScale({
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
      weekNumber: 1,
      serviceName: '',
      selectedMusicians: [],
      date: ''
    });
    setShowCustomServiceName(false);
    setCustomServiceName('');

    addNotification({
      type: 'success',
      title: 'Escala salva!',
      message: `Escala da ${newScale.weekNumber}ª semana foi salva e já está disponível na página de Escalas.`
    });
  };

  const startEditWeek = (weekId: string) => {
    const week = schedules
      .flatMap(s => s.weeks)
      .find(w => w.id === weekId);
    
    if (week) {
      const schedule = schedules.find(s => s.weeks.some(w => w.id === weekId));
      if (schedule) {
        setEditingWeek(weekId);
        
        // Verificar se é um tipo customizado
        const predefinedTypes = ['Culto Manhã', 'Culto Noite', 'Culto de Terça', ''];
        const isCustom = week.serviceName && !predefinedTypes.includes(week.serviceName);
        
        setEditScale({
          month: schedule.month,
          year: schedule.year,
          weekNumber: week.weekNumber,
          serviceName: week.serviceName || '',
          selectedMusicians: week.musicians.map(m => m.id),
          date: week.date
        });
        
        if (isCustom) {
          setShowEditCustomServiceName(true);
          setEditCustomServiceName(week.serviceName || '');
        } else {
          setShowEditCustomServiceName(false);
          setEditCustomServiceName('');
        }
      }
    }
  };

  const saveEditWeek = async () => {
    if (!editingWeek) return;

    if (editScale.selectedMusicians.length === 0) {
      addNotification({
        type: 'warning',
        title: 'Colaboradores obrigatórios',
        message: 'Selecione pelo menos um colaborador para a escala.'
      });
      return;
    }

    const selectedMusiciansData = musicians.filter(m => editScale.selectedMusicians.includes(m.id));
    
    // Encontrar o schedule que contém esta week
    const scheduleWithWeek = schedules.find((s: MonthSchedule) => 
      s.weeks.some((w: WeekSchedule) => w.id === editingWeek)
    );
    
    if (scheduleWithWeek) {
      // Atualizar a week específica
      const updatedSchedule = {
        ...scheduleWithWeek,
        weeks: scheduleWithWeek.weeks.map((week: WeekSchedule) => 
          week.id === editingWeek
            ? {
                ...week,
                weekNumber: editScale.weekNumber,
                date: editScale.date || week.date,
                serviceName: editScale.serviceName || undefined,
                musicians: selectedMusiciansData,
                vocals: []
              }
            : week
        )
      };
      
      try {
        await upsertDocument('schedules', scheduleWithWeek.id, updatedSchedule);
        console.log('✅ Schedule editado no Firestore');
      } catch (error) {
        console.error('❌ Erro ao editar schedule:', error);
      }
    }

    setEditingWeek(null);
    addNotification({
      type: 'success',
      title: 'Escala atualizada!',
      message: 'A escala foi atualizada com sucesso.'
    });
  };

  const cancelEditWeek = () => {
    setEditingWeek(null);
    setEditScale({
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
      weekNumber: 1,
      serviceName: '',
      selectedMusicians: [],
      date: ''
    });
    setShowEditCustomServiceName(false);
    setEditCustomServiceName('');
  };

  const moveWeekUp = async (weekId: string) => {
    // Encontrar o schedule que contém esta week
    const scheduleWithWeek = schedules.find((s: MonthSchedule) => 
      s.weeks.some((w: WeekSchedule) => w.id === weekId)
    );
    
    if (scheduleWithWeek) {
      const weekIndex = scheduleWithWeek.weeks.findIndex((w: WeekSchedule) => w.id === weekId);
      
      if (weekIndex > 0) {
        const newWeeks = [...scheduleWithWeek.weeks];
        [newWeeks[weekIndex - 1], newWeeks[weekIndex]] = [newWeeks[weekIndex], newWeeks[weekIndex - 1]];
        
        const updatedSchedule = {
          ...scheduleWithWeek,
          weeks: newWeeks
        };
        
        try {
          await upsertDocument('schedules', scheduleWithWeek.id, updatedSchedule);
          console.log('✅ Ordem da escala salva no Firestore');
          
          addNotification({
            type: 'success',
            title: 'Escala movida!',
            message: 'A escala foi movida para cima.'
          });
        } catch (error) {
          console.error('❌ Erro ao mover escala:', error);
          addNotification({
            type: 'error',
            title: 'Erro',
            message: 'Não foi possível mover a escala.'
          });
        }
      }
    }
  };

  const moveWeekDown = async (weekId: string) => {
    // Encontrar o schedule que contém esta week
    const scheduleWithWeek = schedules.find((s: MonthSchedule) => 
      s.weeks.some((w: WeekSchedule) => w.id === weekId)
    );
    
    if (scheduleWithWeek) {
      const weekIndex = scheduleWithWeek.weeks.findIndex((w: WeekSchedule) => w.id === weekId);
      
      if (weekIndex < scheduleWithWeek.weeks.length - 1) {
        const newWeeks = [...scheduleWithWeek.weeks];
        [newWeeks[weekIndex], newWeeks[weekIndex + 1]] = [newWeeks[weekIndex + 1], newWeeks[weekIndex]];
        
        const updatedSchedule = {
          ...scheduleWithWeek,
          weeks: newWeeks
        };
        
        try {
          await upsertDocument('schedules', scheduleWithWeek.id, updatedSchedule);
          console.log('✅ Ordem da escala salva no Firestore');
          
          addNotification({
            type: 'success',
            title: 'Escala movida!',
            message: 'A escala foi movida para baixo.'
          });
        } catch (error) {
          console.error('❌ Erro ao mover escala:', error);
          addNotification({
            type: 'error',
            title: 'Erro',
            message: 'Não foi possível mover a escala.'
          });
        }
      }
    }
  };

  const deleteWeek = async (weekId: string) => {
    console.log('🖱️ Botão Delete clicado! Week ID:', weekId);
    console.log('📋 Tipo do weekId:', typeof weekId, weekId);
    
    const confirmed = await showConfirm(
      'Excluir Escala',
      'Tem certeza que deseja excluir esta escala? Esta ação não pode ser desfeita.'
    );
    
    if (confirmed) {
      console.log('✅ Usuário confirmou a exclusão');
      console.log('🗑️ Deletando escala:', weekId);
      console.log('📊 Total de schedules:', schedules.length);
      console.log('📊 Schedules completos:', JSON.stringify(schedules, null, 2));
      
      // Encontrar o schedule que contém esta week
      const scheduleWithWeek = schedules.find((s: MonthSchedule) => 
        s.weeks.some((w: WeekSchedule) => w.id === weekId)
      );
      
      console.log('📋 Schedule encontrado:', scheduleWithWeek);
      
      if (scheduleWithWeek) {
        const updatedWeeks = scheduleWithWeek.weeks.filter((w: WeekSchedule) => w.id !== weekId);
        console.log(`📝 Weeks após remoção: ${updatedWeeks.length} (antes: ${scheduleWithWeek.weeks.length})`);
        
        if (updatedWeeks.length === 0) {
          // Se não sobrou nenhuma semana, deletar o schedule inteiro
          console.log('⚠️ Nenhuma week restante. Deletando schedule inteiro...');
          try {
            await deleteDocument('schedules', scheduleWithWeek.id);
            console.log('✅ Schedule deletado do Firestore (estava vazio)');
          } catch (error) {
            console.error('❌ Erro ao deletar schedule:', error);
            addNotification({
              type: 'error',
              title: 'Erro ao excluir',
              message: 'Não foi possível excluir a escala.'
            });
            return;
          }
        } else {
          // Atualizar o schedule com as semanas restantes
          console.log('🔄 Atualizando schedule com weeks restantes...');
          const updatedSchedule = {
            ...scheduleWithWeek,
            weeks: updatedWeeks
          };
          
          try {
            await upsertDocument('schedules', scheduleWithWeek.id, updatedSchedule);
            console.log('✅ Schedule atualizado no Firestore (week removida)');
          } catch (error) {
            console.error('❌ Erro ao atualizar schedule:', error);
            addNotification({
              type: 'error',
              title: 'Erro ao excluir',
              message: 'Não foi possível excluir a escala.'
            });
            return;
          }
        }
        
        addNotification({
          type: 'success',
          title: 'Escala excluída!',
          message: 'A escala foi removida com sucesso.'
        });
      } else {
        console.error('❌ Schedule não encontrado!');
        addNotification({
          type: 'error',
          title: 'Erro',
          message: 'Escala não encontrada.'
        });
      }
    } else {
      console.log('❌ Usuário cancelou a exclusão');
    }
  };

  // Funções para adicionar música ao repertório
  const handleSongToggleInModal = (songId: string) => {
    setCurrentSongForm(prev => ({
      ...prev,
      selectedSongs: prev.selectedSongs.includes(songId)
        ? prev.selectedSongs.filter(id => id !== songId)
        : [...prev.selectedSongs, songId]
    }));
  };

  const addSongToRepertoire = () => {
    if (currentSongForm.selectedSongs.length === 0 && !currentSongForm.isInstrumental) {
      addNotification({
        type: 'warning',
        title: 'Selecione uma música',
        message: 'Você precisa selecionar pelo menos uma música ou marcar como instrumental.'
      });
      return;
    }

    const selectedSongsData = songs.filter(s => currentSongForm.selectedSongs.includes(s.id));
    const isMedley = currentSongForm.selectedSongs.length > 1 || currentSongForm.isMedley;
    
    const repertoireSong = {
      id: Date.now().toString(),
      songIds: currentSongForm.selectedSongs,
      songs: selectedSongsData,
      customKey: currentSongForm.customKey || undefined,
      isMedley,
      medleyTitle: isMedley ? selectedSongsData.map(s => s.title).join(' + ') : undefined,
      moment: currentSongForm.moment || undefined,
      isInstrumental: currentSongForm.isInstrumental
    };

    setNewRepertoire(prev => ({
      ...prev,
      repertoireSongs: [...prev.repertoireSongs, repertoireSong]
    }));

    setShowAddSongModal(false);
    setCurrentSongForm({
      selectedSongs: [],
      customKey: '',
      isMedley: false,
      moment: '',
      isInstrumental: false
    });

    addNotification({
      type: 'success',
      title: 'Música adicionada',
      message: 'Música adicionada ao repertório!'
    });
  };

  const removeSongFromRepertoire = (songId: string) => {
    setNewRepertoire(prev => ({
      ...prev,
      repertoireSongs: prev.repertoireSongs.filter(s => s.id !== songId)
    }));
  };

  const moveSongUp = (index: number) => {
    if (index > 0) {
      setNewRepertoire(prev => {
        const newSongs = [...prev.repertoireSongs];
        [newSongs[index - 1], newSongs[index]] = [newSongs[index], newSongs[index - 1]];
        return { ...prev, repertoireSongs: newSongs };
      });
    }
  };

  const moveSongDown = (index: number) => {
    setNewRepertoire(prev => {
      if (index < prev.repertoireSongs.length - 1) {
        const newSongs = [...prev.repertoireSongs];
        [newSongs[index], newSongs[index + 1]] = [newSongs[index + 1], newSongs[index]];
        return { ...prev, repertoireSongs: newSongs };
      }
      return prev;
    });
  };

  const startEditRepertoireSong = (index: number) => {
    const repSong = newRepertoire.repertoireSongs[index];
    setEditingRepertoireSongIndex(index);
    setCurrentSongForm({
      selectedSongs: repSong.songIds || [],
      customKey: repSong.customKey || '',
      isMedley: repSong.isMedley,
      moment: repSong.moment || '',
      isInstrumental: repSong.isInstrumental || false
    });
  };

  const saveEditRepertoireSong = () => {
    if (editingRepertoireSongIndex === null) return;

    if (currentSongForm.selectedSongs.length === 0 && !currentSongForm.isInstrumental) {
      addNotification({
        type: 'warning',
        title: 'Selecione uma música',
        message: 'Você precisa selecionar pelo menos uma música ou marcar como instrumental.'
      });
      return;
    }

    const selectedSongsData = songs.filter(s => currentSongForm.selectedSongs.includes(s.id));
    const isMedley = currentSongForm.selectedSongs.length > 1 || currentSongForm.isMedley;
    
    const updatedRepertoireSong = {
      id: newRepertoire.repertoireSongs[editingRepertoireSongIndex].id,
      songIds: currentSongForm.selectedSongs,
      songs: selectedSongsData,
      customKey: currentSongForm.customKey || undefined,
      isMedley,
      medleyTitle: isMedley ? selectedSongsData.map(s => s.title).join(' + ') : undefined,
      moment: currentSongForm.moment || undefined,
      isInstrumental: currentSongForm.isInstrumental
    };

    setNewRepertoire(prev => ({
      ...prev,
      repertoireSongs: prev.repertoireSongs.map((song, idx) => 
        idx === editingRepertoireSongIndex ? updatedRepertoireSong : song
      )
    }));

    setEditingRepertoireSongIndex(null);
    setCurrentSongForm({
      selectedSongs: [],
      customKey: '',
      isMedley: false,
      moment: '',
      isInstrumental: false
    });

    addNotification({
      type: 'success',
      title: 'Música atualizada',
      message: 'Música atualizada no repertório!'
    });
  };

  const cancelEditRepertoireSong = () => {
    setEditingRepertoireSongIndex(null);
    setCurrentSongForm({
      selectedSongs: [],
      customKey: '',
      isMedley: false,
      moment: '',
      isInstrumental: false
    });
  };

  const handleAddRepertoire = async () => {
    console.log('🎼 handleAddRepertoire chamado!');
    console.log('📝 newRepertoire:', newRepertoire);
    
    if (!newRepertoire.title.trim() || !newRepertoire.weekDate || newRepertoire.repertoireSongs.length === 0) {
      addNotification({
        type: 'warning',
        title: 'Campos obrigatórios',
        message: 'Preencha o título, a data e adicione pelo menos uma música.'
      });
      return;
    }
    
    const repertoire = {
      id: Date.now().toString(),
      title: newRepertoire.title,
      weekDate: newRepertoire.weekDate,
      playlistUrl: newRepertoire.playlistUrl || undefined,
      musicians: [],
      vocals: [],
      songs: newRepertoire.repertoireSongs
    };

    console.log('🎼 Repertoire criado:', repertoire);
    console.log('🚀 Chamando addRepertoireContext...');
    await addRepertoireContext(repertoire);
    console.log('✅ addRepertoireContext completou!');
    
    setNewRepertoire({
      title: '',
      weekDate: '',
      playlistUrl: '',
      repertoireSongs: []
    });

    addNotification({
      type: 'success',
      title: 'Repertório criado',
      message: 'Repertório adicionado com sucesso!'
    });
  };

  const startEditRepertoire = (repertoire: any) => {
    setEditingRepertoireId(repertoire.id);
    setEditRepertoire({
      title: repertoire.title || '',
      weekDate: repertoire.weekDate,
      playlistUrl: repertoire.playlistUrl || '',
      repertoireSongs: repertoire.songs || []
    });
  };

  const saveEditRepertoire = async () => {
    console.log('✏️ saveEditRepertoire chamado!');
    console.log('📝 editingRepertoireId:', editingRepertoireId);
    console.log('📝 editRepertoire:', editRepertoire);
    
    if (!editRepertoire.title.trim() || !editRepertoire.weekDate || editRepertoire.repertoireSongs.length === 0) {
      addNotification({
        type: 'warning',
        title: 'Campos obrigatórios',
        message: 'Preencha o título, a data e adicione pelo menos uma música.'
      });
      return;
    }
    
    const updatedRepertoire = {
      id: editingRepertoireId!,
      title: editRepertoire.title,
      weekDate: editRepertoire.weekDate,
      playlistUrl: editRepertoire.playlistUrl || undefined,
      musicians: [],
      vocals: [],
      songs: editRepertoire.repertoireSongs
    };

    console.log('🚀 Chamando updateRepertoire...');
    await updateRepertoire(editingRepertoireId!, updatedRepertoire);
    console.log('✅ updateRepertoire completou!');
    
    setEditingRepertoireId(null);

    addNotification({
      type: 'success',
      title: 'Repertório atualizado',
      message: 'Repertório atualizado com sucesso!'
    });
  };

  const cancelEditRepertoire = () => {
    setEditingRepertoireId(null);
  };

  const handleDeleteRepertoire = async (id: string) => {
    const confirmed = await showConfirm(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este repertório?'
    );

    if (confirmed) {
      deleteRepertoireContext(id);
      addNotification({
        type: 'success',
        title: 'Repertório excluído',
        message: 'Repertório removido com sucesso!'
      });
    }
  };

  const addSongToEditRepertoire = () => {
    if (currentSongForm.selectedSongs.length === 0 && !currentSongForm.isInstrumental) {
      addNotification({
        type: 'warning',
        title: 'Selecione uma música',
        message: 'Você precisa selecionar pelo menos uma música ou marcar como instrumental.'
      });
      return;
    }

    const selectedSongsData = songs.filter(s => currentSongForm.selectedSongs.includes(s.id));
    const isMedley = currentSongForm.selectedSongs.length > 1 || currentSongForm.isMedley;
    
    const repertoireSong = {
      id: Date.now().toString(),
      songIds: currentSongForm.selectedSongs,
      songs: selectedSongsData,
      customKey: currentSongForm.customKey || undefined,
      isMedley,
      medleyTitle: isMedley ? selectedSongsData.map(s => s.title).join(' + ') : undefined,
      moment: currentSongForm.moment || undefined,
      isInstrumental: currentSongForm.isInstrumental
    };

    setEditRepertoire(prev => ({
      ...prev,
      repertoireSongs: [...prev.repertoireSongs, repertoireSong]
    }));

    setShowEditSongModal(false);
    setCurrentSongForm({
      selectedSongs: [],
      customKey: '',
      isMedley: false,
      moment: '',
      isInstrumental: false
    });

    addNotification({
      type: 'success',
      title: 'Música adicionada',
      message: 'Música adicionada ao repertório!'
    });
  };

  const removeSongFromEditRepertoire = (songId: string) => {
    setEditRepertoire(prev => ({
      ...prev,
      repertoireSongs: prev.repertoireSongs.filter(s => s.id !== songId)
    }));
  };

  const moveSongUpEdit = (index: number) => {
    if (index > 0) {
      setEditRepertoire(prev => {
        const newSongs = [...prev.repertoireSongs];
        [newSongs[index - 1], newSongs[index]] = [newSongs[index], newSongs[index - 1]];
        return { ...prev, repertoireSongs: newSongs };
      });
    }
  };

  const moveSongDownEdit = (index: number) => {
    setEditRepertoire(prev => {
      if (index < prev.repertoireSongs.length - 1) {
        const newSongs = [...prev.repertoireSongs];
        [newSongs[index], newSongs[index + 1]] = [newSongs[index + 1], newSongs[index]];
        return { ...prev, repertoireSongs: newSongs };
      }
      return prev;
    });
  };

  const startEditRepertoireSongInEdit = (index: number) => {
    const repSong = editRepertoire.repertoireSongs[index];
    setEditingRepertoireSongIndexInEdit(index);
    setCurrentSongForm({
      selectedSongs: repSong.songIds || [],
      customKey: repSong.customKey || '',
      isMedley: repSong.isMedley,
      moment: repSong.moment || '',
      isInstrumental: repSong.isInstrumental || false
    });
  };

  const saveEditRepertoireSongInEdit = () => {
    if (editingRepertoireSongIndexInEdit === null) return;

    if (currentSongForm.selectedSongs.length === 0 && !currentSongForm.isInstrumental) {
      addNotification({
        type: 'warning',
        title: 'Selecione uma música',
        message: 'Você precisa selecionar pelo menos uma música ou marcar como instrumental.'
      });
      return;
    }

    const selectedSongsData = songs.filter(s => currentSongForm.selectedSongs.includes(s.id));
    const isMedley = currentSongForm.selectedSongs.length > 1 || currentSongForm.isMedley;
    
    const updatedRepertoireSong = {
      id: editRepertoire.repertoireSongs[editingRepertoireSongIndexInEdit].id,
      songIds: currentSongForm.selectedSongs,
      songs: selectedSongsData,
      customKey: currentSongForm.customKey || undefined,
      isMedley,
      medleyTitle: isMedley ? selectedSongsData.map(s => s.title).join(' + ') : undefined,
      moment: currentSongForm.moment || undefined,
      isInstrumental: currentSongForm.isInstrumental
    };

    setEditRepertoire(prev => ({
      ...prev,
      repertoireSongs: prev.repertoireSongs.map((song, idx) => 
        idx === editingRepertoireSongIndexInEdit ? updatedRepertoireSong : song
      )
    }));

    setEditingRepertoireSongIndexInEdit(null);
    setCurrentSongForm({
      selectedSongs: [],
      customKey: '',
      isMedley: false,
      moment: '',
      isInstrumental: false
    });

    addNotification({
      type: 'success',
      title: 'Música atualizada',
      message: 'Música atualizada no repertório!'
    });
  };

  const cancelEditRepertoireSongInEdit = () => {
    setEditingRepertoireSongIndexInEdit(null);
    setCurrentSongForm({
      selectedSongs: [],
      customKey: '',
      isMedley: false,
      moment: '',
      isInstrumental: false
    });
  };

  const tabs = [
    { id: 'agenda', name: 'Agenda', icon: Calendar },
    { id: 'scales', name: 'Escalas', icon: Calendar },
    { id: 'repertoire', name: 'Repertório', icon: Music },
    { id: 'settings', name: 'Configurações', icon: Settings }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3 md:space-x-4">
            <Settings className="h-6 w-6 md:h-8 md:w-8 text-indigo-400" />
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-zinc-100">Painel Administrativo</h1>
              <p className="text-sm md:text-base text-zinc-400 hidden sm:block">Gerencie escalas, repertórios e eventos</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center space-x-2 px-4 py-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors self-start md:self-auto"
          >
            <LogOut className="h-5 w-5" />
            <span>Sair</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="glass p-3 md:p-6">
        <div className="flex flex-wrap md:flex-nowrap gap-2 md:space-x-1 md:gap-0 bg-gray-100 p-1 rounded-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 min-w-[100px] flex items-center justify-center space-x-1 md:space-x-2 px-2 md:px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-zinc-800 text-indigo-300 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Icon className="h-4 w-4 md:h-5 md:w-5" />
                <span className="text-sm md:text-base">{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="glass p-4 md:p-6">

        {/* Agenda Tab */}
        {activeTab === 'agenda' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-zinc-100">Gerenciar Agenda</h2>
            </div>

            {/* Formulário de Nova Agenda */}
            <div className="mb-6 bg-zinc-800 border border-zinc-700 rounded-lg p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold text-zinc-100 mb-4">Novo Evento</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4">
                <div className="space-y-4">
                <input
                  type="text"
                    placeholder="Título do evento"
                    value={newAgendaItem.title}
                    onChange={(e) => setNewAgendaItem({ ...newAgendaItem, title: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-600 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                  <textarea
                    placeholder="Descrição"
                    value={newAgendaItem.description}
                    onChange={(e) => setNewAgendaItem({ ...newAgendaItem, description: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-600 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    rows={3}
                  />
                  <input
                    type="text"
                    placeholder="Local"
                    value={newAgendaItem.location}
                    onChange={(e) => setNewAgendaItem({ ...newAgendaItem, location: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-600 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-4">
                  <input
                    type="date"
                    value={newAgendaItem.date}
                    onChange={(e) => setNewAgendaItem({ ...newAgendaItem, date: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-600 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="time"
                    value={newAgendaItem.time}
                    onChange={(e) => setNewAgendaItem({ ...newAgendaItem, time: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-600 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <select
                    value={newAgendaItem.type}
                    onChange={(e) => setNewAgendaItem({ ...newAgendaItem, type: e.target.value as AgendaItem['type'] })}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-600 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="rehearsal">Ensaio</option>
                    <option value="service">Culto</option>
                    <option value="event">Evento</option>
                    <option value="meeting">Reunião</option>
                </select>
                </div>
              </div>

              <button onClick={handleAddAgendaItem} className="btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                Adicionar Evento
                </button>
            </div>

            {/* Lista de Eventos */}
                    <div>
              <h3 className="text-base md:text-lg font-semibold text-zinc-100 mb-4">Eventos Cadastrados</h3>
              <div className="space-y-4">
                {agendaItems.length > 0 ? (
                  agendaItems.map((item) => (
                    <div key={item.id} className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                      {editingAgendaId === item.id ? (
                        // Modo de edição
                        <div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4">
                            <div className="space-y-3">
                              <input
                                type="text"
                                placeholder="Título do evento"
                                value={editAgendaItem.title}
                                onChange={(e) => setEditAgendaItem({ ...editAgendaItem, title: e.target.value })}
                                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-600 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
                              />
                              <textarea
                                placeholder="Descrição"
                                value={editAgendaItem.description}
                                onChange={(e) => setEditAgendaItem({ ...editAgendaItem, description: e.target.value })}
                                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-600 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                rows={3}
                              />
                              <input
                                type="text"
                                placeholder="Local"
                                value={editAgendaItem.location}
                                onChange={(e) => setEditAgendaItem({ ...editAgendaItem, location: e.target.value })}
                                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-600 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                            <div className="space-y-3">
                              <input
                                type="date"
                                value={editAgendaItem.date}
                                onChange={(e) => setEditAgendaItem({ ...editAgendaItem, date: e.target.value })}
                                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-600 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
                              />
                              <input
                                type="time"
                                value={editAgendaItem.time}
                                onChange={(e) => setEditAgendaItem({ ...editAgendaItem, time: e.target.value })}
                                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-600 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
                              />
                              <select
                                value={editAgendaItem.type}
                                onChange={(e) => setEditAgendaItem({ ...editAgendaItem, type: e.target.value as AgendaItem['type'] })}
                                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-600 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
                              >
                                <option value="rehearsal">Ensaio</option>
                                <option value="service">Culto</option>
                                <option value="event">Evento</option>
                                <option value="meeting">Reunião</option>
                              </select>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <button onClick={saveEditAgenda} className="btn-primary flex-1 sm:flex-initial">
                              <Save className="h-4 w-4 mr-2" />
                              Salvar
                            </button>
                            <button onClick={cancelEditAgenda} className="px-4 py-2 bg-zinc-700 text-zinc-300 rounded-lg hover:bg-zinc-600 transition-colors flex-1 sm:flex-initial">
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        // Modo de visualização
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-zinc-100 text-base md:text-lg">{item.title}</h3>
                            <p className="text-zinc-400 text-sm mb-2">{item.description}</p>
                            <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-zinc-400">
                              <span>📅 {new Date(item.date).toLocaleDateString('pt-BR')}</span>
                              {item.time && <span>🕐 {item.time}</span>}
                              {item.location && <span>📍 {item.location}</span>}
                              <span className={`px-2 py-1 rounded-full text-xs border ${
                                item.type === 'rehearsal' ? 'bg-blue-900/40 text-blue-300 border-blue-800' :
                                item.type === 'service' ? 'bg-green-900/40 text-green-300 border-green-800' :
                                item.type === 'event' ? 'bg-purple-900/40 text-purple-300 border-purple-800' :
                                'bg-orange-900/40 text-orange-300 border-orange-800'
                              }`}>
                                {item.type === 'rehearsal' ? 'Ensaio' :
                                 item.type === 'service' ? 'Culto' :
                                 item.type === 'event' ? 'Evento' : 'Reunião'}
                      </span>
                    </div>
                          </div>
                          <div className="flex items-center space-x-2">
                    <button
                              onClick={() => startEditAgenda(item)}
                              className="p-2 text-blue-400 hover:bg-blue-900/20 rounded-lg transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteAgenda(item.id)}
                              className="p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-zinc-400">
                    <Calendar className="h-16 w-16 mx-auto mb-4 text-zinc-600" />
                    <p>Nenhum evento cadastrado ainda.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Scales Tab */}
        {activeTab === 'scales' && (
          <div>
            <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-zinc-100">Gerenciar Escalas</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
              <div className="space-y-4">
                <input
                  type="month"
                  value={`${newScale.year}-${String(newScale.month + 1).padStart(2, '0')}`}
                  onChange={(e) => {
                    const [year, month] = e.target.value.split('-');
                    setNewScale(prev => ({
                      ...prev,
                      year: parseInt(year),
                      month: parseInt(month) - 1
                    }));
                  }}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="date"
                  value={newScale.date}
                  onChange={(e) => setNewScale(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                      <select 
                        value={showCustomServiceName ? 'Outro' : newScale.serviceName}
                        onChange={(e) => {
                          if (e.target.value === 'Outro') {
                            setShowCustomServiceName(true);
                            setCustomServiceName('');
                            setNewScale(prev => ({ ...prev, serviceName: '' }));
                          } else {
                            setShowCustomServiceName(false);
                            setNewScale(prev => ({ ...prev, serviceName: e.target.value }));
                          }
                        }}
                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">Selecione o tipo de culto</option>
                        <option value="Culto Manhã">Culto Manhã</option>
                        <option value="Culto Noite">Culto Noite</option>
                        <option value="Culto de Terça">Culto de Terça</option>
                        <option value="Outro">Outro (especificar)</option>
                      </select>
                      {showCustomServiceName && (
                <input
                  type="text"
                          placeholder="Especifique o tipo de culto"
                          value={customServiceName}
                          onChange={(e) => {
                            setCustomServiceName(e.target.value);
                            setNewScale(prev => ({ ...prev, serviceName: e.target.value }));
                          }}
                          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500 mt-2"
                          autoFocus
                        />
                      )}
                <select 
                  value={newScale.weekNumber}
                  onChange={(e) => setNewScale(prev => ({ ...prev, weekNumber: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="1">Semana 1</option>
                  <option value="2">Semana 2</option>
                  <option value="3">Semana 3</option>
                  <option value="4">Semana 4</option>
                </select>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Colaboradores ({newScale.selectedMusicians.length} selecionados)
                  </label>
                  <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                    {musicians && musicians.length > 0 ? (
                      <>
                        {/* Músicos */}
                        <div>
                          <h4 className="text-sm font-semibold text-indigo-300 mb-2">Músicos</h4>
                          <div className="space-y-2">
                            {musicians.filter(m => m.instrument !== 'Vocal' && m.instrument !== 'Técnico de Som').map((musician) => (
                              <label key={musician.id} className="flex items-center">
                <input
                                  type="checkbox" 
                                  checked={newScale.selectedMusicians.includes(musician.id)}
                                  onChange={() => handleMusicianToggle(musician.id)}
                                  className="mr-2" 
                                />
                                <span className="text-zinc-300">{musician.name} - {musician.instrument}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Cantores */}
                        <div>
                          <h4 className="text-sm font-semibold text-pink-300 mb-2">Cantores</h4>
                          <div className="space-y-2">
                            {musicians.filter(m => m.instrument === 'Vocal').map((musician) => (
                              <label key={musician.id} className="flex items-center">
                <input
                                  type="checkbox" 
                                  checked={newScale.selectedMusicians.includes(musician.id)}
                                  onChange={() => handleMusicianToggle(musician.id)}
                                  className="mr-2" 
                                />
                                <span className="text-zinc-300">{musician.name} - {musician.instrument}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Técnicos de Som */}
                        <div>
                          <h4 className="text-sm font-semibold text-yellow-300 mb-2">Técnicos de Som</h4>
                          <div className="space-y-2">
                            {musicians.filter(m => m.instrument === 'Técnico de Som').map((musician) => (
                              <label key={musician.id} className="flex items-center">
                <input
                                  type="checkbox" 
                                  checked={newScale.selectedMusicians.includes(musician.id)}
                                  onChange={() => handleMusicianToggle(musician.id)}
                                  className="mr-2" 
                                />
                                <span className="text-zinc-300">{musician.name} - {musician.instrument}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="text-zinc-400">Nenhum colaborador cadastrado</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={saveScale}
              className="btn-primary mb-6"
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar Escala
            </button>

            {/* Formulário de Edição */}
            {editingWeek && (
              <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-zinc-100 mb-4">Editar Escala</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <input
                      type="month"
                      value={`${editScale.year}-${String(editScale.month + 1).padStart(2, '0')}`}
                      onChange={(e) => {
                        const [year, month] = e.target.value.split('-');
                        setEditScale(prev => ({
                          ...prev,
                          year: parseInt(year),
                          month: parseInt(month) - 1
                        }));
                      }}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                      type="date"
                      value={editScale.date}
                      onChange={(e) => setEditScale(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                    <select 
                      value={showEditCustomServiceName ? 'Outro' : editScale.serviceName}
                      onChange={(e) => {
                        if (e.target.value === 'Outro') {
                          setShowEditCustomServiceName(true);
                          setEditCustomServiceName('');
                          setEditScale(prev => ({ ...prev, serviceName: '' }));
                        } else {
                          setShowEditCustomServiceName(false);
                          setEditScale(prev => ({ ...prev, serviceName: e.target.value }));
                        }
                      }}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Selecione o tipo de culto</option>
                      <option value="Culto Manhã">Culto Manhã</option>
                      <option value="Culto Noite">Culto Noite</option>
                      <option value="Culto de Terça">Culto de Terça</option>
                      <option value="Outro">Outro (especificar)</option>
                    </select>
                    {showEditCustomServiceName && (
                      <input
                        type="text"
                        placeholder="Especifique o tipo de culto"
                        value={editCustomServiceName}
                        onChange={(e) => {
                          setEditCustomServiceName(e.target.value);
                          setEditScale(prev => ({ ...prev, serviceName: e.target.value }));
                        }}
                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500 mt-2"
                        autoFocus
                      />
                    )}
                    <select 
                      value={editScale.weekNumber}
                      onChange={(e) => setEditScale(prev => ({ ...prev, weekNumber: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="1">Semana 1</option>
                      <option value="2">Semana 2</option>
                      <option value="3">Semana 3</option>
                      <option value="4">Semana 4</option>
                    </select>
                    </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Colaboradores ({editScale.selectedMusicians.length} selecionados)
                      </label>
                      <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                        {musicians && musicians.length > 0 ? (
                          <>
                            {/* Músicos */}
                            <div>
                              <h4 className="text-sm font-semibold text-indigo-300 mb-2">Músicos</h4>
                              <div className="space-y-2">
                                {musicians.filter(m => m.instrument !== 'Vocal' && m.instrument !== 'Técnico de Som').map((musician) => (
                                  <label key={musician.id} className="flex items-center">
                                    <input 
                                      type="checkbox" 
                                      checked={editScale.selectedMusicians.includes(musician.id)}
                                      onChange={() => {
                                        setEditScale(prev => ({
                                          ...prev,
                                          selectedMusicians: prev.selectedMusicians.includes(musician.id)
                                            ? prev.selectedMusicians.filter(id => id !== musician.id)
                                            : [...prev.selectedMusicians, musician.id]
                                        }));
                                      }}
                                      className="mr-2" 
                                    />
                                    <span className="text-zinc-300">{musician.name} - {musician.instrument}</span>
                                  </label>
                                ))}
                              </div>
                            </div>

                            {/* Cantores */}
                            <div>
                              <h4 className="text-sm font-semibold text-pink-300 mb-2">Cantores</h4>
                              <div className="space-y-2">
                                {musicians.filter(m => m.instrument === 'Vocal').map((musician) => (
                                  <label key={musician.id} className="flex items-center">
                                    <input 
                                      type="checkbox" 
                                      checked={editScale.selectedMusicians.includes(musician.id)}
                                      onChange={() => {
                                        setEditScale(prev => ({
                                          ...prev,
                                          selectedMusicians: prev.selectedMusicians.includes(musician.id)
                                            ? prev.selectedMusicians.filter(id => id !== musician.id)
                                            : [...prev.selectedMusicians, musician.id]
                                        }));
                                      }}
                                      className="mr-2" 
                                    />
                                    <span className="text-zinc-300">{musician.name} - {musician.instrument}</span>
                                  </label>
                                ))}
                              </div>
                            </div>

                            {/* Técnicos de Som */}
                            <div>
                              <h4 className="text-sm font-semibold text-yellow-300 mb-2">Técnicos de Som</h4>
                              <div className="space-y-2">
                                {musicians.filter(m => m.instrument === 'Técnico de Som').map((musician) => (
                                  <label key={musician.id} className="flex items-center">
                                    <input 
                                      type="checkbox" 
                                      checked={editScale.selectedMusicians.includes(musician.id)}
                                      onChange={() => {
                                        setEditScale(prev => ({
                                          ...prev,
                                          selectedMusicians: prev.selectedMusicians.includes(musician.id)
                                            ? prev.selectedMusicians.filter(id => id !== musician.id)
                                            : [...prev.selectedMusicians, musician.id]
                                        }));
                                      }}
                                      className="mr-2" 
                                    />
                                    <span className="text-zinc-300">{musician.name} - {musician.instrument}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          </>
                        ) : (
                          <p className="text-zinc-400">Nenhum colaborador cadastrado</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-4">
                    <button
                    onClick={saveEditWeek}
                    className="btn-primary"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Alterações
                  </button>
                  <button 
                    onClick={cancelEditWeek}
                    className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-100 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Escalas Existentes */}
            {schedules.length > 0 && (
              <div className="mt-8">
                <h3 className="text-base md:text-xl font-bold text-zinc-100 mb-4">Escalas Cadastradas</h3>
                <div className="space-y-4">
                  {schedules.map((schedule) => (
                    <div key={schedule.id} className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-zinc-100 mb-3">
                        {new Date(schedule.year, schedule.month).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {schedule.weeks.map((week) => (
                          <div key={week.id} className="bg-zinc-700 border border-zinc-600 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="text-sm font-semibold text-zinc-100">
                                {week.weekNumber}ª Semana
                              </h5>
                              <div className="flex space-x-1">
                                <button
                                  onClick={() => moveWeekUp(week.id)}
                                  className="text-green-400 hover:text-green-300 transition-colors"
                                  title="Mover para cima"
                                >
                                  <ChevronUp className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => moveWeekDown(week.id)}
                                  className="text-green-400 hover:text-green-300 transition-colors"
                                  title="Mover para baixo"
                                >
                                  <ChevronDown className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => startEditWeek(week.id)}
                                  className="text-indigo-400 hover:text-indigo-300 transition-colors"
                                  title="Editar escala"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    console.log('🔴 CLICK NO BOTÃO DELETE!');
                                    console.log('Week ID:', week.id);
                                    console.log('Week:', week);
                                    deleteWeek(week.id);
                                  }}
                                  className="text-red-400 hover:text-red-300 transition-colors"
                                  title="Excluir escala"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                  </div>
                            </div>
                            {week.serviceName && (
                              <div className={`text-xs font-semibold mb-2 px-2 py-1 rounded-full ${
                                week.serviceName === 'Culto Manhã' 
                                  ? 'bg-orange-900/40 text-orange-300 border border-orange-800' 
                                  : week.serviceName === 'Culto Noite'
                                  ? 'bg-blue-900/40 text-blue-300 border border-blue-800'
                                  : week.serviceName === 'Culto de Terça'
                                  ? 'bg-purple-900/40 text-purple-300 border border-purple-800'
                                  : 'bg-gray-900/40 text-gray-300 border border-gray-800'
                              }`}>
                                {week.serviceName}
                              </div>
                            )}
                            <div className="space-y-1">
                              {week.musicians.map((musician) => (
                                <div key={musician.id} className="text-xs text-zinc-400">
                                  {musician.instrument}: {musician.name}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                  </div>
                </div>
              ))}
            </div>
              </div>
            )}
          </div>
        )}

        {/* Repertoire Tab */}
        {activeTab === 'repertoire' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-zinc-100">Gerenciar Repertório</h2>
            </div>

            {/* Formulário de Novo Repertório */}
            <div className="mb-6 bg-zinc-800 border border-zinc-700 rounded-lg p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold text-zinc-100 mb-4">Novo Repertório</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Nome do Repertório *</label>
                    <input
                      type="text"
                      placeholder="Ex: Culto de Celebração, Louvor da Manhã..."
                      value={newRepertoire.title}
                      onChange={(e) => setNewRepertoire({ ...newRepertoire, title: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-600 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Data do Culto *</label>
                    <input
                      type="date"
                      value={newRepertoire.weekDate}
                      onChange={(e) => setNewRepertoire({ ...newRepertoire, weekDate: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-600 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Link da Playlist (YouTube)</label>
                    <input
                      type="url"
                      placeholder="https://youtube.com/playlist?list=..."
                      value={newRepertoire.playlistUrl}
                      onChange={(e) => setNewRepertoire({ ...newRepertoire, playlistUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-600 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Músicas do Repertório * ({newRepertoire.repertoireSongs.length})
                    </label>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2 bg-zinc-900 border border-zinc-600 rounded-lg p-3">
                      {newRepertoire.repertoireSongs.length > 0 ? (
                        newRepertoire.repertoireSongs.map((repSong, index) => (
                          <div key={repSong.id} className="flex items-start justify-between bg-zinc-800 p-3 rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="px-2 py-0.5 bg-indigo-900/40 text-indigo-300 border border-indigo-800 rounded text-xs font-semibold">
                                  #{index + 1}
                                </span>
                                {repSong.moment && (
                                  <span className="px-2 py-0.5 bg-green-900/40 text-green-300 border border-green-800 rounded text-xs">
                                    {repSong.moment}
                                  </span>
                                )}
                                {repSong.isMedley && (
                                  <span className="px-2 py-0.5 bg-purple-900/40 text-purple-300 border border-purple-800 rounded text-xs">
                                    Medley
                                  </span>
                                )}
                                {repSong.isInstrumental && (
                                  <span className="px-2 py-0.5 bg-amber-900/40 text-amber-300 border border-amber-800 rounded text-xs">
                                    Instrumental
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-zinc-100 font-medium">
                                {repSong.isInstrumental && !repSong.songs[0] ? 'Instrumental' : 
                                 repSong.isMedley ? repSong.medleyTitle : repSong.songs[0]?.title}
                              </div>
                              {!repSong.isMedley && !repSong.isInstrumental && repSong.songs[0] && (
                                <div className="text-xs text-zinc-400">{repSong.songs[0]?.artist}</div>
                              )}
                              {repSong.customKey && (
                                <div className="text-xs text-indigo-300 mt-1">Tom: {repSong.customKey}</div>
                              )}
                            </div>
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => moveSongUp(index)}
                                disabled={index === 0}
                                className={`p-1 rounded transition-colors ${
                                  index === 0 
                                    ? 'text-zinc-600 cursor-not-allowed' 
                                    : 'text-green-400 hover:bg-green-900/20'
                                }`}
                                title="Mover para cima"
                              >
                                <ChevronUp className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => moveSongDown(index)}
                                disabled={index === newRepertoire.repertoireSongs.length - 1}
                                className={`p-1 rounded transition-colors ${
                                  index === newRepertoire.repertoireSongs.length - 1
                                    ? 'text-zinc-600 cursor-not-allowed' 
                                    : 'text-green-400 hover:bg-green-900/20'
                                }`}
                                title="Mover para baixo"
                              >
                                <ChevronDown className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => startEditRepertoireSong(index)}
                                className="p-1 text-blue-400 hover:bg-blue-900/20 rounded transition-colors"
                                title="Editar"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => removeSongFromRepertoire(repSong.id)}
                                className="p-1 text-red-400 hover:bg-red-900/20 rounded transition-colors"
                                title="Remover"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-zinc-500 text-sm text-center py-4">Nenhuma música adicionada ainda</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddSongModal(true)}
                      className="mt-2 w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Adicionar Música / Medley</span>
                    </button>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => {
                  console.log('🖱️ Botão "Adicionar Repertório" clicado!');
                  handleAddRepertoire();
                }} 
                className="btn-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Repertório
              </button>
            </div>

            {/* Lista de Repertórios */}
            <div>
              <h3 className="text-base md:text-lg font-semibold text-zinc-100 mb-4">Repertórios Cadastrados</h3>
              <div className="space-y-4">
                {repertoires.length > 0 ? (
                  repertoires.map((repertoire) => (
                    <div key={repertoire.id} className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                      {editingRepertoireId === repertoire.id ? (
                        // Modo de edição
                        <div>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-3">
                              <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-2">Nome do Repertório</label>
                <input
                  type="text"
                                  placeholder="Ex: Culto de Celebração, Louvor da Manhã..."
                                  value={editRepertoire.title}
                                  onChange={(e) => setEditRepertoire({ ...editRepertoire, title: e.target.value })}
                                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-600 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-2">Data do Culto</label>
                                <input
                                  type="date"
                                  value={editRepertoire.weekDate}
                                  onChange={(e) => setEditRepertoire({ ...editRepertoire, weekDate: e.target.value })}
                                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-600 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-2">Link da Playlist</label>
                                <input
                                  type="url"
                                  placeholder="https://youtube.com/playlist?list=..."
                                  value={editRepertoire.playlistUrl}
                                  onChange={(e) => setEditRepertoire({ ...editRepertoire, playlistUrl: e.target.value })}
                                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-600 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                />
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-2">
                                  Músicas do Repertório ({editRepertoire.repertoireSongs.length})
                                </label>
                                <div className="space-y-2 max-h-60 overflow-y-auto pr-2 bg-zinc-900 border border-zinc-600 rounded-lg p-3">
                                  {editRepertoire.repertoireSongs.length > 0 ? (
                                    editRepertoire.repertoireSongs.map((repSong, index) => (
                                      <div key={repSong.id} className="flex items-start justify-between bg-zinc-800 p-3 rounded-lg">
                                        <div className="flex-1">
                                          <div className="flex items-center space-x-2 mb-1">
                                            <span className="px-2 py-0.5 bg-indigo-900/40 text-indigo-300 border border-indigo-800 rounded text-xs font-semibold">
                                              #{index + 1}
                                            </span>
                                            {repSong.moment && (
                                              <span className="px-2 py-0.5 bg-green-900/40 text-green-300 border border-green-800 rounded text-xs">
                                                {repSong.moment}
                                              </span>
                                            )}
                                            {repSong.isMedley && (
                                              <span className="px-2 py-0.5 bg-purple-900/40 text-purple-300 border border-purple-800 rounded text-xs">
                                                Medley
                                              </span>
                                            )}
                                            {repSong.isInstrumental && (
                                              <span className="px-2 py-0.5 bg-amber-900/40 text-amber-300 border border-amber-800 rounded text-xs">
                                                Instrumental
                                              </span>
                                            )}
                                          </div>
                                          <div className="text-sm text-zinc-100 font-medium">
                                            {repSong.isInstrumental && !repSong.songs[0] ? 'Instrumental' :
                                             repSong.isMedley ? repSong.medleyTitle : repSong.songs[0]?.title}
                                          </div>
                                          {!repSong.isMedley && !repSong.isInstrumental && repSong.songs[0] && (
                                            <div className="text-xs text-zinc-400">{repSong.songs[0]?.artist}</div>
                                          )}
                                          {repSong.customKey && (
                                            <div className="text-xs text-indigo-300 mt-1">Tom: {repSong.customKey}</div>
                                          )}
                                        </div>
                                        <div className="flex items-center space-x-1">
                                          <button
                                            onClick={() => moveSongUpEdit(index)}
                                            disabled={index === 0}
                                            className={`p-1 rounded transition-colors ${
                                              index === 0 
                                                ? 'text-zinc-600 cursor-not-allowed' 
                                                : 'text-green-400 hover:bg-green-900/20'
                                            }`}
                                            title="Mover para cima"
                                          >
                                            <ChevronUp className="h-4 w-4" />
                                          </button>
                                          <button
                                            onClick={() => moveSongDownEdit(index)}
                                            disabled={index === editRepertoire.repertoireSongs.length - 1}
                                            className={`p-1 rounded transition-colors ${
                                              index === editRepertoire.repertoireSongs.length - 1
                                                ? 'text-zinc-600 cursor-not-allowed' 
                                                : 'text-green-400 hover:bg-green-900/20'
                                            }`}
                                            title="Mover para baixo"
                                          >
                                            <ChevronDown className="h-4 w-4" />
                                          </button>
                                          <button
                                            onClick={() => startEditRepertoireSongInEdit(index)}
                                            className="p-1 text-blue-400 hover:bg-blue-900/20 rounded transition-colors"
                                            title="Editar"
                                          >
                                            <Edit className="h-4 w-4" />
                                          </button>
                                          <button
                                            onClick={() => removeSongFromEditRepertoire(repSong.id)}
                                            className="p-1 text-red-400 hover:bg-red-900/20 rounded transition-colors"
                                            title="Remover"
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </button>
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-zinc-500 text-sm text-center py-4">Nenhuma música adicionada ainda</p>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setShowEditSongModal(true)}
                                  className="mt-2 w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
                                >
                                  <Plus className="h-4 w-4" />
                                  <span>Adicionar Música / Medley</span>
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button onClick={saveEditRepertoire} className="btn-primary">
                              <Save className="h-4 w-4 mr-2" />
                              Salvar
                            </button>
                            <button onClick={cancelEditRepertoire} className="px-4 py-2 bg-zinc-700 text-zinc-300 rounded-lg hover:bg-zinc-600 transition-colors">
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        // Modo de visualização
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h3 className="text-xl font-bold text-zinc-100 mb-2">
                                {repertoire.title}
                              </h3>
                              <p className="text-sm text-zinc-400">
                                📅 {(() => {
                                  const date = new Date(repertoire.weekDate + 'T12:00:00');
                                  return date.toLocaleDateString('pt-BR', { 
                                    weekday: 'long', 
                                    day: '2-digit', 
                                    month: 'long', 
                                    year: 'numeric',
                                    timeZone: 'America/Sao_Paulo'
                                  });
                                })()}
                              </p>
                              {repertoire.playlistUrl && (
                                <a 
                                  href={repertoire.playlistUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center mt-1"
                                >
                                  🎵 Ver Playlist no YouTube
                                </a>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => startEditRepertoire(repertoire)}
                                className="p-2 text-blue-400 hover:bg-blue-900/20 rounded-lg transition-colors"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteRepertoire(repertoire.id)}
                                className="p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <div className="mb-3">
                            <h4 className="text-sm font-medium text-zinc-400 mb-2">Músicas ({repertoire.songs.length})</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                              {repertoire.songs.map((repSong, index) => (
                                <div key={repSong.id} className="bg-zinc-700 rounded px-3 py-2 text-sm text-zinc-300">
                                  <div className="flex items-center flex-wrap gap-1 mb-1">
                                    <span className="font-semibold text-indigo-400">{index + 1}.</span>
                                    {repSong.moment && (
                                      <span className="px-1.5 py-0.5 bg-green-900/40 text-green-300 border border-green-800 rounded text-xs">
                                        {repSong.moment}
                                      </span>
                                    )}
                                    {repSong.isMedley && (
                                      <span className="px-1.5 py-0.5 bg-purple-900/40 text-purple-300 border border-purple-800 rounded text-xs">
                                        Medley
                                      </span>
                                    )}
                                    {repSong.isInstrumental && (
                                      <span className="px-1.5 py-0.5 bg-amber-900/40 text-amber-300 border border-amber-800 rounded text-xs">
                                        Instrumental
                                      </span>
                                    )}
                                  </div>
                                  <div className="font-medium">
                                    {repSong.isInstrumental && !repSong.songs[0] ? 'Instrumental' :
                                     repSong.isMedley ? repSong.medleyTitle : repSong.songs[0]?.title}
                                  </div>
                                  {!repSong.isMedley && !repSong.isInstrumental && repSong.songs[0] && (
                                    <div className="text-xs text-zinc-400">{repSong.songs[0].artist}</div>
                                  )}
                                  {repSong.customKey && (
                                    <div className="text-xs text-indigo-300 mt-1">Tom: {repSong.customKey}</div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-zinc-400">
                    <Music className="h-16 w-16 mx-auto mb-4 text-zinc-600" />
                    <p>Nenhum repertório cadastrado ainda.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal para Adicionar Música ao Repertório */}
        {showAddSongModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 md:p-4">
            <div className="bg-zinc-800 rounded-lg p-4 md:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-zinc-700">
              <h3 className="text-lg md:text-xl font-semibold text-zinc-100 mb-4">Adicionar Música / Medley</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Selecione a(s) música(s) ({currentSongForm.selectedSongs.length} selecionada{currentSongForm.selectedSongs.length !== 1 ? 's' : ''})
                  </label>
                  <div className="max-h-60 overflow-y-auto bg-zinc-900 border border-zinc-600 rounded-lg p-3 space-y-2">
                    {songs.map((song) => (
                      <label key={song.id} className="flex items-center cursor-pointer hover:bg-zinc-800 p-2 rounded">
                        <input 
                          type="checkbox" 
                          checked={currentSongForm.selectedSongs.includes(song.id)}
                          onChange={() => handleSongToggleInModal(song.id)}
                          className="mr-3" 
                        />
                        <div className="flex-1">
                          <div className="text-zinc-100 text-sm font-medium">{song.title}</div>
                          <div className="text-zinc-400 text-xs">{song.artist}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                  {currentSongForm.selectedSongs.length > 1 && (
                    <div className="mt-2 p-3 bg-purple-900/20 border border-purple-800 rounded-lg">
                      <div className="flex items-center text-purple-300 text-sm">
                        <Music className="h-4 w-4 mr-2" />
                        <span>Medley: {songs.filter(s => currentSongForm.selectedSongs.includes(s.id)).map(s => s.title).join(' + ')}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Tom a ser cantado (opcional)
                    </label>
                <input
                  type="text"
                      placeholder="Ex: C, D, Em, F#, etc."
                      value={currentSongForm.customKey}
                      onChange={(e) => setCurrentSongForm({ ...currentSongForm, customKey: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-600 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Momento do culto (opcional)
                    </label>
                    <select
                      value={currentSongForm.moment}
                      onChange={(e) => setCurrentSongForm({ ...currentSongForm, moment: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-600 text-zinc-100 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Selecione...</option>
                      <option value="Ofertório">Ofertório</option>
                      <option value="Apelo">Apelo</option>
                      <option value="Abertura">Abertura</option>
                      <option value="Ministração">Ministração</option>
                      <option value="Final">Final</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                <input
                      type="checkbox"
                      checked={currentSongForm.isInstrumental}
                      onChange={(e) => setCurrentSongForm({ ...currentSongForm, isInstrumental: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-zinc-300">
                      Apenas instrumental (sem música específica do acervo)
                    </span>
                  </label>
                  <p className="text-xs text-zinc-500 mt-1 ml-6">
                    Marque esta opção para momentos instrumentais como ofertório
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={addSongToRepertoire}
                  className="flex-1 btn-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar ao Repertório
                </button>
                <button
                  onClick={() => {
                    setShowAddSongModal(false);
                    setCurrentSongForm({ selectedSongs: [], customKey: '', isMedley: false, moment: '', isInstrumental: false });
                  }}
                  className="flex-1 px-4 py-2 bg-zinc-700 text-zinc-300 rounded-lg hover:bg-zinc-600 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal para Adicionar Música ao Repertório (Edição) */}
        {showEditSongModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 md:p-4">
            <div className="bg-zinc-800 rounded-lg p-4 md:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-zinc-700">
              <h3 className="text-lg md:text-xl font-semibold text-zinc-100 mb-4">Adicionar Música / Medley</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Selecione a(s) música(s) ({currentSongForm.selectedSongs.length} selecionada{currentSongForm.selectedSongs.length !== 1 ? 's' : ''})
                  </label>
                  <div className="max-h-60 overflow-y-auto bg-zinc-900 border border-zinc-600 rounded-lg p-3 space-y-2">
                    {songs.map((song) => (
                      <label key={song.id} className="flex items-center cursor-pointer hover:bg-zinc-800 p-2 rounded">
                <input
                          type="checkbox" 
                          checked={currentSongForm.selectedSongs.includes(song.id)}
                          onChange={() => handleSongToggleInModal(song.id)}
                          className="mr-3" 
                        />
                        <div className="flex-1">
                          <div className="text-zinc-100 text-sm font-medium">{song.title}</div>
                          <div className="text-zinc-400 text-xs">{song.artist}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                  {currentSongForm.selectedSongs.length > 1 && (
                    <div className="mt-2 p-3 bg-purple-900/20 border border-purple-800 rounded-lg">
                      <div className="flex items-center text-purple-300 text-sm">
                        <Music className="h-4 w-4 mr-2" />
                        <span>Medley: {songs.filter(s => currentSongForm.selectedSongs.includes(s.id)).map(s => s.title).join(' + ')}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Tom a ser cantado (opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: C, D, Em, F#, etc."
                      value={currentSongForm.customKey}
                      onChange={(e) => setCurrentSongForm({ ...currentSongForm, customKey: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-600 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Momento do culto (opcional)
                    </label>
                <select
                      value={currentSongForm.moment}
                      onChange={(e) => setCurrentSongForm({ ...currentSongForm, moment: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-600 text-zinc-100 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Selecione...</option>
                      <option value="Ofertório">Ofertório</option>
                      <option value="Apelo">Apelo</option>
                      <option value="Abertura">Abertura</option>
                      <option value="Ministração">Ministração</option>
                      <option value="Final">Final</option>
                </select>
              </div>
            </div>

                <div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentSongForm.isInstrumental}
                      onChange={(e) => setCurrentSongForm({ ...currentSongForm, isInstrumental: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-zinc-300">
                      Apenas instrumental (sem música específica do acervo)
                    </span>
                  </label>
                  <p className="text-xs text-zinc-500 mt-1 ml-6">
                    Marque esta opção para momentos instrumentais como ofertório
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={addSongToEditRepertoire}
                  className="flex-1 btn-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar ao Repertório
            </button>
                <button
                  onClick={() => {
                    setShowEditSongModal(false);
                    setCurrentSongForm({ selectedSongs: [], customKey: '', isMedley: false, moment: '', isInstrumental: false });
                  }}
                  className="flex-1 px-4 py-2 bg-zinc-700 text-zinc-300 rounded-lg hover:bg-zinc-600 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal para Editar Música do Repertório (Novo Repertório) */}
        {editingRepertoireSongIndex !== null && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 md:p-4">
            <div className="bg-zinc-800 rounded-lg p-4 md:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-zinc-700">
              <h3 className="text-lg md:text-xl font-semibold text-zinc-100 mb-4">Editar Música / Medley</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Selecione a(s) música(s) ({currentSongForm.selectedSongs.length} selecionada{currentSongForm.selectedSongs.length !== 1 ? 's' : ''})
                  </label>
                  <div className="max-h-60 overflow-y-auto bg-zinc-900 border border-zinc-600 rounded-lg p-3 space-y-2">
                    {songs.map((song) => (
                      <label key={song.id} className="flex items-center cursor-pointer hover:bg-zinc-800 p-2 rounded">
                        <input 
                          type="checkbox" 
                          checked={currentSongForm.selectedSongs.includes(song.id)}
                          onChange={() => handleSongToggleInModal(song.id)}
                          className="mr-3" 
                        />
                    <div className="flex-1">
                          <div className="text-zinc-100 text-sm font-medium">{song.title}</div>
                          <div className="text-zinc-400 text-xs">{song.artist}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                  {currentSongForm.selectedSongs.length > 1 && (
                    <div className="mt-2 p-3 bg-purple-900/20 border border-purple-800 rounded-lg">
                      <div className="flex items-center text-purple-300 text-sm">
                        <Music className="h-4 w-4 mr-2" />
                        <span>Medley: {songs.filter(s => currentSongForm.selectedSongs.includes(s.id)).map(s => s.title).join(' + ')}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Tom a ser cantado (opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: C, D, Em, F#, etc."
                      value={currentSongForm.customKey}
                      onChange={(e) => setCurrentSongForm({ ...currentSongForm, customKey: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-600 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Momento do culto (opcional)
                    </label>
                    <select
                      value={currentSongForm.moment}
                      onChange={(e) => setCurrentSongForm({ ...currentSongForm, moment: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-600 text-zinc-100 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Selecione...</option>
                      <option value="Ofertório">Ofertório</option>
                      <option value="Apelo">Apelo</option>
                      <option value="Abertura">Abertura</option>
                      <option value="Ministração">Ministração</option>
                      <option value="Final">Final</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentSongForm.isInstrumental}
                      onChange={(e) => setCurrentSongForm({ ...currentSongForm, isInstrumental: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-zinc-300">
                      Apenas instrumental (sem música específica do acervo)
                        </span>
                  </label>
                      </div>
                    </div>

              <div className="flex items-center space-x-3">
                    <button
                  onClick={saveEditRepertoireSong}
                  className="flex-1 btn-primary"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </button>
                <button
                  onClick={cancelEditRepertoireSong}
                  className="flex-1 px-4 py-2 bg-zinc-700 text-zinc-300 rounded-lg hover:bg-zinc-600 transition-colors"
                >
                  Cancelar
                    </button>
                  </div>
                </div>
          </div>
        )}

        {/* Modal para Editar Música do Repertório (Editando Repertório) */}
        {editingRepertoireSongIndexInEdit !== null && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 md:p-4">
            <div className="bg-zinc-800 rounded-lg p-4 md:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-zinc-700">
              <h3 className="text-lg md:text-xl font-semibold text-zinc-100 mb-4">Editar Música / Medley</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Selecione a(s) música(s) ({currentSongForm.selectedSongs.length} selecionada{currentSongForm.selectedSongs.length !== 1 ? 's' : ''})
                  </label>
                  <div className="max-h-60 overflow-y-auto bg-zinc-900 border border-zinc-600 rounded-lg p-3 space-y-2">
                    {songs.map((song) => (
                      <label key={song.id} className="flex items-center cursor-pointer hover:bg-zinc-800 p-2 rounded">
                        <input 
                          type="checkbox" 
                          checked={currentSongForm.selectedSongs.includes(song.id)}
                          onChange={() => handleSongToggleInModal(song.id)}
                          className="mr-3" 
                        />
                        <div className="flex-1">
                          <div className="text-zinc-100 text-sm font-medium">{song.title}</div>
                          <div className="text-zinc-400 text-xs">{song.artist}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                  {currentSongForm.selectedSongs.length > 1 && (
                    <div className="mt-2 p-3 bg-purple-900/20 border border-purple-800 rounded-lg">
                      <div className="flex items-center text-purple-300 text-sm">
                        <Music className="h-4 w-4 mr-2" />
                        <span>Medley: {songs.filter(s => currentSongForm.selectedSongs.includes(s.id)).map(s => s.title).join(' + ')}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Tom a ser cantado (opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: C, D, Em, F#, etc."
                      value={currentSongForm.customKey}
                      onChange={(e) => setCurrentSongForm({ ...currentSongForm, customKey: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-600 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Momento do culto (opcional)
                    </label>
                    <select
                      value={currentSongForm.moment}
                      onChange={(e) => setCurrentSongForm({ ...currentSongForm, moment: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-600 text-zinc-100 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Selecione...</option>
                      <option value="Ofertório">Ofertório</option>
                      <option value="Apelo">Apelo</option>
                      <option value="Abertura">Abertura</option>
                      <option value="Ministração">Ministração</option>
                      <option value="Final">Final</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentSongForm.isInstrumental}
                      onChange={(e) => setCurrentSongForm({ ...currentSongForm, isInstrumental: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-zinc-300">
                      Apenas instrumental (sem música específica do acervo)
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={saveEditRepertoireSongInEdit}
                  className="flex-1 btn-primary"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </button>
                <button
                  onClick={cancelEditRepertoireSongInEdit}
                  className="flex-1 px-4 py-2 bg-zinc-700 text-zinc-300 rounded-lg hover:bg-zinc-600 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div>
            <h2 className="text-2xl font-bold text-zinc-100 mb-6">Configurações</h2>

            <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
              <h3 className="text-lg font-semibold text-zinc-100 mb-4">Informações do Ministério</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Nome do Ministério
                  </label>
                  <input
                    type="text"
                    defaultValue="QG WORSHIP"
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Descrição
                  </label>
                  <textarea
                    defaultValue="Ministério de Louvor da Igreja"
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    rows={3}
                  />
                </div>
                <button className="btn-primary">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Configurações
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
