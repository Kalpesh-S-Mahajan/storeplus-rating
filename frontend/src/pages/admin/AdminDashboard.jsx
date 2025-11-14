import { useEffect, useState } from "react";
import API from "../../api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  LogOut,
  Lock,
  Users,
  Store,
  Star,
  BarChart3,
  Loader2,
  ArrowUpRight,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B"];

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });

  const [loading, setLoading] = useState(true);

  const userData = [
    { name: "Users", value: stats.totalUsers },
    { name: "Stores", value: stats.totalStores },
    { name: "Ratings", value: stats.totalRatings },
  ];

  // Fetch dashboard analytics
  const loadDashboard = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/admin/dashboard");
      setStats(data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);

      if (err.response?.status === 403) {
        alert("Access denied. Only admin can view this dashboard.");
        localStorage.clear();
        navigate("/", { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  const fadeContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, duration: 0.4 },
    },
  };

  const fadeItem = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      {/* HEADER */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-40 border-b border-slate-700/40 backdrop-blur-xl bg-slate-900/70"
      >
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              🧭 Admin Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              System Overview & Analytics
            </p>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg flex items-center gap-2 text-slate-300 hover:text-white hover:border-slate-500"
              onClick={() => navigate("/change-password")}
            >
              <Lock className="w-4 h-4" /> Change Password
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-lg flex items-center gap-2 text-blue-400 hover:bg-blue-500/30"
              onClick={() => navigate("/admin/users")}
            >
              <Users className="w-4 h-4" /> Manage Users
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 bg-emerald-500/20 border border-emerald-400/30 rounded-lg flex items-center gap-2 text-emerald-400 hover:bg-emerald-500/30"
              onClick={() => navigate("/admin/stores")}
            >
              <Store className="w-4 h-4" /> Manage Stores
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 bg-red-500/20 border border-red-400/30 rounded-lg flex items-center gap-2 text-red-400 hover:bg-red-500/30"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" /> Logout
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {loading ? (
          <div className="flex justify-center items-center py-20 flex-col gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
            <p className="text-slate-400">Loading analytics...</p>
          </div>
        ) : (
          <motion.div
            variants={fadeContainer}
            initial="hidden"
            animate="visible"
            className="space-y-10"
          >
            {/* ANALYTICS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* USERS CARD */}
              <motion.div
                variants={fadeItem}
                whileHover={{ y: -6 }}
                className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 shadow-lg hover:border-blue-500/50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-400 text-sm">Total Users</p>
                    <p className="text-4xl font-bold mt-2">
                      {stats.totalUsers}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </motion.div>

              {/* STORES CARD */}
              <motion.div
                variants={fadeItem}
                whileHover={{ y: -6 }}
                className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 shadow-lg hover:border-emerald-500/50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-400 text-sm">Total Stores</p>
                    <p className="text-4xl font-bold mt-2">
                      {stats.totalStores}
                    </p>
                  </div>
                  <div className="p-3 bg-emerald-500/20 rounded-lg">
                    <Store className="w-6 h-6 text-emerald-400" />
                  </div>
                </div>
              </motion.div>

              {/* RATINGS CARD */}
              <motion.div
                variants={fadeItem}
                whileHover={{ y: -6 }}
                className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 shadow-lg hover:border-yellow-500/50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-400 text-sm">Total Ratings</p>
                    <p className="text-4xl font-bold mt-2">
                      {stats.totalRatings}
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-500/20 rounded-lg">
                    <Star className="w-6 h-6 text-yellow-400" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* CHARTS SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* BAR CHART */}
              <motion.div
                variants={fadeItem}
                className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-6 shadow-xl"
              >
                <div className="flex items-center gap-2 mb-6">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-semibold">Classical Bar Chart</h3>
                </div>

                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={userData}>
                    <CartesianGrid strokeDasharray="4 4" stroke="#475569" />
                    <XAxis dataKey="name" stroke="#cbd5e1" />
                    <YAxis stroke="#cbd5e1" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Bar dataKey="value" fill="#3B82F6" barSize={45} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              {/* PIE CHART */}
              <motion.div
                variants={fadeItem}
                className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-6 shadow-xl"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-lg font-semibold">Classical Pie Chart</h3>
                </div>

                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={userData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={120}
                      innerRadius={60}
                      label
                    >
                      {userData.map((entry, idx) => (
                        <Cell
                          key={idx}
                          fill={COLORS[idx % COLORS.length]}
                          stroke="#0f172a"
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
