
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <main className="flex-1 p-4 md:p-8">
      <div className="max-w-xl mx-auto">
        <Card>
            <CardHeader className="text-center">
                <CardTitle className="text-3xl">Contact Us</CardTitle>
                <CardDescription>Have questions or feedback? We'd love to hear from you.</CardDescription>
            </CardHeader>
            <CardContent>
                <form className="grid gap-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="first-name">First name</Label>
                            <Input id="first-name" placeholder="John" />
                        </div>
                         <div className="grid gap-2">
                            <Label htmlFor="last-name">Last name</Label>
                            <Input id="last-name" placeholder="Doe" />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="john.doe@example.com" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea id="message" placeholder="Your message here..." />
                    </div>
                    <Button type="submit">Send Message</Button>
                </form>
            </CardContent>
        </Card>
      </div>
    </main>
  );
}
