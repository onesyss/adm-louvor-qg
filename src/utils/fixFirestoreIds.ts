import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

// Função para corrigir IDs dos documentos no Firestore
export const fixFirestoreIds = async () => {
  console.log('🔧 Iniciando correção de IDs do Firestore...');
  
  const collections = ['musicians', 'songs', 'agendaItems', 'schedules', 'repertoires', 'activities'];
  
  for (const collectionName of collections) {
    try {
      console.log(`\n📂 Processando collection: ${collectionName}`);
      
      // Buscar todos os documentos
      const querySnapshot = await getDocs(collection(db, collectionName));
      
      console.log(`  📊 Encontrados ${querySnapshot.size} documentos`);
      
      for (const docSnapshot of querySnapshot.docs) {
        const firestoreId = docSnapshot.id;  // ID do documento no Firestore
        const data = docSnapshot.data();
        const dataId = data.id;  // Campo 'id' dentro do documento
        
        // Se os IDs são diferentes, precisa corrigir
        if (firestoreId !== dataId) {
          console.log(`  ⚠️  ID incorreto encontrado:`);
          console.log(`      Firestore ID: ${firestoreId}`);
          console.log(`      Campo ID: ${dataId}`);
          
          // Criar novo documento com ID correto
          const newDocRef = doc(db, collectionName, dataId);
          await setDoc(newDocRef, data);
          console.log(`  ✅ Documento criado com ID correto: ${dataId}`);
          
          // Deletar documento antigo
          await deleteDoc(doc(db, collectionName, firestoreId));
          console.log(`  🗑️  Documento antigo deletado: ${firestoreId}`);
        } else {
          console.log(`  ✅ ID correto: ${firestoreId}`);
        }
      }
      
      console.log(`✅ Collection ${collectionName} corrigida!`);
    } catch (error) {
      console.error(`❌ Erro ao corrigir ${collectionName}:`, error);
    }
  }
  
  console.log('\n🎉 Correção de IDs concluída!');
  console.log('🔄 Recarregue a página (F5) para ver as mudanças');
};

// Disponibilizar no console
(window as any).fixFirestoreIds = fixFirestoreIds;

