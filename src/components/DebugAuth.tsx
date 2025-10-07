import React, { useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

const DebugAuth: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      console.log('🔐 Auth State:', currentUser ? 'Autenticado' : 'Não autenticado');
      console.log('👤 User:', currentUser);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-zinc-900 border border-zinc-700 rounded-lg p-4 shadow-lg max-w-sm z-50">
      <h3 className="text-sm font-bold text-zinc-100 mb-2">🔧 Debug Auth</h3>
      {user ? (
        <div className="space-y-1 text-xs">
          <p className="text-green-400">✅ Autenticado</p>
          <p className="text-zinc-400">Email: {user.email}</p>
          <p className="text-zinc-400">UID: {user.uid}</p>
        </div>
      ) : (
        <div className="space-y-1 text-xs">
          <p className="text-red-400">❌ Não autenticado</p>
          <p className="text-zinc-400">Faça login no Admin para editar/excluir</p>
        </div>
      )}
    </div>
  );
};

export default DebugAuth;

