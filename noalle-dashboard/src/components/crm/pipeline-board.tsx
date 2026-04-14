"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { AlertTriangle } from "lucide-react";
import { CustomerCard, type CustomerData } from "./customer-card";
import { CustomerModal } from "./customer-modal";
import { cn, STAGES } from "@/lib/utils";

interface PipelineBoardProps {
  customers: CustomerData[];
  onUpdateCustomerStage: (customerId: string, newStage: string) => void;
  onCustomerClick?: (customer: CustomerData) => void;
}

function DroppableColumn({
  stageId,
  stageLabel,
  customers,
  onCustomerClick,
  isOver,
}: {
  stageId: string;
  stageLabel: string;
  customers: CustomerData[];
  onCustomerClick: (customer: CustomerData) => void;
  isOver: boolean;
}) {
  const { setNodeRef } = useDroppable({ id: stageId });

  const followUpAlerts = customers.filter((c) => {
    if (!c.lastInteraction) return false;
    const days = Math.floor(
      (Date.now() - new Date(c.lastInteraction).getTime()) / (1000 * 60 * 60 * 24)
    );
    return days >= 7;
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "kanban-column transition-colors duration-200",
        isOver && "bg-brand-gold/10 border-2 border-dashed border-brand-gold/30"
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-sm text-brand-charcoal">{stageLabel}</h3>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-brand-charcoal/10 text-brand-charcoal-light">
          {customers.length}
        </span>
      </div>

      {/* Follow-up Alerts */}
      {followUpAlerts.length > 0 && (
        <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 border border-red-100 mb-2">
          <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
          <span className="text-xs text-red-600">
            {followUpAlerts.length === 1
              ? `${followUpAlerts[0].name} לא שמע ממך 7 ימים`
              : `${followUpAlerts.length} לקוחות ממתינים למעקב`}
          </span>
        </div>
      )}

      {/* Cards */}
      <SortableContext
        items={customers.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2 min-h-[100px]">
          {customers.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onClick={onCustomerClick}
            />
          ))}
          {customers.length === 0 && (
            <div className="text-center py-8 text-brand-charcoal-light/30 text-xs">
              גרור לקוחות לכאן
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

export function PipelineBoard({
  customers: initialCustomers,
  onUpdateCustomerStage,
}: PipelineBoardProps) {
  const [customers, setCustomers] = useState<CustomerData[]>(initialCustomers);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor)
  );

  const activeCustomer = activeId
    ? customers.find((c) => c.id === activeId) || null
    : null;

  const getCustomersByStage = useCallback(
    (stageId: string) => customers.filter((c) => c.stage === stageId),
    [customers]
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    setOverId(over ? (over.id as string) : null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setOverId(null);

    if (!over) return;

    const customerId = active.id as string;
    let targetStage: string | null = null;

    // Check if dropped on a stage column
    const isStage = STAGES.some((s) => s.id === over.id);
    if (isStage) {
      targetStage = over.id as string;
    } else {
      // Dropped on another customer - find their stage
      const targetCustomer = customers.find((c) => c.id === over.id);
      if (targetCustomer) {
        targetStage = targetCustomer.stage;
      }
    }

    if (targetStage) {
      const customer = customers.find((c) => c.id === customerId);
      if (customer && customer.stage !== targetStage) {
        setCustomers((prev) =>
          prev.map((c) =>
            c.id === customerId ? { ...c, stage: targetStage as string } : c
          )
        );
        onUpdateCustomerStage(customerId, targetStage);
      }
    }
  };

  const handleCustomerClick = (customer: CustomerData) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleUpdateStage = (customerId: string, stage: string) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, stage } : c))
    );
    setSelectedCustomer((prev) => (prev ? { ...prev, stage } : null));
    onUpdateCustomerStage(customerId, stage);
  };

  const handleToggleVip = (customerId: string) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customerId ? { ...c, isVip: !c.isVip } : c
      )
    );
    setSelectedCustomer((prev) =>
      prev ? { ...prev, isVip: !prev.isVip } : null
    );
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4 px-1">
          {STAGES.map((stage) => (
            <DroppableColumn
              key={stage.id}
              stageId={stage.id}
              stageLabel={stage.label}
              customers={getCustomersByStage(stage.id)}
              onCustomerClick={handleCustomerClick}
              isOver={overId === stage.id}
            />
          ))}
        </div>

        <DragOverlay>
          {activeCustomer ? (
            <div className="opacity-80 rotate-3">
              <CustomerCard
                customer={activeCustomer}
                onClick={() => {}}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <CustomerModal
        customer={selectedCustomer}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCustomer(null);
        }}
        onUpdateStage={handleUpdateStage}
        onToggleVip={handleToggleVip}
      />
    </>
  );
}
