import React, { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Database } from 'lucide-react';

const CreateCollectionsButton: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const createAllCollections = async () => {
    setLoading(true);
    
    try {
      console.log('🔧 Criando todas as collections...');
      
      const collections = [
        { name: 'musicians', testDoc: { name: 'Teste', instrument: 'Guitarra' } },
        { name: 'songs', testDoc: { title: 'Teste', artist: 'Teste', tags: ['celebração'] } },
        { name: 'agendaItems', testDoc: { title: 'Teste', date: '2025-01-01' } },
        { name: 'schedules', testDoc: { month: 0, year: 2025, weeks: [] } },
        { name: 'repertoires', testDoc: { title: 'Teste', weekDate: '2025-01-01', songs: [] } },
        { name: 'activities', testDoc: { type: 'song', action: 'added', description: 'Teste', timestamp: Date.now() } }
      ];
      
      for (const collection of collections) {
        try {
          const testDocRef = doc(db, collection.name, 'test-initial');
          await setDoc(testDocRef, collection.testDoc);
          console.log(`✅ Collection ${collection.name} criada!`);
        } catch (error) {
          console.error(`❌ Erro ao criar ${collection.name}:`, error);
        }
      }
      
      console.log('🎉 Todas as collections foram criadas!');
      console.log('⚠️  Documentos de teste foram adicionados');
      console.log('🔄 Recarregue a página (F5) e delete os documentos de teste');
      
      alert('✅ Collections criadas com sucesso!\n\nRecarregue a página (F5) e você poderá:\n- Adicionar escalas\n- Adicionar repertórios\n- Adicionar qualquer dado\n\nDelete os documentos de teste depois.');
      
    } catch (error) {
      console.error('❌ Erro:', error);
      alert('❌ Erro ao criar collections. Veja o console para detalhes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-800 rounded-lg p-6">
      <div className="flex items-start gap-4">
        <Database className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-zinc-100 mb-2">
            Criar Collections no Firebase
          </h3>
          <p className="text-sm text-zinc-400 mb-4">
            Se você não consegue adicionar escalas ou repertórios, clique abaixo para criar as collections necessárias no Firestore.
            <br />
            <span className="text-yellow-400">Atenção:</span> Isso criará documentos de teste que você deve deletar depois.
          </p>
          <button
            onClick={createAllCollections}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Criando...
              </>
            ) : (
              <>
                <Database className="h-4 w-4" />
                Criar Collections
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCollectionsButton;

