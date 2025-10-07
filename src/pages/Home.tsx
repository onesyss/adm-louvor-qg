import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Music, Archive, ArrowRight, Clock, Users, Guitar, Plus, Edit, Trash2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Home: React.FC = () => {
  const { musicians, songs, agendaItems, activities } = useAppContext();
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  const quickActions = [
    {
      title: 'Escalas do Mês',
      description: `Confira as escalas de ${currentMonth}`,
      icon: Calendar,
      href: '/scales',
      color: 'bg-blue-500',
    },
    {
      title: 'Repertório da Semana',
      description: 'Músicas e vocais desta semana',
      icon: Music,
      href: '/repertoire',
      color: 'bg-green-500',
    },
    {
      title: 'Agenda',
      description: 'Próximos eventos e ensaios',
      icon: Clock,
      href: '/agenda',
      color: 'bg-purple-500',
    },
    {
      title: 'Acervo Musical',
      description: 'Músicas já tocadas no ministério',
      icon: Archive,
      href: '/archive',
      color: 'bg-orange-500',
    },
    {
      title: 'Colaboradores',
      description: 'Veja todos os músicos do ministério',
      icon: Guitar,
      href: '/musicians',
      color: 'bg-indigo-500',
    },
  ];

  // Calcular próximos eventos (futuros)
  const upcomingEvents = agendaItems.filter(item => new Date(item.date) >= currentDate).length;
  
  // Calcular ensaios deste mês
  const rehearsalsThisMonth = agendaItems.filter(item => {
    const itemDate = new Date(item.date);
    return item.type === 'rehearsal' && 
           itemDate.getMonth() === currentDate.getMonth() && 
           itemDate.getFullYear() === currentDate.getFullYear();
  }).length;

  const stats = [
    { label: 'Colaboradores', value: musicians.length.toString(), icon: Users },
    { label: 'Músicas no Acervo', value: songs.length.toString(), icon: Music },
    { label: 'Ensaios este Mês', value: rehearsalsThisMonth.toString(), icon: Calendar },
    { label: 'Próximos Eventos', value: upcomingEvents.toString(), icon: Clock },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-zinc-100 mb-4">
          Bem-vindo ao QG WORSHIP
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
          Ministério de Louvor - Organize suas escalas, repertórios e eventos de forma eficiente
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="glass p-6 text-center fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex justify-center mb-3">
                <Icon className="h-8 w-8 text-indigo-400" />
              </div>
              <div className="text-3xl font-bold text-zinc-100 mb-1">{stat.value}</div>
              <div className="text-sm text-zinc-400">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="glass p-8">
        <h2 className="text-2xl font-bold text-zinc-100 mb-6">Acesso Rápido</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            const isLastItem = index === quickActions.length - 1;
            return (
              <Link
                key={index}
                to={action.href}
                className={`group bg-zinc-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-zinc-700 ${
                  isLastItem ? 'md:col-start-1 md:col-span-2 md:max-w-md md:mx-auto' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${action.color} group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-zinc-100 group-hover:text-indigo-400 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-zinc-400 mt-1">{action.description}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-zinc-400 group-hover:text-indigo-400 transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass p-8">
        <h2 className="text-2xl font-bold text-zinc-100 mb-6">Atividade Recente</h2>
        <div className="space-y-4">
          {activities.length > 0 ? (
            activities.slice(0, 10).map((activity) => {
              const getActivityIcon = () => {
                switch (activity.type) {
                  case 'musician': return { 
                    icon: Users, 
                    bgColor: 'bg-purple-900/40', 
                    borderColor: 'border-purple-800', 
                    textColor: 'text-purple-400' 
                  };
                  case 'song': return { 
                    icon: Music, 
                    bgColor: 'bg-blue-900/40', 
                    borderColor: 'border-blue-800', 
                    textColor: 'text-blue-400' 
                  };
                  case 'schedule': return { 
                    icon: Calendar, 
                    bgColor: 'bg-green-900/40', 
                    borderColor: 'border-green-800', 
                    textColor: 'text-green-400' 
                  };
                  case 'repertoire': return { 
                    icon: Guitar, 
                    bgColor: 'bg-indigo-900/40', 
                    borderColor: 'border-indigo-800', 
                    textColor: 'text-indigo-400' 
                  };
                  case 'agenda': return { 
                    icon: Clock, 
                    bgColor: 'bg-orange-900/40', 
                    borderColor: 'border-orange-800', 
                    textColor: 'text-orange-400' 
                  };
                  default: return { 
                    icon: Calendar, 
                    bgColor: 'bg-zinc-800', 
                    borderColor: 'border-zinc-700', 
                    textColor: 'text-zinc-400' 
                  };
                }
              };

              const getActionIcon = () => {
                switch (activity.action) {
                  case 'added': return Plus;
                  case 'updated': return Edit;
                  case 'deleted': return Trash2;
                  default: return Plus;
                }
              };

              const { icon: TypeIcon, bgColor, borderColor, textColor } = getActivityIcon();
              const ActionIcon = getActionIcon();

              const getTimeAgo = (timestamp: number) => {
                const now = Date.now();
                const diff = now - timestamp;
                const minutes = Math.floor(diff / 60000);
                const hours = Math.floor(diff / 3600000);
                const days = Math.floor(diff / 86400000);
                
                if (minutes < 1) return 'Agora mesmo';
                if (minutes < 60) return `Há ${minutes} minuto${minutes > 1 ? 's' : ''}`;
                if (hours < 24) return `Há ${hours} hora${hours > 1 ? 's' : ''}`;
                if (days === 1) return 'Há 1 dia';
                if (days < 7) return `Há ${days} dias`;
                if (days < 30) return `Há ${Math.floor(days / 7)} semana${Math.floor(days / 7) > 1 ? 's' : ''}`;
                return `Há ${Math.floor(days / 30)} mês${Math.floor(days / 30) > 1 ? 'es' : ''}`;
              };

              return (
                <div key={activity.id} className="flex items-center space-x-4 p-4 bg-zinc-800 rounded-lg border border-zinc-700">
                  <div className={`p-2 rounded-lg border relative ${bgColor} ${borderColor}`}>
                    <TypeIcon className={`h-5 w-5 ${textColor}`} />
                    <div className={`absolute -top-1 -right-1 p-0.5 bg-zinc-800 rounded-full border ${borderColor}`}>
                      <ActionIcon className={`h-3 w-3 ${textColor}`} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-zinc-100">{activity.description}</p>
                    <p className="text-sm text-zinc-400">{getTimeAgo(activity.timestamp)}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-zinc-400">
              <Clock className="h-16 w-16 mx-auto mb-4 text-zinc-600" />
              <p>Nenhuma atividade registrada ainda</p>
              <p className="text-sm mt-2">As atividades aparecerão aqui quando você começar a usar o sistema</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
