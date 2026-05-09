'use client';

import { StatisticsDashboard } from "@/components/stats";

export default function StatisticsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto py-8">
        <StatisticsDashboard />
      </div>
    </div>
  );
}