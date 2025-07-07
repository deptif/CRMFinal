
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  Plus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time: string;
  type: 'meeting' | 'task' | 'call' | 'event';
  participants?: string[];
  description?: string;
}

export const CalendarWidget = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  const [events] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Reunião com Cliente ABC',
      date: new Date(),
      time: '10:00',
      type: 'meeting',
      participants: ['Ana Silva', 'João Santos'],
      description: 'Apresentação da proposta comercial'
    },
    {
      id: '2',
      title: 'Follow-up Lead DEF',
      date: new Date(Date.now() + 24 * 60 * 60 * 1000),
      time: '14:30',
      type: 'call',
      participants: ['Maria Costa'],
      description: 'Chamada de acompanhamento'
    },
    {
      id: '3',
      title: 'Demo do Produto',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      time: '16:00',
      type: 'event',
      participants: ['Equipa de Vendas'],
      description: 'Demonstração do novo produto'
    }
  ]);

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'meeting': return 'bg-blue-100 text-blue-800';
      case 'task': return 'bg-green-100 text-green-800';
      case 'call': return 'bg-orange-100 text-orange-800';
      case 'event': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleNewEvent = () => {
    toast({
      title: "Novo Evento",
      description: "Funcionalidade de criação de eventos em desenvolvimento"
    });
  };

  const todayEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Calendário</h2>
          <p className="text-muted-foreground">
            Atividades e reuniões agendadas
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('month')}
          >
            Mês
          </Button>
          <Button
            variant={viewMode === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('week')}
          >
            Semana
          </Button>
          <Button
            variant={viewMode === 'day' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('day')}
          >
            Dia
          </Button>
          <Button onClick={handleNewEvent} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Novo Evento
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2" />
              {selectedDate?.toLocaleDateString('pt-PT', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Events for selected date */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Eventos de {selectedDate?.toLocaleDateString('pt-PT')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayEvents.length > 0 ? (
                todayEvents.map((event) => (
                  <div key={event.id} className="p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium text-sm">{event.title}</h4>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {event.time}
                        </div>
                        {event.participants && (
                          <div className="flex items-center text-xs text-gray-500">
                            <Users className="h-3 w-3 mr-1" />
                            {event.participants.join(', ')}
                          </div>
                        )}
                        {event.description && (
                          <p className="text-xs text-gray-600">{event.description}</p>
                        )}
                      </div>
                      <Badge className={getEventTypeColor(event.type)} variant="secondary">
                        {event.type === 'meeting' ? 'Reunião' :
                         event.type === 'task' ? 'Tarefa' :
                         event.type === 'call' ? 'Chamada' : 'Evento'}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">
                  Nenhum evento agendado para este dia
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
