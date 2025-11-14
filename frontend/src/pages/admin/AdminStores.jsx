import { useEffect, useState } from "react";
import API from "../../api";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Plus, Eye, Search, Loader2, X, Star } from "lucide-react";

export default function AdminStores() {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
  });
  const [showCreate, setShowCreate] = useState(false);
  const [createData, setCreateData] = useState({
    name: "",
    email: "",
    address: "",
    owner_id: "",
  });
  const [selectedStore, setSelectedStore] = useState(null);

  const loadStores = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/admin/stores", { params: filters });
      setStores(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load stores");
    } finally {
      setLoading(false);
    }
  };

  const loadOwners = async () => {
    try {
      const { data } = await API.get("/admin/users?role=store_owner");
      setOwners(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadStores();
    loadOwners();
  }, []);

  useEffect(() => {
    loadStores();
  }, [filters]);

  const handleCreateStore = async (e) => {
    e.preventDefault();
    try {
      await API.post("/admin/stores", createData);
      alert("Store created successfully!");
      setShowCreate(false);
      setCreateData({
        name: "",
        email: "",
        address: "",
        owner_id: "",
      });
      loadStores();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create store");
    }
  };

  const handleLogout = () => {
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
              🏬 Manage Stores
            </h1>
            <p className="text-slate-400 text-sm mt-1">Store Administration</p>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/admin/dashboard")}
              className="px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white transition-colors text-sm"
            >
              Dashboard
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30 hover:bg-emerald-500/30 text-emerald-400 hover:text-emerald-300 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Store</span>
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
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { placeholder: "Filter by name", key: "name" },
            { placeholder: "Filter by email", key: "email" },
            { placeholder: "Filter by address", key: "address" },
          ].map((filter) => (
            <div key={filter.key}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder={filter.placeholder}
                  value={filters[filter.key]}
                  onChange={(e) =>
                    setFilters({ ...filters, [filter.key]: e.target.value })
                  }
                />
              </div>
            </div>
          ))}
        </motion.div>

        {/* Table */}
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
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/50 border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                      Store Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                      Address
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                      Owner
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                      Avg Rating
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {stores.map((s) => (
                    <motion.tr
                      key={s.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ backgroundColor: "rgba(51, 65, 85, 0.5)" }}
                      className="transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-white font-medium">
                        {s.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">
                        {s.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">
                        {s.address}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">
                        {s.User?.name || "Unknown"}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-yellow-400 font-semibold">
                            {s.Ratings?.length
                              ? (
                                  s.Ratings.reduce((a, b) => a + b.rating, 0) /
                                  s.Ratings.length
                                ).toFixed(1)
                              : "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedStore(s)}
                          className="flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors text-xs"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </main>

      {/* Create Store Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-800/90 backdrop-blur border border-slate-700/50 rounded-xl shadow-2xl w-full max-w-md p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Create Store</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCreate(false)}
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </motion.button>
              </div>

              <form onSubmit={handleCreateStore} className="space-y-4">
                {[
                  { label: "Store Name", key: "name", type: "text" },
                  { label: "Email", key: "email", type: "email" },
                  { label: "Address", key: "address", type: "text" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={createData[field.key]}
                      onChange={(e) =>
                        setCreateData({
                          ...createData,
                          [field.key]: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Store Owner
                  </label>
                  <select
                    className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={createData.owner_id}
                    onChange={(e) =>
                      setCreateData({ ...createData, owner_id: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Store Owner</option>
                    {owners.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-linear-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white font-semibold py-2 px-4 rounded-lg transition-all"
                  >
                    Create Store
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowCreate(false)}
                    className="flex-1 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold transition-colors"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Store Modal */}
      <AnimatePresence>
        {selectedStore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-800/90 backdrop-blur border border-slate-700/50 rounded-xl shadow-2xl w-full max-w-md p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Store Details</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedStore(null)}
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </motion.button>
              </div>

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
                  <p className="text-sm text-slate-400 font-medium">Email</p>
                  <p className="text-white font-semibold mt-1">
                    {selectedStore.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 font-medium">Address</p>
                  <p className="text-white font-semibold mt-1">
                    {selectedStore.address}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 font-medium">Owner</p>
                  <p className="text-white font-semibold mt-1">
                    {selectedStore.User?.name}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-700">
                  <p className="text-sm text-yellow-400 font-medium">
                    ⭐ Average Rating
                  </p>
                  <p className="text-white font-semibold mt-1">
                    {selectedStore.Ratings?.length
                      ? (
                          selectedStore.Ratings.reduce(
                            (a, b) => a + b.rating,
                            0
                          ) / selectedStore.Ratings.length
                        ).toFixed(1)
                      : "No ratings yet"}
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedStore(null)}
                className="w-full mt-6 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold transition-colors"
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
