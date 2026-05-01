"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchQueue, callNextToken, skipToken, pauseQueue, resumeQueue } from "@/store/slices/queueSlice";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { PageHeader, StatusBadge, SectionCard, LoadingSpinner, ActionButton } from "@/components/ui";
import { QueueEntry } from "@/types";
import { Clock, Users, Hash, ArrowRight, SkipForward, Pause, Play, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export default function QueuePage() {
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((s) => s.queue);

  useEffect(() => { dispatch(fetchQueue()); }, [dispatch]);

  const totalWaiting = list.reduce((s, q) => s + q.waitingPatients, 0);
  const activeQueues = list.filter((q) => q.status === "active").length;

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <PageHeader
          title="Queue / Token Management"
          subtitle="Live monitoring and control of all clinical queue systems."
          actions={
            <button
              onClick={() => dispatch(fetchQueue())}
              className="h-9 px-4 rounded-lg border border-border-default text-text-secondary text-sm hover:text-text-primary flex items-center gap-2"
            >
              <RefreshCw size={14} /> Refresh
            </button>
          }
          stats={
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-white font-bold text-lg">{activeQueues}</p>
                <p className="text-text-muted text-xs">Active Queues</p>
              </div>
              <div className="w-px h-8 bg-border-default" />
              <div className="text-center">
                <p className="text-white font-bold text-lg">{totalWaiting}</p>
                <p className="text-text-muted text-xs">Total Waiting</p>
              </div>
            </div>
          }
        />

        {loading ? <LoadingSpinner /> : (
          <div className="space-y-4">
            {/* Live token board */}
            <div className="grid grid-cols-2 gap-4">
              {list.map((q) => (
                <QueueCard key={q.id} queue={q} dispatch={dispatch} />
              ))}
            </div>

            {/* Table view */}
            <SectionCard title="Queue Overview" subtitle="All active clinical queues" noPadding>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border-subtle">
                      {["Doctor", "Clinic", "Current Token", "Waiting", "Avg Wait", "Status", "Actions"].map((h) => (
                        <th key={h} className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider py-3 px-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((q) => (
                      <tr key={q.id} className="border-b border-border-subtle last:border-0 hover:bg-bg-hover transition-colors">
                        <td className="py-3.5 px-4 text-text-primary font-medium text-sm">{q.doctorName}</td>
                        <td className="py-3.5 px-4 text-text-secondary text-sm">{q.clinic}</td>
                        <td className="py-3.5 px-4">
                          <span className="w-10 h-10 rounded-full bg-accent-red-glow border-2 border-accent-red/40 text-accent-red-light font-bold text-lg flex items-center justify-center">
                            {q.currentToken}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-text-primary font-medium">{q.waitingPatients}</td>
                        <td className="py-3.5 px-4 text-text-secondary text-sm">{q.avgWaitTime} min</td>
                        <td className="py-3.5 px-4"><StatusBadge status={q.status} /></td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <ActionButton label="Next" onClick={() => dispatch(callNextToken(q.id))} variant="success" size="xs" />
                            <ActionButton label="Skip" onClick={() => dispatch(skipToken(q.id))} variant="warning" size="xs" />
                            {q.status === "active"
                              ? <ActionButton label="Pause" onClick={() => dispatch(pauseQueue(q.id))} variant="secondary" size="xs" />
                              : <ActionButton label="Resume" onClick={() => dispatch(resumeQueue(q.id))} variant="success" size="xs" />
                            }
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function QueueCard({ queue: q, dispatch }: { queue: QueueEntry; dispatch: ReturnType<typeof useAppDispatch> }) {
  const progressPct = Math.min((q.currentToken / q.totalTokens) * 100, 100);

  return (
    <SectionCard
      title={q.doctorName}
      subtitle={q.clinic}
      headerRight={<StatusBadge status={q.status} />}
    >
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center p-3 rounded-xl bg-bg-elevated border border-border-subtle">
          <div className="w-12 h-12 rounded-full bg-accent-red-glow border-2 border-accent-red/40 flex items-center justify-center text-accent-red-light text-2xl font-bold mx-auto mb-1">
            {q.currentToken}
          </div>
          <p className="text-text-muted text-[10px] uppercase tracking-wider">Current</p>
        </div>
        <div className="text-center p-3 rounded-xl bg-bg-elevated border border-border-subtle">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Users size={14} className="text-blue-400" />
            <span className="text-white text-xl font-bold">{q.waitingPatients}</span>
          </div>
          <p className="text-text-muted text-[10px] uppercase tracking-wider">Waiting</p>
        </div>
        <div className="text-center p-3 rounded-xl bg-bg-elevated border border-border-subtle">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Clock size={14} className="text-yellow-400" />
            <span className="text-white text-xl font-bold">{q.avgWaitTime}</span>
          </div>
          <p className="text-text-muted text-[10px] uppercase tracking-wider">Avg Min</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-text-muted mb-1">
          <span>Progress</span>
          <span>{q.currentToken}/{q.totalTokens}</span>
        </div>
        <div className="h-2 rounded-full bg-bg-elevated overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-accent transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <button
          onClick={() => dispatch(callNextToken(q.id))}
          className="flex-1 h-9 rounded-lg bg-gradient-accent text-white text-xs font-medium flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
        >
          <ArrowRight size={13} /> Call Next
        </button>
        <button
          onClick={() => dispatch(skipToken(q.id))}
          className="h-9 px-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-xs font-medium flex items-center gap-1.5 hover:bg-yellow-500/20 transition-colors"
        >
          <SkipForward size={13} /> Skip
        </button>
        {q.status === "active" ? (
          <button
            onClick={() => dispatch(pauseQueue(q.id))}
            className="h-9 px-3 rounded-lg border border-border-default text-text-secondary text-xs font-medium flex items-center gap-1.5 hover:bg-bg-hover transition-colors"
          >
            <Pause size={13} /> Pause
          </button>
        ) : (
          <button
            onClick={() => dispatch(resumeQueue(q.id))}
            className="h-9 px-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-medium flex items-center gap-1.5 hover:bg-emerald-500/20 transition-colors"
          >
            <Play size={13} /> Resume
          </button>
        )}
      </div>
    </SectionCard>
  );
}
