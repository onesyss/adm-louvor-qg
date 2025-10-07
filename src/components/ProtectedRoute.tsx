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
    // Verificar localStorage primeiro (fallback imediato)
    const checkAuth = () => {
      const localAuth = localStorage.getItem('isAuthenticated') === 'true';
      
      // Se tem no localStorage, já considera autenticado e carrega
      if (localAuth) {
        setIsAuthenticated(true);
        setIsLoading(false);
      }
      
      // Listener do estado de autenticação do Firebase (em background)
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        // Se tem usuário no Firebase, está autenticado
        if (user) {
          localStorage.setItem('isAuthenticated', 'true');
          setIsAuthenticated(true);
        } else if (!localAuth) {
          // Só marca como não autenticado se também não tem no localStorage
          setIsAuthenticated(false);
        }
        setIsLoading(false);
      }, () => {
        // Se erro no Firebase, mantém localStorage
        console.log('Firebase auth check failed, using localStorage fallback');
        if (localAuth) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
        setIsLoading(false);
      });

      return unsubscribe;
    };

    const unsubscribe = checkAuth();
    return () => {
      if (unsubscribe) unsubscribe();
    };
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
