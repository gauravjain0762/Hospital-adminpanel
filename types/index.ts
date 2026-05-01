// Doctor types
export interface Doctor {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  initials: string;
  specialization: string;
  clinic: string;
  clinicId: string;
  status: "active" | "inactive" | "suspended";
  verificationStatus: "approved" | "pending" | "rejected";
  rating: number;
  totalAppointments: number;
  earnings: number;
  phone: string;
  experience: number;
  joinedAt: string;
  documents: Document[];
}

// Clinic types
export interface Clinic {
  id: string;
  name: string;
  location: string;
  city: string;
  doctorsAssigned: number;
  status: "active" | "inactive";
  dailyAppointments: number;
  rating: number;
  phone: string;
  email: string;
  timings: string;
  tokenCapacity: number;
  services: string[];
  consultationFee: number;
}

// Patient types
export interface Patient {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  initials: string;
  totalAppointments: number;
  lastVisit: string;
  status: "active" | "blocked";
  age: number;
  bloodGroup: string;
  address: string;
  joinedAt: string;
}

// Appointment types
export interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  doctorId: string;
  clinic: string;
  clinicId: string;
  date: string;
  time: string;
  tokenNumber: number;
  status: "waiting" | "completed" | "cancelled" | "in_progress";
  paymentStatus: "paid" | "pending" | "cash_pending";
  amount: number;
  notes?: string;
}

// Queue types
export interface QueueEntry {
  id: string;
  doctorName: string;
  doctorId: string;
  clinic: string;
  currentToken: number;
  waitingPatients: number;
  avgWaitTime: number;
  status: "active" | "paused" | "closed";
  totalTokens: number;
}

// Payment types
export interface Payment {
  id: string;
  doctorName: string;
  doctorId: string;
  specialization: string;
  clinic: string;
  paymentId: string;
  amount: number;
  status: "completed" | "processing" | "failed" | "pending";
  payoutDate: string;
  initials: string;
}

// Verification types
export interface VerificationDoc {
  id: string;
  doctorName: string;
  doctorId: string;
  specialization: string;
  initials: string;
  documentType: string;
  uploadDate: string;
  status: "pending" | "verified" | "rejected";
  fileType: "pdf" | "image";
}

// Review types
export interface Review {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  doctorId: string;
  rating: number;
  reviewText: string;
  date: string;
  status: "published" | "flagged" | "resolved" | "hidden";
}

// Notification types
export interface Notification {
  id: string;
  title: string;
  audience: "doctors" | "patients" | "all" | "clinics";
  channel: ("push" | "email" | "sms")[];
  status: "delivered" | "queued" | "failed" | "scheduled";
  sentAt: string;
  reachCount: number;
}

// Support Ticket types
export interface SupportTicket {
  id: string;        // mapped from ticketId
  userName: string;
  phone: string;
  subject: string;
  category: string;
  priority: string;  // "Low" | "Medium" | "High"
  status: "open" | "closed";
  description: string;
  createdAt: string;
  userType: string;  // "doctor" | "patient"
}

// Document types
export interface Document {
  id: string;
  type: string;
  uploadDate: string;
  status: string;
}

// Analytics/Dashboard types
export interface DashboardMetric {
  label: string;
  value: string | number;
  change: number;
  changeType: "positive" | "negative";
}

export interface ChartDataPoint {
  name: string;
  value: number;
  secondary?: number;
}

// Redux state types
export interface PaginationState {
  page: number;
  limit: number;
  total: number;
}

export interface FilterState {
  search: string;
  status: string;
  dateFrom: string;
  dateTo: string;
  [key: string]: string;
}
