"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RefreshCw, ExternalLink, Copy, Check, ChevronDown, ChevronUp, DollarSign, Clock, FileCheck, AlertCircle } from "lucide-react";

interface FilingDetails {
  managementType?: string;
  isSelfAgent?: boolean;
  organizerState?: string;
  registeredAgent?: { name: string; street: string; city: string; state: string; zip: string } | null;
  members?: Array<{ name: string; ownership: string }>;
  businessPurpose?: string;
}

interface Order {
  id: string;
  business_name: string;
  state: string;
  structure: string;
  organizer_name: string;
  address_line1: string;
  city: string;
  zip: string;
  phone: string;
  user_email: string;
  amount_cents: number;
  details: string | null;
  notes: string;
  confirmation_number: string;
  status: string;
  filed_at: string | null;
  approved_at: string | null;
  created_at: string;
}

const STATUS_CONFIG: Record<string, { label: string; dot: string; badge: string }> = {
  pending_payment: { label: "Awaiting payment", dot: "bg-gray-400",    badge: "bg-gray-100 text-gray-600" },
  paid:            { label: "Needs filing",     dot: "bg-amber-400",   badge: "bg-amber-100 text-amber-700" },
  filed:           { label: "Filed",            dot: "bg-blue-400",    badge: "bg-blue-100 text-blue-700" },
  approved:        { label: "Approved",         dot: "bg-emerald-400", badge: "bg-emerald-100 text-emerald-700" },
};

const FILING_PORTALS: Record<string, string> = {
  California: "https://bizfileonline.sos.ca.gov",
  Florida:    "https://dos.myflorida.com/sunbiz",
  "New York": "https://ecorp.dos.ny.gov/",
  Texas:      "https://www.sos.state.tx.us/corp/forms_boc.shtml",
};

function useCopy(value: string) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return { copy, copied };
}

function CopyBtn({ value }: { value: string }) {
  const { copy, copied } = useCopy(value);
  return (
    <button onClick={copy} className="shrink-0 text-gray-300 hover:text-[#D4AF37] transition-colors">
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
      <div className="flex items-center gap-1.5">
        <p className="text-sm text-gray-800">{value || "—"}</p>
        {value && <CopyBtn value={value} />}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, color }: { icon: React.ElementType; label: string; value: string; sub?: string; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-start gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 leading-none">{value}</p>
        <p className="text-xs font-semibold text-gray-500 mt-1">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function OrderRow({ order, onOptimisticUpdate, onRefresh }: {
  order: Order;
  onOptimisticUpdate: (id: string, status: string) => void;
  onRefresh: () => void;
}) {
  const [expanded, setExpanded] = useState(order.status === "paid");
  const [notes, setNotes] = useState(order.notes || "");
  const [confNum, setConfNum] = useState(order.confirmation_number || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [acting, setActing] = useState(false);

  const st = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending_payment;
  const details: FilingDetails = (() => { try { return order.details ? JSON.parse(order.details) : {}; } catch { return {}; } })();
  const portal = FILING_PORTALS[order.state];

  async function updateStatus(status: string) {
    setActing(true);
    onOptimisticUpdate(order.id, status);
    await fetch("/api/admin/orders/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: order.id, status }),
    });
    setActing(false);
    onRefresh();
  }

  async function saveNotes() {
    setSaving(true);
    await fetch("/api/admin/orders/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: order.id, notes, confirmation_number: confNum }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
      order.status === "paid" ? "border-amber-200" : "border-gray-100"
    }`}>
      {/* Row */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${st.dot}`} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-gray-900">{order.business_name}</p>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${st.badge}`}>{st.label}</span>
            {order.status === "paid" && <span className="text-xs font-bold text-amber-600 animate-pulse">● Action needed</span>}
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{order.state} · {order.structure.toUpperCase()} · {order.user_email}</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <p className="text-sm font-bold text-gray-700 hidden sm:block">${(order.amount_cents / 100).toFixed(0)}</p>
          <p className="text-xs text-gray-400 hidden sm:block">
            {new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </p>

          {order.status === "paid" && (
            <button
              onClick={e => { e.stopPropagation(); updateStatus("filed"); }}
              disabled={acting}
              className="text-xs font-bold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              {acting ? "…" : "Mark filed"}
            </button>
          )}
          {order.status === "filed" && (
            <button
              onClick={e => { e.stopPropagation(); updateStatus("approved"); }}
              disabled={acting}
              className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              {acting ? "…" : "Mark approved"}
            </button>
          )}
          {portal && (
            <a
              href={portal}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="text-gray-300 hover:text-[#D4AF37] transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      {/* Detail panel */}
      {expanded && (
        <div className="border-t border-gray-100 px-5 py-5 space-y-5 bg-gray-50/50">

          {/* Contact */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Contact</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Field label="Organizer" value={order.organizer_name} />
              <Field label="Address" value={`${order.address_line1}, ${order.city}, ${details.organizerState || ""} ${order.zip}`} />
              <Field label="Phone" value={order.phone} />
              <Field label="Email" value={order.user_email} />
            </div>
          </div>

          {/* Filing details */}
          {Object.keys(details).length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Filing details</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                <Field label="Management" value={details.managementType === "member-managed" ? "Member-managed" : "Manager-managed"} />
                <Field label="Business purpose" value={details.businessPurpose || "Any lawful purpose"} />
                <Field
                  label="Registered agent"
                  value={details.isSelfAgent
                    ? `${order.organizer_name} (self)`
                    : details.registeredAgent
                      ? `${details.registeredAgent.name}, ${details.registeredAgent.city} ${details.registeredAgent.state}`
                      : "—"
                  }
                />
              </div>

              {details.members && details.members.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Members</p>
                  <div className="inline-flex flex-col gap-1 bg-white rounded-xl border border-gray-100 overflow-hidden">
                    {details.members.map((m, i) => (
                      <div key={i} className={`flex items-center gap-6 px-4 py-2.5 text-sm ${i > 0 ? "border-t border-gray-100" : ""}`}>
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-gray-800">{m.name}</span>
                          <CopyBtn value={m.name} />
                        </div>
                        <span className="font-bold text-gray-900 ml-auto">{m.ownership}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Notes & tracking</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Confirmation number</label>
                <input
                  value={confNum}
                  onChange={e => setConfNum(e.target.value)}
                  placeholder="State filing confirmation #"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Internal notes</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Any notes about this filing..."
                  rows={2}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] resize-none bg-white leading-relaxed"
                />
              </div>
            </div>
            <button
              onClick={saveNotes}
              disabled={saving}
              className="mt-2 flex items-center gap-1.5 text-xs font-semibold transition-colors disabled:opacity-40 text-[#D4AF37] hover:text-[#B8962E]"
            >
              {saving ? <RefreshCw className="w-3 h-3 animate-spin" /> : saved ? <Check className="w-3 h-3 text-emerald-500" /> : null}
              {saving ? "Saving…" : saved ? "Saved" : "Save notes"}
            </button>
          </div>

          {/* Timestamps */}
          {(order.filed_at || order.approved_at) && (
            <div className="flex items-center gap-4 text-xs text-gray-400 pt-1 border-t border-gray-100">
              {order.filed_at && <span>Filed {new Date(order.filed_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>}
              {order.approved_at && <span>Approved {new Date(order.approved_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function useSecondsAgo(date: Date | null) {
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    if (!date) return;
    const id = setInterval(() => setSecs(Math.floor((Date.now() - date.getTime()) / 1000)), 1000);
    return () => clearInterval(id);
  }, [date]);
  return secs;
}

export default function AdminClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [filter, setFilter] = useState("all");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const secondsAgo = useSecondsAgo(lastRefreshed);

  const load = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    else setRefreshing(true);
    const res = await fetch("/api/admin/orders");
    const data = await res.json();
    setOrders(Array.isArray(data) ? data : []);
    setLastRefreshed(new Date());
    if (!quiet) setLoading(false);
    else setRefreshing(false);
  }, []);

  useEffect(() => {
    load();
    intervalRef.current = setInterval(() => load(true), 30000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [load]);

  function optimisticUpdate(id: string, status: string) {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  }

  const revenue = orders.filter(o => o.status !== "pending_payment").reduce((s, o) => s + o.amount_cents, 0);
  const needsFiling = orders.filter(o => o.status === "paid").length;
  const filed = orders.filter(o => o.status === "filed").length;
  const approved = orders.filter(o => o.status === "approved").length;

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  const refreshLabel = !lastRefreshed ? "" : secondsAgo < 5 ? "just now" : secondsAgo < 60 ? `${secondsAgo}s ago` : `${Math.floor(secondsAgo / 60)}m ago`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Filing Dashboard</h1>
            {needsFiling > 0 && (
              <p className="text-amber-500 text-xs font-semibold mt-0.5">{needsFiling} order{needsFiling !== 1 ? "s" : ""} need{needsFiling === 1 ? "s" : ""} filing now</p>
            )}
          </div>
          <button
            onClick={() => load(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 font-medium transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            {refreshLabel && <span className="text-xs text-gray-300">{refreshLabel}</span>}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard icon={DollarSign} label="Revenue collected" value={`$${(revenue / 100).toLocaleString()}`} color="bg-[#D4AF37]" />
          <StatCard icon={AlertCircle} label="Needs filing" value={String(needsFiling)} sub={needsFiling > 0 ? "Action required" : "All clear"} color={needsFiling > 0 ? "bg-amber-400" : "bg-gray-300"} />
          <StatCard icon={Clock} label="Filed / in progress" value={String(filed)} color="bg-blue-400" />
          <StatCard icon={FileCheck} label="Approved" value={String(approved)} color="bg-emerald-500" />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { value: "all",             label: `All orders`,          count: orders.length },
            { value: "paid",            label: "Needs filing",        count: needsFiling },
            { value: "filed",           label: "Filed",               count: filed },
            { value: "approved",        label: "Approved",            count: approved },
            { value: "pending_payment", label: "Awaiting payment",    count: orders.filter(o => o.status === "pending_payment").length },
          ].map(tab => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all ${
                filter === tab.value
                  ? "bg-gray-900 text-white border-gray-900"
                  : "border-gray-200 text-gray-600 hover:border-gray-400 bg-white"
              }`}
            >
              {tab.label}
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                filter === tab.value ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
              }`}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Orders */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 h-16 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <p className="text-gray-400 font-medium">No orders here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(order => (
              <OrderRow
                key={order.id}
                order={order}
                onOptimisticUpdate={optimisticUpdate}
                onRefresh={() => load(true)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
