import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
  ChevronRight,
  Trash2,
  Calendar,
  Activity,
  Users as UsersIcon,
  TrendingUp
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
import AnalyticsCard from '@/components/admin/AnalyticsCard';
import { AdminBookingDialog } from '@/components/admin/AdminBookingDialog';
import { MedicalKnowledge } from '@/components/admin/MedicalKnowledge';

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
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

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
      setCancelDialogOpen(false);
      setSelectedAppointmentId(null);
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error('Failed to update appointment');
    }
  };

  const handleCancelClick = (id: string) => {
    setSelectedAppointmentId(id);
    setCancelDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setSelectedAppointmentId(id);
    setDeleteDialogOpen(true);
  };

  const confirmCancel = () => {
    if (selectedAppointmentId) {
      updateAppointmentStatus(selectedAppointmentId, 'cancelled');
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

  const confirmDelete = async () => {
    if (!selectedAppointmentId) return;

    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', selectedAppointmentId);

      if (error) throw error;
      
      toast.success('Appointment deleted successfully');
      loadAppointments();
      setDeleteDialogOpen(false);
      setSelectedAppointmentId(null);
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

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20 hover:border-primary/40 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <TrendingUp className="w-5 h-5 text-primary/40" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Appointments</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-yellow-500/10 via-yellow-500/5 to-background border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-yellow-500/10 group-hover:bg-yellow-500/20 transition-colors">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <Activity className="w-5 h-5 text-yellow-500/40" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-green-500/10 via-green-500/5 to-background border-green-500/20 hover:border-green-500/40 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <UsersIcon className="w-5 h-5 text-green-500/40" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Confirmed</p>
                <p className="text-3xl font-bold text-green-600">{stats.confirmed}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-red-500/10 via-red-500/5 to-background border-red-500/20 hover:border-red-500/40 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
                  <Ban className="w-6 h-6 text-red-600" />
                </div>
                <XCircle className="w-5 h-5 text-red-500/40" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Blocked</p>
                <p className="text-3xl font-bold text-red-600">{stats.blocked}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Card */}
          <AnalyticsCard />

          {/* Medical Knowledge RAG Section */}
          <MedicalKnowledge />

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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <AdminBookingDialog onSuccess={loadAppointments} />
          </div>
        </Card>

        {/* Appointments Table */}
        <Card className="bg-gradient-card backdrop-blur-xl border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl bg-gradient-vibe bg-clip-text text-transparent">
              Appointments Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No appointments found</p>
              </div>
            ) : (
              <div className="rounded-lg border border-primary/20 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-primary/5 hover:bg-primary/5">
                      <TableHead className="font-semibold">Patient</TableHead>
                      <TableHead className="font-semibold">Contact</TableHead>
                      <TableHead className="font-semibold">Appointment</TableHead>
                      <TableHead className="font-semibold">Service</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAppointments.map((appointment) => (
                      <TableRow 
                        key={appointment.id} 
                        className="hover:bg-primary/5 transition-colors"
                      >
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-primary" />
                              <span className="font-medium">{appointment.patient_name}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Created: {format(new Date(appointment.created_at), 'MMM dd, yyyy')}
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              <Mail className="w-3 h-3 text-muted-foreground" />
                              <span className="text-muted-foreground">{appointment.patient_email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-3 h-3 text-muted-foreground" />
                              <span className="text-muted-foreground">{appointment.patient_phone}</span>
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <CalendarIcon className="w-4 h-4 text-primary" />
                              <span className="font-medium">
                                {format(new Date(appointment.appointment_date), 'MMM dd, yyyy')}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span className="text-muted-foreground">{appointment.appointment_time}</span>
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <span className="text-sm font-medium">{appointment.service}</span>
                          {appointment.notes && (
                            <p className="text-xs text-muted-foreground mt-1 max-w-[200px] truncate">
                              {appointment.notes}
                            </p>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          {getStatusBadge(appointment.status)}
                        </TableCell>
                        
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {appointment.status === 'pending' && (
                              <>
                                <Button
                                  onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 h-8"
                                >
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Confirm
                                </Button>
                                <Button
                                  onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                                  size="sm"
                                  variant="destructive"
                                  className="h-8"
                                >
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                            {appointment.status === 'confirmed' && (
                              <Button
                                onClick={() => handleCancelClick(appointment.id)}
                                size="sm"
                                variant="outline"
                                className="h-8"
                              >
                                <Ban className="w-3 h-3 mr-1" />
                                Cancel
                              </Button>
                            )}
                            <Button
                              onClick={() => handleDeleteClick(appointment.id)}
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:text-red-700 hover:bg-red-100 h-8"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cancel Confirmation Dialog */}
        <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel this appointment? This action cannot be undone.
                The patient will need to book a new appointment.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>No, Keep It</AlertDialogCancel>
              <AlertDialogAction onClick={confirmCancel} className="bg-red-600 hover:bg-red-700">
                Yes, Cancel Appointment
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Appointment</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to permanently delete this appointment? This action cannot be undone.
                All appointment data will be lost forever.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>No, Keep It</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                Yes, Delete Permanently
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
}