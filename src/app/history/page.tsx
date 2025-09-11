
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HistoryPage() {
  return (
    <main className="flex-1 p-4 md:p-8">
      <div className="max-w-7xl mx-auto grid gap-8">
        <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">History</h1>
            <p className="mt-2 text-lg md:text-xl text-muted-foreground">View your saved charts.</p>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Saved Charts</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground bg-muted/20 rounded-lg border-2 border-dashed">
                    <p>No saved charts yet.</p>
                </div>
            </CardContent>
        </Card>
      </div>
    </main>
  );
}
