"use client";

import { useEffect, useRef, useState } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Check,
  Download,
  FileUp,
  Key,
  Save,
  Upload,
  User,
} from "lucide-react";
import {
  exportAll,
  getProfile,
  getSettings,
  importAll,
  setProfile,
  setSettings,
} from "@/lib/storage/local";
import type { AppSettings } from "@/lib/storage/types";

const DEFAULT_SETTINGS: AppSettings = {
  apiProvider: "openai",
  apiKey: "",
  model: "gpt-4o-mini",
  defaultDifficulty: "medium",
  defaultTone: "realistic",
};

const MODEL_OPTIONS = [
  { id: "gpt-4o-mini" as const, label: "GPT-4o Mini", provider: "openai" as const, cost: "$0.15 / $0.60 per 1M tokens" },
  { id: "gpt-4o" as const, label: "GPT-4o", provider: "openai" as const, cost: "$2.50 / $10 per 1M tokens" },
  { id: "claude-haiku-4-5-20251001" as const, label: "Claude Haiku 4.5", provider: "anthropic" as const, cost: "$0.80 / $4 per 1M tokens" },
];

export default function SettingsPage() {
  const [context, setContext] = useState("");
  const [settings, setSettingsState] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [profileSaved, setProfileSaved] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setContext(getProfile().context);
    setSettingsState(getSettings());
    setLoaded(true);
  }, []);

  function handleSaveProfile() {
    setProfile(context);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  }

  function handleSaveSettings() {
    setSettings(settings);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  }

  async function handleImportMd(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setContext(text);
    e.target.value = "";
  }

  function handleExportData() {
    const json = exportAll();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `interview-copilot-backup-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleImportData(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    try {
      importAll(text);
      setContext(getProfile().context);
      setSettingsState(getSettings());
    } catch (err) {
      console.error("Import failed:", err);
      alert("Failed to import data: invalid file");
    }
    e.target.value = "";
  }

  if (!loaded) {
    return (
      <PageContainer>
        <div className="text-sm text-muted-foreground">Loading…</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Your data stays on this device. Nothing leaves your browser.
        </p>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4" /> Profile Context
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Free-form text about you — background, skills, goals, anything
                the AI should know. Paste or import a markdown file.
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".md,.markdown,.txt"
                  onChange={handleImportMd}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FileUp className="h-3.5 w-3.5" /> Import .md
                </Button>
                <span className="text-xs text-muted-foreground">
                  {context.length.toLocaleString()} characters
                </span>
              </div>
              <Textarea
                placeholder="# About me&#10;&#10;Senior Frontend Engineer with 6 years of experience…&#10;&#10;## Strengths&#10;- …"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="min-h-[200px] max-h-[400px] font-mono text-sm"
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleSaveProfile}
                  className="gap-2 rounded-full px-6"
                >
                  {profileSaved ? (
                    <>
                      <Check className="h-4 w-4" /> Saved
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" /> Save Profile
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Key className="h-4 w-4" /> AI Model
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Bring your own API key. Stored locally; requests go directly
                from your browser to the provider.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm">Model</Label>
                <Select
                  value={settings.model || "gpt-4o-mini"}
                  onValueChange={(v) => {
                    if (!v) return;
                    const opt = MODEL_OPTIONS.find((m) => m.id === v);
                    if (!opt) return;
                    setSettingsState((s) => ({
                      ...s,
                      model: opt.id,
                      apiProvider: opt.provider,
                    }));
                  }}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MODEL_OPTIONS.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        <div className="flex items-center justify-between w-full gap-3">
                          <span>{m.label}</span>
                          <span className="text-[10px] text-muted-foreground">{m.cost}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm">
                  API Key ({settings.apiProvider === "anthropic" ? "Anthropic" : "OpenAI"})
                </Label>
                <Input
                  type="password"
                  placeholder={settings.apiProvider === "anthropic" ? "sk-ant-..." : "sk-..."}
                  value={settings.apiKey}
                  onChange={(e) =>
                    setSettingsState((s) => ({ ...s, apiKey: e.target.value }))
                  }
                  className="mt-1.5 font-mono"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-sm">Default Difficulty</Label>
                  <Select
                    value={settings.defaultDifficulty}
                    onValueChange={(v) =>
                      v &&
                      setSettingsState((s) => ({
                        ...s,
                        defaultDifficulty:
                          v as AppSettings["defaultDifficulty"],
                      }))
                    }
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm">Default Tone</Label>
                  <Select
                    value={settings.defaultTone}
                    onValueChange={(v) =>
                      v &&
                      setSettingsState((s) => ({
                        ...s,
                        defaultTone: v as AppSettings["defaultTone"],
                      }))
                    }
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="realistic">Realistic</SelectItem>
                      <SelectItem value="strict">Strict</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleSaveSettings}
                  className="gap-2 rounded-full px-6"
                >
                  {settingsSaved ? (
                    <>
                      <Check className="h-4 w-4" /> Saved
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" /> Save
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Data</CardTitle>
              <p className="text-xs text-muted-foreground">
                Back up or move your data between devices.
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={handleExportData}
                >
                  <Download className="h-3.5 w-3.5" /> Export JSON
                </Button>
                <input
                  ref={importInputRef}
                  type="file"
                  accept="application/json"
                  onChange={handleImportData}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => importInputRef.current?.click()}
                >
                  <Upload className="h-3.5 w-3.5" /> Import JSON
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Note: CV files are stored separately in IndexedDB and are not
                included in the JSON export.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
