'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { STATUS_LABELS, BOOKING_STATUSES } from '@/lib/constants';

export function BookingsStatusChart({ data }) {
  const rows = (data || [])
    .map((row) => ({ status: row.status, count: Number(row.count) || 0 }))
    .sort((a, b) => BOOKING_STATUSES.indexOf(a.status) - BOOKING_STATUSES.indexOf(b.status));

  if (rows.length === 0) {
    return <p className="text-sm text-muted-foreground">No booking data yet.</p>;
  }

  const chartData = rows.map((row) => ({
    status: STATUS_LABELS[row.status] || row.status,
    count: row.count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading">Bookings by Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="Bookings" fill="#0f766e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
