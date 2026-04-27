import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, Target, Send, CheckCircle } from 'lucide-react';

interface Application {
  id: number;
  company_name: string;
  role: string;
  match_score: number;
  distance: number;
  status: string;
}

function App() {
  const [jobs, setJobs] = useState<Application[]>([]);
  const [activeTab, setActiveTab] = useState('New');

  useEffect(() => {
    // Fetch from FastAPI backend
    fetch('http://localhost:8000/applications/')
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error("Error fetching jobs:", err));
  }, []);

  const filteredJobs = jobs.filter(j => j.status === activeTab);

  return (
    <div className="min-h-screen p-8 bg-slate-900 text-slate-100">
      <header className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          JobHunter Command Center
        </h1>
        <p className="text-slate-400 mt-2">Your personal AI-powered application assistant</p>
      </header>

      <div className="flex space-x-4 mb-6 border-b border-slate-700 pb-2">
        {['New', 'Reviewed', 'Applied', 'Rejected'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md transition-all ${
              activeTab === tab ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            No jobs found in this category.
          </div>
        ) : (
          filteredJobs.map(job => (
            <div key={job.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-indigo-500/50 transition-all flex justify-between items-center group">
              <div>
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Briefcase size={20} className="text-indigo-400" />
                  {job.role}
                </h3>
                <p className="text-slate-400 mt-1">{job.company_name}</p>
                <div className="flex gap-4 mt-4 text-sm">
                  <span className="flex items-center gap-1 text-slate-300">
                    <MapPin size={16} className="text-emerald-400" />
                    {job.distance}km away
                  </span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <Target size={16} className="text-blue-400" />
                    {job.match_score}% Match
                  </span>
                </div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-lg font-medium shadow-lg shadow-indigo-500/20">
                  <Send size={18} />
                  Review & Apply
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
