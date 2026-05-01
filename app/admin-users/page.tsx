"use client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { PageHeader, SectionCard, StatusBadge } from "@/components/ui";
import { UserCog, Plus } from "lucide-react";

const adminUsers = [
  { id: "a1", name: "Dr. Aris Thorne", email: "aris.thorne@pulseclinical.com", role: "Chief Administrator", status: "active", lastLogin: "Today, 9:24 AM" },
  { id: "a2", name: "Maria Santos", email: "maria.s@pulseclinical.com", role: "System Moderator", status: "active", lastLogin: "Today, 8:10 AM" },
  { id: "a3", name: "James Crawford", email: "james.c@pulseclinical.com", role: "Finance Admin", status: "active", lastLogin: "Yesterday, 5:45 PM" },
  { id: "a4", name: "Priya Nair", email: "priya.n@pulseclinical.com", role: "Support Lead", status: "inactive", lastLogin: "Oct 20, 2024" },
];

export default function AdminUsersPage() {
  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <PageHeader
          title="Admin Users"
          subtitle="Manage administrator accounts and role-based access control."
          actions={
            <button className="h-9 px-4 rounded-lg bg-gradient-accent text-white text-sm font-medium flex items-center gap-2 hover:opacity-90 shadow-accent-glow">
              <Plus size={14} /> Add Admin User
            </button>
          }
        />
        <SectionCard noPadding>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle">
                {["Administrator", "Email", "Role", "Status", "Last Login", "Actions"].map((h) => (
                  <th key={h} className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider py-3 px-5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {adminUsers.map((user) => (
                <tr key={user.id} className="border-b border-border-subtle last:border-0 hover:bg-bg-hover transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-accent flex items-center justify-center text-white text-xs font-bold">
                        {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <span className="text-text-primary font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-5 text-text-secondary text-sm">{user.email}</td>
                  <td className="py-4 px-5">
                    <span className="px-2 py-0.5 rounded text-xs bg-accent-red-glow border border-accent-red/20 text-accent-red-light">{user.role}</span>
                  </td>
                  <td className="py-4 px-5"><StatusBadge status={user.status} /></td>
                  <td className="py-4 px-5 text-text-muted text-sm">{user.lastLogin}</td>
                  <td className="py-4 px-5">
                    <div className="flex gap-1.5">
                      <button className="h-7 px-2.5 rounded-lg border border-border-default text-text-secondary text-xs hover:text-text-primary hover:border-accent-red/30 transition-all">Edit</button>
                      <button className="h-7 px-2.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 transition-colors">Revoke</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
      </div>
    </DashboardLayout>
  );
}
