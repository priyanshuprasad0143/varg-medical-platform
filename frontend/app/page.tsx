"use client";
import { useState, useEffect } from "react";

export default function Home() {
  // Active Tab State: 'ai' | 'blood' | 'doctors'
  const [activeTab, setActiveTab] = useState("ai");

  // --- State for AI Symptom Checker ---
  const [symptoms, setSymptoms] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [aiResult, setAiResult] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  // --- State for Blood Bank Locator ---
  const [bloodGroup, setBloodGroup] = useState("");
  const [bloodBanks, setBloodBanks] = useState([]);
  const [bloodLoading, setBloodLoading] = useState(false);

  // --- State for Doctor Listing ---
  const [specialty, setSpecialty] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(false);

  // --- 1. Fetch AI Symptoms Analysis ---
  const handleAiSubmit = async (
  e: React.FormEve<HTMLFormElement>
) => {
    e.preventDefault();
    if (!symptoms || !age) return alert("Please fill all fields");
    setAiLoading(true);
    setAiResult("");

    try {
      const res = await fetch("http://localhost:8000/api/analyze-symptoms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms, age: parseInt(age), gender }),
      });
      const data = await res.json();
      if (res.ok) setAiResult(data.analysis);
      else alert(data.detail || "Something went wrong");
    } catch (err) {
      console.error(err);
      alert("Failed to connect to Backend Server");
    } finally {
      setAiLoading(false);
    }
  };

  // --- 2. Fetch Blood Banks ---
  const fetchBloodBanks = async (group = "") => {
    setBloodLoading(true);
    try {
      const url = group 
        ? `http://localhost:8000/api/blood-banks?blood_group=${encodeURIComponent(group)}`
        : "http://localhost:8000/api/blood-banks";
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) setBloodBanks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setBloodLoading(false);
    }
  };

  // --- 3. Fetch Doctors ---
  const fetchDoctors = async (spec = "") => {
    setDoctorsLoading(true);
    try {
      const url = spec 
        ? `http://localhost:8000/api/doctors?specialty=${encodeURIComponent(spec)}`
        : "http://localhost:8000/api/doctors";
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) setDoctors(data);
    } catch (err) {
      console.error(err);
    } finally {
      setDoctorsLoading(false);
    }
  };

  useEffect(() => {
    fetchBloodBanks();
    fetchDoctors();
  }, []);

  useEffect(() => {
    fetchBloodBanks(bloodGroup);
  }, [bloodGroup]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased flex flex-col selection:bg-blue-500/10">
      
      {/* Premium Top Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-sm shadow-blue-500/20">
              V
            </div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Varg<span className="font-medium text-blue-600">Medi</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Core Systems Active</span>
          </div>
        </div>
      </header>

      {/* Hero / Subheader Context */}
      <div className="bg-gradient-to-b from-white to-transparent pt-8 pb-4">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">VargMed</h2>
          <p className="text-sm text-slate-500 mt-1">Access AI assistance diagnostics, verified blood storage centers, and specialist medical matrices.</p>
        </div>
      </div>

      {/* Segmented Control / Tabs */}
      <div className="max-w-6xl mx-auto w-full px-6 mt-4">
        <div className="flex p-1 bg-slate-200/60 rounded-2xl border border-slate-200/30 gap-1 shadow-inner">
          <button
            onClick={() => setActiveTab("ai")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-center font-semibold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 ${
              activeTab === "ai"
                ? "bg-white text-blue-600 shadow-sm shadow-slate-300/50 scale-[1.01]"
                : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
            }`}
          >
            <span>🤖</span> AI Diagnostic Engine
          </button>
          <button
            onClick={() => setActiveTab("blood")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-center font-semibold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 ${
              activeTab === "blood"
                ? "bg-white text-red-600 shadow-sm shadow-slate-300/50 scale-[1.01]"
                : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
            }`}
          >
            <span>🩸</span> Blood Registry
          </button>
          <button
            onClick={() => setActiveTab("doctors")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-center font-semibold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 ${
              activeTab === "doctors"
                ? "bg-white text-emerald-600 shadow-sm shadow-slate-300/50 scale-[1.01]"
                : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
            }`}
          >
            <span>👨‍⚕️</span> Specialist Directory
          </button>
        </div>
      </div>

      {/* Workspace Panel */}
      <main className="max-w-6xl mx-auto w-full px-6 py-6 flex-grow mb-12">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
          
          {/* ================= MODULE 1: AI SYMPTOM CHECKER ================= */}
          {activeTab === "ai" && (
            <div className="transition-all duration-500">
              <div className="border-b border-slate-100 pb-4 mb-6">
                <h3 className="text-lg font-bold text-slate-950">AI Symptom Diagnostics</h3>
                <p className="text-xs text-slate-400 mt-0.5">Real-time symptom mapping via LLM deep layer text interpretation.</p>
              </div>
              
              <form onSubmit={handleAiSubmit} className="space-y-6 max-w-3xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">User Age</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="e.g. 24"
                      className="w-full p-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all text-sm font-medium placeholder:text-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Biological Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none bg-slate-50/50 text-sm font-medium transition-all"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Symptom Statement</label>
                  <textarea
                    rows="4"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="Enter explicit detail of physiological discomfort (e.g. Chronic migraine, mild thermal spike since 24h)..."
                    className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all resize-none text-sm leading-relaxed placeholder:text-slate-300"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={aiLoading}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-md shadow-blue-500/10 transition-all cursor-pointer disabled:opacity-50"
                >
                  {aiLoading ? "Processing Metrics..." : "Compile Diagnostics Report"}
                </button>
              </form>

              {aiResult && (
                <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
                  <div className="bg-slate-800/50 border-b border-slate-800/80 px-5 py-3 flex justify-between items-center">
                    <span className="text-xs font-bold tracking-widest text-blue-400 uppercase">Analysis Matrix Output</span>
                    <span className="text-[10px] bg-slate-700 text-slate-300 font-mono px-2 py-0.5 rounded">v2.5-Flash</span>
                  </div>
                  <div className="p-5 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-line max-h-[400px] overflow-y-auto">
                    {aiResult}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= MODULE 2: BLOOD BANK LOCATOR ================= */}
          {activeTab === "blood" && (
            <div className="transition-all duration-500">
              <div className="border-b border-slate-100 pb-4 mb-6">
                <h3 className="text-lg font-bold text-slate-950">Blood Storage Core</h3>
                <p className="text-xs text-slate-400 mt-0.5">Real-time filter arrays matching active token configurations in Supabase.</p>
              </div>
              
              <div className="mb-6 max-w-sm">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Target Phenotype</label>
                <input
                  type="text"
                  placeholder="Filter by blood group string (e.g. O+, AB-)"
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-red-500/5 focus:border-red-500 outline-none uppercase transition-all text-sm font-medium placeholder:text-slate-300"
                />
              </div>

              {bloodLoading ? (
                <div className="flex justify-center items-center py-12"><p className="text-slate-400 text-xs animate-pulse">Syncing Database Elements...</p></div>
              ) : bloodBanks.length === 0 ? (
                <p className="text-slate-400 bg-slate-50/50 p-6 rounded-xl text-center border border-dashed border-slate-200 text-xs font-medium">Null response. Adjust query configuration.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {bloodBanks.map((bank, index) => (
                    <div key={index} className="p-5 border border-slate-100 rounded-2xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:border-slate-200/80 hover:shadow-[0_4px_12px_rgba(0,0,0,0.02)] transition-all flex flex-col justify-between group">
                      <div>
                        <div className="flex justify-between items-start gap-3">
                          <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-base">{bank.name}</h4>
                          <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2.5 py-1 rounded-md border border-red-100 uppercase tracking-wider whitespace-nowrap shrink-0">
                            {bank.blood_groups || "ALL UNITS"}
                          </span>
                        </div>
                        <p className="text-slate-500 text-xs mt-2.5 flex items-center gap-1.5">
                          <span className="text-slate-400">📍</span> {bank.location || "Metadata omitted"}
                        </p>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-4 pt-3 border-t border-slate-50 font-medium flex justify-between items-center">
                        <span>Contact Link:</span>
                        <span className="text-slate-700 font-semibold">{bank.contact || "N/A"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= MODULE 3: DOCTOR LISTING & FILTER ================= */}
          {activeTab === "doctors" && (
            <div className="transition-all duration-500">
              <div className="border-b border-slate-100 pb-4 mb-6">
                <h3 className="text-lg font-bold text-slate-950">Specialist Allocation Directory</h3>
                <p className="text-xs text-slate-400 mt-0.5">Verified practitioner lookup matching systemic query arrays.</p>
              </div>
              
              <div className="mb-6 max-w-xs">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Specialization Category</label>
                <select
                  value={specialty}
                  onChange={(e) => {
                    setSpecialty(e.target.value);
                    fetchDoctors(e.target.value);
                  }}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none bg-white font-semibold text-xs tracking-wider text-slate-600 uppercase transition-all"
                >
                  <option value="">All Fields</option>
                  <option value="General Physician">General Physician</option>
                  <option value="Cardiologist">Cardiologist</option>
                  <option value="Dermatologist">Dermatologist</option>
                  <option value="Neurologist">Neurologist</option>
                  <option value="Pediatrician">Pediatrician</option>
                </select>
              </div>

              {doctorsLoading ? (
                <div className="flex justify-center items-center py-12"><p className="text-slate-400 text-xs animate-pulse">Syncing Allocation Matrix...</p></div>
              ) : doctors.length === 0 ? (
                <p className="text-slate-400 bg-slate-50/50 p-6 rounded-xl text-center border border-dashed border-slate-200 text-xs font-medium">No specialized nodes registered under this header.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {doctors.map((doc, index) => (
                    <div key={index} className="border border-slate-100 rounded-2xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.025)] hover:border-slate-200/60 transition-all overflow-hidden flex flex-col justify-between group">
                      <div className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-inner">
                            MD
                          </div>
                          <div className="truncate">
                            <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">{doc.name}</h4>
                            <p className="text-emerald-600 font-bold text-[10px] uppercase tracking-widest mt-0.5">{doc.specialty}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 space-y-2 text-xs text-slate-600 border-t border-slate-100/70 pt-3">
                          <div className="flex justify-between"><span className="text-slate-400">Tenure Exp:</span> <span className="font-medium text-slate-800">{doc.experience || "N/A"} Years</span></div>
                          <div className="flex justify-between"><span className="text-slate-400">Availability:</span> <span className="font-medium text-slate-800">{doc.timings || "09:00 - 17:00"}</span></div>
                          <div className="flex justify-between"><span className="text-slate-400">Consultation Cost:</span> <span className="font-semibold text-slate-900">₹{doc.fees || "500"}</span></div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-slate-50/80 border-t border-slate-100/60 flex justify-between items-center gap-2">
                        <span className="text-[10px] text-slate-400 truncate font-medium">📍 OPD Sector {index + 1}</span>
                        <button className="bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg transition-all cursor-pointer">
                          Initialize
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* Sleek Minimalist Footer */}
      <footer className="bg-white border-t border-slate-200/60 py-4 mt-auto">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-[11px] font-medium text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-tight text-slate-700 text-xs">Varg-Medi © 2026</span>
            <span>•</span>
            <p>Design and developed by: <span className="text-slate-600 font-semibold">Priyanshu Prasad</span></p>
          </div>
          <div className="flex gap-4 text-slate-400/80 font-semibold tracking-wider uppercase text-[10px]">
            <span>FastAPI Core</span>
            <span>Supabase Gateway</span>
            <span>Gemini LLM Stack</span>
          </div>
        </div>
      </footer>

    </div>
  );
}