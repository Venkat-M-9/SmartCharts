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
import { Download, Copy, TrendingUp, BarChart2, PieChart as PieChartIcon, FileUp, TestTube2 } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/toaster";

interface DataItem {
  name: string;
  value: number;
}

const COLORS = ["#16a085", "#8e44ad", "#f39c12", "#2980b9", "#c0392b"];
const COLOR_THEMES = {
    '#16a085': '166 71% 36%',
    '#8e44ad': '271 47% 41%',
    '#f39c12': '36 91% 51%',
    '#2980b9': '205 65% 44%',
    '#c0392b': '5 61% 48%'
};

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
      parseData(event.target?.result as string);
    };
    reader.readAsText(file);
  };

  const parseData = (dataToParse = fileData) => {
    if (!dataToParse) {
      toast({
        title: "No Data",
        description: "Please upload a file or load sample data first.",
        variant: "destructive",
      });
      return;
    }
    let data: DataItem[] = [];
    try {
      data = JSON.parse(dataToParse);
    } catch (error) {
      try {
        const lines = dataToParse.split("\n").filter(line => line.trim() !== "");
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
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const applyColorTheme = (color: keyof typeof COLOR_THEMES) => {
    const hsl = COLOR_THEMES[color];
    document.documentElement.style.setProperty('--primary', hsl);
    document.documentElement.style.setProperty('--ring', hsl);
  };

  const renderChart = () => {
    if (!parsedData.length) {
      return (
        <div className="flex flex-col items-center justify-center h-[450px] text-muted-foreground bg-muted/20 rounded-lg border-2 border-dashed">
            <p className="mb-4">Your chart will appear here.</p>
            <Button onClick={() => fileInputRef.current?.click()}>
                <FileUp className="mr-2 h-4 w-4" />
                Upload File
            </Button>
        </div>
      );
    }

    const chartComponents = {
        pie: PieChartIcon,
        bar: BarChart2,
        line: TrendingUp,
    }
    const ChartIcon = chartComponents[chartType];

    return (
        <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                    <ChartIcon className="h-6 w-6" />
                    <CardTitle>Product Sales Distribution</CardTitle>
                </div>
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
            </CardHeader>
            <CardContent>
                <div ref={chartRef} className="bg-background p-4 rounded-lg">
                    <ResponsiveContainer width="100%" height={400}>
                        {chartType === 'pie' ? (
                            <PieChart>
                                <Pie dataKey="value" nameKey="name" data={parsedData} cx="50%" cy="50%" outerRadius={150} fill="#8884d8" labelLine={false} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                                    {parsedData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        ) : chartType === 'bar' ? (
                            <BarChart data={parsedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                <defs>
                                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0}>
                                    <RechartsLabel value="Products" position="insideBottom" offset={-15} />
                                </XAxis>
                                <YAxis>
                                    <RechartsLabel value="Units Sold" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                                </YAxis>
                                <Tooltip cursor={{fill: 'hsla(var(--muted))'}} contentStyle={{backgroundColor: 'hsl(var(--background))'}}/>
                                <Legend />
                                <Bar dataKey="value" fill="url(#barGradient)">
                                    <LabelList dataKey="value" position="top" />
                                </Bar>
                            </BarChart>
                        ) : (
                            <LineChart data={parsedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                 <defs>
                                    <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0}>
                                     <RechartsLabel value="Products" position="insideBottom" offset={-15} />
                                </XAxis>
                                <YAxis>
                                    <RechartsLabel value="Units Sold" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                                </YAxis>
                                <Tooltip contentStyle={{backgroundColor: 'hsl(var(--background))'}} />
                                <Legend />
                                <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#lineGradient)" />
                            </LineChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
  };

  return (
    <>
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto grid gap-8">
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">SmartCharts</h1>
                <p className="mt-2 text-lg md:text-xl text-muted-foreground">Upload Data → Generate Charts Instantly</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>1. Load Your Data</CardTitle>
                        <CardDescription>Upload a file or use our sample data to get started.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="file-upload" className="sr-only">Upload Data</Label>
                          <Input id="file-upload" type="file" accept=".json, .csv, .xls, .xlsx" onChange={handleFileChange} className="hidden" ref={fileInputRef}/>
                          <Button onClick={() => fileInputRef.current?.click()}>
                            <FileUp className="mr-2 h-4 w-4" />
                            Upload File
                          </Button>
                        </div>
                        <div className="relative">
                            <Separator className="my-2" />
                            <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-card px-2 text-sm text-muted-foreground">OR</span>
                        </div>
                        <Button onClick={loadSampleData} variant="secondary">
                            <TestTube2 className="mr-2 h-4 w-4"/>
                            Try Sample Data
                        </Button>
                    </CardContent>
                </Card>
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>2. Customize Your Chart</CardTitle>
                        <CardDescription>Select chart type and other options.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label>Chart Type</Label>
                            <Select value={chartType} onValueChange={(value) => setChartType(value as "pie" | "bar" | "line")}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a chart type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="bar">Bar Chart</SelectItem>
                                <SelectItem value="line">Line Chart</SelectItem>
                                <SelectItem value="pie">Pie Chart</SelectItem>
                            </SelectContent>
                            </Select>
                        </div>
                         <div className="grid gap-2">
                            <Label>Color Theme</Label>
                             <div className="flex gap-2">
                                {Object.keys(COLOR_THEMES).map((color) => (
                                    <Button
                                        key={color}
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        style={{ backgroundColor: color }}
                                        onClick={() => applyColorTheme(color as keyof typeof COLOR_THEMES)}
                                    />
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">3. Your Chart</h3>
            {renderChart()}
          </div>
          
          {parsedData.length > 0 && (
             <Card>
                <CardHeader>
                    <CardTitle>Data Preview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="max-h-60 overflow-y-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground uppercase">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Product</th>
                                    <th scope="col" className="px-6 py-3">Units Sold</th>
                                </tr>
                            </thead>
                            <tbody>
                                {parsedData.map((item, index) => (
                                    <tr key={index} className="border-b">
                                        <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap">{item.name}</th>
                                        <td className="px-6 py-4">{item.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
             </Card>
          )}

        </div>
      </main>
      <Toaster />
    </>
  );
}
