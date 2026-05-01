"use client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { PageHeader, SectionCard } from "@/components/ui";
import { Download, FileText, BarChart2, Building2, DollarSign, Users, Stethoscope } from "lucide-react";

const reportTypes = [
  {
    icon: <FileText size={20} />,
    title: "Appointment Reports",
    description: "Complete log of all appointments with status breakdowns, cancellation rates, and doctor performance metrics.",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    formats: ["PDF", "Excel", "CSV"],
  },
  {
    icon: <Stethoscope size={20} />,
    title: "Doctor Performance",
    description: "Individual doctor ratings, appointment completion rates, patient feedback scores, and revenue contribution.",
    color: "text-accent-red",
    bg: "bg-accent-red-glow border-accent-red/20",
    formats: ["PDF", "Excel"],
  },
  {
    icon: <Building2 size={20} />,
    title: "Clinic Performance",
    description: "Clinic-level analytics including throughput, queue efficiency, patient satisfaction, and capacity utilization.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    formats: ["PDF", "Excel", "CSV"],
  },
  {
    icon: <DollarSign size={20} />,
    title: "Revenue Reports",
    description: "Financial summaries including gross revenue, platform commission, doctor payouts, and refund analysis.",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-500/20",
    formats: ["PDF", "Excel"],
  },
  {
    icon: <Users size={20} />,
    title: "Patient Activity",
    description: "Patient registration trends, appointment frequency, demographics, and retention analysis.",
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
    formats: ["PDF", "Excel", "CSV"],
  },
  {
    icon: <BarChart2 size={20} />,
    title: "Queue Analytics",
    description: "Wait time distributions, queue efficiency, skip rates, and peak hour analysis across all clinics.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
    formats: ["Excel", "CSV"],
  },
];

const formatColors: Record<string, string> = {
  PDF: "text-red-400 bg-red-500/10 border-red-500/20",
  Excel: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  CSV: "text-blue-400 bg-blue-500/10 border-blue-500/20",
};

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <PageHeader
          title="Reports"
          subtitle="Generate and download comprehensive operational and financial reports."
        />

        {/* Quick export banner */}
        <div className="mb-6 p-5 rounded-xl border border-border-subtle bg-gradient-to-r from-bg-card to-bg-elevated flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold">Quick Export — Full System Snapshot</h3>
            <p className="text-text-muted text-sm mt-0.5">Download a comprehensive report covering all modules for the current month.</p>
          </div>
          <button className="h-10 px-6 rounded-xl bg-gradient-accent text-white font-medium flex items-center gap-2 hover:opacity-90 shadow-accent-glow">
            <Download size={15} /> Export All Reports
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {reportTypes.map((report) => (
            <SectionCard key={report.title}>
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${report.bg} ${report.color}`}>
                {report.icon}
              </div>
              <h3 className="text-white font-semibold mb-2">{report.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed mb-4">{report.description}</p>
              <div className="flex items-center gap-2 mb-4">
                {report.formats.map((fmt) => (
                  <span key={fmt} className={`px-2 py-0.5 rounded text-xs border font-medium ${formatColors[fmt]}`}>
                    {fmt}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {report.formats.map((fmt) => (
                  <button
                    key={fmt}
                    className="h-8 rounded-lg border border-border-default text-text-secondary text-xs hover:text-text-primary hover:border-accent-red/30 transition-all flex items-center justify-center gap-1"
                  >
                    <Download size={11} /> {fmt}
                  </button>
                ))}
              </div>
            </SectionCard>
          ))}
        </div>

        {/* Date range filter */}
        <SectionCard className="mt-6" title="Custom Date Range Export" subtitle="Select a date range and report type for a custom export.">
          <div className="grid grid-cols-4 gap-4 items-end">
            <div>
              <label className="text-text-muted text-xs uppercase tracking-wider block mb-2">From Date</label>
              <input
                type="date"
                className="w-full h-9 px-3 bg-bg-elevated border border-border-default rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent-red/50 [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="text-text-muted text-xs uppercase tracking-wider block mb-2">To Date</label>
              <input
                type="date"
                className="w-full h-9 px-3 bg-bg-elevated border border-border-default rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent-red/50 [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="text-text-muted text-xs uppercase tracking-wider block mb-2">Report Type</label>
              <select className="w-full h-9 px-3 bg-bg-elevated border border-border-default rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent-red/50 appearance-none">
                {reportTypes.map((r) => (
                  <option key={r.title} className="bg-bg-elevated">{r.title}</option>
                ))}
              </select>
            </div>
            <button className="h-9 px-4 rounded-lg bg-gradient-accent text-white text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 shadow-accent-glow">
              <Download size={14} /> Generate Report
            </button>
          </div>
        </SectionCard>
      </div>
    </DashboardLayout>
  );
}
