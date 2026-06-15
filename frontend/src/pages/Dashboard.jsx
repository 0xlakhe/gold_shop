import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { dashboard } from "../api/dashboard";
import { Link } from "react-router-dom";
import { ArrowUpRight, Gem, Package, TrendingUp, Wallet } from "lucide-react";

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await dashboard();
        setData(res.data);
        console.log(res);
      } catch (err) {
        setError("Failed to load dashboard");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading)
    return (
      <div className="app-page">
        <Navbar />
        <div className="page-wrap">
          <div className="panel panel-body">Loading dashboard...</div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="app-page">
        <Navbar />
        <div className="page-wrap">
          <div className="panel panel-body text-red-600 dark:text-red-400">{error}</div>
        </div>
      </div>
    );

  const renderTypeBreakdown = (items = {}, metal) => {
    const entries = Object.entries(items);
    if (!entries.length) {
      return <p className="text-sm text-stone-500 dark:text-stone-400">No items recorded yet.</p>;
    }

    return (
      <div className="mt-4 space-y-2">
        {entries.map(([name, count]) => (
          <Link
            className="list-row transition hover:border-amber-200 hover:bg-amber-50/60 dark:hover:border-amber-700/40 dark:hover:bg-amber-900/15"
            key={name}
            to="/inventory"
            state={{ metal, typeName: name }}
          >
            <span className="text-sm font-semibold text-stone-700 dark:text-stone-200">
              {name}
            </span>
            <span className="badge">{String(count)}</span>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="app-page">
      <Navbar />
      <main className="page-wrap">
        <header className="page-header">
          <div>
            <p className="eyebrow">Overview</p>
            <h1 className="page-title">Daily inventory snapshot</h1>
            <p className="page-subtitle">
              Track metal rates, stock value, and this month's selling activity
              from one calm workspace.
            </p>
          </div>
          <Link className="btn-secondary" to="/prices">
            Update prices
            <ArrowUpRight size={16} />
          </Link>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <p className="stat-label">Gold price</p>
              <Gem className="text-amber-600 dark:text-amber-400" size={20} />
            </div>
            <p className="stat-value">{data.today_gold_price ?? "N/A"}</p>
            <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">Per tola today</p>
          </div>
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <p className="stat-label">Silver price</p>
              <Wallet className="text-stone-500 dark:text-stone-400" size={20} />
            </div>
            <p className="stat-value">{data.today_silver_price ?? "N/A"}</p>
            <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">Per tola today</p>
          </div>
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <p className="stat-label">Price note</p>
              <TrendingUp className="text-emerald-600 dark:text-emerald-400" size={20} />
            </div>
            <p className="mt-2 text-lg font-bold text-stone-950 dark:text-stone-100">
              {data.price_note || "No note added"}
            </p>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="panel">
            <div className="panel-header flex items-center justify-between">
              <div>
                <p className="eyebrow">Inventory</p>
                <h2 className="text-lg font-bold text-stone-950 dark:text-stone-100">Gold stock</h2>
              </div>
              <Package className="text-amber-600 dark:text-amber-400" size={20} />
            </div>
            <div className="panel-body">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="stat-label">Total items</p>
                  <p className="stat-value">{data.gold_inventory.total_items}</p>
                </div>
                <div>
                  <p className="stat-label">Total value</p>
                  <p className="stat-value">{data.gold_inventory.total_value}</p>
                </div>
              </div>
              {renderTypeBreakdown(data.gold_inventory.items_by_types, "gold")}
            </div>
          </div>

          <div className="panel">
            <div className="panel-header flex items-center justify-between">
              <div>
                <p className="eyebrow">Inventory</p>
                <h2 className="text-lg font-bold text-stone-950 dark:text-stone-100">
                  Silver stock
                </h2>
              </div>
              <Package className="text-stone-500 dark:text-stone-400" size={20} />
            </div>
            <div className="panel-body">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="stat-label">Total items</p>
                  <p className="stat-value">
                    {data.silver_inventory.total_items}
                  </p>
                </div>
                <div>
                  <p className="stat-label">Total value</p>
                  <p className="stat-value">
                    {data.silver_inventory.total_value}
                  </p>
                </div>
              </div>
              {renderTypeBreakdown(
                data.silver_inventory.items_by_types,
                "silver",
              )}
            </div>
          </div>
        </section>

        <section className="panel mt-6">
          <div className="panel-header">
            <p className="eyebrow">This month</p>
            <h2 className="text-lg font-bold text-stone-950 dark:text-stone-100">Sales report</h2>
          </div>
          <div className="panel-body grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
              <p className="stat-label">Gold items sold</p>
              <Link
                to="/sold-items"
                state={{ isGold: true, currentMonthOnly: true }}
                className="mt-2 inline-flex items-center gap-2 text-2xl font-bold text-amber-900 dark:text-amber-300"
              >
                {data.this_month.gold_sold}
                <ArrowUpRight size={18} />
              </Link>
              <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
                Profit: {data.this_month.gold_profit}
              </p>
            </div>
            <div className="rounded-lg bg-stone-100 p-4 dark:bg-stone-800">
              <p className="stat-label">Silver items sold</p>
              <Link
                to="/sold-items"
                state={{ isGold: false, currentMonthOnly: true }}
                className="mt-2 inline-flex items-center gap-2 text-2xl font-bold text-stone-950 dark:text-stone-100"
              >
                {data.this_month.silver_sold}
                <ArrowUpRight size={18} />
              </Link>
              <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
                Profit: {data.this_month.silver_profit}
              </p>
            </div>
            <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-900/20">
              <p className="stat-label">Total profit</p>
              <p className="mt-2 text-2xl font-bold text-emerald-900 dark:text-emerald-300">
                {data.this_month.total_profit}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
