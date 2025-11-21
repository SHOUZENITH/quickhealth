import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-900 text-white p-6">
      <div className="max-w-3xl text-center space-y-8">
        <div className="inline-block px-4 py-1 bg-blue-500 bg-opacity-30 rounded-full text-sm font-medium border border-blue-400">
          v1.0 Public Beta
        </div>
        
        <h1 className="text-6xl font-extrabold tracking-tight">
          QuickHealth <span className="text-blue-300">AI</span>
        </h1>
        
        <p className="text-xl text-blue-100 max-w-2xl mx-auto">
          Analyze your lifestyle, diet, and sleep patterns in seconds. 
          Get a personalized health score without needing a doctor visit.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link 
            href="/calculator" 
            className="px-8 py-4 bg-white text-blue-900 font-bold rounded-lg shadow-lg hover:bg-gray-100 transition transform hover:-translate-y-1"
          >
            🚀 Start Checkup (Guest)
          </Link>

          <Link 
            href="/login" 
            className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-blue-900 transition"
          >
            🔐 Login / History
          </Link>
        </div>

        <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-left text-blue-200 text-sm">
            <div className="p-4 bg-white/10 rounded backdrop-blur">
                <h3 className="font-bold text-white mb-2">⚡ Instant Analysis</h3>
                <p>Calculates BMI, BMR, and Lifestyle Score instantly.</p>
            </div>
            <div className="p-4 bg-white/10 rounded backdrop-blur">
                <h3 className="font-bold text-white mb-2">🔒 Privacy First</h3>
                <p>Data is not saved unless you log in. Download PDF locally.</p>
            </div>
            <div className="p-4 bg-white/10 rounded backdrop-blur">
                <h3 className="font-bold text-white mb-2">📈 Track Progress</h3>
                <p>Create an account to save your history and watch your health improve.</p>
            </div>
        </div>
      </div>
    </main>
  );
}