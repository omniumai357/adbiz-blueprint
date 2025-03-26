import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import type { TourAnalyticsData } from "@/hooks/tour/analytics/types";

export const TourAnalyticsDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<TourAnalyticsData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('tourAnalytics');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setAnalyticsData(parsedData);
      } else {
        setAnalyticsData([]);
      }
    } catch (error) {
      console.error('Failed to load analytics data:', error);
      toast({
        title: "Error Loading Analytics",
        description: "Could not load tour analytics data.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const getCompletionRateData = () => {
    const tourStarts = analyticsData.filter(item => item.event === 'tour_started').length;
    const tourCompletions = analyticsData.filter(item => item.event === 'tour_completed').length;
    const tourAbandons = analyticsData.filter(item => item.event === 'tour_abandoned').length;
    
    return [
      { name: 'Completed', value: tourCompletions },
      { name: 'Abandoned', value: tourAbandons },
      { name: 'In Progress', value: Math.max(0, tourStarts - tourCompletions - tourAbandons) }
    ];
  };

  const getStepViewData = () => {
    const stepViews = analyticsData.filter(item => item.event === 'step_viewed');
    const stepCounts: Record<string, number> = {};

    stepViews.forEach(item => {
      if (item.stepId) {
        stepCounts[item.stepId] = (stepCounts[item.stepId] || 0) + 1;
      }
    });

    return Object.entries(stepCounts).map(([id, count]) => ({
      name: id,
      views: count
    }));
  };

  const getDropOffData = () => {
    const tourPaths = [...new Set(analyticsData
      .filter(item => item.event === 'tour_started')
      .map(item => item.pathId))];
    
    const dropOffByStep: Record<string, Record<number, number>> = {};
    
    tourPaths.forEach(pathId => {
      dropOffByStep[pathId] = {};
      
      const abandonEvents = analyticsData
        .filter(item => 
          item.event === 'tour_abandoned' && 
          item.pathId === pathId && 
          typeof item.stepIndex === 'number'
        );
      
      abandonEvents.forEach(item => {
        if (typeof item.stepIndex === 'number') {
          dropOffByStep[pathId][item.stepIndex] = 
            (dropOffByStep[pathId][item.stepIndex] || 0) + 1;
        }
      });
    });
    
    const result: { step: number; [key: string]: number | string }[] = [];
    
    tourPaths.forEach(pathId => {
      const steps = Object.keys(dropOffByStep[pathId]).map(Number);
      if (steps.length > 0) {
        const maxStep = Math.max(...steps);
        
        for (let i = 0; i <= maxStep; i++) {
          if (!result[i]) {
            result[i] = { step: i };
          }
          
          result[i][pathId] = dropOffByStep[pathId][i] || 0;
        }
      }
    });
    
    return result;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tour Analytics</CardTitle>
          <CardDescription>Loading analytics data...</CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  if (analyticsData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tour Analytics</CardTitle>
          <CardDescription>No analytics data available yet</CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <p className="text-muted-foreground">
            Start using tours to collect analytics data.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tour Analytics</CardTitle>
        <CardDescription>
          Insights into how users are interacting with tours
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="completion">
          <TabsList className="mb-4">
            <TabsTrigger value="completion">Completion Rates</TabsTrigger>
            <TabsTrigger value="steps">Step Views</TabsTrigger>
            <TabsTrigger value="dropoff">Drop-off Points</TabsTrigger>
          </TabsList>
          
          <TabsContent value="completion" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getCompletionRateData()}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getCompletionRateData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="steps" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={getStepViewData()}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="views" fill="#0088FE" name="Step Views" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="dropoff" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={getDropOffData()}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="step" />
                <YAxis />
                <Tooltip />
                <Legend />
                {[...new Set(analyticsData
                  .filter(item => item.event === 'tour_started')
                  .map(item => item.pathId))].map((pathId, index) => (
                  <Bar key={pathId} dataKey={pathId} fill={COLORS[index % COLORS.length]} name={pathId} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
