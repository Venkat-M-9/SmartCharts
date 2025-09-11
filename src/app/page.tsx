"use client";

import { useRef, useState, useCallback } from "react";
import { toPng } from "html-to-image";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
  Label as RechartsLabel,
  LabelList,
} from "recharts";
import { Download, Copy, TrendingUp, BarChart2, PieChart as PieChartIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Separator } from "@/components/ui/separator";

interface DataItem {
  name: string;
  value: number;
}

const COLORS = ["#16a085", "#8e44ad", "#f39c12", "#2980b9", "#c0392b"];

const sampleData = [
  { name: "Laptops", value: 4000 },
  { name: "Monitors", value: 3000 },
  { name: "Keyboards", value: 2000 },
  { name: "Mice", value: 2780 },
  { name: "Webcams", value: 1890 },
  { name: "Printers", value: 2390 },
];

export default function Home() {
  const [fileData, setFileData] = useState<string>("");
  const [parsedData, setParsedData] = useState<DataItem[]>([]);
  const [chartType, setChartType] = useState<"pie" | "bar" | "line">("bar");
  const chartRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setFileData(event.target?.result as string);
    };
    reader.readAsText(file);
  };

  const parseData = () => {
    if (!fileData) {
      toast({
        title: "No Data",
        description: "Please upload a file or load sample data first.",
        variant: "destructive",
      });
      return;
    }
    let data: DataItem[] = [];
    try {
      data = JSON.parse(fileData);
    } catch (error) {
      try {
        const lines = fileData.split("\n").filter(line => line.trim() !== "");
        data = lines.map((line) => {
          const [name, value] = line.split(",");
          return { name, value: parseFloat(value) };
        });
      } catch (csvError) {
        toast({
          title: "Parsing Error",
          description: "Please ensure data is valid JSON or CSV (name,value).",
          variant: "destructive",
        });
        return;
      }
    }

    const validData = data.filter(item => typeof item.name === 'string' && item.name.trim() !== '' && typeof item.value === 'number' && !isNaN(item.value) && item.value !== null);
    const sortedData = validData.sort((a, b) => b.value - a.value);
    setParsedData(sortedData);
    toast({
        title: "Success",
        description: "Data parsed and visualized successfully."
    })
  };

  const loadSampleData = () => {
    const sortedSampleData = [...sampleData].sort((a,b) => b.value - a.value);
    setFileData(JSON.stringify(sampleData, null, 2));
    setParsedData(sortedSampleData);
     toast({
        title: "Sample Data Loaded",
        description: "The sample data has been loaded and visualized."
    })
  };

  const handleDownload = useCallback(() => {
    if (chartRef.current === null) {
      return;
    }

    toPng(chartRef.current, { cacheBust: true, backgroundColor: 'white' })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `${chartType}-chart.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Error",
          description: "Could not download chart.",
          variant: "destructive",
        });
      });
  }, [chartRef, chartType, toast]);

  const handleCopy = useCallback(() => {
    if (chartRef.current === null) {
      return;
    }

    toPng(chartRef.current, { cacheBust: true, backgroundColor: 'white' })
      .then(async (dataUrl) => {
        try {
          const blob = await (await fetch(dataUrl)).blob();
          await navigator.clipboard.write([
            new ClipboardItem({
              [blob.type]: blob,
            }),
          ]);
          toast({
            title: "Success",
            description: "Chart copied to clipboard.",
          });
        } catch (err) {
            console.error(err)
            toast({
                title: "Error",
                description: "Could not copy chart to clipboard.",
                variant: "destructive",
            });
        }
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Error",
          description: "Could not copy chart.",
          variant: "destructive",
        });
      });
  }, [chartRef, toast]);

  const renderChart = () => {
    if (!parsedData.length) {
      return <div className="flex items-center justify-center h-[400px] text-muted-foreground">No data to display. Please upload and parse your data.</div>;
    }

    const chartComponents = {
        pie: PieChartIcon,
        bar: BarChart2,
        line: TrendingUp,
    }
    const ChartIcon = chartComponents[chartType];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ChartIcon className="h-6 w-6" />
                    Product Sales Distribution
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div ref={chartRef} className="bg-background p-4 rounded-lg">
                    <ResponsiveContainer width="100%" height={400}>
                        {chartType === 'pie' ? (
                            <PieChart>
                                <defs>
                                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <Pie dataKey="value" nameKey="name" data={parsedData} cx="50%" cy="50%" outerRadius={150} fill="#8884d8" labelLine={false} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                                    {parsedData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        ) : chartType === 'bar' ? (
                            <BarChart data={parsedData}>
                                <defs>
                                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name">
                                    <RechartsLabel value="Products" position="insideBottom" offset={-5} />
                                </XAxis>
                                <YAxis>
                                    <RechartsLabel value="Units Sold" angle={-90} position="insideLeft" />
                                </YAxis>
                                <Tooltip cursor={{fill: 'hsla(var(--muted))'}} />
                                <Legend />
                                <Bar dataKey="value" fill="url(#barGradient)">
                                    <LabelList dataKey="value" position="top" />
                                </Bar>
                            </BarChart>
                        ) : (
                            <LineChart data={parsedData}>
                                 <defs>
                                    <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name">
                                     <RechartsLabel value="Products" position="insideBottom" offset={-5} />
                                </XAxis>
                                <YAxis>
                                    <RechartsLabel value="Units Sold" angle={-90} position="insideLeft" />
                                </YAxis>
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="value" stroke="hsl(var(--accent))" fill="url(#lineGradient)" />
                            </LineChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight">Chartastic</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">Visualize your data with intuitive and beautiful charts.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>1. Load Your Data</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="file">Upload Data (JSON or CSV):</Label>
                          <Input id="file" type="file" accept=".json, .csv" onChange={handleFileChange} />
                        </div>
                        <div className="relative">
                            <Separator className="my-2" />
                            <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-card px-2 text-sm text-muted-foreground">OR</span>
                        </div>
                        <Button onClick={loadSampleData} variant="secondary">Load Sample Data</Button>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1">
                            <AccordionTrigger>View Sample Data Structure</AccordionTrigger>
                            <AccordionContent>
                                <p className="text-sm text-muted-foreground mb-2">
                                Your data should be an array of objects with "name" and "value" keys (JSON) or a CSV with name,value columns.
                                </p>
                                <pre className="bg-muted p-2 rounded-md text-sm overflow-x-auto">
                                <code>{JSON.stringify(sampleData, null, 2)}</code>
                                </pre>
                            </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>2. Customize & Visualize</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label>Select Chart Type:</Label>
                            <Select value={chartType} onValueChange={(value) => setChartType(value as "pie" | "bar" | "line")}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a chart type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pie">Pie Chart</SelectItem>
                                <SelectItem value="bar">Bar Chart</SelectItem>
                                <SelectItem value="line">Line Chart</SelectItem>
                            </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={parseData} className="w-full">Parse and Visualize Data</Button>
                    </CardContent>
                </Card>
            </div>

          <Separator />
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">3. Export Your Chart</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleDownload} disabled={!parsedData.length}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" size="sm" onClick={handleCopy} disabled={!parsedData.length}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
              </div>
            </div>
            {renderChart()}
          </div>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}
