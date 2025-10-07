// Função para limpar localStorage completamente
export const clearAllLocalStorage = () => {
  console.log('🧹 Limpando localStorage...');
  
  const keys = [
    'musicians',
    'songs',
    'agendaItems',
    'schedules',
    'repertoires',
    'activities',
    'isAuthenticated'
  ];
  
  keys.forEach(key => {
    if (localStorage.getItem(key)) {
      console.log(`  ❌ Removendo: ${key}`);
      localStorage.removeItem(key);
    }
  });
  
  console.log('✅ localStorage limpo!');
  console.log('🔄 Recarregue a página para sincronizar com Firestore');
};

// Para usar no console: window.clearStorage()
(window as any).clearStorage = clearAllLocalStorage;

