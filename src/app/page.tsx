"use client";

import { useState } from "react";
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
} from "recharts";
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

interface DataItem {
  name: string;
  value: number;
}

const COLORS = ["#3498db", "#2ecc71", "#e74c3c", "#9b59b6", "#f39c12"];

const sampleData = [
  { name: "Jan", value: 4000 },
  { name: "Feb", value: 3000 },
  { name: "Mar", value: 2000 },
  { name: "Apr", value: 2780 },
  { name: "May", value: 1890 },
  { name: "Jun", value: 2390 },
];

export default function Home() {
  const [fileData, setFileData] = useState<string>("");
  const [parsedData, setParsedData] = useState<DataItem[]>([]);
  const [chartType, setChartType] = useState<"pie" | "bar" | "line">("bar");

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
      alert("Please upload a file or load sample data first.");
      return;
    }
    try {
      const data = JSON.parse(fileData) as DataItem[];
      setParsedData(data);
    } catch (error) {
      try {
        const lines = fileData.split("\n").filter(line => line.trim() !== "");
        const data = lines.map((line) => {
          const [name, value] = line.split(",");
          return { name, value: parseFloat(value) };
        });
        setParsedData(data);
      } catch (csvError) {
        alert("Error parsing data. Please ensure it is valid JSON or CSV format (name,value).");
      }
    }
  };

  const loadSampleData = () => {
    setFileData(JSON.stringify(sampleData, null, 2));
    setParsedData(sampleData);
  };

  const renderChart = () => {
    if (!parsedData.length) {
      return <p>No data to display. Please upload and parse your data.</p>;
    }

    switch (chartType) {
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie dataKey="value" data={parsedData} cx="50%" cy="50%" outerRadius={150} fill="#8884d8" label>
                {parsedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={parsedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        );
      case "line":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={parsedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="hsl(var(--accent))" />
            </LineChart>
          </ResponsiveContainer>
        );
      default:
        return <p>Select a chart type to visualize your data.</p>;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Chartastic</CardTitle>
          <CardDescription>Visualize your data with ease.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="file">Upload Data (JSON or CSV):</Label>
              <Input id="file" type="file" accept=".json, .csv" onChange={handleFileChange} />
            </div>
            <div className="grid gap-2">
              <Label>Or use sample data:</Label>
              <Button onClick={loadSampleData} variant="secondary">Load Sample Data</Button>
            </div>
          </div>

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

          <Button onClick={parseData}>Parse and Visualize Data</Button>

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

          <div className="mt-4 border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">Chart Preview</h3>
            {renderChart()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}