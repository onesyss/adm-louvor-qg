import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar localStorage primeiro (fallback)
    const localAuth = localStorage.getItem('isAuthenticated') === 'true';
    
    // Listener do estado de autenticação do Firebase
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Se tem usuário no Firebase OU tem no localStorage, está autenticado
      setIsAuthenticated(!!user || localAuth);
      setIsLoading(false);
    }, (error) => {
      // Se erro no Firebase, usa localStorage como fallback
      console.log('Firebase auth check failed, using localStorage fallback');
      setIsAuthenticated(localAuth);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-zinc-400">Verificando autenticação...</p>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
