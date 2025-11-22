import { Activity, Users, Globe, ShieldCheck } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-8 md:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Partner with Us</h1>
        
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          QuickHealth was founded with a simple mission: to make healthcare insights accessible to everyone, instantly. We believe that understanding your body shouldn't require a waiting room.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="p-6 bg-blue-50 rounded-xl">
            <Activity className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="font-bold text-gray-900 text-lg mb-2">Our Mission</h3>
            <p className="text-gray-600">To provide instant, AI-powered health assessments that empower users to make better lifestyle choices.</p>
          </div>
          <div className="p-6 bg-purple-50 rounded-xl">
            <Users className="w-8 h-8 text-purple-600 mb-4" />
            <h3 className="font-bold text-gray-900 text-lg mb-2">Our Team</h3>
            <p className="text-gray-600">A dedicated team of doctors, developers, and data scientists working together to bridge technology and medicine.</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
        <p className="text-gray-600 mb-6">
          Started in 2025 at Bina Nusantara University, QuickHealth began as a student project to solve the complexity of basic health checks. Today, we serve thousands of users, helping them track their BMI, BMR, and mental well-being with ease.
        </p>
      </div>
    </main>
  );
}