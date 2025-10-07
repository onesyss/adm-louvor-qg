import { addDocument } from '../firebase/firestore';
import { Musician, Song, AgendaItem, MonthSchedule, Repertoire } from '../types';

/**
 * Script para migrar dados do localStorage para Firebase
 * Execute este script UMA VEZ para transferir os dados existentes
 */
export const migrateLocalStorageToFirebase = async () => {
  console.log('🔄 Iniciando migração do localStorage para Firebase...');

  try {
    // 1. Migrar músicos
    const musiciansData = localStorage.getItem('qg-worship-musicians');
    if (musiciansData) {
      const musicians: Musician[] = JSON.parse(musiciansData);
      console.log(`📊 Migrando ${musicians.length} músicos...`);
      for (const musician of musicians) {
        await addDocument('musicians', musician);
      }
      console.log('✅ Músicos migrados!');
    }

    // 2. Migrar músicas
    const songsData = localStorage.getItem('qg-worship-songs');
    if (songsData) {
      const songs: Song[] = JSON.parse(songsData);
      console.log(`📊 Migrando ${songs.length} músicas...`);
      for (const song of songs) {
        await addDocument('songs', song);
      }
      console.log('✅ Músicas migradas!');
    }

    // 3. Migrar agenda
    const agendaData = localStorage.getItem('qg-worship-agenda');
    if (agendaData) {
      const agendaItems: AgendaItem[] = JSON.parse(agendaData);
      console.log(`📊 Migrando ${agendaItems.length} eventos da agenda...`);
      for (const item of agendaItems) {
        await addDocument('agendaItems', item);
      }
      console.log('✅ Agenda migrada!');
    }

    // 4. Migrar escalas
    const schedulesData = localStorage.getItem('qg-worship-schedules');
    if (schedulesData) {
      const schedules: MonthSchedule[] = JSON.parse(schedulesData);
      console.log(`📊 Migrando ${schedules.length} escalas...`);
      for (const schedule of schedules) {
        await addDocument('schedules', schedule);
      }
      console.log('✅ Escalas migradas!');
    }

    // 5. Migrar repertórios
    const repertoiresData = localStorage.getItem('qg-worship-repertoires');
    if (repertoiresData) {
      const repertoires: Repertoire[] = JSON.parse(repertoiresData);
      console.log(`📊 Migrando ${repertoires.length} repertórios...`);
      for (const repertoire of repertoires) {
        await addDocument('repertoires', repertoire);
      }
      console.log('✅ Repertórios migrados!');
    }

    // 6. Migrar atividades
    const activitiesData = localStorage.getItem('qg-worship-activities');
    if (activitiesData) {
      const activities = JSON.parse(activitiesData);
      console.log(`📊 Migrando ${activities.length} atividades...`);
      for (const activity of activities) {
        await addDocument('activities', activity);
      }
      console.log('✅ Atividades migradas!');
    }

    console.log('🎉 Migração concluída com sucesso!');
    console.log('💡 Você pode limpar o localStorage agora se quiser.');
    
    return { success: true };
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    return { success: false, error };
  }
};

/**
 * Limpar localStorage (usar APENAS após confirmar que dados estão no Firebase)
 */
export const clearLocalStorage = () => {
  const keys = [
    'qg-worship-musicians',
    'qg-worship-songs',
    'qg-worship-agenda',
    'qg-worship-schedules',
    'qg-worship-repertoires',
    'qg-worship-activities'
  ];

  keys.forEach(key => localStorage.removeItem(key));
  console.log('🧹 localStorage limpo!');
};

