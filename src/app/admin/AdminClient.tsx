"use client";

import { useEffect, useState } from "react";
import { FilingOrder } from "@/lib/db";

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  pending_payment: { label: "Awaiting payment", color: "bg-gray-100 text-gray-600" },
  paid:            { label: "Paid — needs filing", color: "bg-amber-100 text-amber-700" },
  filed:           { label: "Filed", color: "bg-emerald-100 text-emerald-700" },
  complete:        { label: "Complete", color: "bg-[#FF8C42]/20 text-[#E87030]" },
};

export default function AdminClient() {
  const [orders, setOrders] = useState<FilingOrder[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/admin/orders");
    const data = await res.json();
    setOrders(data);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    await fetch("/api/admin/orders/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    load();
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Filing Orders</h1>
          <p className="text-gray-500 text-sm mt-1">{orders.filter(o => o.status === "paid").length} need filing</p>
        </div>

        {loading ? (
          <p className="text-gray-400 text-sm">Loading…</p>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <p className="text-gray-400 font-medium">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const st = STATUS_LABEL[order.status] ?? { label: order.status, color: "bg-gray-100 text-gray-600" };
              return (
                <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-bold text-gray-900 text-lg">{order.business_name}</p>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${st.color}`}>{st.label}</span>
                      </div>
                      <p className="text-sm text-gray-500">{order.state} · {order.structure.toUpperCase()} · ${(order.amount_cents / 100).toFixed(0)} paid</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {order.status === "paid" && (
                        <button
                          onClick={() => updateStatus(order.id, "filed")}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                        >
                          Mark as filed
                        </button>
                      )}
                      {order.status === "filed" && (
                        <button
                          onClick={() => updateStatus(order.id, "complete")}
                          className="bg-[#FF8C42] hover:bg-[#E87030] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                        >
                          Mark complete
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 text-sm">
                    {([
                      ["Organizer", order.organizer_name],
                      ["Address", `${order.address_line1}, ${order.city} ${order.zip}`],
                      ["Phone", order.phone || "—"],
                      ["Customer email", order.user_email],
                      ["Ordered", new Date(order.created_at).toLocaleDateString()],
                      ...(order.filed_at ? [["Filed", new Date(order.filed_at).toLocaleDateString()]] : []),
                    ] as [string, string][]).map(([label, value]) => (
                      <div key={label}>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
                        <p className="text-gray-700 mt-0.5">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
