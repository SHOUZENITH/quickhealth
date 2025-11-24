import PageNavigation from '@/components/PageNavigation';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* --- 1. ADDED: Navigation Bar --- */}
        <PageNavigation />

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-gray-500 mb-8">Last updated: November 2025</p>

        <div className="prose prose-blue max-w-none text-gray-600 space-y-6">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Introduction</h2>
            <p>
              Welcome to QuickHealth. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy will inform you as to how we look after your personal data when you visit our website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Data We Collect</h2>
            <p>
              We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
              <li><strong>Health Data:</strong> includes BMI, weight, height, and other metrics you input into our calculator.</li>
              <li><strong>Usage Data:</strong> includes information about how you use our website and services.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. How We Use Your Data</h2>
            <p>
              We will only use your personal data when the law allows us to. Most commonly, we use your data to provide the health analysis services you requested and to improve our algorithm accuracy.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}