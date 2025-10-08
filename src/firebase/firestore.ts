import { 
  collection, 
  addDoc,
  setDoc,
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  onSnapshot,
  query,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from './config';

// Função auxiliar para remover campos undefined recursivamente
const removeUndefined = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(item => removeUndefined(item));
  }
  
  if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => [key, removeUndefined(value)])
    );
  }
  
  return obj;
};

// Função genérica para adicionar documento
export const addDocument = async (collectionName: string, data: any) => {
  try {
    console.log(`➕ Adicionando documento em ${collectionName}`);
    console.log('📝 Dados originais:', data);
    
    // Sempre usar addDoc (ID gerado pelo Firestore)
    // Remover campo 'id' e campos 'undefined' dos dados antes de salvar
    const { id, ...dataWithoutId } = data;
    
    // Remover campos undefined recursivamente (Firestore não aceita)
    const cleanData = removeUndefined(dataWithoutId);
    
    console.log('✨ Dados limpos:', cleanData);
    
    const docRef = await addDoc(collection(db, collectionName), {
      ...cleanData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    console.log(`✅ Documento criado com ID automático do Firestore: ${docRef.id}`);
    
    return { id: docRef.id, ...cleanData };
  } catch (error: any) {
    console.error(`❌ Error adding document to ${collectionName}:`, error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    throw error;
  }
};

// Função genérica para atualizar documento
export const updateDocument = async (collectionName: string, id: string, data: any) => {
  try {
    // Remover campos undefined recursivamente (Firestore não aceita)
    const cleanData = removeUndefined(data);
    
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      ...cleanData,
      updatedAt: Timestamp.now()
    });
    return { id, ...cleanData };
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    throw error;
  }
};

// Função genérica para deletar documento
export const deleteDocument = async (collectionName: string, id: string) => {
  try {
    console.log(`🔥 Firestore: Deletando ${collectionName}/${id}...`);
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
    console.log(`✅ Firestore: Documento ${collectionName}/${id} deletado com sucesso!`);
    return id;
  } catch (error: any) {
    console.error(`❌ Firestore Error deleting ${collectionName}/${id}:`, error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    throw error;
  }
};

// Função genérica para buscar todos os documentos
export const getDocuments = async (collectionName: string) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error(`Error getting documents from ${collectionName}:`, error);
    throw error;
  }
};

// Função para escutar mudanças em tempo real
export const subscribeToCollection = (
  collectionName: string, 
  callback: (data: any[]) => void,
  orderByField?: string
) => {
  try {
    console.log(`📡 Iniciando onSnapshot para ${collectionName}...`);
    const collectionRef = collection(db, collectionName);
    const q = orderByField 
      ? query(collectionRef, orderBy(orderByField))
      : collectionRef;

    return onSnapshot(q, 
      (snapshot) => {
        console.log(`🔔 onSnapshot detectou mudança em ${collectionName}:`, snapshot.docs.length, 'documentos');
        const data = snapshot.docs.map(doc => {
          const docData = { id: doc.id, ...doc.data() };
          console.log(`  📄 Doc ${doc.id}:`, docData);
          return docData;
        });
        console.log(`✅ Chamando callback com ${data.length} documentos`);
        callback(data);
      },
      (error) => {
        console.error(`❌ Erro no onSnapshot de ${collectionName}:`, error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
      }
    );
  } catch (error) {
    console.error(`❌ Error setting up subscription to ${collectionName}:`, error);
    throw error;
  }
};

