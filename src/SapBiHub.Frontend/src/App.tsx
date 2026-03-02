import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LayoutDashboard, Database, Search, Settings, Activity, Play, Filter, Save, MessageSquare } from 'lucide-react';

const Sidebar = () => (
  <div className="w-64 bg-slate-900 text-white min-h-screen p-4">
    <h1 className="text-2xl font-bold mb-8">SAP BI Hub</h1>
    <nav className="space-y-4">
      <Link to="/" className="flex items-center gap-2 hover:text-blue-400">
        <LayoutDashboard size={20} /> Dashboard
      </Link>
      <Link to="/queries" className="flex items-center gap-2 hover:text-blue-400">
        <Search size={20} /> Query Studio
      </Link>
      <Link to="/datasets" className="flex items-center gap-2 hover:text-blue-400">
        <Database size={20} /> Datasets
      </Link>
      <Link to="/observability" className="flex items-center gap-2 hover:text-blue-400">
        <Activity size={20} /> Observability
      </Link>
      <Link to="/settings" className="flex items-center gap-2 hover:text-blue-400">
        <Settings size={20} /> Settings
      </Link>
    </nav>
  </div>
);

const Dashboard = () => (
  <div className="p-8">
    <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow border border-slate-200">
        <h3 className="text-slate-500 text-sm font-medium">SAP Session Status</h3>
        <p className="text-2xl font-bold text-green-600">Connected</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow border border-slate-200">
        <h3 className="text-slate-500 text-sm font-medium">Active Jobs</h3>
        <p className="text-2xl font-bold">12</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow border border-slate-200">
        <h3 className="text-slate-500 text-sm font-medium">Rows Materialized</h3>
        <p className="text-2xl font-bold">1.2M</p>
      </div>
    </div>
  </div>
);

const QueryStudio = () => {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<any>(null);

  const handleAiPropose = () => {
    setResult({
      endpoint: "/Invoices",
      select: "DocEntry,CardCode,DocTotal",
      filter: "DocTotal gt 1000",
      top: 50
    });
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Search /> Query Studio
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow border border-slate-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MessageSquare size={18} /> AI Assistant
            </h3>
            <textarea
              className="w-full p-3 border rounded-md h-32"
              placeholder="E.g., Show me all invoices with total greater than 1000"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button
              onClick={handleAiPropose}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Propose Query
            </button>
          </div>

          {result && (
            <div className="bg-slate-100 p-6 rounded-lg border border-slate-300">
              <h3 className="text-lg font-semibold mb-4">Proposed Query</h3>
              <div className="space-y-2 font-mono text-sm">
                <p><strong>Endpoint:</strong> {result.endpoint}</p>
                <p><strong>$select:</strong> {result.select}</p>
                <p><strong>$filter:</strong> {result.filter}</p>
                <p><strong>$top:</strong> {result.top}</p>
              </div>
              <div className="mt-6 flex gap-3">
                <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md">
                  <Play size={16} /> Run Preview
                </button>
                <button className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-md">
                  <Save size={16} /> Save as Dataset
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-slate-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Filter size={18} /> Manual Builder
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Entity</label>
              <select className="w-full p-2 border rounded-md">
                <option>Invoices</option>
                <option>Orders</option>
                <option>BusinessPartners</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Select Fields</label>
              <input type="text" className="w-full p-2 border rounded-md" placeholder="DocEntry, CardCode, ..." />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Datasets = () => {
  const mockDatasets = [
    { id: 1, name: "ds_invoices_high", query: "/Invoices", lastRun: "2 mins ago", status: "OK", rows: "1,245" },
    { id: 2, name: "ds_orders_pending", query: "/Orders", lastRun: "1 hour ago", status: "OK", rows: "450" },
    { id: 3, name: "ds_bp_catalog", query: "/BusinessPartners", lastRun: "Yesterday", status: "FAIL", rows: "0" },
  ];

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Datasets</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden border border-slate-200">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold text-slate-700">Dataset Name</th>
              <th className="px-6 py-3 text-sm font-semibold text-slate-700">Endpoint</th>
              <th className="px-6 py-3 text-sm font-semibold text-slate-700">Last Run</th>
              <th className="px-6 py-3 text-sm font-semibold text-slate-700">Status</th>
              <th className="px-6 py-3 text-sm font-semibold text-slate-700">Rows</th>
              <th className="px-6 py-3 text-sm font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {mockDatasets.map((ds) => (
              <tr key={ds.id}>
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{ds.name}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{ds.query}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{ds.lastRun}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${ds.status === 'OK' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {ds.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{ds.rows}</td>
                <td className="px-6 py-4 text-sm">
                  <button className="text-blue-600 hover:text-blue-800">Explore</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="flex bg-slate-50 min-h-screen">
        <Sidebar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/queries" element={<QueryStudio />} />
            <Route path="/datasets" element={<Datasets />} />
            <Route path="/observability" element={<div className="p-8">Observability</div>} />
            <Route path="/settings" element={<div className="p-8">Settings</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
