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

// Função genérica para adicionar documento
export const addDocument = async (collectionName: string, data: any) => {
  try {
    console.log(`➕ Adicionando documento em ${collectionName} com ID:`, data.id);
    
    // Se tem ID, usar setDoc para definir o ID do documento
    if (data.id) {
      const docRef = doc(db, collectionName, data.id);
      await setDoc(docRef, {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      console.log(`✅ Documento criado com ID customizado: ${data.id}`);
      return data;
    } else {
      // Se não tem ID, usar addDoc (gera ID automático)
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      console.log(`✅ Documento criado com ID automático: ${docRef.id}`);
      return { id: docRef.id, ...data };
    }
  } catch (error) {
    console.error(`Error adding document to ${collectionName}:`, error);
    throw error;
  }
};

// Função genérica para atualizar documento
export const updateDocument = async (collectionName: string, id: string, data: any) => {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
    return { id, ...data };
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

