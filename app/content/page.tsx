"use client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { PageHeader, SectionCard } from "@/components/ui";
import { FileText } from "lucide-react";

export default function ContentPage() {
  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <PageHeader title="Content Management" subtitle="Manage platform content, FAQs, and announcements." />
        <SectionCard>
          <div className="py-16 text-center">
            <FileText size={32} className="text-text-muted mx-auto mb-3" />
            <p className="text-text-secondary">Content management module coming soon.</p>
          </div>
        </SectionCard>
      </div>
    </DashboardLayout>
  );
}
