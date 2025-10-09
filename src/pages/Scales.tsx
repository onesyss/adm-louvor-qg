import React, { useState } from 'react';
import { Calendar, Users, Music } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Scales: React.FC = () => {
  const { schedules } = useAppContext();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());


  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const getCurrentMonthSchedule = () => {
    return schedules.find(schedule => 
      schedule.month === currentMonth && schedule.year === currentYear
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };



  const currentSchedule = getCurrentMonthSchedule();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Calendar className="h-8 w-8 text-indigo-400" />
            <div>
              <h1 className="text-3xl font-bold text-zinc-100">Escalas Mensais</h1>
              <p className="text-zinc-400">Organize as escalas do ministério de louvor</p>
            </div>
          </div>
        </div>
      </div>

      {/* Month Navigation */}
      <div className="glass p-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors border border-zinc-700"
          >
            <svg className="h-6 w-6 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <h2 className="text-2xl font-bold text-zinc-100">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors border border-zinc-700"
          >
            <svg className="h-6 w-6 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>


      {/* Schedule Table */}
      {currentSchedule ? (
        <div className="glass p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {(() => {
              // Agrupar escalas por semana PRESERVANDO A ORDEM do array original
              const weeksGrouped = currentSchedule.weeks.reduce((acc, week) => {
                if (!acc[week.weekNumber]) {
                  acc[week.weekNumber] = [];
                }
                acc[week.weekNumber].push(week);
                return acc;
              }, {} as Record<number, typeof currentSchedule.weeks>);

              // Criar array ordenado mantendo a ordem original das weeks
              const orderedWeeks: Array<[string, typeof currentSchedule.weeks]> = [];
              const processedWeekNumbers = new Set<number>();
              
              // Percorrer o array original para manter a ordem
              currentSchedule.weeks.forEach(week => {
                if (!processedWeekNumbers.has(week.weekNumber)) {
                  orderedWeeks.push([week.weekNumber.toString(), weeksGrouped[week.weekNumber]]);
                  processedWeekNumbers.add(week.weekNumber);
                }
              });

              return orderedWeeks.map(([weekNumber, weeks]) => (
                <div key={weekNumber} className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-zinc-100">
                        {weekNumber}ª Semana
                      </h3>
                      <div className="text-sm text-zinc-400">
                        {new Date(weeks[0].date).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>

                  {/* Escalas da semana */}
                  <div className="space-y-4">
                    {weeks.map((week) => (
                      <div key={week.id} className="bg-zinc-700 rounded-lg p-4 border border-zinc-600">
                        <div className="mb-3">
                          {week.serviceName && (
                            <div className={`text-sm font-semibold px-3 py-1 rounded-full inline-block ${
                              week.serviceName === 'Culto Manhã' 
                                ? 'bg-orange-900/40 text-orange-300 border border-orange-800' 
                                : week.serviceName === 'Culto Noite'
                                ? 'bg-blue-900/40 text-blue-300 border border-blue-800'
                                : week.serviceName === 'Culto de Terça'
                                ? 'bg-purple-900/40 text-purple-300 border border-purple-800'
                                : 'bg-gray-900/40 text-gray-300 border border-gray-800'
                            }`}>
                              {week.serviceName}
                            </div>
                          )}
                        </div>

                        {/* Colaboradores (Músicos + Vocais) */}
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-zinc-300 mb-2 flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            Colaboradores ({week.musicians.length})
                          </h4>
                          <div className="space-y-2">
                            {week.musicians.map((musician) => (
                              <div key={musician.id} className="flex items-center justify-between text-sm">
                                <span className="text-zinc-100">{musician.name}</span>
                                <span className={`px-2 py-1 border rounded-full text-xs ${
                                  musician.instrument === 'Vocal'
                                    ? 'bg-green-900/40 text-green-300 border-green-800'
                                    : 'bg-indigo-900/40 text-indigo-300 border-indigo-800'
                                }`}>
                                  {musician.instrument}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      ) : (
        <div className="glass p-12 text-center">
          <Calendar className="h-16 w-16 text-zinc-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-zinc-100 mb-2">
            Nenhuma escala encontrada
          </h3>
          <p className="text-zinc-400 mb-6">
            Não há escalas cadastradas para {monthNames[currentMonth]} {currentYear}
          </p>
          <p className="text-zinc-500">
            As escalas são gerenciadas pelo administrador
          </p>
        </div>
      )}
    </div>
  );
};

export default Scales;