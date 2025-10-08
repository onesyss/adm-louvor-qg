import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

// Função para criar a collection songs com um documento inicial
export const createSongsCollection = async () => {
  console.log('🎵 Criando collection songs...');
  
  try {
    // Criar um documento de teste para inicializar a collection
    const testSong = {
      id: 'test-song-initial',
      title: 'Música de Teste',
      artist: 'Sistema',
      tags: ['celebração']
    };
    
    const docRef = doc(db, 'songs', testSong.id);
    await setDoc(docRef, testSong);
    
    console.log('✅ Collection songs criada com sucesso!');
    console.log('📝 Documento inicial adicionado');
    console.log('🔄 Agora você pode adicionar músicas normalmente');
    console.log('⚠️  Delete o documento "test-song-initial" depois se quiser');
    
    alert('✅ Collection songs criada com sucesso!\nAgora você pode adicionar músicas normalmente.\n\n(Delete a música "Música de Teste" depois se quiser)');
  } catch (error: any) {
    console.error('❌ Erro ao criar collection songs:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    alert('❌ Erro ao criar collection:\n' + error.message);
  }
};

// Disponibilizar no console
(window as any).createSongsCollection = createSongsCollection;

