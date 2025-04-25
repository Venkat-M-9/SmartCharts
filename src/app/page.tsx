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
    try {
      const data = JSON.parse(fileData) as DataItem[];
      setParsedData(data);
    } catch (error) {
      try {
        const lines = fileData.split("\n");
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
              <Bar dataKey="value" fill="#3498db" />
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
              <Line type="monotone" dataKey="value" stroke="#2ecc71" />
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
          <div className="grid gap-2">
            <Label htmlFor="file">Upload Data (JSON or CSV):</Label>
            <Input id="file" type="file" accept=".json, .csv" onChange={handleFileChange} />
          </div>
          <Button onClick={parseData}>Parse Data</Button>

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

          <div className="mt-4">
            {renderChart()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
