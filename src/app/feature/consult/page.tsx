'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  ArrowLeft, 
  Star, 
  Clock, 
  Video, 
  Calendar,
  Filter,
  CheckCircle2,
  Stethoscope,
  Heart,
  Brain,
  Baby,
  Eye,
  X
} from 'lucide-react';

// --- MOCK DATA ---
const SPECIALTIES = [
  { id: 'all', name: 'All Specialists', icon: <Stethoscope className="w-4 h-4" /> },
  { id: 'general', name: 'General Practitioner', icon: <Stethoscope className="w-4 h-4" /> },
  { id: 'cardio', name: 'Cardiologist', icon: <Heart className="w-4 h-4" /> },
  { id: 'derma', name: 'Dermatologist', icon: <SparklesIcon /> },
  { id: 'pediatric', name: 'Pediatrician', icon: <Baby className="w-4 h-4" /> },
  { id: 'psych', name: 'Psychiatrist', icon: <Brain className="w-4 h-4" /> },
];

const DOCTORS = [
  { 
    id: 1, 
    name: 'Dr. Sarah Wilson', 
    specialty: 'general', 
    specialtyName: 'General Practitioner',
    rating: 4.9, 
    reviews: 128, 
    exp: '8 years', 
    price: 50000, 
    isOnline: true,
    image: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
  },
  { 
    id: 2, 
    name: 'Dr. James Chen', 
    specialty: 'cardio', 
    specialtyName: 'Cardiologist',
    rating: 5.0, 
    reviews: 84, 
    exp: '12 years', 
    price: 150000, 
    isOnline: false,
    nextAvailable: '14:00 Today',
    image: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
  },
  { 
    id: 3, 
    name: 'Dr. Emily Johnson', 
    specialty: 'pediatric', 
    specialtyName: 'Pediatrician',
    rating: 4.8, 
    reviews: 210, 
    exp: '15 years', 
    price: 90000, 
    isOnline: true,
    image: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
  },
  { 
    id: 4, 
    name: 'Dr. Michael Chang', 
    specialty: 'derma', 
    specialtyName: 'Dermatologist',
    rating: 4.7, 
    reviews: 156, 
    exp: '6 years', 
    price: 120000, 
    isOnline: true,
    image: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' 
  },
  { 
    id: 5, 
    name: 'Dr. Lisa Wong', 
    specialty: 'psych', 
    specialtyName: 'Psychiatrist',
    rating: 4.9, 
    reviews: 92, 
    exp: '10 years', 
    price: 200000, 
    isOnline: false,
    nextAvailable: 'Tomorrow',
    image: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' 
  },
  { 
    id: 6, 
    name: 'Dr. Robert Taylor', 
    specialty: 'general', 
    specialtyName: 'General Practitioner',
    rating: 4.6, 
    reviews: 340, 
    exp: '20 years', 
    price: 60000, 
    isOnline: true,
    image: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400' 
  },
];

export default function ConsultPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null); // For Modal
  const [bookingStep, setBookingStep] = useState<'details' | 'success'>('details');

  const filteredDoctors = useMemo(() => {
    return DOCTORS.filter((doc) => {
      const matchesCategory = activeCategory === 'all' || doc.specialty === activeCategory;
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || doc.specialtyName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const formatIDR = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };

  // --- BOOKING HANDLER ---
  const handleBook = (doctor: any) => {
    setSelectedDoctor(doctor);
    setBookingStep('details');
  };

  const confirmBooking = () => {
    setBookingStep('success');
    // In a real app, you would save this to Supabase 'appointments' table here
  };

  const closeBooking = () => {
    setSelectedDoctor(null);
    setBookingStep('details');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050b14] text-gray-900 dark:text-white font-sans transition-colors duration-300">
      
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#050b14]/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition">
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </Link>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500 dark:from-blue-400 dark:to-teal-400">
              Find a Doctor
            </h1>
          </div>
          
          {/* Simple user avatar placeholder or profile link */}
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10"></div>
        </div>
      </header>

      {/* --- SEARCH & FILTERS --- */}
      <div className="bg-white dark:bg-[#0a111d] border-b border-gray-200 dark:border-white/5 pt-8 pb-6 px-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold mb-2">Consult with experts</h2>
            <p className="text-gray-500 dark:text-gray-400">Get medical advice from verified doctors via video call or chat.</p>
          </div>
          
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search doctor, specialty, or symptom..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-100 dark:bg-white/5 border border-transparent focus:bg-white dark:focus:bg-[#0a111d] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
            />
          </div>

          {/* Specialties Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {SPECIALTIES.map((spec) => (
              <button
                key={spec.id}
                onClick={() => setActiveCategory(spec.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  activeCategory === spec.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
                }`}
              >
                {spec.icon}
                {spec.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- DOCTOR GRID --- */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <div key={doctor.id} className="bg-white dark:bg-[#0a111d] border border-gray-200 dark:border-white/5 rounded-2xl p-5 hover:border-blue-500/30 transition-all hover:shadow-lg dark:hover:shadow-none flex flex-col">
                
                {/* Header: Image & Status */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold ${doctor.image}`}>
                      {doctor.name.split(' ')[1][0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1">{doctor.name}</h3>
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{doctor.specialtyName}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <span className="bg-gray-100 dark:bg-white/10 px-1.5 py-0.5 rounded">{doctor.exp} exp</span>
                        <span>•</span>
                        <div className="flex items-center text-yellow-500">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="ml-1 font-bold text-gray-700 dark:text-gray-300">{doctor.rating}</span>
                          <span className="text-gray-400 ml-0.5">({doctor.reviews})</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Availability Badge */}
                <div className="flex items-center gap-2 mb-6">
                  {doctor.isOnline ? (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-500/10 px-2.5 py-1 rounded-full">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      Available Now
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-100 dark:bg-white/5 px-2.5 py-1 rounded-full">
                      <Clock className="w-3 h-3" />
                      Next: {doctor.nextAvailable}
                    </span>
                  )}
                </div>

                {/* Footer: Price & Action */}
                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Consultation Fee</p>
                    <p className="font-bold text-lg">{formatIDR(doctor.price)}</p>
                  </div>
                  <button 
                    onClick={() => handleBook(doctor)}
                    className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                      doctor.isOnline 
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20' 
                        : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10'
                    }`}
                  >
                    {doctor.isOnline ? 'Chat Now' : 'Book'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold">No doctors found</h3>
            <p className="text-gray-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </main>

      {/* --- BOOKING MODAL --- */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeBooking}></div>
          <div className="relative w-full max-w-md bg-white dark:bg-[#0f172a] rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-[#0a111d]">
              <h3 className="font-bold text-lg">Appointment Details</h3>
              <button onClick={closeBooking} className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {bookingStep === 'details' ? (
                <>
                  <div className="flex gap-4 mb-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold flex-shrink-0 ${selectedDoctor.image}`}>
                      {selectedDoctor.name.split(' ')[1][0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{selectedDoctor.name}</h4>
                      <p className="text-blue-600 dark:text-blue-400 text-sm">{selectedDoctor.specialtyName}</p>
                      <p className="text-gray-500 text-sm mt-1">{formatIDR(selectedDoctor.price)} / session</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">Date</p>
                        <p className="font-medium">Today, {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 flex items-center gap-3">
                      <Video className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">Method</p>
                        <p className="font-medium">Video Consultation</p>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={confirmBooking}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
                  >
                    Confirm & Pay {formatIDR(selectedDoctor.price)}
                  </button>
                </>
              ) : (
                // SUCCESS STATE
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Booking Confirmed!</h3>
                  <p className="text-gray-500 mb-8">You will receive a notification when {selectedDoctor.name} is ready.</p>
                  <button 
                    onClick={closeBooking}
                    className="w-full py-3 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 font-bold rounded-xl transition"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function SparklesIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  )
}