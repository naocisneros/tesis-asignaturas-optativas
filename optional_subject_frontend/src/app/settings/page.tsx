'use client';

import UserManagement from '@/components/user-settings-component';

export default function SettingsPage() {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Gestión de Usuarios</h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6">
        <UserManagement />
      </div>
    </div>
  );
}