// ============================================================
// VendorBridge - Frontend Code (React + Tailwind CSS)
// All screens: Login, Register, Dashboard, Vendors, RFQ,
// Quotations, Comparison, Approvals, PO/Invoice, Reports, Logs
// ============================================================

// ---- File Structure ----
// src/
// ├── App.jsx
// ├── index.css
// ├── context/AuthContext.jsx
// ├── pages/
// │   ├── Login.jsx
// │   ├── Register.jsx
// │   ├── Dashboard.jsx
// │   ├── Vendors.jsx
// │   ├── RFQCreate.jsx
// │   ├── Quotations.jsx
// │   ├── QuotationCompare.jsx
// │   ├── Approvals.jsx
// │   ├── PurchaseOrders.jsx
// │   ├── Invoices.jsx
// │   ├── Reports.jsx
// │   └── ActivityLogs.jsx
// ├── components/
// │   ├── Sidebar.jsx
// │   ├── Topbar.jsx
// │   ├── StatCard.jsx
// │   ├── DataTable.jsx
// │   └── StatusBadge.jsx
// └── api/
//     └── axios.js

// ============================================================
// 1. src/App.jsx
// ============================================================
/*
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Vendors from './pages/Vendors';
import RFQCreate from './pages/RFQCreate';
import Quotations from './pages/Quotations';
import QuotationCompare from './pages/QuotationCompare';
import Approvals from './pages/Approvals';
import PurchaseOrders from './pages/PurchaseOrders';
import Invoices from './pages/Invoices';
import Reports from './pages/Reports';
import ActivityLogs from './pages/ActivityLogs';
import MainLayout from './components/MainLayout';

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="vendors" element={<Vendors />} />
            <Route path="rfqs/create" element={<RFQCreate />} />
            <Route path="quotations" element={<Quotations />} />
            <Route path="quotations/compare/:rfqId" element={<QuotationCompare />} />
            <Route path="approvals" element={<Approvals />} />
            <Route path="purchase-orders" element={<PurchaseOrders />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="reports" element={<Reports />} />
            <Route path="activity" element={<ActivityLogs />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
*/

// ============================================================
// 2. src/context/AuthContext.jsx
// ============================================================
/*
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser]   = useState(JSON.parse(localStorage.getItem('user') || 'null'));

  function login(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setToken(token);
    setUser(user);
  }

  function logout() {
    localStorage.clear();
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
*/

// ============================================================
// 3. src/api/axios.js
// ============================================================
/*
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
*/

// ============================================================
// 4. src/pages/Login.jsx
// ============================================================
/*
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 to-green-600">
      <div className="bg-white rounded-2xl p-10 w-96 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-700 rounded-full mx-auto mb-3 flex items-center justify-center">
            <span className="text-white text-2xl">🏢</span>
          </div>
          <h1 className="text-2xl font-bold text-green-800">VendorBridge</h1>
          <p className="text-gray-500 text-sm mt-1">Procurement Management System</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg px-4 py-2 mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-600"
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-600"
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold rounded-lg py-3 transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-500">
          No account? <Link to="/register" className="text-green-700 font-medium">Register</Link>
        </p>
      </div>
    </div>
  );
}
*/

// ============================================================
// 5. src/pages/Dashboard.jsx
// ============================================================
/*
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api/axios';

export default function Dashboard() {
  const [stats, setStats] = useState({ vendors: 0, rfqs: 0, poValue: 0, approvals: 0 });
  const [recentRFQs, setRecentRFQs] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, rfqRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/rfqs?limit=5'),
        ]);
        setStats(statsRes.data);
        setRecentRFQs(rfqRes.data.data);
        setChartData([
          { month: 'Jan', spend: 120000 },
          { month: 'Feb', spend: 180000 },
          { month: 'Mar', spend: 95000 },
          { month: 'Apr', spend: 210000 },
          { month: 'May', spend: 160000 },
          { month: 'Jun', spend: 230000 },
        ]);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-5">Dashboard — Today's Overview</h2>

      // Stat Cards
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Vendors',     value: stats.vendors,   color: 'green' },
          { label: 'Active RFQs',       value: stats.rfqs,      color: 'blue' },
          { label: 'PO Value (Month)',  value: `₹${(stats.poValue/1000).toFixed(1)}K`, color: 'green' },
          { label: 'Pending Approvals', value: stats.approvals, color: 'red' },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className={`text-3xl font-bold text-${card.color}-700`}>{card.value}</p>
            <p className="text-xs text-gray-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      // Charts & Tables
      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-sm mb-3">Monthly Spend (₹)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="spend" fill="#2E7D32" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-sm mb-3">Recent RFQs</h3>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left pb-2 text-gray-500">RFQ #</th>
                <th className="text-left pb-2 text-gray-500">Title</th>
                <th className="text-left pb-2 text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentRFQs.map(rfq => (
                <tr key={rfq.id} className="border-b border-gray-50">
                  <td className="py-2">{rfq.rfq_number}</td>
                  <td className="py-2">{rfq.title}</td>
                  <td className="py-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs
                      ${rfq.status === 'open' ? 'bg-blue-50 text-blue-700' :
                        rfq.status === 'awarded' ? 'bg-green-50 text-green-700' :
                        'bg-yellow-50 text-yellow-700'}`}>
                      {rfq.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
*/

// ============================================================
// 6. src/pages/Vendors.jsx
// ============================================================
/*
import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    api.get(`/vendors?search=${search}&category=${category}`)
      .then(r => setVendors(r.data.data))
      .catch(console.error);
  }, [search, category]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-xl font-bold">Vendors</h2>
          <p className="text-sm text-gray-500">Manage supplier profiles</p>
        </div>
        <button className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
          + Add Vendor
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex gap-3">
        <input
          type="text"
          placeholder="Search vendors..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="IT">IT Equipment</option>
          <option value="Furniture">Furniture</option>
          <option value="Stationery">Stationery</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Vendor','Category','Email','Phone','City','Status','Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {vendors.map(v => (
              <tr key={v.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold">{v.company_name}</td>
                <td className="px-4 py-3">{v.category}</td>
                <td className="px-4 py-3 text-blue-600">{v.email}</td>
                <td className="px-4 py-3">{v.phone}</td>
                <td className="px-4 py-3">{v.city}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium
                    ${v.status === 'active' ? 'bg-green-50 text-green-700' :
                      v.status === 'pending' ? 'bg-gray-100 text-gray-600' :
                      'bg-yellow-50 text-yellow-700'}`}>
                    {v.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button className="border border-green-600 text-green-700 px-3 py-1 rounded text-xs">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
*/

// ============================================================
// 7. src/pages/RFQCreate.jsx
// ============================================================
/*
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function RFQCreate() {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [form, setForm] = useState({
    title: '', category: '', deadline: '',
    description: '', budget: ''
  });
  const [items, setItems] = useState([{ name: '', qty: 1, unit: 'Nos' }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/vendors?status=active').then(r => setVendors(r.data.data));
  }, []);

  function toggleVendor(id) {
    setSelectedVendors(prev =>
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    );
  }

  function addItem() {
    setItems(prev => [...prev, { name: '', qty: 1, unit: 'Nos' }]);
  }

  async function handleSubmit() {
    setLoading(true);
    try {
      await api.post('/rfqs', {
        ...form,
        vendor_ids: selectedVendors,
        line_items: items
      });
      navigate('/quotations');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create RFQ');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-5">Create RFQ</h2>
      <div className="grid grid-cols-2 gap-5">
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-sm mb-4 border-b pb-2">RFQ Details</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Title</label>
                <input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.title}
                  onChange={e => setForm({...form, title: e.target.value})} placeholder="RFQ Title" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Category</label>
                  <select className="w-full border rounded-lg px-3 py-2 text-sm"
                    value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                    <option>Furniture</option><option>IT Equipment</option><option>Stationery</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Deadline</label>
                  <input type="date" className="w-full border rounded-lg px-3 py-2 text-sm"
                    value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Description</label>
                <textarea rows={3} className="w-full border rounded-lg px-3 py-2 text-sm"
                  value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Budget (₹)</label>
                <input type="number" className="w-full border rounded-lg px-3 py-2 text-sm"
                  value={form.budget} onChange={e => setForm({...form, budget: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-sm mb-4 border-b pb-2">Line Items</h3>
            <table className="w-full text-xs mb-3">
              <thead><tr>
                <th className="text-left pb-2">Item Name</th>
                <th className="text-left pb-2">Qty</th>
                <th className="text-left pb-2">Unit</th>
              </tr></thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i}>
                    <td className="pr-2 pb-2">
                      <input className="w-full border rounded px-2 py-1 text-xs" value={item.name}
                        onChange={e => { const n=[...items]; n[i].name=e.target.value; setItems(n); }} />
                    </td>
                    <td className="pr-2 pb-2">
                      <input type="number" className="w-16 border rounded px-2 py-1 text-xs" value={item.qty}
                        onChange={e => { const n=[...items]; n[i].qty=e.target.value; setItems(n); }} />
                    </td>
                    <td className="pb-2">
                      <select className="border rounded px-2 py-1 text-xs" value={item.unit}
                        onChange={e => { const n=[...items]; n[i].unit=e.target.value; setItems(n); }}>
                        <option>Nos</option><option>Kg</option><option>Ltr</option><option>Set</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={addItem} className="text-green-700 border border-green-600 px-3 py-1 rounded text-xs">+ Add Item</button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-sm mb-4 border-b pb-2">Select Vendors</h3>
            <div className="space-y-2">
              {vendors.map(v => (
                <label key={v.id} className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="checkbox" checked={selectedVendors.includes(v.id)}
                    onChange={() => toggleVendor(v.id)} />
                  <span>{v.company_name}</span>
                  <span className="text-xs text-gray-400">{v.category}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-sm mb-4 border-b pb-2">Submit</h3>
            <div className="flex gap-3">
              <button onClick={handleSubmit} disabled={loading}
                className="flex-1 bg-green-700 hover:bg-green-800 text-white py-2.5 rounded-lg text-sm font-medium">
                {loading ? 'Submitting...' : 'Submit RFQ'}
              </button>
              <button className="border border-green-600 text-green-700 px-4 rounded-lg text-sm">Save Draft</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
*/

// ============================================================
// 8. package.json (Frontend)
// ============================================================
/*
{
  "name": "vendorbridge-frontend",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.14.0",
    "axios": "^1.4.0",
    "recharts": "^2.7.2",
    "@headlessui/react": "^1.7.15",
    "@heroicons/react": "^2.0.18"
  },
  "devDependencies": {
    "tailwindcss": "^3.3.3",
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.27",
    "vite": "^4.4.5",
    "@vitejs/plugin-react": "^4.0.4"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
*/

// ============================================================
// 9. tailwind.config.js
// ============================================================
/*
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#2E7D32', light: '#4CAF50', pale: '#E8F5E9' },
        accent:  { DEFAULT: '#1976D2', pale: '#E3F2FD' },
      }
    }
  },
  plugins: []
};
*/

export default null;
