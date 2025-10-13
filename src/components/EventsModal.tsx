import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { X, Calendar, Clock, MapPin, Users } from 'lucide-react';

dayjs.extend(utc);
import { supabase } from '../lib/supabase';

interface Event {
  id: string;
  title: string;
  description: string;
  start_time: string;
  duration: string;
}

interface EventsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EventsModal = ({ isOpen, onClose }: EventsModalProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchEvents();
    }
  }, [isOpen]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      
      const now = dayjs();

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('start_time', now.format('YYYY-MM-DD'))
        .order('start_time', { ascending: true });


      if (error) {
        setError(error as Error);
      } else {
        setEvents(data as Event[] || []);
        setError(null);
      }
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const isToday = (dateString: string) => {
    // Compare the date part of the UTC timestamp with the user's local 'today'
    const eventDate = dayjs.utc(dateString).format('YYYY-MM-DD');
    const todayInUTC = dayjs().utc().format('YYYY-MM-DD'); // To be safe, compare UTC with UTC
    return eventDate === todayInUTC;
  };

  const formatDate = (dateString: string) => {
    const eventDate = dayjs.utc(dateString);
    const today = dayjs().startOf('day');
    const tomorrow = dayjs().add(1, 'day').startOf('day');

    if (eventDate.isSame(today, 'day')) {
      return 'Today';
    } else if (eventDate.isSame(tomorrow, 'day')) {
      return 'Tomorrow';
    } else {
      return eventDate.format('dddd, MMM D');
    }
  };

  const formatTime = (dateString: string) => {
    // Parse the date as UTC and format it in UTC.
    const date = dayjs.utc(dateString);
    return date.format('h:mm A');
  };

  const formatDuration = (duration: string) => {
    // Handle duration format (e.g., "2:00:00", "1:30:00", etc.)
    if (!duration) return 'Duration TBD';
    
    try {
      const parts = duration.split(':');
      if (parts.length >= 2) {
        const hours = parseInt(parts[0]);
        const minutes = parseInt(parts[1]);
        
        if (hours === 0) {
          return `${minutes} minutes`;
        } else if (minutes === 0) {
          return `${hours} hour${hours > 1 ? 's' : ''}`;
        } else {
          return `${hours}h ${minutes}m`;
        }
      }
    } catch (error) {
      console.error('Error parsing duration:', error);
    }
    
    return duration;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
            <p className="text-gray-600 mt-1">Connect through meaningful conversations</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B83280]"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error.message}</p>
              <button 
                onClick={fetchEvents}
                className="mt-4 px-4 py-2 bg-[#B83280] text-white rounded-lg hover:bg-[#a02970] transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No upcoming events</p>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className={`bg-white border rounded-xl p-6 hover:shadow-lg transition-shadow ${
                    isToday(event.start_time) ? 'border-[#B83280] bg-gradient-to-r from-[#4CAF50]/5 to-transparent' : 'border-gray-200'
                  }`}
                >
                  <div className="flex gap-4">
                    {/* Event Image */}
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 bg-gradient-to-br from-[#B83280] to-[#8e165c] rounded-lg flex items-center justify-center">
                        <Calendar className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {event.title}
                            {isToday(event.start_time) && (
                              <span className="ml-2 px-2 py-1 bg-[#B83280] text-white text-xs rounded-full">
                                Next Event
                              </span>
                            )}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {event.description}
                          </p>
                        </div>
                      </div>

                      {/* Event Meta */}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(event.start_time)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatTime(event.start_time)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatDuration(event.duration)}</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="mt-4">
                        <button 
                        onClick={() => window.open('https://apps.apple.com/us/app/convoo/id6746660683', '_blank')}
                        className="px-4 py-2 bg-[#B83280] text-white rounded-lg hover:bg-[#a02970] transition-colors text-sm font-medium">
                          Join Event
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};