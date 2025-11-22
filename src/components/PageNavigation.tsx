'use client';

import Link from 'next/link';
import { Home } from 'lucide-react';

export default function PageNavigation() {
  return (
    <div className="flex items-center mb-8 text-sm font-medium text-gray-500">
      <Link 
        href="/" 
        className="flex items-center gap-2 hover:text-blue-600 transition bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm"
      >
        <Home className="w-4 h-4" /> 
        Home
      </Link>
    </div>
  );
}