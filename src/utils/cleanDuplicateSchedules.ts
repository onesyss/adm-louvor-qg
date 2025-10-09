import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';

// Função para limpar schedules duplicados no Firestore
export const cleanDuplicateSchedules = async () => {
  try {
    console.log('🧹 Iniciando limpeza de schedules duplicados...');
    
    const querySnapshot = await getDocs(collection(db, 'schedules'));
    const schedules: any[] = [];
    
    querySnapshot.forEach((doc) => {
      schedules.push({ docId: doc.id, data: doc.data() });
    });
    
    console.log(`📊 Total de documentos: ${schedules.length}`);
    
    // Agrupar por ID (field 'id' dentro do documento)
    const grouped: Record<string, any[]> = {};
    schedules.forEach((schedule) => {
      const id = schedule.data.id || schedule.docId;
      if (!grouped[id]) {
        grouped[id] = [];
      }
      grouped[id].push(schedule);
    });
    
    // Encontrar duplicatas
    let deletedCount = 0;
    for (const [id, docs] of Object.entries(grouped)) {
      if (docs.length > 1) {
        console.warn(`⚠️ Encontradas ${docs.length} cópias do schedule ${id}`);
        
        // Manter apenas o primeiro, deletar os outros
        for (let i = 1; i < docs.length; i++) {
          console.log(`🗑️ Deletando duplicata: ${docs[i].docId}`);
          await deleteDoc(doc(db, 'schedules', docs[i].docId));
          deletedCount++;
        }
      }
    }
    
    if (deletedCount > 0) {
      console.log(`✅ Limpeza concluída! ${deletedCount} duplicata(s) removida(s)`);
      alert(`✅ Limpeza concluída!\n${deletedCount} schedule(s) duplicado(s) foram removidos.`);
    } else {
      console.log('✅ Nenhuma duplicata encontrada!');
      alert('✅ Nenhuma duplicata encontrada!\nSeus dados estão consistentes.');
    }
  } catch (error: any) {
    console.error('❌ Erro ao limpar duplicatas:', error);
    alert('❌ Erro ao limpar duplicatas:\n' + error.message);
  }
};

// Disponibilizar no console para uso manual
(window as any).cleanDuplicateSchedules = cleanDuplicateSchedules;

console.log('🧹 cleanDuplicateSchedules() disponível no console!');
console.log('💡 Para limpar schedules duplicados, execute: cleanDuplicateSchedules()');

