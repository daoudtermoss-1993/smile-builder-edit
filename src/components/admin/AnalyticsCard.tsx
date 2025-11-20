import { Card } from '@/components/ui/card';
import { TrendingUp, Users, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays } from 'date-fns';

interface AnalyticsData {
  today: {
    visits: number;
    unique: number;
    pageViews: number;
  };
  week: {
    visits: number;
    unique: number;
    pageViews: number;
  };
  month: {
    visits: number;
    unique: number;
    pageViews: number;
  };
}

export default function AnalyticsCard() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    today: { visits: 0, unique: 0, pageViews: 0 },
    week: { visits: 0, unique: 0, pageViews: 0 },
    month: { visits: 0, unique: 0, pageViews: 0 },
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const weekAgo = format(subDays(new Date(), 7), 'yyyy-MM-dd');
      const monthAgo = format(subDays(new Date(), 30), 'yyyy-MM-dd');

      // Get today's data
      const { data: todayData } = await supabase
        .from('site_analytics')
        .select('*')
        .eq('visit_date', today)
        .single();

      // Get week's data
      const { data: weekData } = await supabase
        .from('site_analytics')
        .select('*')
        .gte('visit_date', weekAgo);

      // Get month's data
      const { data: monthData } = await supabase
        .from('site_analytics')
        .select('*')
        .gte('visit_date', monthAgo);

      setAnalytics({
        today: {
          visits: todayData?.visit_count || 0,
          unique: todayData?.unique_visitors || 0,
          pageViews: todayData?.page_views || 0,
        },
        week: {
          visits: weekData?.reduce((sum, d) => sum + d.visit_count, 0) || 0,
          unique: weekData?.reduce((sum, d) => sum + d.unique_visitors, 0) || 0,
          pageViews: weekData?.reduce((sum, d) => sum + d.page_views, 0) || 0,
        },
        month: {
          visits: monthData?.reduce((sum, d) => sum + d.visit_count, 0) || 0,
          unique: monthData?.reduce((sum, d) => sum + d.unique_visitors, 0) || 0,
          pageViews: monthData?.reduce((sum, d) => sum + d.page_views, 0) || 0,
        },
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6 bg-gradient-card backdrop-blur-xl border-primary/20">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-primary/10 rounded w-1/3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-primary/10 rounded"></div>
            <div className="h-4 bg-primary/10 rounded w-2/3"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-card backdrop-blur-xl border-primary/20">
      <h3 className="text-xl font-bold mb-6 bg-gradient-vibe bg-clip-text text-transparent">
        Site Analytics
      </h3>
      
      <div className="space-y-6">
        {/* Today */}
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground mb-3">Today</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground">Visits</span>
              </div>
              <p className="text-2xl font-bold">{analytics.today.visits}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-green-500" />
                <span className="text-xs text-muted-foreground">Unique</span>
              </div>
              <p className="text-2xl font-bold text-green-500">{analytics.today.unique}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-500" />
                <span className="text-xs text-muted-foreground">Views</span>
              </div>
              <p className="text-2xl font-bold text-blue-500">{analytics.today.pageViews}</p>
            </div>
          </div>
        </div>

        {/* Last 7 Days */}
        <div className="border-t border-primary/10 pt-4">
          <h4 className="text-sm font-semibold text-muted-foreground mb-3">Last 7 Days</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Visits</span>
              <p className="text-xl font-bold">{analytics.week.visits}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Unique</span>
              <p className="text-xl font-bold text-green-500">{analytics.week.unique}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Views</span>
              <p className="text-xl font-bold text-blue-500">{analytics.week.pageViews}</p>
            </div>
          </div>
        </div>

        {/* Last 30 Days */}
        <div className="border-t border-primary/10 pt-4">
          <h4 className="text-sm font-semibold text-muted-foreground mb-3">Last 30 Days</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Visits</span>
              <p className="text-xl font-bold">{analytics.month.visits}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Unique</span>
              <p className="text-xl font-bold text-green-500">{analytics.month.unique}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Views</span>
              <p className="text-xl font-bold text-blue-500">{analytics.month.pageViews}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
