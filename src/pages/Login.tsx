import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Login com Firebase Auth (mantém sessão automaticamente)
      await signInWithEmailAndPassword(auth, email, password);
      // Também manter no localStorage como fallback
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/admin');
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        setError('Email ou senha incorretos');
      } else if (error.code === 'auth/invalid-email') {
        setError('Email inválido');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Muitas tentativas. Tente novamente mais tarde.');
      } else {
        setError('Erro ao fazer login. Tente novamente.');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-950 to-black flex items-center justify-center p-4">
      <div className="glass p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Music className="h-12 w-12 text-indigo-400" />
            <span className="ml-3 text-3xl font-bold text-zinc-100">QG WORSHIP</span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-100">Área Administrativa</h1>
          <p className="text-zinc-400 mt-2">Faça login para acessar o painel administrativo</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-900/40 border border-red-800 text-red-300 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-400" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Sua senha"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-300"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </button>
        </form>


        {/* Back to Site */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
          >
            ← Voltar ao site
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;