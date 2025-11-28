import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TrendingUp, Users, Eye, BarChart3 } from 'lucide-react';
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
      <Card className="bg-gradient-card backdrop-blur-xl border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl bg-gradient-vibe bg-clip-text text-transparent flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Site Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="space-y-3">
              <div className="h-20 bg-primary/10 rounded-lg"></div>
              <div className="h-20 bg-primary/10 rounded-lg"></div>
              <div className="h-20 bg-primary/10 rounded-lg"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card backdrop-blur-xl border-primary/20">
      <CardHeader>
        <CardTitle className="text-xl bg-gradient-vibe bg-clip-text text-transparent flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Site Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Today */}
          <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              Today
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-primary/20">
                    <TrendingUp className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-xs text-muted-foreground">Visits</span>
                </div>
                <p className="text-2xl font-bold">{analytics.today.visits}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-green-500/20">
                    <Users className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-xs text-muted-foreground">Unique</span>
                </div>
                <p className="text-2xl font-bold text-green-600">{analytics.today.unique}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-blue-500/20">
                    <Eye className="w-3 h-3 text-blue-600" />
                  </div>
                  <span className="text-xs text-muted-foreground">Views</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">{analytics.today.pageViews}</p>
              </div>
            </div>
          </div>

          {/* Last 7 Days */}
          <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
            <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              Last 7 Days
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Visits</span>
                <p className="text-xl font-bold">{analytics.week.visits}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Unique</span>
                <p className="text-xl font-bold text-green-600">{analytics.week.unique}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Views</span>
                <p className="text-xl font-bold text-blue-600">{analytics.week.pageViews}</p>
              </div>
            </div>
          </div>

          {/* Last 30 Days */}
          <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
            <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              Last 30 Days
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Visits</span>
                <p className="text-xl font-bold">{analytics.month.visits}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Unique</span>
                <p className="text-xl font-bold text-green-600">{analytics.month.unique}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Views</span>
                <p className="text-xl font-bold text-blue-600">{analytics.month.pageViews}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
