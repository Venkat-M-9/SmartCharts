
"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { BarChart2, LineChart, PieChart as PieChartIcon, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart as RechartsPieChart, Pie, LineChart as RechartsLineChart, Line } from "recharts";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface DataItem {
  name: string;
  value: number;
}

interface SavedChart {
  id: number;
  title: string;
  data: DataItem[];
  chartType: "pie" | "bar" | "line";
  useMultiColor: boolean;
  primaryColor: string;
  savedAt: string;
}

const CHART_ICONS = {
  bar: BarChart2,
  line: LineChart,
  pie: PieChartIcon,
};

const COLORS = ["#16a085", "#8e44ad", "#f39c12", "#2980b9", "#c0392b"];

export default function HistoryPage() {
  const [savedCharts, setSavedCharts] = useState<SavedChart[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
    try {
      const chartsFromStorage = JSON.parse(localStorage.getItem("savedCharts") || "[]");
      setSavedCharts(chartsFromStorage);
    } catch (error) {
      console.error("Failed to load charts from storage:", error);
      toast({
        title: "Error",
        description: "Could not load saved charts.",
        variant: "destructive",
      });
    }
  }, [toast]);
  
  const deleteChart = (id: number) => {
    try {
        const updatedCharts = savedCharts.filter(chart => chart.id !== id);
        localStorage.setItem("savedCharts", JSON.stringify(updatedCharts));
        setSavedCharts(updatedCharts);
        toast({
            title: "Chart Deleted",
            description: "The chart has been removed from your history.",
        });
    } catch (error) {
        console.error("Failed to delete chart:", error);
        toast({
            title: "Error",
            description: "Could not delete the chart.",
            variant: "destructive",
        });
    }
  };


  if (!isMounted) {
    return null; // Avoid hydration mismatch
  }

  return (
    <>
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto grid gap-8">
          <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">History</h1>
              <p className="mt-2 text-lg md:text-xl text-muted-foreground">View your saved charts.</p>
          </div>
          
          {savedCharts.length === 0 ? (
             <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground bg-muted/20 rounded-lg border-2 border-dashed">
                        <p>No saved charts yet.</p>
                    </div>
                </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {savedCharts.map((chart) => {
                    const ChartIcon = CHART_ICONS[chart.chartType];
                    return (
                        <Card key={chart.id} className="flex flex-col">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <ChartIcon className="h-5 w-5" />
                                            {chart.title}
                                        </CardTitle>
                                        <CardDescription>
                                            Saved {formatDistanceToNow(new Date(chart.savedAt), { addSuffix: true })}
                                        </CardDescription>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteChart(chart.id)}>
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">Delete chart</span>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 -mt-4">
                               <div style={{ "--primary": chart.primaryColor } as React.CSSProperties}>
                                 <ResponsiveContainer width="100%" height={200}>
                                        {chart.chartType === 'pie' ? (
                                            <RechartsPieChart>
                                                <Pie dataKey="value" nameKey="name" data={chart.data} cx="50%" cy="50%" outerRadius={80} fill="hsl(var(--primary))" labelLine={false}>
                                                    {chart.data.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip cursor={{fill: 'hsla(var(--muted))'}} contentStyle={{backgroundColor: 'hsl(var(--background))'}}/>
                                            </RechartsPieChart>
                                        ) : chart.chartType === 'bar' ? (
                                            <BarChart data={chart.data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} tickLine={false} axisLine={false} />
                                                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                                                <Tooltip cursor={{fill: 'hsla(var(--muted))'}} contentStyle={{backgroundColor: 'hsl(var(--background))'}}/>
                                                <Bar dataKey="value" fill="hsl(var(--primary))">
                                                    {chart.useMultiColor && chart.data.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        ) : (
                                            <RechartsLineChart data={chart.data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} tickLine={false} axisLine={false} />
                                                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                                                <Tooltip contentStyle={{backgroundColor: 'hsl(var(--background))'}} />
                                                <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                                            </RechartsLineChart>
                                        )}
                                    </ResponsiveContainer>
                               </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
          )}
        </div>
      </main>
      <Toaster />
    </>
  );
}

    