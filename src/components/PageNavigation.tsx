'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';

export default function PageNavigation() {
  const router = useRouter();

  return (
    <div className="flex items-center gap-4 mb-8 text-sm font-medium text-gray-500">
      {/* Back Button */}
      <button 
        onClick={() => router.back()} 
        className="flex items-center gap-2 hover:text-blue-600 transition bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" /> 
        Back
      </button>

      {/* Separator */}
      <span className="text-gray-300">|</span>

      {/* Home Button */}
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