'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface BloodBank {
  id: number;
  name: string;
  location: string;
  blood_groups: string;
  contact: string;
}

export default function BloodBankLocator() {
  const [bloodBanks, setBloodBanks] = useState<BloodBank[]>([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Function: Backend se data fetch karne ke liye
  const fetchBloodBanks = async (group: string) => {
    setLoading(true);
    setError('');
    try {
      // Agar group selected hai toh query param bhejenge, nahi toh saare banks aayenge
      const url = group 
        ? `http://localhost:8000/api/blood-banks?blood_group=${encodeURIComponent(group)}`
        : 'http://localhost:8000/api/blood-banks';
        
      const response = await axios.get(url);
      setBloodBanks(response.data);
    } catch (err) {
      console.error("Error fetching blood banks:", err);
      setError("Database se blood banks ka data nikalne me dikkat aa rahi hai.");
    } finally {
      setLoading(false);
    }
  };

  // Page load hote hi pehle saare blood banks dikhao
  useEffect(() => {
    fetchBloodBanks('');
  }, []);

  // Jab user dropdown badle tab filter karo
  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const group = e.target.value;
    setSelectedGroup(group);
    fetchBloodBanks(group);
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-red-600 tracking-tight sm:text-4xl">
            🩸 Emergency Blood Bank Locator
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Find available blood stocks near you instantly.
          </p>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-md font-semibold text-slate-700">Filter by Required Blood Group</h3>
            <p className="text-xs text-slate-400">Select a group to check availability</p>
          </div>
          <div className="w-full sm:w-48">
            <select
              value={selectedGroup}
              onChange={handleGroupChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-black font-medium"
            >
              <option value="">All Groups</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        {/* Grid List */}
        {loading ? (
          <div className="text-center py-10 text-slate-500 font-medium">
            Blood banks dhoodh rahe hain...
          </div>
        ) : bloodBanks.length === 0 ? (
          <div className="text-center py-10 text-slate-400 bg-white rounded-xl shadow-inner border border-dashed border-slate-200">
            Is blood group ke liye koi blood bank nahi mila.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {bloodBanks.map((bank) => (
              <div 
                key={bank.id} 
                className="bg-white rounded-xl shadow-md p-6 border border-slate-100 hover:border-red-200 transition duration-200 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-lg font-bold text-slate-800 mb-2">{bank.name}</h2>
                  <p className="text-sm text-slate-500 mb-3 flex items-start gap-1">
                    <span>📍</span> {bank.location}
                  </p>
                  <div className="mb-4">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Available Stock:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {bank.blood_groups.split(',').map((group, index) => (
                        <span 
                          key={index} 
                          className="px-2 py-1 bg-red-50 text-red-600 rounded text-xs font-bold border border-red-100"
                        >
                          {group.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-sm text-slate-600 font-medium">📞 {bank.contact}</span>
                  <a 
                    href={`tel:${bank.contact}`}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition duration-150"
                  >
                    Call Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}