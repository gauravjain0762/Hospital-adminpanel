"use client";
import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchVerifications, approveVerification, rejectVerification, setVerificationFilter, selectDoc } from "@/store/slices/verificationSlice";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { PageHeader, DataTable, StatusBadge, ActionButton, SectionCard, LoadingSpinner, Pagination } from "@/components/ui";
import { VerificationDoc } from "@/types";
import { RefreshCw, FileText, Image, AlertTriangle, CheckSquare, Square } from "lucide-react";
import { cn } from "@/lib/utils";

export default function VerificationPage() {
  const dispatch = useAppDispatch();
  const { list, loading, filters, selected, pagination } = useAppSelector((s) => s.verification);

  useEffect(() => { dispatch(fetchVerifications()); }, [dispatch]);

  const filtered = useMemo(() =>
    list.filter((v) => {
      const matchStatus = !filters.status || v.status === filters.status;
      const matchSearch = !filters.search || v.doctorName.toLowerCase().includes(filters.search.toLowerCase());
      return matchStatus && matchSearch;
    }),
    [list, filters]
  );

  const pending = list.filter((v) => v.status === "pending").length;
  const rejected = list.filter((v) => v.status === "rejected").length;

  const columns = [
    {
      key: "doctorName", label: "Doctor Name",
      render: (v: VerificationDoc) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-accent flex items-center justify-center text-white text-xs font-bold">
            {v.initials}
          </div>
          <div>
            <p className="text-text-primary font-medium">{v.doctorName}</p>
            <p className="text-text-muted text-xs">{v.specialization}</p>
          </div>
        </div>
      ),
    },
    { key: "documentType", label: "Document Type" },
    {
      key: "preview", label: "Preview",
      render: (v: VerificationDoc) => (
        <button
          onClick={(e) => { e.stopPropagation(); dispatch(selectDoc(v)); }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-default bg-bg-elevated hover:border-accent-red/30 text-text-secondary hover:text-text-primary transition-all text-xs"
        >
          {v.fileType === "pdf" ? <FileText size={12} /> : <Image size={12} />}
          Preview
        </button>
      ),
    },
    { key: "uploadDate", label: "Upload Date", render: (v: VerificationDoc) => <span className="text-text-secondary text-sm">{v.uploadDate}</span> },
    { key: "status", label: "Status", render: (v: VerificationDoc) => <StatusBadge status={v.status} /> },
    {
      key: "actions", label: "Actions",
      render: (v: VerificationDoc) => (
        <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
          {v.status === "pending" && (
            <>
              <ActionButton label="Approve" onClick={() => dispatch(approveVerification(v.id))} variant="success" size="xs" />
              <ActionButton label="Reject" onClick={() => dispatch(rejectVerification(v.id))} variant="danger" size="xs" />
              <ActionButton label="Re-upload" onClick={() => {}} variant="warning" size="xs" />
            </>
          )}
          {v.status !== "pending" && (
            <ActionButton label="Review" onClick={() => dispatch(selectDoc(v))} variant="secondary" size="xs" />
          )}
        </div>
      ),
    },
  ];

  const [checklist, setChecklist] = React.useState({ registry: false, seal: false, expiry: false });

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <PageHeader
          title="Verification Center"
          subtitle={`Reviewing ${pending} pending medical credentials for approval.`}
          actions={
            <>
              {["ALL", "PENDING", "FLAGGED"].map((f) => (
                <button
                  key={f}
                  onClick={() => dispatch(setVerificationFilter({ status: f === "ALL" ? "" : f.toLowerCase() }))}
                  className={`h-9 px-4 rounded-lg border text-sm font-medium transition-all ${
                    (f === "ALL" && !filters.status) || filters.status === f.toLowerCase()
                      ? "bg-bg-elevated border-accent-red/30 text-text-primary"
                      : "border-border-default text-text-muted hover:text-text-primary"
                  }`}
                >
                  {f}
                </button>
              ))}
              <button onClick={() => dispatch(fetchVerifications())} className="h-9 px-3 rounded-lg border border-border-default text-text-secondary hover:text-text-primary flex items-center gap-2 text-sm">
                <RefreshCw size={14} />
              </button>
            </>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-bg-card border border-border-subtle rounded-xl p-5">
            <p className="text-text-muted text-xs uppercase tracking-wider mb-1">System Health</p>
            <p className="text-white text-3xl font-bold">98.2%</p>
            <p className="text-emerald-400 text-xs mt-1">↑ +2.4% Verification Speed</p>
          </div>
          <div className="bg-bg-card border border-border-subtle rounded-xl p-5">
            <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Awaiting Review</p>
            <p className="text-white text-3xl font-bold">{pending}</p>
            <div className="flex -space-x-2 mt-2">
              {list.filter((v) => v.status === "pending").slice(0, 4).map((v) => (
                <div key={v.id} className="w-6 h-6 rounded-full bg-gradient-accent border-2 border-bg-card flex items-center justify-center text-white text-[9px] font-bold">
                  {v.initials[0]}
                </div>
              ))}
              {pending > 4 && <div className="w-6 h-6 rounded-full bg-bg-elevated border-2 border-bg-card flex items-center justify-center text-text-muted text-[9px]">+{pending - 4}</div>}
            </div>
          </div>
          <div className="bg-bg-card border border-border-subtle rounded-xl p-5 border-l-2 border-l-red-500">
            <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Rejected Today</p>
            <p className="text-white text-3xl font-bold">{String(rejected).padStart(2, "0")}</p>
            <p className="text-text-muted text-xs mt-1">Expired license common cause</p>
          </div>
        </div>

        {/* Table + Preview panel */}
        <div className="grid grid-cols-3 gap-4">
          <SectionCard className="col-span-2" title="Credential Workflow Queue" noPadding headerRight={
            <button onClick={() => dispatch(fetchVerifications())} className="w-8 h-8 rounded-lg border border-border-default flex items-center justify-center text-text-muted hover:text-text-primary transition-all">
              <RefreshCw size={13} />
            </button>
          }>
            {loading ? <LoadingSpinner /> : (
              <>
                <DataTable
                  columns={columns}
                  data={filtered}
                  keyExtractor={(v) => v.id}
                  onRowClick={(v) => dispatch(selectDoc(v))}
                />
                <div className="px-4 py-3 border-t border-border-subtle flex justify-between items-center">
                  <p className="text-text-muted text-xs">Showing {filtered.length} of {list.length} results</p>
                  <Pagination page={pagination.page} total={filtered.length} limit={10} onPageChange={() => {}} />
                </div>
              </>
            )}
          </SectionCard>

          {/* Preview + Checklist */}
          <div className="space-y-4">
            <SectionCard title={selected ? `Selected: ${selected.documentType}` : "Document Preview"} subtitle={selected ? selected.doctorName : "Select a document"}>
              <div className="aspect-video rounded-xl bg-bg-elevated border border-border-subtle flex items-center justify-center mb-4 overflow-hidden">
                {selected ? (
                  <div className="text-center">
                    {selected.fileType === "pdf" ? <FileText size={32} className="text-accent-red mx-auto mb-2" /> : <Image size={32} className="text-accent-red mx-auto mb-2" />}
                    <p className="text-text-secondary text-sm">{selected.documentType}</p>
                    <p className="text-text-muted text-xs mt-1">Click Fullscreen to view</p>
                  </div>
                ) : (
                  <div className="text-center text-text-muted">
                    <FileText size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Select a document to initiate deep-scan preview</p>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <p className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-3">Verification Checklist</p>
                {[
                  { key: "registry", label: "Registry match found" },
                  { key: "seal", label: "Seal authenticity verified" },
                  { key: "expiry", label: "Expiry date valid (>6 months)" },
                ].map((item) => (
                  <label key={item.key} className="flex items-center gap-2 mb-2 cursor-pointer group">
                    <button
                      onClick={() => setChecklist((c) => ({ ...c, [item.key]: !c[item.key as keyof typeof c] }))}
                      className={cn(
                        "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                        checklist[item.key as keyof typeof checklist]
                          ? "bg-accent-red border-accent-red"
                          : "border-border-default bg-bg-elevated group-hover:border-accent-red/50"
                      )}
                    >
                      {checklist[item.key as keyof typeof checklist] && <span className="text-white text-[9px]">✓</span>}
                    </button>
                    <span className="text-text-secondary text-sm">{item.label}</span>
                  </label>
                ))}
              </div>

              <div className="mb-4">
                <p className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-2">Compliance Notes</p>
                <textarea
                  placeholder="Add internal observation..."
                  className="w-full h-20 px-3 py-2 bg-bg-elevated border border-border-default rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-red/50 resize-none"
                />
              </div>

              <button
                disabled={!selected}
                className="w-full h-10 rounded-xl bg-gradient-accent text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Finalize Batch Review
              </button>
            </SectionCard>

            {/* Legal advisory */}
            <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 flex gap-3">
              <AlertTriangle size={16} className="text-yellow-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-yellow-400 text-sm font-semibold">Legal Advisory</p>
                <p className="text-text-muted text-xs mt-1">Verification must be completed within 48 hours of document submission per state regulation §21-A.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Need React import for useState
import React from "react";
