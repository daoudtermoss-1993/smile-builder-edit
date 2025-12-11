import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Ban, 
  TrendingUp, 
  Users, 
  Activity,
  BarChart3,
  PieChart
} from 'lucide-react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

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

interface AppointmentStatsProps {
  appointments: Appointment[];
}

export function AppointmentStats({ appointments }: AppointmentStatsProps) {
  const stats = useMemo(() => {
    const today = new Date();
    const weekStart = startOfWeek(today);
    const weekEnd = endOfWeek(today);
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);

    // This week's appointments
    const thisWeekAppointments = appointments.filter(apt => {
      const aptDate = parseISO(apt.appointment_date);
      return isWithinInterval(aptDate, { start: weekStart, end: weekEnd });
    });

    // This month's appointments
    const thisMonthAppointments = appointments.filter(apt => {
      const aptDate = parseISO(apt.appointment_date);
      return isWithinInterval(aptDate, { start: monthStart, end: monthEnd });
    });

    // Today's appointments
    const todayAppointments = appointments.filter(apt => 
      apt.appointment_date === format(today, 'yyyy-MM-dd')
    );

    // Status counts
    const statusCounts = {
      total: appointments.length,
      pending: appointments.filter(a => a.status === 'pending').length,
      confirmed: appointments.filter(a => a.status === 'confirmed').length,
      cancelled: appointments.filter(a => a.status === 'cancelled').length,
      blocked: appointments.filter(a => a.status === 'blocked').length,
    };

    // Service distribution
    const serviceDistribution = appointments.reduce((acc, apt) => {
      acc[apt.service] = (acc[apt.service] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Conversion rate (confirmed / total excluding blocked)
    const totalNonBlocked = statusCounts.total - statusCounts.blocked;
    const conversionRate = totalNonBlocked > 0 
      ? Math.round((statusCounts.confirmed / totalNonBlocked) * 100) 
      : 0;

    // Pending today that need attention
    const pendingToday = todayAppointments.filter(apt => apt.status === 'pending').length;

    // New bookings this week
    const newThisWeek = thisWeekAppointments.length;

    return {
      statusCounts,
      thisWeek: newThisWeek,
      thisMonth: thisMonthAppointments.length,
      today: todayAppointments.length,
      pendingToday,
      conversionRate,
      serviceDistribution,
      topService: Object.entries(serviceDistribution).sort((a, b) => b[1] - a[1])[0],
    };
  }, [appointments]);

  const serviceLabels: Record<string, string> = {
    'implants': 'Implants Dentaires',
    'cosmetic': 'Dentisterie Esthétique',
    'orthodontics': 'Orthodontie',
    'root-canal': 'Traitement de Canal',
    'cleaning': 'Nettoyage & Check-up',
    'emergency': 'Soins d\'Urgence',
  };

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20 hover:border-primary/40 transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <TrendingUp className="w-5 h-5 text-primary/40" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Total Rendez-vous</p>
              <p className="text-3xl font-bold">{stats.statusCounts.total}</p>
            </div>
          </CardContent>
        </Card>

        {/* Pending (Need Action) */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-yellow-500/10 via-yellow-500/5 to-background border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-yellow-500/10 group-hover:bg-yellow-500/20 transition-colors">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              {stats.statusCounts.pending > 0 && (
                <span className="px-2 py-1 text-xs font-bold bg-yellow-500 text-white rounded-full animate-pulse">
                  Action requise
                </span>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">En Attente de Confirmation</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.statusCounts.pending}</p>
            </div>
          </CardContent>
        </Card>

        {/* Confirmed */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-green-500/10 via-green-500/5 to-background border-green-500/20 hover:border-green-500/40 transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <Users className="w-5 h-5 text-green-500/40" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Confirmés</p>
              <p className="text-3xl font-bold text-green-600">{stats.statusCounts.confirmed}</p>
            </div>
          </CardContent>
        </Card>

        {/* Cancelled/Blocked */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-red-500/10 via-red-500/5 to-background border-red-500/20 hover:border-red-500/40 transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <Ban className="w-5 h-5 text-red-500/40" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Annulés / Bloqués</p>
              <p className="text-3xl font-bold text-red-600">
                {stats.statusCounts.cancelled + stats.statusCounts.blocked}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* This Week */}
        <Card className="bg-gradient-card backdrop-blur-xl border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Cette Semaine
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.thisWeek} rendez-vous</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.pendingToday > 0 && (
                <span className="text-yellow-600 font-medium">
                  {stats.pendingToday} en attente aujourd'hui
                </span>
              )}
            </p>
          </CardContent>
        </Card>

        {/* This Month */}
        <Card className="bg-gradient-card backdrop-blur-xl border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Ce Mois
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.thisMonth} rendez-vous</div>
            <p className="text-xs text-muted-foreground mt-1">
              Taux de confirmation: <span className="font-medium text-green-600">{stats.conversionRate}%</span>
            </p>
          </CardContent>
        </Card>

        {/* Top Service */}
        <Card className="bg-gradient-card backdrop-blur-xl border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <PieChart className="w-4 h-4" />
              Service le Plus Demandé
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.topService ? (
              <>
                <div className="text-lg font-bold truncate">
                  {serviceLabels[stats.topService[0]] || stats.topService[0]}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="font-medium text-primary">{stats.topService[1]}</span> demandes
                </p>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">Aucune donnée</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Service Distribution */}
      <Card className="bg-gradient-card backdrop-blur-xl border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Répartition par Service
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(stats.serviceDistribution)
              .sort((a, b) => b[1] - a[1])
              .map(([service, count]) => {
                const percentage = Math.round((count / stats.statusCounts.total) * 100);
                return (
                  <div key={service} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{serviceLabels[service] || service}</span>
                      <span className="text-muted-foreground">{count} ({percentage}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-primary/10 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            {Object.keys(stats.serviceDistribution).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Aucun rendez-vous enregistré
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
