"use client";
import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchClinics, setClinicsFilter, setClinicsPage } from "@/store/slices/clinicsSlice";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { PageHeader, SearchBar, SelectFilter, DataTable, StatusBadge, ActionButton, Pagination, SectionCard, LoadingSpinner, StarRating } from "@/components/ui";
import { Clinic } from "@/types";
import { Plus, Download, Building2, MapPin } from "lucide-react";

export default function ClinicsPage() {
  const dispatch = useAppDispatch();
  const { list, loading, filters, pagination } = useAppSelector((s) => s.clinics);

  useEffect(() => { dispatch(fetchClinics()); }, [dispatch]);

  const filtered = useMemo(() =>
    list.filter((c) => {
      const matchSearch = !filters.search ||
        c.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        c.city.toLowerCase().includes(filters.search.toLowerCase());
      const matchStatus = !filters.status || c.status === filters.status;
      return matchSearch && matchStatus;
    }),
    [list, filters]
  );
  const paginated = filtered.slice((pagination.page - 1) * pagination.limit, pagination.page * pagination.limit);

  const columns = [
    {
      key: "name", label: "Clinic Name",
      render: (c: Clinic) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shrink-0">
            <Building2 size={16} className="text-white" />
          </div>
          <div>
            <p className="text-text-primary font-medium">{c.name}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin size={10} className="text-text-muted" />
              <span className="text-text-muted text-xs">{c.city}</span>
            </div>
          </div>
        </div>
      ),
    },
    { key: "location", label: "Location", render: (c: Clinic) => <span className="text-text-secondary text-sm">{c.location}</span> },
    {
      key: "doctorsAssigned", label: "Doctors",
      render: (c: Clinic) => (
        <div className="flex items-center gap-1.5">
          <span className="w-6 h-6 rounded-full bg-accent-red-glow border border-accent-red/20 flex items-center justify-center text-accent-red text-xs font-bold">
            {c.doctorsAssigned}
          </span>
        </div>
      ),
    },
    { key: "status", label: "Status", render: (c: Clinic) => <StatusBadge status={c.status} /> },
    { key: "dailyAppointments", label: "Daily Appts", render: (c: Clinic) => <span className="text-text-primary font-medium">{c.dailyAppointments}</span> },
    { key: "rating", label: "Rating", render: (c: Clinic) => <StarRating rating={c.rating} /> },
    { key: "tokenCapacity", label: "Capacity", render: (c: Clinic) => <span className="text-text-secondary text-sm">{c.tokenCapacity} tokens</span> },
    {
      key: "actions", label: "Actions",
      render: (c: Clinic) => (
        <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
          <ActionButton label="View" onClick={() => {}} variant="secondary" size="xs" />
          <ActionButton label="Edit" onClick={() => {}} variant="secondary" size="xs" />
          {c.status === "active"
            ? <ActionButton label="Deactivate" onClick={() => {}} variant="danger" size="xs" />
            : <ActionButton label="Activate" onClick={() => {}} variant="success" size="xs" />
          }
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <PageHeader
          title="Clinic Management"
          subtitle="Oversee and configure all registered clinical facilities."
          actions={
            <>
              <button className="h-9 px-4 rounded-lg border border-border-default text-text-secondary text-sm hover:text-text-primary flex items-center gap-2">
                <Download size={14} /> Export
              </button>
              <button className="h-9 px-4 rounded-lg bg-gradient-accent text-white text-sm font-medium flex items-center gap-2 hover:opacity-90 shadow-accent-glow">
                <Plus size={14} /> Add Clinic
              </button>
            </>
          }
        />
        <SectionCard noPadding>
          <div className="flex items-center gap-3 p-4 border-b border-border-subtle">
            <SearchBar
              value={filters.search}
              onChange={(v) => dispatch(setClinicsFilter({ search: v }))}
              placeholder="Search clinics by name or city..."
              className="flex-1"
            />
            <SelectFilter
              value={filters.status}
              onChange={(v) => dispatch(setClinicsFilter({ status: v }))}
              options={[
                { label: "All Status", value: "" },
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ]}
            />
            <SelectFilter
              value={filters.city}
              onChange={(v) => dispatch(setClinicsFilter({ city: v }))}
              options={[
                { label: "All Cities", value: "" },
                { label: "New York", value: "New York" },
                { label: "Chicago", value: "Chicago" },
                { label: "Los Angeles", value: "Los Angeles" },
                { label: "Houston", value: "Houston" },
                { label: "Phoenix", value: "Phoenix" },
              ]}
            />
          </div>
          {loading ? <LoadingSpinner /> : (
            <>
              <DataTable columns={columns} data={paginated} keyExtractor={(c) => c.id} emptyMessage="No clinics found" />
              <div className="flex items-center justify-between px-4 py-3 border-t border-border-subtle">
                <p className="text-text-muted text-xs">
                  Showing <strong className="text-text-primary">{paginated.length}</strong> of <strong className="text-text-primary">{filtered.length}</strong> clinics
                </p>
                <Pagination page={pagination.page} total={filtered.length} limit={pagination.limit} onPageChange={(p) => dispatch(setClinicsPage(p))} />
              </div>
            </>
          )}
        </SectionCard>
      </div>
    </DashboardLayout>
  );
}
