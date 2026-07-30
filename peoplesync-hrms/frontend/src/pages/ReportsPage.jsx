import React, { useState, useEffect } from 'react';
import { reportService } from '../services/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useToast } from '../context/ToastContext';
import { Download, BarChart3, TrendingUp, PieChart as PieIcon, FileText } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const ReportsPage = () => {
  const { showToast } = useToast();
  const [chartsData, setChartsData] = useState(null);

  useEffect(() => {
    reportService.getChartsData().then(data => setChartsData(data));
  }, []);

  const handleExportFullReport = () => {
    showToast({ message: 'Generating & downloading 2026 Executive HR Analytics Report (PDF)...', type: 'success' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-text dark:text-gray-100 tracking-tight">Executive HR Analytics & Reports</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            In-depth reporting on workforce growth, hiring velocity, attendance consistency, and leave utilization.
          </p>
        </div>

        <Button variant="primary" icon={Download} onClick={handleExportFullReport}>
          Export Full HR Report
        </Button>
      </div>

      {chartsData && (
        <div className="space-y-6">
          {/* Top Charts: Monthly Hiring Velocity & Leave Utilization */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Hiring Bar Chart */}
            <Card title="Monthly Hiring & Retention Velocity" subtitle="Hired workforce vs attrition count per month">
              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartsData.monthlyHiring}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#18221D', borderColor: '#2D3F36', borderRadius: '12px', color: '#FFF' }}
                    />
                    <Legend />
                    <Bar dataKey="hired" fill="#1F4D3B" name="New Hires" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="exited" fill="#DC2626" name="Exits" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Leave Usage Donut Chart */}
            <Card title="Leave Utilization Quota" subtitle="Days consumed by leave category">
              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartsData.leaveAnalytics} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis type="number" stroke="#9CA3AF" fontSize={12} />
                    <YAxis dataKey="type" type="category" stroke="#9CA3AF" fontSize={12} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#18221D', borderColor: '#2D3F36', borderRadius: '12px', color: '#FFF' }}
                    />
                    <Legend />
                    <Bar dataKey="used" fill="#2E7D57" name="Days Used" radius={[0, 6, 6, 0]} />
                    <Bar dataKey="total" fill="#6B4F3B" name="Total Quota" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Attendance Trend Full Width */}
          <Card title="6-Month Presence & Attendance Stability" subtitle="Aggregated organizational attendance rate (%)">
            <div className="h-80 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartsData.attendanceTrend}>
                  <defs>
                    <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2E7D57" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#2E7D57" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                  <YAxis domain={[80, 100]} stroke="#9CA3AF" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#18221D', borderColor: '#2D3F36', borderRadius: '12px', color: '#FFF' }}
                  />
                  <Area type="monotone" dataKey="rate" stroke="#2E7D57" strokeWidth={3} fillOpacity={1} fill="url(#areaColor)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
