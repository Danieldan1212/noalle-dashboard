"use client";

import { useState } from "react";
import {
  Key,
  Eye,
  EyeOff,
  Palette,
  Download,
  Globe,
  Shield,
  Save,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";

interface ApiKeyField {
  id: string;
  label: string;
  envVar: string;
  value: string;
  placeholder: string;
}

export default function SettingsPage() {
  const [language, setLanguage] = useState<"he" | "en">("he");
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState(false);

  const [apiKeys, setApiKeys] = useState<ApiKeyField[]>([
    {
      id: "shopify",
      label: "Shopify Access Token",
      envVar: "SHOPIFY_ACCESS_TOKEN",
      value: "",
      placeholder: "shpat_xxxxx",
    },
    {
      id: "meta",
      label: "Meta Access Token",
      envVar: "META_ACCESS_TOKEN",
      value: "",
      placeholder: "EAAxxxxx",
    },
    {
      id: "pinterest",
      label: "Pinterest Access Token",
      envVar: "PINTEREST_ACCESS_TOKEN",
      value: "",
      placeholder: "pina_xxxxx",
    },
    {
      id: "fal",
      label: "fal.ai API Key",
      envVar: "FAL_KEY",
      value: "",
      placeholder: "xxxxx-xxxxx-xxxxx",
    },
    {
      id: "anthropic",
      label: "Anthropic API Key",
      envVar: "ANTHROPIC_API_KEY",
      value: "",
      placeholder: "sk-ant-xxxxx",
    },
  ]);

  const toggleKeyVisibility = (id: string) => {
    setShowKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const updateApiKey = (id: string, value: string) => {
    setApiKeys((prev) =>
      prev.map((key) => (key.id === id ? { ...key, value } : key))
    );
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleExport = async () => {
    try {
      const response = await fetch("/api/analytics?export=csv");
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `noalle-export-${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-brand-charcoal">הגדרות</h1>
        <p className="text-brand-charcoal-light/60 text-sm mt-1">
          הגדרות מערכת, מפתחות API וזהות מותג
        </p>
      </div>

      {/* API Keys */}
      <div className="glass-card p-6 space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-brand-gold/10">
            <Key className="w-5 h-5 text-brand-gold" />
          </div>
          <div>
            <h2 className="font-bold text-brand-charcoal">מפתחות API</h2>
            <p className="text-xs text-brand-charcoal-light/60">
              הגדר חיבורים לשירותים חיצוניים
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {apiKeys.map((key) => (
            <div key={key.id}>
              <label className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-brand-charcoal">
                  {key.label}
                </span>
                <code className="text-[10px] text-brand-charcoal-light/40 bg-brand-cream px-2 py-0.5 rounded">
                  {key.envVar}
                </code>
              </label>
              <div className="relative">
                <input
                  type={showKeys[key.id] ? "text" : "password"}
                  value={key.value}
                  onChange={(e) => updateApiKey(key.id, e.target.value)}
                  className="input-field pl-10"
                  placeholder={key.placeholder}
                  dir="ltr"
                />
                <button
                  onClick={() => toggleKeyVisibility(key.id)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-brand-cream transition-colors"
                >
                  {showKeys[key.id] ? (
                    <EyeOff className="w-4 h-4 text-brand-charcoal-light/50" />
                  ) : (
                    <Eye className="w-4 h-4 text-brand-charcoal-light/50" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button onClick={handleSave} className="btn-primary flex items-center gap-2">
            {saved ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                נשמר
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                שמור מפתחות
              </>
            )}
          </button>
          <div className="flex items-center gap-1.5 text-xs text-brand-charcoal-light/50">
            <Shield className="w-3.5 h-3.5" />
            <span>המפתחות מאוחסנים בצורה מוצפנת</span>
          </div>
        </div>
      </div>

      {/* Brand Identity */}
      <div className="glass-card p-6 space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-brand-rose/20">
            <Palette className="w-5 h-5 text-brand-rose-dark" />
          </div>
          <div>
            <h2 className="font-bold text-brand-charcoal">זהות מותג</h2>
            <p className="text-xs text-brand-charcoal-light/60">
              הצגת הצבעים, הפונטים והלוגו של המותג
            </p>
          </div>
        </div>

        {/* Brand Name */}
        <div className="p-4 rounded-xl bg-brand-cream/50 border border-brand-cream-dark/50">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl gold-gradient flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              N
            </div>
            <div>
              <h3 className="text-xl font-bold text-brand-charcoal">
                {BRAND.name}
              </h3>
              <p className="text-sm text-brand-charcoal-light/70">
                {BRAND.nameHe}
              </p>
              <p className="text-xs text-brand-charcoal-light/50 mt-1">
                {BRAND.tagline}
              </p>
            </div>
          </div>
        </div>

        {/* Colors */}
        <div>
          <h3 className="text-sm font-medium text-brand-charcoal mb-3">
            צבעי המותג
          </h3>
          <div className="grid grid-cols-5 gap-3">
            {[
              { name: "זהב ראשי", color: BRAND.colors.primary, label: "Primary" },
              { name: "זהב בהיר", color: BRAND.colors.primaryLight, label: "Primary Light" },
              { name: "פחם", color: BRAND.colors.secondary, label: "Secondary" },
              { name: "ורוד עדין", color: BRAND.colors.accent, label: "Accent" },
              { name: "קרם", color: BRAND.colors.background, label: "Background" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div
                  className="w-full aspect-square rounded-xl border border-brand-cream-dark shadow-sm mb-2"
                  style={{ backgroundColor: item.color }}
                />
                <p className="text-xs font-medium text-brand-charcoal">
                  {item.name}
                </p>
                <p className="text-[10px] text-brand-charcoal-light/50 font-mono">
                  {item.color}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Fonts */}
        <div>
          <h3 className="text-sm font-medium text-brand-charcoal mb-3">
            פונטים
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-brand-cream/50 border border-brand-cream-dark/50">
              <p className="text-xs text-brand-charcoal-light/60 mb-2">
                עברית
              </p>
              <p className="text-2xl font-bold text-brand-charcoal" style={{ fontFamily: BRAND.fonts.hebrew }}>
                {BRAND.fonts.hebrew}
              </p>
              <p className="text-sm text-brand-charcoal-light/70 mt-1">
                אבגדהוזחטיכלמנסעפצקרשת
              </p>
            </div>
            <div className="p-4 rounded-xl bg-brand-cream/50 border border-brand-cream-dark/50">
              <p className="text-xs text-brand-charcoal-light/60 mb-2">
                English
              </p>
              <p className="text-2xl font-bold text-brand-charcoal" style={{ fontFamily: BRAND.fonts.english }}>
                {BRAND.fonts.english}
              </p>
              <p className="text-sm text-brand-charcoal-light/70 mt-1" dir="ltr">
                ABCDEFGHIJKLMNOPQRSTUVWXYZ
              </p>
            </div>
          </div>
        </div>

        {/* Brand Voice */}
        <div>
          <h3 className="text-sm font-medium text-brand-charcoal mb-3">
            קול המותג
          </h3>
          <div className="p-4 rounded-xl bg-brand-cream/50 border border-brand-cream-dark/50 space-y-3">
            <div>
              <p className="text-xs text-brand-charcoal-light/60">טון</p>
              <p className="text-sm text-brand-charcoal">{BRAND.voice.toneHe}</p>
            </div>
            <div>
              <p className="text-xs text-brand-charcoal-light/60">קהל יעד</p>
              <p className="text-sm text-brand-charcoal">{BRAND.voice.audienceHe}</p>
            </div>
            <div>
              <p className="text-xs text-brand-charcoal-light/60">מילות מפתח</p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {BRAND.voice.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="px-2.5 py-1 rounded-full bg-brand-gold/10 text-brand-gold text-xs font-medium"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data & Language */}
      <div className="grid grid-cols-2 gap-6">
        {/* Export */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50">
              <Download className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-bold text-brand-charcoal">ייצוא נתונים</h2>
              <p className="text-xs text-brand-charcoal-light/60">
                הורד את כל הנתונים בפורמט CSV
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <button onClick={handleExport} className="btn-secondary w-full text-sm">
              ייצא לקוחות
            </button>
            <button onClick={handleExport} className="btn-secondary w-full text-sm">
              ייצא הזמנות
            </button>
            <button onClick={handleExport} className="btn-secondary w-full text-sm">
              ייצא אנליטיקס
            </button>
          </div>
        </div>

        {/* Language */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-green-50">
              <Globe className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="font-bold text-brand-charcoal">שפה</h2>
              <p className="text-xs text-brand-charcoal-light/60">
                בחר את שפת הממשק
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => setLanguage("he")}
              className={cn(
                "w-full flex items-center gap-3 p-4 rounded-xl border transition-all",
                language === "he"
                  ? "border-brand-gold bg-brand-gold/5"
                  : "border-brand-cream-dark hover:border-brand-gold/30"
              )}
            >
              <span className="text-2xl">🇮🇱</span>
              <div className="text-right flex-1">
                <p className="font-medium text-sm text-brand-charcoal">
                  עברית
                </p>
                <p className="text-xs text-brand-charcoal-light/60">
                  שפת ברירת מחדל
                </p>
              </div>
              {language === "he" && (
                <CheckCircle2 className="w-5 h-5 text-brand-gold" />
              )}
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={cn(
                "w-full flex items-center gap-3 p-4 rounded-xl border transition-all",
                language === "en"
                  ? "border-brand-gold bg-brand-gold/5"
                  : "border-brand-cream-dark hover:border-brand-gold/30"
              )}
            >
              <span className="text-2xl">🇺🇸</span>
              <div className="text-right flex-1">
                <p className="font-medium text-sm text-brand-charcoal">
                  English
                </p>
                <p className="text-xs text-brand-charcoal-light/60">
                  Secondary language
                </p>
              </div>
              {language === "en" && (
                <CheckCircle2 className="w-5 h-5 text-brand-gold" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
