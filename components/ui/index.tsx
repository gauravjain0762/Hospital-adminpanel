"use client";
import { cn, getStatusColor } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";

// ─── StatusBadge ───────────────────────────────────────────────────────────
export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider border",
        getStatusColor(status)
      )}
    >
      {status}
    </span>
  );
}

// ─── MetricCard ────────────────────────────────────────────────────────────
interface MetricCardProps {
  label: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  suffix?: string;
  onClick?: () => void;
}
export function MetricCard({ label, value, change, icon, suffix, onClick }: MetricCardProps) {
  const isPositive = (change ?? 0) >= 0;
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-bg-card border border-border-subtle rounded-xl p-5 transition-all",
        onClick
          ? "cursor-pointer hover:border-border-default hover:bg-bg-hover hover:scale-[1.02]"
          : "hover:border-border-default"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        {icon && (
          <div className="w-9 h-9 rounded-lg bg-accent-red-glow border border-accent-red/20 flex items-center justify-center text-accent-red">
            {icon}
          </div>
        )}
        {change !== undefined && (
          <span className={cn("text-xs font-medium flex items-center gap-0.5", isPositive ? "text-emerald-400" : "text-red-400")}>
            {isPositive ? "↑" : "↓"} {Math.abs(change)}%
          </span>
        )}
      </div>
      <p className="text-text-muted text-xs uppercase tracking-wider mb-1">{label}</p>
      <p className="text-white text-2xl font-bold">
        {value}{suffix && <span className="text-lg ml-0.5">{suffix}</span>}
      </p>
    </div>
  );
}

// ─── PageHeader ────────────────────────────────────────────────────────────
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  stats?: React.ReactNode;
}
export function PageHeader({ title, subtitle, actions, stats }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-text-secondary text-sm mt-1">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {stats}
        {actions}
      </div>
    </div>
  );
}

// ─── SearchBar ─────────────────────────────────────────────────────────────
interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}
export function SearchBar({ value, onChange, placeholder, className }: SearchBarProps) {
  return (
    <div className={cn("relative", className)}>
      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Search..."}
        className="w-full h-9 pl-9 pr-8 bg-bg-card border border-border-default rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-red/50 transition-colors"
      />
      {value && (
        <button onClick={() => onChange("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary">
          <X size={12} />
        </button>
      )}
    </div>
  );
}

// ─── Select Filter ─────────────────────────────────────────────────────────
interface SelectFilterProps {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
  className?: string;
}
export function SelectFilter({ value, onChange, options, className }: SelectFilterProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "h-9 px-3 bg-bg-card border border-border-default rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent-red/50 transition-colors appearance-none cursor-pointer",
        className
      )}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-bg-card">
          {opt.label}
        </option>
      ))}
    </select>
  );
}

// ─── Pagination ────────────────────────────────────────────────────────────
interface PaginationProps {
  page: number;
  total: number;
  limit: number;
  onPageChange: (p: number) => void;
}
export function Pagination({ page, total, limit, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  if (totalPages <= 6) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="w-8 h-8 rounded-lg border border-border-default flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-accent-red/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft size={14} />
      </button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`e${i}`} className="w-8 h-8 flex items-center justify-center text-text-muted text-sm">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={cn(
              "w-8 h-8 rounded-lg border text-sm font-medium transition-all",
              page === p
                ? "bg-accent-red border-accent-red text-white"
                : "border-border-default text-text-secondary hover:text-text-primary hover:border-accent-red/30"
            )}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="w-8 h-8 rounded-lg border border-border-default flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-accent-red/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight size={14} />
      </button>
    </div>
  );
}

// ─── DataTable ─────────────────────────────────────────────────────────────
interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}
interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  keyExtractor: (row: T) => string;
}
export function DataTable<T>({ columns, data, loading, emptyMessage, onRowClick, keyExtractor }: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-14 bg-bg-card rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="py-16 text-center text-text-muted">
        <p className="text-sm">{emptyMessage || "No data found"}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border-subtle">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider py-3 px-4",
                  col.className
                )}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={keyExtractor(row)}
              onClick={() => onRowClick?.(row)}
              className={cn(
                "border-b border-border-subtle last:border-0 transition-colors",
                onRowClick && "cursor-pointer hover:bg-bg-hover"
              )}
            >
              {columns.map((col) => (
                <td key={col.key} className={cn("py-3.5 px-4 text-sm text-text-primary", col.className)}>
                  {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── ActionButton ──────────────────────────────────────────────────────────
interface ActionButtonProps {
  label: string;
  onClick: (e: React.MouseEvent) => void;
  variant?: "primary" | "secondary" | "danger" | "success" | "warning";
  size?: "sm" | "xs";
  disabled?: boolean;
}
export function ActionButton({ label, onClick, variant = "secondary", size = "sm", disabled }: ActionButtonProps) {
  const variants = {
    primary: "bg-gradient-accent text-white hover:opacity-90 border-accent-red",
    secondary: "bg-bg-elevated text-text-secondary hover:text-text-primary border-border-default hover:border-accent-red/30",
    danger: "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20",
    warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20",
  };
  const sizes = { sm: "h-7 px-3 text-xs", xs: "h-6 px-2 text-[10px]" };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-lg border font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size]
      )}
    >
      {label}
    </button>
  );
}

// ─── StarRating ────────────────────────────────────────────────────────────
export function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-1">
      <span className="text-yellow-400 text-sm">★</span>
      <span className="text-text-primary text-sm font-medium">{rating.toFixed(1)}</span>
    </span>
  );
}

// ─── Avatar ────────────────────────────────────────────────────────────────
export function Avatar({ name, initials, size = "md" }: { name: string; initials: string; size?: "sm" | "md" }) {
  const sizes = { sm: "w-7 h-7 text-[10px]", md: "w-9 h-9 text-xs" };
  return (
    <div
      className={cn(
        "rounded-full bg-gradient-accent flex items-center justify-center font-bold text-white shrink-0",
        sizes[size]
      )}
      title={name}
    >
      {initials}
    </div>
  );
}

// ─── LoadingSpinner ────────────────────────────────────────────────────────
export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center py-16", className)}>
      <div className="w-8 h-8 border-2 border-border-default border-t-accent-red rounded-full animate-spin" />
    </div>
  );
}

// ─── SectionCard ──────────────────────────────────────────────────────────
export function SectionCard({
  children,
  title,
  subtitle,
  headerRight,
  className,
  noPadding,
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  headerRight?: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}) {
  return (
    <div className={cn("bg-bg-card border border-border-subtle rounded-xl", className)}>
      {(title || headerRight) && (
        <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-border-subtle">
          <div>
            {title && <h3 className="text-white font-semibold text-base">{title}</h3>}
            {subtitle && <p className="text-text-muted text-xs mt-0.5">{subtitle}</p>}
          </div>
          {headerRight && <div>{headerRight}</div>}
        </div>
      )}
      <div className={noPadding ? "" : "p-5"}>{children}</div>
    </div>
  );
}

export function DatePickerInput({
  value,
  onChange,
  placeholder = "dd/mm/yyyy",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const display = value
    ? value.split("-").reverse().join("/")
    : placeholder;

  return (
    <div className="relative inline-flex items-center bg-bg-secondary border border-border-default rounded-lg px-3 py-1.5 cursor-pointer hover:border-accent-red transition-colors min-w-[130px]">
      <span className={`text-sm select-none ${value ? "text-white" : "text-text-muted"}`}>
        {display}
      </span>
      <svg className="ml-2 shrink-0 text-text-muted" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
    </div>
  );
}
