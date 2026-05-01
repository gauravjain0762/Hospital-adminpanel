"use client";
import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchPatients, setPatientsFilter, setPatientsPage, updatePatientStatus } from "@/store/slices/patientsSlice";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { PageHeader, SearchBar, SelectFilter, DataTable, StatusBadge, ActionButton, Pagination, SectionCard, LoadingSpinner } from "@/components/ui";
import { Patient } from "@/types";
import { Plus, Download } from "lucide-react";

export default function PatientsPage() {
  const dispatch = useAppDispatch();
  const { list, loading, filters, pagination } = useAppSelector((s) => s.patients);

  useEffect(() => { dispatch(fetchPatients()); }, [dispatch]);

  const filtered = useMemo(() =>
    list.filter((p) => {
      const matchSearch = !filters.search ||
        p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.phone.includes(filters.search);
      const matchStatus = !filters.status || p.status === filters.status;
      return matchSearch && matchStatus;
    }),
    [list, filters]
  );
  const paginated = filtered.slice((pagination.page - 1) * pagination.limit, pagination.page * pagination.limit);

  const columns = [
    {
      key: "name", label: "Patient Name",
      render: (p: Patient) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {p.initials}
          </div>
          <div>
            <p className="text-text-primary font-medium">{p.name}</p>
            <p className="text-text-muted text-xs">{p.email}</p>
          </div>
        </div>
      ),
    },
    { key: "phone", label: "Phone", render: (p: Patient) => <span className="text-text-secondary text-sm">{p.phone}</span> },
    { key: "totalAppointments", label: "Total Appointments", render: (p: Patient) => <span className="font-medium">{p.totalAppointments}</span> },
    { key: "lastVisit", label: "Last Visit", render: (p: Patient) => <span className="text-text-secondary text-sm">{p.lastVisit}</span> },
    { key: "status", label: "Status", render: (p: Patient) => <StatusBadge status={p.status} /> },
    {
      key: "actions", label: "Actions",
      render: (p: Patient) => (
        <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
          <ActionButton label="View Profile" onClick={() => {}} variant="secondary" size="xs" />
          <ActionButton label="History" onClick={() => {}} variant="secondary" size="xs" />
          {p.status === "active"
            ? <ActionButton label="Block" onClick={() => dispatch(updatePatientStatus({ id: p.id, status: "blocked" }))} variant="danger" size="xs" />
            : <ActionButton label="Unblock" onClick={() => dispatch(updatePatientStatus({ id: p.id, status: "active" }))} variant="success" size="xs" />
          }
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <PageHeader
          title="Patient Management"
          subtitle="View, manage, and moderate patient profiles across the clinical network."
          actions={
            <>
              <button className="h-9 px-4 rounded-lg border border-border-default text-text-secondary text-sm hover:text-text-primary flex items-center gap-2">
                <Download size={14} /> Export
              </button>
              <button className="h-9 px-4 rounded-lg bg-gradient-accent text-white text-sm font-medium flex items-center gap-2 hover:opacity-90 shadow-accent-glow">
                <Plus size={14} /> Add Patient
              </button>
            </>
          }
        />
        <SectionCard noPadding>
          <div className="flex items-center gap-3 p-4 border-b border-border-subtle">
            <SearchBar
              value={filters.search}
              onChange={(v) => dispatch(setPatientsFilter({ search: v }))}
              placeholder="Search patients by name, email, phone..."
              className="flex-1"
            />
            <SelectFilter
              value={filters.status}
              onChange={(v) => dispatch(setPatientsFilter({ status: v }))}
              options={[
                { label: "All Patients", value: "" },
                { label: "Active", value: "active" },
                { label: "Blocked", value: "blocked" },
              ]}
            />
          </div>
          {loading ? <LoadingSpinner /> : (
            <>
              <DataTable columns={columns} data={paginated} keyExtractor={(p) => p.id} emptyMessage="No patients found" />
              <div className="flex items-center justify-between px-4 py-3 border-t border-border-subtle">
                <p className="text-text-muted text-xs">Showing <strong className="text-text-primary">{paginated.length}</strong> of <strong className="text-text-primary">{filtered.length}</strong> patients</p>
                <Pagination page={pagination.page} total={filtered.length} limit={pagination.limit} onPageChange={(p) => dispatch(setPatientsPage(p))} />
              </div>
            </>
          )}
        </SectionCard>
      </div>
    </DashboardLayout>
  );
}
