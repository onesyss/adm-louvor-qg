import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Music } from 'lucide-react';
import { AgendaItem } from '../types';
import { useAppContext } from '../context/AppContext';

const Agenda: React.FC = () => {
  const { agendaItems } = useAppContext();
  const [filter, setFilter] = useState<'all' | 'rehearsal' | 'service' | 'event' | 'meeting'>('all');

  const getTypeIcon = (type: AgendaItem['type']) => {
    switch (type) {
      case 'rehearsal':
        return <Music className="h-5 w-5" />;
      case 'service':
        return <Users className="h-5 w-5" />;
      case 'event':
        return <Calendar className="h-5 w-5" />;
      case 'meeting':
        return <Users className="h-5 w-5" />;
      default:
        return <Calendar className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: AgendaItem['type']) => {
    switch (type) {
      case 'rehearsal':
        return 'bg-blue-900/40 text-blue-300 border-blue-800';
      case 'service':
        return 'bg-green-900/40 text-green-300 border-green-800';
      case 'event':
        return 'bg-purple-900/40 text-purple-300 border-purple-800';
      case 'meeting':
        return 'bg-orange-900/40 text-orange-300 border-orange-800';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  const getTypeLabel = (type: AgendaItem['type']) => {
    switch (type) {
      case 'rehearsal':
        return 'Ensaio';
      case 'service':
        return 'Culto';
      case 'event':
        return 'Evento';
      case 'meeting':
        return 'Reunião';
      default:
        return 'Outro';
    }
  };

  const filteredItems = filter === 'all' 
    ? agendaItems 
    : agendaItems.filter(item => item.type === filter);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const upcomingItems = agendaItems
    .filter(item => new Date(item.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Calendar className="h-8 w-8 text-indigo-400" />
            <div>
              <h1 className="text-3xl font-bold text-zinc-100">Agenda</h1>
              <p className="text-zinc-400">Organize eventos, ensaios e reuniões do ministério</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="glass p-6">
        <h2 className="text-xl font-semibold text-zinc-100 mb-4">Próximos Eventos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {upcomingItems.map((item) => (
            <div key={item.id} className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${getTypeColor(item.type)}`}>
                  {getTypeIcon(item.type)}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs border ${getTypeColor(item.type)}`}>
                  {getTypeLabel(item.type)}
                </span>
              </div>
              <h3 className="font-semibold text-zinc-100 mb-1">{item.title}</h3>
              <p className="text-sm text-zinc-400 mb-2">{item.description}</p>
              <div className="space-y-1 text-sm text-zinc-400">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(item.date)}
                </div>
                {item.time && (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {item.time}
                  </div>
                )}
                {item.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {item.location}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="glass p-6">
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('rehearsal')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'rehearsal' 
                ? 'bg-blue-600 text-white' 
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'
            }`}
          >
            Ensaios
          </button>
          <button
            onClick={() => setFilter('service')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'service' 
                ? 'bg-green-600 text-white' 
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'
            }`}
          >
            Cultos
          </button>
          <button
            onClick={() => setFilter('meeting')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'meeting' 
                ? 'bg-orange-600 text-white' 
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'
            }`}
          >
            Reuniões
          </button>
          <button
            onClick={() => setFilter('event')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'event' 
                ? 'bg-purple-600 text-white' 
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'
            }`}
          >
            Eventos
          </button>
        </div>

        {/* Agenda List */}
        <div className="space-y-4">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div key={item.id} className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${getTypeColor(item.type)}`}>
                      {getTypeIcon(item.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-zinc-100">{item.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs border ${getTypeColor(item.type)}`}>
                          {getTypeLabel(item.type)}
                        </span>
                      </div>
                      <p className="text-zinc-400 mb-3">{item.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(item.date)}
                        </div>
                        {item.time && (
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {item.time}
                          </div>
                        )}
                        {item.location && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {item.location}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-zinc-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-zinc-100 mb-2">
                Nenhum evento encontrado
              </h3>
              <p className="text-zinc-400 mb-6">
                {filter === 'all' 
                  ? 'Não há eventos na agenda ainda'
                  : `Não há eventos do tipo "${getTypeLabel(filter as AgendaItem['type'])}" na agenda`
                }
              </p>
              <p className="text-zinc-500">
                Os eventos são gerenciados pelo administrador
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Agenda;
