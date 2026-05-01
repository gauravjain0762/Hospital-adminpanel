import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  dummyDoctors,
  dummyPatients,
  dummyAppointments,
  appointmentTrendData,
  revenueData,
  patientGrowthData,
  recentActivity,
} from "@/lib/dummyData";

interface DashboardState {
  metrics: {
    totalDoctors: number;
    totalPatients: number;
    totalClinics: number;
    todaysAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
    activeTokens: number;
    totalRevenue: number;
  };
  appointmentTrend: typeof appointmentTrendData;
  revenueChart: typeof revenueData;
  patientGrowth: typeof patientGrowthData;
  recentActivity: typeof recentActivity;
  topDoctors: typeof dummyDoctors;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  metrics: {
    totalDoctors: 0,
    totalPatients: 0,
    totalClinics: 0,
    todaysAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    activeTokens: 0,
    totalRevenue: 0,
  },
  appointmentTrend: [],
  revenueChart: [],
  patientGrowth: [],
  recentActivity: [],
  topDoctors: [],
  loading: false,
  error: null,
};

export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchData",
  async () => {
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 600));
    return {
      metrics: {
        totalDoctors: dummyDoctors.length,
        totalPatients: dummyPatients.length,
        totalClinics: 5,
        todaysAppointments: 320,
        completedAppointments: dummyAppointments.filter((a) => a.status === "completed").length,
        cancelledAppointments: dummyAppointments.filter((a) => a.status === "cancelled").length,
        activeTokens: 48,
        totalRevenue: 1284500,
      },
      appointmentTrend: appointmentTrendData,
      revenueChart: revenueData,
      patientGrowth: patientGrowthData,
      recentActivity,
      topDoctors: dummyDoctors
        .filter((d) => d.verificationStatus === "approved")
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3),
    };
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.metrics = action.payload.metrics;
        state.appointmentTrend = action.payload.appointmentTrend;
        state.revenueChart = action.payload.revenueChart;
        state.patientGrowth = action.payload.patientGrowth;
        state.recentActivity = action.payload.recentActivity;
        state.topDoctors = action.payload.topDoctors;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch dashboard data";
      });
  },
});

export default dashboardSlice.reducer;
