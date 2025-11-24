'use client';

import Link from 'next/link';
import { Home, ChevronLeft } from 'lucide-react';

interface PageNavigationProps {
  variant?: 'glass' | 'light'; // 'glass' for dark backgrounds, 'light' for white pages
  backText?: string;
}

export default function PageNavigation({ variant = 'glass', backText = 'Home' }: PageNavigationProps) {
  
  // Style for Dark/Gradient Backgrounds (The one you like)
  const glassStyle = "bg-white/10 hover:bg-white/20 text-white border-white/10 backdrop-blur-md";
  
  // Style for White Backgrounds (If you ever need it)
  const lightStyle = "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200";

  const currentStyle = variant === 'glass' ? glassStyle : lightStyle;

  return (
    <Link 
      href="/" 
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border ${currentStyle}`}
    >
      {/* You can swap this icon for ChevronLeft if you prefer "Back" over "Home" */}
      <Home className="w-4 h-4" /> 
      <span>{backText}</span>
    </Link>
  );
}