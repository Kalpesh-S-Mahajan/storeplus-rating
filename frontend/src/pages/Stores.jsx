import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, LogOut, Lock, Star, TrendingUp, Loader2 } from "lucide-react";

export default function Stores() {
  const [stores, setStores] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [rating, setRating] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState({});
  const navigate = useNavigate();

  const fetchStores = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/rating/stores");
      setStores(data || []);
      setFiltered(data || []);

      const userRatings = {};
      data.forEach((store) => {
        if (store.user_rating) {
          userRatings[store.id] = store.user_rating;
        }
      });
      setRating(userRatings);
    } catch (err) {
      console.error("Failed to fetch stores:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    const lower = search.toLowerCase();
    setFiltered(
      stores.filter(
        (s) =>
          s.name.toLowerCase().includes(lower) ||
          s.address.toLowerCase().includes(lower)
      )
    );
  }, [search, stores]);

  const handleRating = async (storeId) => {
    if (!rating[storeId]) {
      alert("Please choose a rating (1-5)");
      return;
    }

    try {
      setSubmitting({ ...submitting, [storeId]: true });
      await API.post("/rating/submit", {
        store_id: storeId,
        rating: rating[storeId],
      });

      alert("Rating saved!");
      fetchStores();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit rating");
    } finally {
      setSubmitting({ ...submitting, [storeId]: false });
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-40 border-b border-slate-700/50 backdrop-blur-xl bg-slate-900/80"
      >
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              🏪 Rate Stores
            </h1>
            <p className="text-slate-400 text-sm mt-1">Share your experience</p>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/change-password")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white transition-colors"
            >
              <Lock className="w-4 h-4" />
              <span className="text-sm">Change Password</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 text-red-400 hover:text-red-300 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-10"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or address..."
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Stores Grid */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-20"
          >
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
              <p className="text-slate-400">Loading stores...</p>
            </div>
          </motion.div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-slate-400 text-lg">No stores found.</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((s, idx) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
                className="group bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 hover:border-slate-600 transition-all shadow-lg hover:shadow-xl hover:shadow-blue-500/10"
              >
                {/* Store Header */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {s.name}
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">{s.address}</p>
                </div>

                {/* Rating Display */}
                <div className="mb-6 p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Avg Rating</span>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-xl font-bold text-yellow-400">
                        {s.average_rating
                          ? Number.parseFloat(s.average_rating).toFixed(1)
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rating Input */}
                <div className="mb-4">
                  <label className="text-sm font-medium text-slate-300 block mb-2">
                    Your Rating
                  </label>
                  <select
                    className="w-full px-3 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={rating[s.id] || ""}
                    onChange={(e) =>
                      setRating({ ...rating, [s.id]: +e.target.value })
                    }
                  >
                    <option value="">Select rating...</option>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n === 5
                          ? "⭐⭐⭐⭐⭐ Excellent"
                          : n === 4
                          ? "⭐⭐⭐⭐ Very Good"
                          : n === 3
                          ? "⭐⭐⭐ Good"
                          : n === 2
                          ? "⭐⭐ Fair"
                          : "⭐ Poor"}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRating(s.id)}
                  disabled={submitting[s.id]}
                  className="w-full bg-linear-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  {submitting[s.id] ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-4 h-4" />
                      <span>
                        {s.user_rating ? "Update Rating" : "Submit Rating"}
                      </span>
                    </>
                  )}
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}
