"use client";

import { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchPaymentSummary } from "@/store/slices/paymentsSlice";
import { fetchAllDoctors } from "@/store/slices/allDoctorsSlice";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  IndianRupee,
  CalendarCheck,
  Stethoscope,
  Search,
  Zap,
  LayoutGrid,
  BadgeCheck,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type PlanType = "token" | "monthly" | "none";

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon,
  loading,
  sub,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  loading?: boolean;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-border-subtle bg-bg-card p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-text-muted text-sm">{label}</p>
        <div className="w-9 h-9 rounded-lg bg-bg-elevated flex items-center justify-center text-text-secondary">
          {icon}
        </div>
      </div>
      {loading ? (
        <div className="h-8 w-32 rounded-md bg-bg-elevated animate-pulse" />
      ) : (
        <p className="text-3xl font-bold text-white">{value}</p>
      )}
      {sub && !loading && <p className="text-text-muted text-xs">{sub}</p>}
    </div>
  );
}

function PlanBadge({ plan }: { plan: PlanType }) {
  if (plan === "token")
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
        <Zap size={11} /> Token Plan
      </span>
    );
  if (plan === "monthly")
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
        <LayoutGrid size={11} /> Monthly Plan
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-bg-elevated text-text-muted border border-border-subtle">
      No Plan
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PaymentsPage() {
  const dispatch = useAppDispatch();
  const { summary, summaryLoading } = useAppSelector((s) => s.payments);
  const { list: doctorsList, loading: doctorsLoading } = useAppSelector((s) => s.allDoctors);

  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState<PlanType | "all">("all");

  useEffect(() => {
    dispatch(fetchPaymentSummary());
    dispatch(fetchAllDoctors(1));
  }, [dispatch]);

  // Derive a mock plan from doctor data until backend returns it
  const getDoctorPlan = (doctor: any): PlanType => {
    if (doctor.planType) return doctor.planType;
    // Fallback heuristic: monthly if totalAppointments > 10
    if ((doctor.totalAppointments ?? 0) > 10) return "monthly";
    if ((doctor.totalAppointments ?? 0) > 0) return "token";
    return "none";
  };

  const enrichedDoctors = useMemo(
    () => doctorsList.map((d: any) => ({ ...d, plan: getDoctorPlan(d) })),
    [doctorsList]
  );

  const tokenCount = useMemo(
    () => enrichedDoctors.filter((d) => d.plan === "token").length,
    [enrichedDoctors]
  );
  const monthlyCount = useMemo(
    () => enrichedDoctors.filter((d) => d.plan === "monthly").length,
    [enrichedDoctors]
  );

  const filtered = useMemo(
    () =>
      enrichedDoctors.filter((d: any) => {
        const matchSearch = d.name?.toLowerCase().includes(search.toLowerCase());
        const matchPlan = planFilter === "all" || d.plan === planFilter;
        return matchSearch && matchPlan;
      }),
    [enrichedDoctors, search, planFilter]
  );

  const getInitials = (name = "") => {
    const parts = name.trim().split(" ");
    return parts.length === 1
      ? parts[0][0]?.toUpperCase()
      : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-8">

        {/* ── Header ── */}
        <div>
          <h1 className="text-2xl font-bold text-white">Payments & Plans</h1>
          <p className="text-text-secondary text-sm mt-1">
            Manage doctor subscription plans and track platform revenue.
          </p>
        </div>

        {/* ── Summary Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Total Revenue"
            value={
              summaryLoading
                ? "—"
                : summary.totalRevenue >= 100000
                ? `₹${(summary.totalRevenue / 100000).toFixed(1)}L`
                : summary.totalRevenue >= 1000
                ? `₹${(summary.totalRevenue / 1000).toFixed(1)}K`
                : `₹${summary.totalRevenue}`
            }
            icon={<IndianRupee size={16} />}
            loading={summaryLoading}
            sub="Platform-wide earnings"
          />
          <StatCard
            label="Total Bookings"
            value={summaryLoading ? "—" : summary.totalBookings.toLocaleString()}
            icon={<CalendarCheck size={16} />}
            loading={summaryLoading}
            sub="All appointments"
          />
          <StatCard
            label="Token Plan Doctors"
            value={doctorsLoading ? "—" : tokenCount.toString()}
            icon={<Zap size={16} />}
            sub="Pay-per-token"
          />
          <StatCard
            label="Monthly Plan Doctors"
            value={doctorsLoading ? "—" : monthlyCount.toString()}
            icon={<BadgeCheck size={16} />}
            sub="Fixed monthly fee"
          />
        </div>

        {/* ── Doctor Plan Table ── */}
        <div className="rounded-2xl border border-border-subtle bg-bg-card overflow-hidden">

          {/* Table header + filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-border-subtle">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Stethoscope size={16} className="text-text-muted" />
              Doctor Plans
            </h2>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Plan filter pills */}
              <div className="flex items-center gap-2">
                {([
                  { label: "All", value: "all" },
                  { label: "Token", value: "token" },
                  { label: "Monthly", value: "monthly" },
                  { label: "None", value: "none" },
                ] as { label: string; value: PlanType | "all" }[]).map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => setPlanFilter(value)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                      planFilter === value
                        ? "bg-accent-red border-accent-red text-white"
                        : "border-border-subtle text-text-muted hover:text-white hover:border-[#555]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search doctor..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-bg-secondary border border-border-default rounded-lg text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-accent-red w-48"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          {doctorsLoading ? (
            <div className="p-8 flex justify-center">
              <div className="w-6 h-6 border-2 border-accent-red border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-text-muted text-sm">
              No doctors found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-text-muted text-xs border-b border-border-subtle">
                    <th className="text-left px-4 py-3 font-medium">Doctor</th>
                    <th className="text-left px-4 py-3 font-medium">Plan</th>
                    <th className="text-left px-4 py-3 font-medium">Status</th>
                    <th className="text-left px-4 py-3 font-medium">Appointments</th>
                    <th className="text-left px-4 py-3 font-medium">Speciality</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {filtered.map((doctor: any) => (
                    <tr key={doctor._id || doctor.id} className="hover:bg-bg-elevated/50 transition-colors">
                      {/* Doctor */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-accent-red/20 flex items-center justify-center text-xs font-bold text-accent-red shrink-0">
                            {getInitials(doctor.name)}
                          </div>
                          <div>
                            <p className="text-white font-medium leading-tight">{doctor.name}</p>
                            <p className="text-text-muted text-xs">{doctor.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Plan */}
                      <td className="px-4 py-3">
                        <PlanBadge plan={doctor.plan} />
                      </td>

                      {/* Active status */}
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          doctor.activeStatus === "active"
                            ? "bg-green-500/10 text-green-400 border border-green-500/20"
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${doctor.activeStatus === "active" ? "bg-green-400" : "bg-red-400"}`} />
                          {doctor.activeStatus === "active" ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* Appointments */}
                      <td className="px-4 py-3 text-text-secondary">
                        {doctor.totalAppointments ?? 0}
                      </td>

                      {/* Speciality */}
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {(doctor.services ?? []).slice(0, 2).map((s: string) => (
                            <span key={s} className="px-2 py-0.5 text-xs rounded bg-bg-elevated text-text-muted border border-border-subtle">
                              {s}
                            </span>
                          ))}
                          {(doctor.services ?? []).length > 2 && (
                            <span className="px-2 py-0.5 text-xs rounded bg-bg-elevated text-text-muted border border-border-subtle">
                              +{(doctor.services ?? []).length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
