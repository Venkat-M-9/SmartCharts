
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <main className="flex-1 p-4 md:p-8">
      <div className="max-w-4xl mx-auto grid gap-8">
        <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">About SmartCharts</h1>
            <p className="mt-2 text-lg md:text-xl text-muted-foreground">A brief overview of the project.</p>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
               <p>SmartCharts is a tool to quickly generate charts from your data. Simply upload a CSV or JSON file and see your data visualized instantly. You can switch between different chart types, customize colors, and download your charts as images.</p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Tech Stack</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
                <Badge>Next.js</Badge>
                <Badge>React</Badge>
                <Badge>Tailwind CSS</Badge>
                <Badge>ShadCN UI</Badge>
                <Badge>Recharts</Badge>
                <Badge>TypeScript</Badge>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Why SmartCharts?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <p>This project demonstrates a clean, modern, and responsive user interface built with the latest web technologies. It showcases an understanding of component-based architecture, state management, and data visualization.</p>
            </CardContent>
        </Card>
      </div>
    </main>
  );
}
