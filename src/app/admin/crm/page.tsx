'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Search } from 'lucide-react';

export default function CRMPage() {
  const supabase = createClientComponentClient();
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase.from('profiles').select('*');
      setUsers(data || []);
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => 
    u.display_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold">User CRM</h2>
          <p className="text-gray-500">View and manage registered users.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search users..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:ring-2 ring-blue-500/50 transition w-64"
          />
        </div>
      </header>

      <div className="bg-white dark:bg-[#0a111d] rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/5 text-xs uppercase text-gray-500">
              <th className="p-4 font-bold">User Name</th>
              <th className="p-4 font-bold">Gender</th>
              <th className="p-4 font-bold">Age</th>
              <th className="p-4 font-bold">Joined Date</th>
              <th className="p-4 font-bold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition">
                <td className="p-4 font-medium text-gray-900 dark:text-white flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                    {user.display_name?.charAt(0) || 'U'}
                  </div>
                  {user.display_name || 'Anonymous'}
                </td>
                <td className="p-4 text-gray-500 capitalize">{user.gender || '-'}</td>
                <td className="p-4 text-gray-500">
                  {user.birth_date ? new Date().getFullYear() - new Date(user.birth_date).getFullYear() : '-'}
                </td>
                <td className="p-4 text-gray-500 text-sm">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="p-4 text-right">
                  <button className="text-xs font-bold text-blue-600 hover:underline">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="p-8 text-center text-gray-500">No users found.</div>
        )}
      </div>
    </div>
  );
}