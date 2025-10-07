import { 
  collection, 
  addDoc, 
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
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return { id: docRef.id, ...data };
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
    await deleteDoc(doc(db, collectionName, id));
    return id;
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error);
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
    const collectionRef = collection(db, collectionName);
    const q = orderByField 
      ? query(collectionRef, orderBy(orderByField))
      : collectionRef;

    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(data);
    });
  } catch (error) {
    console.error(`Error subscribing to ${collectionName}:`, error);
    throw error;
  }
};

