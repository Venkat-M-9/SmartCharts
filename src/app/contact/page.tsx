
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin, Github } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="flex-1 p-4 md:p-8">
      <div className="max-w-xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Contact Me</CardTitle>
            <CardDescription>
              Feel free to reach out. I'm always open to discussing new projects, creative ideas, or opportunities.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <a href="mailto:venkatmukala9@gmail.com">
              <Button variant="outline" className="w-full justify-start">
                <Mail className="mr-4" />
                venkatmukala9@gmail.com
              </Button>
            </a>
            <a href="https://www.linkedin.com/public-profile/settings?trk=d_flagship3_profile_self_view_public_profile" target="_blank" rel="noopener noreferrer">
               <Button variant="outline" className="w-full justify-start">
                <Linkedin className="mr-4" />
                LinkedIn
              </Button>
            </a>
            <a href="https://github.com/Venkat-M-9" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="w-full justify-start">
                <Github className="mr-4" />
                GitHub
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
