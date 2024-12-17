import React from 'react';
import { Activity } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-orange-500" />
            <h1 className="ml-2 text-2xl font-bold text-gray-900">DomainPulse</h1>
          </div>
        </div>
      </div>
    </header>
  );
}