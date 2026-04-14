"use client";

import { useState, useCallback } from "react";
import { UserPlus, Search, Filter, AlertTriangle } from "lucide-react";
import { PipelineBoard } from "@/components/crm/pipeline-board";
import { AddCustomerForm, type CustomerFormData } from "@/components/crm/add-customer-form";
import type { CustomerData } from "@/components/crm/customer-card";

// Demo data
const DEMO_CUSTOMERS: CustomerData[] = [
  {
    id: "c1",
    name: "מיכל לוי",
    email: "michal@email.com",
    phone: "050-123-4567",
    instagram: "@michal_levi",
    source: "instagram",
    stage: "firstContact",
    isVip: false,
    notes: "מתעניינת בטבעת אירוסין מותאמת אישית",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    lastInteraction: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    orderCount: 0,
    totalSpent: 0,
  },
  {
    id: "c2",
    name: "רונית כהן",
    email: "ronit@email.com",
    phone: "052-987-6543",
    instagram: "@ronit_cohen",
    source: "referral",
    stage: "quoteSent",
    isVip: false,
    notes: "הומלצה ע״י שרה. רוצה שרשרת זהב עם חריטה",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    lastInteraction: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    orderCount: 0,
    totalSpent: 0,
  },
  {
    id: "c3",
    name: "שרה גולד",
    email: "sara@email.com",
    phone: "054-555-1234",
    instagram: "@sara.gold",
    source: "shopify",
    stage: "confirmed",
    isVip: true,
    notes: "לקוחה חוזרת. מעדיפה זהב צהוב",
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    lastInteraction: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    orderCount: 4,
    totalSpent: 12800,
  },
  {
    id: "c4",
    name: "דנה אברהם",
    phone: "053-222-3333",
    source: "whatsapp",
    stage: "inProduction",
    isVip: false,
    notes: "צמיד זהב עם יהלומים קטנים",
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    lastInteraction: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    orderCount: 1,
    totalSpent: 3200,
  },
  {
    id: "c5",
    name: "נורית פרידמן",
    email: "nurit@email.com",
    phone: "050-444-5555",
    instagram: "@nurit_f",
    source: "facebook",
    stage: "shipped",
    isVip: false,
    notes: "עגילי פנינה - נשלח בדואר שליחים",
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    lastInteraction: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    orderCount: 1,
    totalSpent: 1800,
  },
  {
    id: "c6",
    name: "יעל כץ",
    email: "yael@email.com",
    phone: "052-666-7777",
    source: "instagram",
    stage: "followUp",
    isVip: true,
    notes: "קנתה שרשרת, לבדוק שביעות רצון",
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    lastInteraction: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    orderCount: 3,
    totalSpent: 8500,
  },
  {
    id: "c7",
    name: "רחל גולדברג",
    email: "rachel@email.com",
    phone: "054-888-9999",
    instagram: "@rachel.goldberg",
    source: "walkIn",
    stage: "firstContact",
    isVip: false,
    notes: "ביקרה בחנות, התעניינה בסט שלם",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    lastInteraction: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    orderCount: 0,
    totalSpent: 0,
  },
  {
    id: "c8",
    name: "ענת שלום",
    phone: "050-111-2222",
    source: "phone",
    stage: "quoteSent",
    isVip: false,
    notes: "טבעת נישואין, תקציב עד 5000 ש״ח",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    lastInteraction: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    orderCount: 0,
    totalSpent: 0,
  },
  {
    id: "c9",
    name: "תמר דוד",
    email: "tamar@email.com",
    phone: "053-333-4444",
    instagram: "@tamar.david",
    source: "instagram",
    stage: "confirmed",
    isVip: false,
    notes: "תליון לב עם חריטת שם",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    lastInteraction: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    orderCount: 1,
    totalSpent: 2200,
  },
];

export default function CRMPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState<CustomerData[]>(DEMO_CUSTOMERS);

  const filteredCustomers = searchQuery
    ? customers.filter(
        (c) =>
          c.name.includes(searchQuery) ||
          c.phone?.includes(searchQuery) ||
          c.email?.includes(searchQuery) ||
          c.instagram?.includes(searchQuery)
      )
    : customers;

  const handleUpdateStage = useCallback(
    async (customerId: string, newStage: string) => {
      try {
        await fetch(`/api/customers/${customerId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stage: newStage }),
        });
      } catch (error) {
        console.error("Failed to update stage:", error);
      }
    },
    []
  );

  const handleAddCustomer = useCallback(
    async (data: CustomerFormData) => {
      const newCustomer: CustomerData = {
        id: `c${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastInteraction: null,
        orderCount: 0,
        totalSpent: 0,
      };

      setCustomers((prev) => [...prev, newCustomer]);

      try {
        await fetch("/api/customers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } catch (error) {
        console.error("Failed to add customer:", error);
      }
    },
    []
  );

  const followUpCount = customers.filter((c) => {
    if (!c.lastInteraction) return false;
    const days = Math.floor(
      (Date.now() - new Date(c.lastInteraction).getTime()) / (1000 * 60 * 60 * 24)
    );
    return days >= 7;
  }).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-charcoal">
            ניהול לקוחות
          </h1>
          <p className="text-brand-charcoal-light/60 text-sm mt-1">
            {customers.length} לקוחות במערכת
          </p>
        </div>
        <div className="flex items-center gap-3">
          {followUpCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">
                {followUpCount} לקוחות ממתינים למעקב
              </span>
            </div>
          )}
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            הוסף לקוח
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-charcoal-light/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pr-10"
            placeholder="חפש לקוח לפי שם, טלפון, אימייל..."
          />
        </div>
        <button className="btn-secondary flex items-center gap-2 text-sm">
          <Filter className="w-4 h-4" />
          סינון
        </button>
      </div>

      {/* Pipeline Board */}
      <PipelineBoard
        customers={filteredCustomers}
        onUpdateCustomerStage={handleUpdateStage}
      />

      {/* Add Customer Form */}
      <AddCustomerForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleAddCustomer}
      />
    </div>
  );
}
