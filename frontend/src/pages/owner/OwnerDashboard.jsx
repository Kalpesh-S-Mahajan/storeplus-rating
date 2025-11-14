import { useEffect, useState } from "react";
import API from "../../api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LogOut,
  Lock,
  RefreshCw,
  Store,
  Star,
  TrendingUp,
  Loader2,
  User,
} from "lucide-react";

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const [ownerName, setOwnerName] = useState(
    localStorage.getItem("name") || ""
  );
  const [ownerEmail, setOwnerEmail] = useState(
    localStorage.getItem("email") || ""
  );
  const [stores, setStores] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [totalRatingsCount, setTotalRatingsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingRatings, setLoadingRatings] = useState(false);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const res = await API.get("/store/my");
      const myStores = res.data || [];
      setStores(myStores);
      if (myStores.length) {
        setSelectedStoreId(myStores[0].id);
        setSelectedStore(myStores[0]);
      } else {
        setSelectedStoreId(null);
        setSelectedStore(null);
      }
      await computeTotalRatings(myStores);
    } catch (err) {
      console.warn("/store/my not available; trying fallback");
      try {
        const res2 = await API.get("/rating/stores");
        const allStores = res2.data || [];
        setStores(allStores);
        if (allStores.length) {
          setSelectedStoreId(allStores[0].id);
          setSelectedStore(allStores[0]);
        } else {
          setSelectedStoreId(null);
          setSelectedStore(null);
        }
        await computeTotalRatings(allStores);
      } catch (err2) {
        console.error("Failed to fetch stores:", err2);
        setStores([]);
        setSelectedStore(null);
        setTotalRatingsCount(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const computeTotalRatings = async (storeArray) => {
    if (!storeArray || storeArray.length === 0) {
      setTotalRatingsCount(0);
      return;
    }
    try {
      let total = 0;
      for (const s of storeArray) {
        try {
          const r = await API.get(`/rating/store/${s.id}`);
          const list = r.data?.Ratings || [];
          total += list.length;
        } catch (e) {
          // skip silently
        }
      }
      setTotalRatingsCount(total);
    } catch (err) {
      console.error("Error computing total ratings:", err);
      setTotalRatingsCount(0);
    }
  };

  const fetchRatingsForStore = async (storeId) => {
    if (!storeId) {
      setRatings([]);
      return;
    }
    setLoadingRatings(true);
    try {
      const { data } = await API.get(`/rating/store/${storeId}`);
      const list = data?.Ratings || [];
      setRatings(list);
      const s = stores.find((x) => x.id === Number.parseInt(storeId));
      setSelectedStore(s || null);
    } catch (err) {
      console.error("Failed to load ratings for store:", err);
      setRatings([]);
    } finally {
      setLoadingRatings(false);
    }
  };

  useEffect(() => {
    const nameFromStorage = localStorage.getItem("name");
    const emailFromStorage = localStorage.getItem("email");
    if (nameFromStorage && !ownerName) setOwnerName(nameFromStorage);
    if (emailFromStorage && !ownerEmail) setOwnerEmail(emailFromStorage);

    fetchStores();
  }, []);

  useEffect(() => {
    if (selectedStoreId) {
      fetchRatingsForStore(selectedStoreId);
    } else {
      setRatings([]);
    }
  }, [selectedStoreId]);

  const handleStoreSelect = (e) => {
    const id = e.target.value;
    setSelectedStoreId(id ? Number.parseInt(id) : null);
  };

  const handleRefresh = async () => {
    await fetchStores();
    if (selectedStoreId) await fetchRatingsForStore(selectedStoreId);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  const goChangePassword = () => {
    navigate("/change-password");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
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
              🏪 Store Owner Dashboard
            </h1>
            <div className="flex items-center gap-4 mt-2 text-slate-400 text-sm">
              {ownerName && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{ownerName}</span>
                </div>
              )}
              {ownerEmail && <span className="text-slate-500">•</span>}
              {ownerEmail && <span>{ownerEmail}</span>}
            </div>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={goChangePassword}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white transition-colors text-sm"
            >
              <Lock className="w-4 h-4" />
              <span>Change Password</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 transition-colors text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 text-red-400 hover:text-red-300 transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 hover:border-blue-500/50 transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">
                  Stores Owned
                </p>
                <p className="text-3xl font-bold text-white mt-2">
                  {stores.length}
                </p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Store className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 hover:border-emerald-500/50 transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">
                  Total Ratings
                </p>
                <p className="text-3xl font-bold text-white mt-2">
                  {totalRatingsCount}
                </p>
              </div>
              <div className="p-3 bg-emerald-500/20 rounded-lg">
                <Star className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 hover:border-yellow-500/50 transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">
                  Selected Store Avg
                </p>
                <p className="text-3xl font-bold text-yellow-400 mt-2">
                  {selectedStore?.average_rating
                    ? Number.parseFloat(selectedStore.average_rating).toFixed(1)
                    : selectedStore
                    ? "N/A"
                    : "-"}
                </p>
              </div>
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Main Grid */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-20"
          >
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
              <p className="text-slate-400">Loading dashboard...</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Store Selector */}
            <motion.div
              variants={itemVariants}
              className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-4">
                Your Stores
              </h2>

              {stores.length === 0 ? (
                <p className="text-slate-400 text-sm">
                  You don't own any stores yet.
                </p>
              ) : (
                <>
                  <select
                    value={selectedStoreId || ""}
                    onChange={handleStoreSelect}
                    className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all mb-6"
                  >
                    {stores.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} — {s.address}
                      </option>
                    ))}
                  </select>

                  {selectedStore ? (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-slate-400 font-medium">
                          Store Name
                        </p>
                        <p className="text-white font-semibold mt-1">
                          {selectedStore.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400 font-medium">
                          Address
                        </p>
                        <p className="text-slate-300 text-sm mt-1">
                          {selectedStore.address}
                        </p>
                      </div>
                      <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm text-yellow-400 font-semibold">
                            {selectedStore.average_rating
                              ? Number.parseFloat(
                                  selectedStore.average_rating
                                ).toFixed(1)
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-300 text-sm">
                      Select a store to view details.
                    </p>
                  )}
                </>
              )}
            </motion.div>

            {/* Ratings List */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-2 bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-white">
                  {selectedStore
                    ? `Ratings — ${selectedStore.name}`
                    : "Ratings"}
                </h2>
                {loadingRatings && (
                  <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                )}
              </div>

              {selectedStoreId ? (
                <>
                  {ratings.length === 0 ? (
                    <p className="text-slate-400 text-sm text-center py-8">
                      No ratings yet for this store.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-700">
                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">
                              User
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">
                              Rating
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">
                              Date
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">
                              Comment
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                          {ratings.map((r) => (
                            <motion.tr
                              key={r.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              whileHover={{
                                backgroundColor: "rgba(51, 65, 85, 0.3)",
                              }}
                              className="transition-colors"
                            >
                              <td className="px-4 py-3 text-sm text-white font-medium">
                                {r.User?.name ||
                                  r.User?.email ||
                                  `User #${r.user_id}`}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                  <span className="text-yellow-400 font-semibold">
                                    {r.rating}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-xs text-slate-400">
                                {r.createdAt
                                  ? new Date(r.createdAt).toLocaleDateString()
                                  : "-"}
                              </td>
                              <td className="px-4 py-3 text-sm text-slate-300">
                                {r.comment || "-"}
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-slate-400 text-sm text-center py-8">
                  Select a store to view ratings.
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
