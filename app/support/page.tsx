"use client";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchTickets,
  updateTicketStatus,
  setSupportFilter,
  setSupportPage,
} from "@/store/slices/supportSlice";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  PageHeader, SearchBar, SelectFilter, DataTable, StatusBadge,
  ActionButton, Pagination, SectionCard, LoadingSpinner, MetricCard,
} from "@/components/ui";
import { SupportTicket } from "@/types";
import { HeadphonesIcon, CheckCircle, XCircle, LayoutList } from "lucide-react";

export default function SupportPage() {
  const dispatch = useAppDispatch();
  const { list, loading, filters, pagination, updatingId } = useAppSelector((s) => s.support);
  const [activeTab, setActiveTab] = useState<"doctor" | "patient">("doctor");

  useEffect(() => { dispatch(fetchTickets()); }, [dispatch]);

  const filtered = useMemo(() =>
    list.filter((t) => {
      const matchTab = t.userType?.toLowerCase() === activeTab;
      const matchSearch =
        !filters.search ||
        t.userName.toLowerCase().includes(filters.search.toLowerCase()) ||
        t.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        t.subject.toLowerCase().includes(filters.search.toLowerCase());
      const matchStatus = !filters.status || t.status === filters.status;
      const matchPriority =
        !filters.priority ||
        t.priority.toLowerCase() === filters.priority.toLowerCase();
      const matchCategory =
        !filters.category ||
        t.category.toLowerCase() === filters.category.toLowerCase();
      return matchTab && matchSearch && matchStatus && matchPriority && matchCategory;
    }),
    [list, filters, activeTab]
  );

  const paginated = filtered.slice(
    (pagination.page - 1) * pagination.limit,
    pagination.page * pagination.limit
  );

  const tabList = list.filter((t) => t.userType?.toLowerCase() === activeTab);

  const summaryCards = [
    { label: "Open Tickets", value: tabList.filter((t) => t.status === "open").length, icon: <HeadphonesIcon size={16} /> },
    { label: "Closed Tickets", value: tabList.filter((t) => t.status === "closed").length, icon: <CheckCircle size={16} /> },
    { label: "High Priority", value: tabList.filter((t) => t.priority.toLowerCase() === "high").length, icon: <XCircle size={16} /> },
    { label: "Total Reports", value: tabList.length, icon: <LayoutList size={16} /> },
  ];

  const columns = [
    {
      key: "id",
      label: "Ticket ID",
      render: (t: SupportTicket) => (
        <span className="text-accent-red-light font-mono text-xs">{t.id}</span>
      ),
    },
    {
      key: "userName",
      label: "User",
      render: (t: SupportTicket) => (
        <div>
          <p className="text-text-primary text-sm font-medium">{t.userName}</p>
          {t.phone && (
            <p className="text-text-muted text-xs">{t.phone}</p>
          )}
        </div>
      ),
    },
    {
      key: "subject",
      label: "Subject",
      render: (t: SupportTicket) => (
        <div>
          <p className="text-text-secondary text-sm">{t.subject}</p>
          {t.description && (
            <p className="text-text-muted text-xs truncate max-w-[200px]">{t.description}</p>
          )}
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (t: SupportTicket) => (
        <span className="text-text-muted text-sm">{t.category}</span>
      ),
    },
    {
      key: "priority",
      label: "Priority",
      render: (t: SupportTicket) => (
        <span
          className={`px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider ${
            t.priority.toLowerCase() === "high"
              ? "bg-red-500/10 text-red-400 border border-red-500/20"
              : t.priority.toLowerCase() === "medium"
              ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
              : "bg-green-500/10 text-green-400 border border-green-500/20"
          }`}
        >
          {t.priority}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (t: SupportTicket) => <StatusBadge status={t.status} />,
    },
    {
      key: "createdAt",
      label: "Reported",
      render: (t: SupportTicket) => (
        <span className="text-text-muted text-xs">
          {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "—"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (t: SupportTicket) => {
        const isUpdating = updatingId === t.id;
        return (
          <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
            {t.status === "open" ? (
              <ActionButton
                label={isUpdating ? "Closing..." : "Close"}
                onClick={() =>
                  dispatch(updateTicketStatus({ ticketId: t.id, status: "closed" }))
                }
                variant="danger"
                size="xs"
              />
            ) : (
              <ActionButton
                label={isUpdating ? "Reopening..." : "Reopen"}
                onClick={() =>
                  dispatch(updateTicketStatus({ ticketId: t.id, status: "open" }))
                }
                variant="success"
                size="xs"
              />
            )}
          </div>
        );
      },
    },
  ];

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <PageHeader
          title="Support Reports"
          subtitle="Manage and resolve user support requests across the platform."
        />

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-bg-card border border-border-subtle rounded-xl p-1 w-fit">
          {(["doctor", "patient"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                dispatch(setSupportFilter({ search: "", status: "", priority: "", category: "" }));
              }}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                activeTab === tab
                  ? "bg-accent-red text-white shadow"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              {tab === "doctor" ? "Doctors" : "Patients"}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {summaryCards.map((c) => (
            <MetricCard key={c.label} {...c} />
          ))}
        </div>

        <SectionCard noPadding>
          <div className="flex items-center gap-3 p-4 border-b border-border-subtle flex-wrap">
            <SearchBar
              value={filters.search}
              onChange={(v) => dispatch(setSupportFilter({ search: v }))}
              placeholder="Search by user, ticket ID, or subject..."
              className="flex-1 min-w-52"
            />
            <SelectFilter
              value={filters.status}
              onChange={(v) => dispatch(setSupportFilter({ status: v }))}
              options={[
                { label: "All Status", value: "" },
                { label: "Open", value: "open" },
                { label: "Closed", value: "closed" },
              ]}
            />
            <SelectFilter
              value={filters.priority}
              onChange={(v) => dispatch(setSupportFilter({ priority: v }))}
              options={[
                { label: "All Priority", value: "" },
                { label: "High", value: "High" },
                { label: "Medium", value: "Medium" },
                { label: "Low", value: "Low" },
              ]}
            />
            <SelectFilter
              value={filters.category}
              onChange={(v) => dispatch(setSupportFilter({ category: v }))}
              options={[
                { label: "All Categories", value: "" },
                { label: "Appointment", value: "Appointment" },
                { label: "Account", value: "Account" },
                { label: "Billing", value: "Billing" },
                { label: "Other", value: "Other" },
              ]}
            />
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              <DataTable
                columns={columns}
                data={paginated}
                keyExtractor={(t) => t.id}
                emptyMessage="No reports found"
              />
              <div className="flex items-center justify-between px-4 py-3 border-t border-border-subtle">
                <p className="text-text-muted text-xs">
                  Showing{" "}
                  <strong className="text-text-primary">{paginated.length}</strong> of{" "}
                  <strong className="text-text-primary">{filtered.length}</strong> reports
                </p>
                <Pagination
                  page={pagination.page}
                  total={filtered.length}
                  limit={pagination.limit}
                  onPageChange={(p) => dispatch(setSupportPage(p))}
                />
              </div>
            </>
          )}
        </SectionCard>
      </div>
    </DashboardLayout>
  );
}
