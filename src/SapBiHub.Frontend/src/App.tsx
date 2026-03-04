import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LayoutDashboard, Database, Search, Settings, Activity, Play, Filter, Save, MessageSquare, Server, CheckCircle, AlertCircle } from 'lucide-react';

const Sidebar = () => (
  <div className="w-64 bg-slate-900 text-white min-h-screen p-6 flex flex-col">
    <div className="flex items-center gap-3 mb-10">
      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold">S</div>
      <h1 className="text-xl font-bold tracking-tight">SAP BI Hub</h1>
    </div>
    <nav className="space-y-2 flex-1">
      <Link to="/" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-800 transition text-slate-300 hover:text-white">
        <LayoutDashboard size={20} /> Dashboard
      </Link>
      <Link to="/queries" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-800 transition text-slate-300 hover:text-white">
        <Search size={20} /> Query Studio
      </Link>
      <Link to="/datasets" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-800 transition text-slate-300 hover:text-white">
        <Database size={20} /> Datasets
      </Link>
      <Link to="/system" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-800 transition text-slate-300 hover:text-white">
        <Server size={20} /> System Status
      </Link>
    </nav>
    <div className="mt-auto pt-6 border-t border-slate-800">
       <Link to="/settings" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-800 transition text-slate-300 hover:text-white">
        <Settings size={20} /> Settings
      </Link>
    </div>
  </div>
);

const Dashboard = () => (
  <div className="p-10 max-w-7xl mx-auto">
    <div className="flex justify-between items-end mb-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Overview</h2>
        <p className="text-slate-500">Global performance and materialization status</p>
      </div>
      <div className="flex gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> SAP Live</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Postgres OK</span>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
      <StatCard title="Total Datasets" value="24" icon={<Database className="text-blue-500" />} trend="+2 this month" />
      <StatCard title="Rows Materialized" value="4.8M" icon={<Activity className="text-purple-500" />} trend="Sub-second latency" />
      <StatCard title="Active Jobs" value="8" icon={<Play className="text-green-500" />} trend="Scheduled" />
      <StatCard title="AI Queries" value="156" icon={<MessageSquare className="text-amber-500" />} trend="78% success rate" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold mb-6">Recent Executions</h3>
        <div className="space-y-4">
          <ExecutionItem name="ds_invoices_daily" time="2m ago" status="Success" rows="12,400" />
          <ExecutionItem name="ds_business_partners" time="15m ago" status="Success" rows="845" />
          <ExecutionItem name="ds_stock_valuation" time="1h ago" status="Warning" rows="-" error="SAP Timeout" />
          <ExecutionItem name="ds_sales_orders" time="2h ago" status="Success" rows="5,200" />
        </div>
      </div>
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
        <h3 className="text-lg font-bold mb-6">Storage Utilization</h3>
        <div className="flex-1 flex items-center justify-center">
            <div className="w-48 h-48 rounded-full border-8 border-slate-100 relative flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-8 border-blue-500 border-t-transparent -rotate-45"></div>
                <div className="text-center">
                    <p className="text-3xl font-bold">64%</p>
                    <p className="text-xs text-slate-400 uppercase">Postgres DB</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  </div>
);

const StatCard = ({ title, value, icon, trend }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-200 transition">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-slate-50 rounded-xl">{icon}</div>
      <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-50 px-2 py-1 rounded-md">{trend}</span>
    </div>
    <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
  </div>
);

const ExecutionItem = ({ name, time, status, rows, error }: any) => (
  <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100">
    <div className="flex items-center gap-3">
      {status === 'Success' ? <CheckCircle className="text-green-500" size={18} /> : <AlertCircle className="text-amber-500" size={18} />}
      <div>
        <p className="text-sm font-bold text-slate-800">{name}</p>
        <p className="text-[10px] text-slate-400 uppercase font-medium">{time}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-sm font-bold text-slate-700">{rows}</p>
      <p className="text-[10px] font-bold text-slate-400 uppercase">{error || status}</p>
    </div>
  </div>
);

const SystemStatus = () => (
  <div className="p-10 max-w-7xl mx-auto">
    <h2 className="text-3xl font-bold text-slate-900 mb-8">Debian System Health</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-lg font-mono">
        <h3 className="text-blue-400 mb-4 flex items-center gap-2 font-sans"><Server size={18} /> systemctl status</h3>
        <div className="text-xs space-y-2 opacity-80">
          <p>● sapbihub-api.service - SAP BI Hub API</p>
          <p className="text-green-400">   Active: active (running) since Mon 2026-03-02</p>
          <p>   Main PID: 12450 (dotnet)</p>
          <p className="mt-4">● sapbihub-worker.service - SAP BI Hub Worker</p>
          <p className="text-green-400">   Active: active (running) since Mon 2026-03-02</p>
          <p>   Main PID: 12451 (dotnet)</p>
        </div>
      </div>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100">
          <h3 className="font-bold mb-4">Ollama LLM (coder 1.0b)</h3>
          <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
            <CheckCircle size={16} /> Service Online
          </div>
          <p className="text-xs text-slate-500 mt-2">GPU Acceleration: Disabled (CPU Mode)</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100">
          <h3 className="font-bold mb-4">Debian Environment</h3>
          <p className="text-sm text-slate-700">OS: Debian GNU/Linux 12 (bookworm)</p>
          <p className="text-sm text-slate-700">Architecture: x86_64</p>
          <p className="text-sm text-slate-700">Kernel: 6.1.0-18-amd64</p>
        </div>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="flex bg-slate-50 min-h-screen text-slate-900">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/queries" element={<div className="p-10">Query Studio</div>} />
            <Route path="/datasets" element={<div className="p-10">Datasets</div>} />
            <Route path="/system" element={<SystemStatus />} />
            <Route path="/settings" element={<div className="p-10">Settings</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
