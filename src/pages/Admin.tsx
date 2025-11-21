import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  LogOut, 
  Loader2,
  CheckCircle,
  XCircle,
  Ban,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
import AnalyticsCard from '@/components/admin/AnalyticsCard';

interface Appointment {
  id: string;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  appointment_date: string;
  appointment_time: string;
  service: string;
  status: string;
  notes?: string;
  created_at: string;
}

export default function Admin() {
  const { user, isAdmin, isLoading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/auth');
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      loadAppointments();
      
      // Set up realtime subscription
      const channel = supabase
        .channel('appointments-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'appointments'
          },
          () => {
            loadAppointments();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, isAdmin]);

  useEffect(() => {
    // Filter appointments based on status, search, and selected date
    let filtered = appointments;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(apt => apt.status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(apt =>
        apt.patient_name.toLowerCase().includes(query) ||
        apt.patient_email.toLowerCase().includes(query) ||
        apt.patient_phone.includes(query)
      );
    }

    if (selectedDate) {
      filtered = filtered.filter(apt => 
        isSameDay(new Date(apt.appointment_date), selectedDate)
      );
    }

    setFilteredAppointments(filtered);
  }, [appointments, statusFilter, searchQuery, selectedDate]);

  const loadAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error loading appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setIsLoading(false);
    }
  };

  const updateAppointmentStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      toast.success(`Appointment ${status} successfully`);
      loadAppointments();
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error('Failed to update appointment');
    }
  };

  const confirmAppointmentByDoctor = async (appointment: Appointment) => {
    try {
      const { data, error } = await supabase.functions.invoke('notify-patient-confirmation', {
        body: { appointment_id: appointment.id },
      });

      if (error) {
        console.error('Error from notify-patient-confirmation:', error);
        throw error;
      }

      // Optionally inspect data for warnings (e.g., webhook missing)
      if (data?.warning) {
        console.warn('notify-patient-confirmation warning:', data.warning);
      }

      toast.success('Appointment confirmed! WhatsApp message sent to patient');
      loadAppointments();
    } catch (error) {
      console.error('Error confirming appointment:', error);
      toast.error('Failed to confirm appointment');
    }
  };

  const deleteAppointment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this appointment?')) return;

    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Appointment deleted successfully');
      loadAppointments();
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast.error('Failed to delete appointment');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(apt => 
      isSameDay(new Date(apt.appointment_date), date)
    );
  };

  const getDaysInMonth = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500/20 text-green-600"><CheckCircle className="w-3 h-3 mr-1" />Confirmed</Badge>;
      case 'pending_doctor':
        return <Badge className="bg-yellow-500/20 text-yellow-600"><Clock className="w-3 h-3 mr-1" />Pending Doctor</Badge>;
      case 'pending_patient':
        return <Badge className="bg-blue-500/20 text-blue-600"><Clock className="w-3 h-3 mr-1" />Pending Patient</Badge>;
      case 'rejected_by_doctor':
        return <Badge className="bg-red-500/20 text-red-600"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      case 'cancelled_by_patient':
        return <Badge className="bg-orange-500/20 text-orange-600"><XCircle className="w-3 h-3 mr-1" />Patient Cancelled</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-600"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'blocked':
        return <Badge className="bg-red-500/20 text-red-600"><Ban className="w-3 h-3 mr-1" />Blocked</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-500/20 text-gray-600"><XCircle className="w-3 h-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => ['pending', 'pending_doctor', 'pending_patient'].includes(a.status)).length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    blocked: appointments.filter(a => a.status === 'blocked').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="border-b border-primary/20 bg-background/50 backdrop-blur-xl sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold bg-gradient-vibe bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">Welcome, {user.email}</p>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-6 bg-gradient-card backdrop-blur-xl border-primary/20">
              <div className="text-sm text-muted-foreground mb-1">Total</div>
              <div className="text-3xl font-bold text-foreground">{stats.total}</div>
            </Card>
            <Card className="p-6 bg-gradient-card backdrop-blur-xl border-primary/20">
              <div className="text-sm text-muted-foreground mb-1">Pending</div>
              <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
            </Card>
            <Card className="p-6 bg-gradient-card backdrop-blur-xl border-primary/20">
              <div className="text-sm text-muted-foreground mb-1">Confirmed</div>
              <div className="text-3xl font-bold text-green-600">{stats.confirmed}</div>
            </Card>
            <Card className="p-6 bg-gradient-card backdrop-blur-xl border-primary/20">
              <div className="text-sm text-muted-foreground mb-1">Blocked</div>
              <div className="text-3xl font-bold text-red-600">{stats.blocked}</div>
            </Card>
          </div>
          
          {/* Analytics Card */}
          <AnalyticsCard />
        </div>

        {/* Monthly Calendar View */}
        <Card className="p-6 mb-8 bg-gradient-card backdrop-blur-xl border-primary/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold bg-gradient-vibe bg-clip-text text-transparent">
              Monthly Calendar
            </h2>
            <div className="flex items-center gap-4">
              <Button onClick={goToPreviousMonth} variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-lg font-semibold min-w-[150px] text-center">
                {format(currentMonth, 'MMMM yyyy')}
              </span>
              <Button onClick={goToNextMonth} variant="outline" size="sm">
                <ChevronRight className="h-4 w-4" />
              </Button>
              {selectedDate && (
                <Button onClick={() => setSelectedDate(null)} variant="ghost" size="sm">
                  Clear Filter
                </Button>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-semibold text-sm p-2">
                {day}
              </div>
            ))}
            
            {getDaysInMonth().map(day => {
              const dayAppointments = getAppointmentsForDate(day);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isToday = isSameDay(day, new Date());
              
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`
                    min-h-[80px] p-2 rounded-lg border transition-all
                    ${isSelected ? 'bg-primary text-primary-foreground border-primary' : 'bg-card hover:bg-accent'}
                    ${isToday ? 'ring-2 ring-primary' : ''}
                  `}
                >
                  <div className="text-sm font-semibold mb-1">
                    {format(day, 'd')}
                  </div>
                  {dayAppointments.length > 0 && (
                    <div className="space-y-1">
                      {dayAppointments.slice(0, 2).map(apt => (
                        <div
                          key={apt.id}
                          className={`text-xs px-1 py-0.5 rounded truncate ${
                            apt.status === 'confirmed' ? 'bg-green-500/20 text-green-300' :
                            apt.status === 'pending_doctor' ? 'bg-yellow-500/20 text-yellow-300' :
                            apt.status === 'pending_patient' ? 'bg-blue-500/20 text-blue-300' :
                            apt.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                            apt.status === 'blocked' ? 'bg-red-500/20 text-red-300' :
                            'bg-gray-500/20 text-gray-300'
                          }`}
                        >
                          {apt.appointment_time}
                        </div>
                      ))}
                      {dayAppointments.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{dayAppointments.length - 2} more
                        </div>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          {selectedDate && (
            <div className="mt-4 text-sm text-muted-foreground">
              Showing appointments for: <strong>{format(selectedDate, 'PPP')}</strong>
            </div>
          )}
        </Card>

        {/* Filters */}
        <Card className="p-6 mb-6 bg-gradient-card backdrop-blur-xl border-primary/20">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-background/50 border-primary/20"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 bg-background/50 border-primary/20">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending_doctor">Pending Doctor</SelectItem>
                <SelectItem value="pending_patient">Pending Patient</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="rejected_by_doctor">Rejected by Doctor</SelectItem>
                <SelectItem value="cancelled_by_patient">Cancelled by Patient</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <Card className="p-12 text-center bg-gradient-card backdrop-blur-xl border-primary/20">
              <p className="text-muted-foreground">No appointments found</p>
            </Card>
          ) : (
            filteredAppointments.map((appointment) => (
              <Card key={appointment.id} className="p-6 bg-gradient-card backdrop-blur-xl border-primary/20 hover:border-primary/40 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      {getStatusBadge(appointment.status)}
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(appointment.created_at), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-primary" />
                        <span className="font-medium">{appointment.patient_name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">{appointment.patient_email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">{appointment.patient_phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarIcon className="w-4 h-4 text-primary" />
                        <span className="font-medium">
                          {format(new Date(appointment.appointment_date), 'EEEE, MMM dd, yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="font-medium">{appointment.appointment_time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Service:</span>
                        <span className="font-medium">{appointment.service}</span>
                      </div>
                    </div>

                    {appointment.notes && (
                      <div className="text-sm text-muted-foreground bg-background/50 p-3 rounded-lg">
                        <strong>Notes:</strong> {appointment.notes}
                      </div>
                    )}
                  </div>

                  <div className="flex lg:flex-col gap-2">
                    {appointment.status === 'pending_doctor' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => confirmAppointmentByDoctor(appointment)}
                          className="flex-1 lg:flex-none"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Confirm & Notify Patient
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateAppointmentStatus(appointment.id, 'rejected_by_doctor')}
                          className="flex-1 lg:flex-none"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    {appointment.status === 'pending_patient' && (
                      <Badge className="bg-blue-500/20 text-blue-600 px-3 py-2">
                        <Clock className="w-4 h-4 mr-1" />
                        Waiting for patient response via WhatsApp
                      </Badge>
                    )}
                    {!['cancelled', 'rejected_by_doctor', 'cancelled_by_patient'].includes(appointment.status) && appointment.status !== 'pending_doctor' && appointment.status !== 'pending_patient' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                        className="flex-1 lg:flex-none"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteAppointment(appointment.id)}
                      className="flex-1 lg:flex-none"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}