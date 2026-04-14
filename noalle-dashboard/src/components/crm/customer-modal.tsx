"use client";

import { useState } from "react";
import {
  Phone,
  Mail,
  Crown,
  Instagram,
  ShoppingBag,
  MessageCircle,
  Calendar,
  Plus,
  Package,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { cn, formatDate, formatCurrency, getSourceIcon, getStageColor, STAGES } from "@/lib/utils";
import type { CustomerData } from "./customer-card";

interface OrderData {
  id: string;
  type: string;
  description: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

interface InteractionData {
  id: string;
  type: string;
  notes: string;
  followUpDate?: string | null;
  createdAt: string;
}

interface CustomerModalProps {
  customer: CustomerData | null;
  isOpen: boolean;
  onClose: () => void;
  orders?: OrderData[];
  interactions?: InteractionData[];
  onAddInteraction?: (data: { type: string; notes: string; followUpDate?: string }) => void;
  onUpdateStage?: (customerId: string, stage: string) => void;
  onToggleVip?: (customerId: string) => void;
}

export function CustomerModal({
  customer,
  isOpen,
  onClose,
  orders = [],
  interactions = [],
  onAddInteraction,
  onUpdateStage,
  onToggleVip,
}: CustomerModalProps) {
  const [activeTab, setActiveTab] = useState<"info" | "orders" | "interactions">("info");
  const [showAddInteraction, setShowAddInteraction] = useState(false);
  const [newInteraction, setNewInteraction] = useState({
    type: "call",
    notes: "",
    followUpDate: "",
  });

  if (!customer) return null;

  const stageLabel = STAGES.find((s) => s.id === customer.stage)?.label || customer.stage;

  const handleAddInteraction = () => {
    if (onAddInteraction && newInteraction.notes.trim()) {
      onAddInteraction({
        type: newInteraction.type,
        notes: newInteraction.notes,
        followUpDate: newInteraction.followUpDate || undefined,
      });
      setNewInteraction({ type: "call", notes: "", followUpDate: "" });
      setShowAddInteraction(false);
    }
  };

  const interactionTypeLabels: Record<string, string> = {
    call: "שיחה",
    whatsapp: "ווטסאפ",
    email: "אימייל",
    meeting: "פגישה",
    instagram: "אינסטגרם",
    other: "אחר",
  };

  const orderStatusLabels: Record<string, string> = {
    pending: "ממתין",
    confirmed: "מאושר",
    inProduction: "בייצור",
    shipped: "נשלח",
    delivered: "נמסר",
    cancelled: "בוטל",
  };

  const tabs = [
    { id: "info" as const, label: "פרטים", icon: Phone },
    { id: "orders" as const, label: `הזמנות (${orders.length})`, icon: ShoppingBag },
    { id: "interactions" as const, label: `אינטראקציות (${interactions.length})`, icon: MessageCircle },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={customer.name} size="xl">
      {/* Customer Header */}
      <div className="flex items-start gap-4 mb-6 pb-6 border-b border-brand-cream-dark">
        <div className="w-14 h-14 rounded-2xl gold-gradient flex items-center justify-center text-white text-xl font-bold shadow-md">
          {customer.name.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-bold text-brand-charcoal">{customer.name}</h3>
            {customer.isVip && (
              <button
                onClick={() => onToggleVip?.(customer.id)}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 hover:bg-brand-gold/20 transition-colors"
              >
                <Crown className="w-3.5 h-3.5 text-brand-gold" />
                <span className="text-xs font-bold text-brand-gold">VIP</span>
              </button>
            )}
            {!customer.isVip && (
              <button
                onClick={() => onToggleVip?.(customer.id)}
                className="text-xs text-brand-charcoal-light/50 hover:text-brand-gold transition-colors"
              >
                + VIP
              </button>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm text-brand-charcoal-light/70">
            <span>{getSourceIcon(customer.source)} {customer.source}</span>
            <span className={cn("px-2 py-0.5 rounded-full text-xs border", getStageColor(customer.stage))}>
              {stageLabel}
            </span>
          </div>
        </div>
        <div>
          <select
            value={customer.stage}
            onChange={(e) => onUpdateStage?.(customer.id, e.target.value)}
            className="input-field text-sm py-1.5 px-3"
          >
            {STAGES.map((stage) => (
              <option key={stage.id} value={stage.id}>
                {stage.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-brand-cream rounded-xl p-1">
        {tabs.map((tab) => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                activeTab === tab.id
                  ? "bg-white text-brand-charcoal shadow-sm"
                  : "text-brand-charcoal-light/60 hover:text-brand-charcoal"
              )}
            >
              <TabIcon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "info" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {customer.phone && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-brand-cream/50">
                <Phone className="w-4 h-4 text-brand-gold" />
                <div>
                  <p className="text-xs text-brand-charcoal-light/60">טלפון</p>
                  <p className="text-sm font-medium" dir="ltr">{customer.phone}</p>
                </div>
              </div>
            )}
            {customer.email && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-brand-cream/50">
                <Mail className="w-4 h-4 text-brand-gold" />
                <div>
                  <p className="text-xs text-brand-charcoal-light/60">אימייל</p>
                  <p className="text-sm font-medium" dir="ltr">{customer.email}</p>
                </div>
              </div>
            )}
            {customer.instagram && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-brand-cream/50">
                <Instagram className="w-4 h-4 text-brand-gold" />
                <div>
                  <p className="text-xs text-brand-charcoal-light/60">אינסטגרם</p>
                  <p className="text-sm font-medium">{customer.instagram}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-brand-cream/50">
              <Calendar className="w-4 h-4 text-brand-gold" />
              <div>
                <p className="text-xs text-brand-charcoal-light/60">לקוח מאז</p>
                <p className="text-sm font-medium">{formatDate(customer.createdAt)}</p>
              </div>
            </div>
          </div>

          {customer.notes && (
            <div className="p-4 rounded-xl bg-brand-cream/50">
              <p className="text-xs text-brand-charcoal-light/60 mb-1">הערות</p>
              <p className="text-sm text-brand-charcoal">{customer.notes}</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "orders" && (
        <div className="space-y-3">
          {orders.length === 0 ? (
            <div className="text-center py-8 text-brand-charcoal-light/50">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>אין הזמנות עדיין</p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 rounded-xl bg-brand-cream/50 border border-brand-cream-dark/50"
              >
                <div>
                  <p className="font-medium text-sm text-brand-charcoal">
                    {order.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-brand-charcoal-light/60">
                      {order.type}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-brand-cream-dark text-brand-charcoal-light">
                      {orderStatusLabels[order.status] || order.status}
                    </span>
                  </div>
                </div>
                <div className="text-left">
                  <p className="font-bold text-brand-gold">
                    {formatCurrency(order.amount, order.currency)}
                  </p>
                  <p className="text-xs text-brand-charcoal-light/50 mt-0.5">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "interactions" && (
        <div className="space-y-4">
          {/* Add Interaction Button */}
          {!showAddInteraction && (
            <button
              onClick={() => setShowAddInteraction(true)}
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              הוסף אינטראקציה
            </button>
          )}

          {/* Add Interaction Form */}
          {showAddInteraction && (
            <div className="p-4 rounded-xl border border-brand-gold/30 bg-brand-gold/5 space-y-3">
              <div className="flex gap-3">
                <select
                  value={newInteraction.type}
                  onChange={(e) =>
                    setNewInteraction({ ...newInteraction, type: e.target.value })
                  }
                  className="input-field w-auto"
                >
                  {Object.entries(interactionTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  value={newInteraction.followUpDate}
                  onChange={(e) =>
                    setNewInteraction({
                      ...newInteraction,
                      followUpDate: e.target.value,
                    })
                  }
                  className="input-field w-auto"
                  placeholder="תאריך מעקב"
                />
              </div>
              <textarea
                value={newInteraction.notes}
                onChange={(e) =>
                  setNewInteraction({ ...newInteraction, notes: e.target.value })
                }
                className="input-field min-h-[80px] resize-none"
                placeholder="הערות..."
              />
              <div className="flex gap-2">
                <button onClick={handleAddInteraction} className="btn-primary text-sm">
                  שמור
                </button>
                <button
                  onClick={() => setShowAddInteraction(false)}
                  className="btn-secondary text-sm"
                >
                  ביטול
                </button>
              </div>
            </div>
          )}

          {/* Interactions List */}
          {interactions.length === 0 ? (
            <div className="text-center py-8 text-brand-charcoal-light/50">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>אין אינטראקציות עדיין</p>
            </div>
          ) : (
            <div className="space-y-3">
              {interactions.map((interaction) => (
                <div
                  key={interaction.id}
                  className="p-4 rounded-xl bg-brand-cream/50 border border-brand-cream-dark/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-brand-cream-dark text-brand-charcoal-light font-medium">
                      {interactionTypeLabels[interaction.type] || interaction.type}
                    </span>
                    <span className="text-xs text-brand-charcoal-light/50">
                      {formatDate(interaction.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-brand-charcoal">{interaction.notes}</p>
                  {interaction.followUpDate && (
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-brand-gold">
                      <Calendar className="w-3 h-3" />
                      <span>מעקב: {formatDate(interaction.followUpDate)}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
