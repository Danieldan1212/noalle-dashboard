"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Phone, Clock, Crown, MessageCircle } from "lucide-react";
import { cn, getSourceIcon, formatRelativeDate } from "@/lib/utils";

export interface CustomerData {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  instagram?: string | null;
  source: string;
  stage: string;
  isVip: boolean;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  lastInteraction?: string | null;
  orderCount?: number;
  totalSpent?: number;
}

interface CustomerCardProps {
  customer: CustomerData;
  onClick: (customer: CustomerData) => void;
}

export function CustomerCard({ customer, onClick }: CustomerCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: customer.id,
    data: { customer },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const daysSinceContact = customer.lastInteraction
    ? Math.floor(
        (Date.now() - new Date(customer.lastInteraction).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  const needsFollowUp = daysSinceContact !== null && daysSinceContact >= 7;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onClick(customer)}
      className={cn(
        "bg-white rounded-xl p-4 shadow-sm border cursor-pointer",
        "hover:shadow-md hover:border-brand-gold/30 transition-all duration-200",
        isDragging && "opacity-50 shadow-lg rotate-2 scale-105",
        needsFollowUp && "border-red-200 bg-red-50/30"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg" title={customer.source}>
            {getSourceIcon(customer.source)}
          </span>
          <div>
            <h4 className="font-semibold text-brand-charcoal text-sm">
              {customer.name}
            </h4>
            {customer.instagram && (
              <p className="text-xs text-brand-charcoal-light/60">
                {customer.instagram}
              </p>
            )}
          </div>
        </div>
        {customer.isVip && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-gold/10 border border-brand-gold/20">
            <Crown className="w-3 h-3 text-brand-gold" />
            <span className="text-[10px] font-bold text-brand-gold">VIP</span>
          </div>
        )}
      </div>

      {/* Contact Info */}
      {customer.phone && (
        <div className="flex items-center gap-2 text-xs text-brand-charcoal-light/70 mb-2">
          <Phone className="w-3.5 h-3.5" />
          <span dir="ltr">{customer.phone}</span>
        </div>
      )}

      {/* Stats Row */}
      {(customer.orderCount !== undefined || customer.totalSpent !== undefined) && (
        <div className="flex items-center gap-3 text-xs text-brand-charcoal-light/60 mb-2">
          {customer.orderCount !== undefined && (
            <span>{customer.orderCount} הזמנות</span>
          )}
          {customer.totalSpent !== undefined && customer.totalSpent > 0 && (
            <span className="font-medium text-brand-gold">
              {new Intl.NumberFormat("he-IL", {
                style: "currency",
                currency: "ILS",
                minimumFractionDigits: 0,
              }).format(customer.totalSpent)}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-brand-cream-dark/50">
        {customer.lastInteraction ? (
          <div className="flex items-center gap-1.5 text-xs text-brand-charcoal-light/50">
            <Clock className="w-3 h-3" />
            <span>{formatRelativeDate(customer.lastInteraction)}</span>
          </div>
        ) : (
          <div className="text-xs text-brand-charcoal-light/40">אין אינטראקציה</div>
        )}

        {needsFollowUp && (
          <div className="flex items-center gap-1 text-xs text-red-500 font-medium">
            <MessageCircle className="w-3 h-3" />
            <span>{daysSinceContact} ימים</span>
          </div>
        )}
      </div>
    </div>
  );
}
