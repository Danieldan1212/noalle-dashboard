"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { SOURCES, STAGES } from "@/lib/utils";

interface AddCustomerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CustomerFormData) => void;
}

export interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  instagram: string;
  source: string;
  stage: string;
  isVip: boolean;
  notes: string;
}

const INITIAL_FORM: CustomerFormData = {
  name: "",
  email: "",
  phone: "",
  instagram: "",
  source: "instagram",
  stage: "firstContact",
  isVip: false,
  notes: "",
};

export function AddCustomerForm({ isOpen, onClose, onSubmit }: AddCustomerFormProps) {
  const [form, setForm] = useState<CustomerFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerFormData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CustomerFormData, string>> = {};

    if (!form.name.trim()) {
      newErrors.name = "שם הלקוח הוא שדה חובה";
    }

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "כתובת אימייל לא תקינה";
    }

    if (form.phone && !/^[\d\-+() ]{7,15}$/.test(form.phone)) {
      newErrors.phone = "מספר טלפון לא תקין";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(form);
      setForm(INITIAL_FORM);
      setErrors({});
      onClose();
    }
  };

  const updateField = <K extends keyof CustomerFormData>(
    field: K,
    value: CustomerFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="הוסף לקוח חדש" size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-brand-charcoal mb-1.5">
            שם הלקוח *
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            className="input-field"
            placeholder="שם מלא"
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name}</p>
          )}
        </div>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-1.5">
              טלפון
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className="input-field"
              placeholder="050-000-0000"
              dir="ltr"
            />
            {errors.phone && (
              <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-1.5">
              אימייל
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              className="input-field"
              placeholder="email@example.com"
              dir="ltr"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>
        </div>

        {/* Instagram */}
        <div>
          <label className="block text-sm font-medium text-brand-charcoal mb-1.5">
            אינסטגרם
          </label>
          <input
            type="text"
            value={form.instagram}
            onChange={(e) => updateField("instagram", e.target.value)}
            className="input-field"
            placeholder="@username"
            dir="ltr"
          />
        </div>

        {/* Source & Stage */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-1.5">
              מקור
            </label>
            <select
              value={form.source}
              onChange={(e) => updateField("source", e.target.value)}
              className="input-field"
            >
              {SOURCES.map((source) => (
                <option key={source.id} value={source.id}>
                  {source.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-1.5">
              שלב
            </label>
            <select
              value={form.stage}
              onChange={(e) => updateField("stage", e.target.value)}
              className="input-field"
            >
              {STAGES.map((stage) => (
                <option key={stage.id} value={stage.id}>
                  {stage.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* VIP Toggle */}
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={form.isVip}
              onChange={(e) => updateField("isVip", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-brand-cream-dark peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand-gold/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:-translate-x-full rtl:peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-gold"></div>
          </label>
          <span className="text-sm font-medium text-brand-charcoal">לקוח VIP</span>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-brand-charcoal mb-1.5">
            הערות
          </label>
          <textarea
            value={form.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            className="input-field min-h-[100px] resize-none"
            placeholder="הערות נוספות על הלקוח..."
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button type="submit" className="btn-primary flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            הוסף לקוח
          </button>
          <button type="button" onClick={onClose} className="btn-secondary">
            ביטול
          </button>
        </div>
      </form>
    </Modal>
  );
}
