"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { getSettings } from "@/lib/storage/local";

export function SettingsGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState<boolean | null>(null);

  useEffect(() => {
    setReady(Boolean(getSettings().apiKey));
  }, []);

  // Loading
  if (ready === null) return null;

  if (!ready) {
    return (
      <div className="relative min-h-[60vh]">
        {/* Blurred backdrop hint */}
        <div className="pointer-events-none select-none blur-sm opacity-30" aria-hidden>
          {children}
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[2px]">
          <Card className="max-w-sm w-full shadow-lg">
            <CardContent className="p-8 text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                <Settings className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Setup required</h3>
                <p className="text-sm text-muted-foreground">
                  Add your API key to start using AI features.
                </p>
              </div>
              <Link href="/settings">
                <Button className="rounded-full px-6">Go to Settings</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
