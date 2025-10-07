import React, { useState } from 'react';
import { Database, Check, AlertCircle } from 'lucide-react';
import { migrateLocalStorageToFirebase } from '../utils/migrateToFirebase';

const MigrationButton: React.FC = () => {
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleMigration = async () => {
    if (window.confirm('⚠️ Isso vai transferir TODOS os dados do localStorage para o Firebase. Continuar?')) {
      setIsMigrating(true);
      setMigrationStatus('idle');

      const result = await migrateLocalStorageToFirebase();
      
      if (result.success) {
        setMigrationStatus('success');
        alert('✅ Migração concluída! Verifique o console do navegador para detalhes.');
      } else {
        setMigrationStatus('error');
        alert('❌ Erro na migração. Verifique o console do navegador.');
      }
      
      setIsMigrating(false);
    }
  };

  return (
    <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-yellow-300 mb-2 flex items-center">
        <Database className="h-5 w-5 mr-2" />
        Migração de Dados (Uma única vez)
      </h3>
      <p className="text-sm text-yellow-200/80 mb-4">
        Clique no botão abaixo para migrar seus dados do localStorage para o Firebase. 
        Isso precisa ser feito apenas UMA VEZ.
      </p>
      
      <button
        onClick={handleMigration}
        disabled={isMigrating || migrationStatus === 'success'}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
          migrationStatus === 'success'
            ? 'bg-green-600 text-white cursor-not-allowed'
            : migrationStatus === 'error'
            ? 'bg-red-600 text-white hover:bg-red-700'
            : 'bg-yellow-600 text-white hover:bg-yellow-700'
        }`}
      >
        {migrationStatus === 'success' ? (
          <>
            <Check className="h-4 w-4" />
            <span>Migração Concluída!</span>
          </>
        ) : migrationStatus === 'error' ? (
          <>
            <AlertCircle className="h-4 w-4" />
            <span>Tentar Novamente</span>
          </>
        ) : isMigrating ? (
          <>
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Migrando...</span>
          </>
        ) : (
          <>
            <Database className="h-4 w-4" />
            <span>Migrar Dados para Firebase</span>
          </>
        )}
      </button>

      {migrationStatus === 'success' && (
        <p className="text-sm text-green-300 mt-3">
          ✅ Dados migrados com sucesso! Agora todos os dados estão sincronizados na nuvem.
        </p>
      )}
    </div>
  );
};

export default MigrationButton;

