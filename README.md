# 🏥 Pulse Clinical OS — Admin Panel

A complete, production-grade **Healthcare Appointment Booking Admin Dashboard** built with:

- **Next.js 14** (App Router)
- **Redux Toolkit** (state management)
- **Axios** (API client, ready to swap dummy data)
- **Recharts** (analytics charts)
- **Tailwind CSS** (dark theme with red accents)
- **TypeScript** (fully typed)

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Open in browser
http://localhost:3000
```

The app auto-redirects `/` → `/dashboard`.

---

## 📁 Project Structure

```
pulse-clinical-os/
├── app/                        # Next.js App Router pages
│   ├── dashboard/page.tsx      # Main overview dashboard
│   ├── doctors/page.tsx        # Doctor management
│   ├── clinics/page.tsx        # Clinic management
│   ├── patients/page.tsx       # Patient management
│   ├── appointments/page.tsx   # Appointment management
│   ├── queue/page.tsx          # Live queue / token control
│   ├── verification/page.tsx   # Document verification center
│   ├── payments/page.tsx       # Payments & revenue
│   ├── reviews/page.tsx        # Reviews & complaints
│   ├── notifications/page.tsx  # Broadcast center
│   ├── support/page.tsx        # Support tickets
│   ├── reports/page.tsx        # Downloadable reports
│   ├── settings/page.tsx       # Admin settings
│   ├── admin-users/page.tsx    # Admin user management
│   └── content/page.tsx        # Content management
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx         # Collapsible sidebar navigation
│   │   ├── Header.tsx          # Top header with search
│   │   └── DashboardLayout.tsx # Main layout wrapper
│   ├── ui/
│   │   └── index.tsx           # Shared UI components
│   └── ReduxProvider.tsx       # Redux store provider
│
├── store/
│   ├── index.ts                # Redux store configuration
│   ├── hooks.ts                # Typed useAppDispatch/useAppSelector
│   └── slices/
│       ├── uiSlice.ts          # Sidebar, modals, search
│       ├── dashboardSlice.ts   # Dashboard metrics & charts
│       ├── doctorsSlice.ts     # Doctors CRUD + filters
│       ├── clinicsSlice.ts     # Clinics management
│       ├── patientsSlice.ts    # Patients management
│       ├── appointmentsSlice.ts # Appointments
│       ├── queueSlice.ts       # Live queue control
│       ├── paymentsSlice.ts    # Payments & revenue
│       ├── verificationSlice.ts # Document verification
│       ├── reviewsSlice.ts     # Reviews & complaints
│       ├── notificationsSlice.ts # Broadcast notifications
│       └── supportSlice.ts     # Support tickets
│
├── lib/
│   ├── dummyData.ts            # All mock data (replace with real API)
│   ├── apiClient.ts            # Axios instance + API endpoints
│   └── utils.ts                # cn(), formatCurrency(), etc.
│
└── types/
    └── index.ts                # All TypeScript interfaces
```

---

## 🔌 Switching to Real API

All dummy data is isolated in `lib/dummyData.ts`.  
The Axios client is configured in `lib/apiClient.ts`.

To connect real APIs:

1. Set `NEXT_PUBLIC_API_URL` in your `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=https://your-api.com/v1
   ```

2. Replace each `createAsyncThunk` to use `apiClient` instead of dummy data:

   **Before (dummy):**
   ```ts
   export const fetchDoctors = createAsyncThunk("doctors/fetchAll", async () => {
     await new Promise((r) => setTimeout(r, 400));
     return dummyDoctors;
   });
   ```

   **After (real API):**
   ```ts
   export const fetchDoctors = createAsyncThunk("doctors/fetchAll", async () => {
     const response = await apiClient.get(API.doctors.list());
     return response.data;
   });
   ```

All API endpoints are pre-defined in `lib/apiClient.ts` under the `API` object.

---

## ✅ Features Implemented

| Page | Features |
|------|----------|
| Dashboard | Metrics cards, appointment trend chart, patient growth chart, revenue chart, recent activity, top doctors |
| Doctors | Table with filters, approve/reject/suspend actions, pagination, summary cards |
| Clinics | Table with search/filter, activate/deactivate actions |
| Patients | Table with search/filter, block/unblock actions |
| Appointments | Table with multi-filter, complete/cancel actions |
| Queue | Live token board cards with progress bars, call next/skip/pause/resume controls, table overview |
| Verification | Credential workflow queue, document preview panel, verification checklist, approve/reject actions |
| Payments | Revenue summary cards, bar chart, payout distribution, recent payouts table |
| Reviews | Sentiment analysis chart, tabbed review table, urgent dispute panel, resolution template |
| Notifications | Broadcast form with channel selection, recent history, full log table |
| Support | Ticket table with priority/status filters, resolve/escalate actions |
| Reports | Report type cards with format badges, custom date range export |
| Settings | Profile, notifications, security settings tabs |
| Admin Users | Admin user list with roles and access control |

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Background | `#0f0f0f` |
| Card | `#1a1a1a` |
| Elevated | `#1f1f1f` |
| Border | `#2a2a2a` |
| Accent Red | `#e53e3e` |
| Text Primary | `#f5f5f5` |
| Text Secondary | `#a0a0a0` |
| Text Muted | `#606060` |

---

## 🛠️ Tech Stack

| Package | Version | Purpose |
|---------|---------|---------|
| next | 14.2.5 | Framework |
| @reduxjs/toolkit | ^2.3.0 | State management |
| react-redux | ^9.1.2 | React bindings |
| axios | ^1.7.7 | HTTP client |
| recharts | ^2.12.7 | Charts |
| lucide-react | ^0.447.0 | Icons |
| tailwindcss | ^3.4.1 | Styling |
| clsx + tailwind-merge | latest | Class utilities |

---

Built with ❤️ — Pulse Clinical OS
