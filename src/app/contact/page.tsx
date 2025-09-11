
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin, Github, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function ContactPage() {
  const { toast } = useToast();
  const email = "venkatmukala9@gmail.com";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email).then(() => {
      toast({
        title: "Copied to Clipboard",
        description: "The email address has been copied successfully.",
      });
    }).catch(err => {
      console.error("Failed to copy email: ", err);
      toast({
        title: "Error",
        description: "Could not copy email address to clipboard.",
        variant: "destructive",
      });
    });
  };

  return (
    <>
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
              <div className="flex items-center gap-2">
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="mr-4" />
                  {email}
                </Button>
                <Button variant="outline" size="icon" onClick={handleCopyEmail} aria-label="Copy email address">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
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
      <Toaster />
    </>
  );
}
