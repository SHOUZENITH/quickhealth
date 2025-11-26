'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  Tag, 
  ChevronRight, 
  TrendingUp, 
  Filter,
  ExternalLink,
  Loader2
} from 'lucide-react';

// --- TYPE DEFINITIONS ---
type Article = {
  id: string;
  title: string;
  description: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: string;
  imageUrl: string;
  sourceUrl?: string; // For external API links
};

// --- MOCK DATA (Fallback / Demo Content) ---
const DEMO_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'The Science of Sleep: Why You Need 8 Hours',
    description: 'Understanding the circadian rhythm and how sleep deprivation affects your long-term health and cognitive function.',
    category: 'Sleep',
    author: 'Dr. Matthew Walker',
    publishedAt: '2024-03-15',
    readTime: '6 min read',
    imageUrl: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
  },
  {
    id: '2',
    title: 'Mediterranean Diet: A Beginner’s Guide',
    description: 'Ranked as the #1 diet for health, this guide covers the essential foods, benefits, and simple recipes to get started.',
    category: 'Nutrition',
    author: 'Sarah Berry, RD',
    publishedAt: '2024-03-12',
    readTime: '8 min read',
    imageUrl: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  },
  {
    id: '3',
    title: 'Mental Resilience in High-Stress Jobs',
    description: 'Techniques for managing burnout and anxiety in fast-paced professional environments.',
    category: 'Mental Health',
    author: 'Dr. Ali Abdaal',
    publishedAt: '2024-03-10',
    readTime: '5 min read',
    imageUrl: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  },
  {
    id: '4',
    title: 'HIIT vs. Steady Cardio: Which is Better?',
    description: 'Comparing high-intensity interval training with zone 2 cardio for longevity and fat loss.',
    category: 'Fitness',
    author: 'Andrew Huberman',
    publishedAt: '2024-03-08',
    readTime: '7 min read',
    imageUrl: 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400',
  },
  {
    id: '5',
    title: 'Understanding Vitamin D Deficiency',
    description: 'Symptoms, causes, and safe ways to increase your levels through sun exposure and supplements.',
    category: 'Nutrition',
    author: 'Healthline Editorial',
    publishedAt: '2024-03-05',
    readTime: '4 min read',
    imageUrl: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
  },
  {
    id: '6',
    title: 'Digital Detox: Reclaiming Your Attention',
    description: 'How constant connectivity impacts dopamine levels and practical steps to unplug.',
    category: 'Mental Health',
    author: 'Cal Newport',
    publishedAt: '2024-03-01',
    readTime: '10 min read',
    imageUrl: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  }
];

const CATEGORIES = ['All', 'Nutrition', 'Fitness', 'Mental Health', 'Sleep', 'Disease'];

export default function LibraryPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // --- 1. DATA FETCHING (Simulating an API) ---
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      
      // --- REAL API OPTION (Uncomment to use NewsAPI) ---
      /*
      try {
        const API_KEY = 'YOUR_NEWSAPI_KEY'; 
        const res = await fetch(`https://newsapi.org/v2/top-headlines?category=health&apiKey=${API_KEY}`);
        const data = await res.json();
        
        // Transform API data to match our UI
        const apiArticles = data.articles.map((a: any, index: number) => ({
          id: String(index),
          title: a.title,
          description: a.description || 'No description available.',
          category: 'News',
          author: a.author || 'Unknown',
          publishedAt: a.publishedAt.split('T')[0],
          readTime: '5 min read', // API doesn't give this, so we guess
          imageUrl: 'bg-blue-100', // Fallback since we can't load external images easily in all envs
          sourceUrl: a.url
        }));
        setArticles(apiArticles);
      } catch (error) {
        console.error("API Failed, loading demo data");
        setArticles(DEMO_ARTICLES);
      }
      */

      // --- CURRENT: SIMULATED API ---
      // We use a timeout to mimic network loading so you can see the loading state
      setTimeout(() => {
        setArticles(DEMO_ARTICLES);
        setLoading(false);
      }, 800); 
    };

    fetchArticles();
  }, []);

  // --- 2. FILTERING LOGIC ---
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesCategory = activeCategory === 'All' || article.category === activeCategory;
      const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            article.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [articles, activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050b14] text-gray-900 dark:text-white font-sans transition-colors duration-300">
      
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#050b14]/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition">
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </Link>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-400">
              Health Library
            </h1>
          </div>
          {/* Profile / Settings could go here */}
        </div>
      </header>

      {/* --- SEARCH & FILTER SECTION --- */}
      <div className="bg-white dark:bg-[#0a111d] border-b border-gray-200 dark:border-white/5 pt-8 pb-6 px-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold mb-2">Verified health information</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Browse thousands of physician-reviewed articles on nutrition, fitness, and wellness.
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search for 'Sleep', 'Keto', 'Anxiety'..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-100 dark:bg-white/5 border border-transparent focus:bg-white dark:focus:bg-[#0a111d] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
            />
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- CONTENT GRID --- */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {loading ? (
          // Skeleton Loading State
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white dark:bg-[#0a111d] h-80 rounded-2xl border border-gray-200 dark:border-white/5 p-4 animate-pulse">
                <div className="h-40 bg-gray-200 dark:bg-white/5 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-white/5 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-white/5 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredArticles.length > 0 ? (
          // Articles List
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <article 
                key={article.id} 
                className="group flex flex-col bg-white dark:bg-[#0a111d] border border-gray-200 dark:border-white/5 rounded-2xl overflow-hidden hover:border-blue-500/30 hover:shadow-lg dark:hover:shadow-none transition-all duration-300"
              >
                {/* Article Image (Placeholder style to match theme) */}
                <div className={`h-48 w-full flex items-center justify-center ${article.imageUrl}`}>
                  <BookOpen className="w-12 h-12 opacity-50" />
                </div>

                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-1 rounded-md">
                      {article.category}
                    </span>
                    <div className="flex items-center text-gray-400 text-xs gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-4 flex-grow">
                    {article.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5 mt-auto">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      By {article.author}
                    </span>
                    {article.sourceUrl ? (
                      <a 
                        href={article.sourceUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center gap-1 hover:underline"
                      >
                        Read Source <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <button className="text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center gap-1 hover:underline">
                        Read Article <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          // Empty State
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">No articles found</h3>
            <p className="text-gray-500">Try searching for something else.</p>
          </div>
        )}
      </main>
    </div>
  );
}