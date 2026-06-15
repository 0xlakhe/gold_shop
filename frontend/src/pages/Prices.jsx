import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getAllPrice, getPrice, setPrice } from "../api/prices";
import { ChevronDown, ChevronUp, Coins, History, Save } from "lucide-react";
import useToast from "../context/useToast";

function Prices() {
  const toast = useToast();
  const [todayPrice, setTodayPrice] = useState("");
  const [historyPrice, setHistoryPrice] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
  const [goldPrice, setGoldPrice] = useState("");
  const [silverPrice, setSilverPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const tPrice = await getPrice();
        const hPrice = await getAllPrice();
        setTodayPrice(tPrice.data);
        setHistoryPrice(hPrice.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrice();
  }, [submitting]);
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handlePriceSubmit = async (e) => {
    e.preventDefault();
    if (!goldPrice || !silverPrice) {
      toast.warning("Please enter both gold and silver prices");
      return;
    }
    setSubmitting(true);
    try {
      await setPrice({
        gold_price_per_tola: Number(goldPrice),
        silver_price_per_tola: Number(silverPrice),
      });
      toast.success("Price updated");
    } catch (err) {
      console.error("Failed to update price", err);
      toast.error("Could not update price");
    } finally {
      setSubmitting(false);
    }
  };
  if (loading) {
    return (
      <div className="app-page">
        <Navbar />
        <div className="page-wrap">
          <div className="panel panel-body">Loading prices...</div>
        </div>
      </div>
    );
  }
  return (
    <div className="app-page">
      <Navbar />
      <main className="page-wrap">
        <header className="page-header">
          <div>
            <p className="eyebrow">Rates</p>
            <h1 className="page-title">Metal prices</h1>
            <p className="page-subtitle">
              Set today's rates and review recent price changes.
            </p>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-yellow-200 bg-yellow-50/60 dark:border-yellow-700/40 dark:bg-yellow-900/20 p-5 shadow-sm shadow-stone-200/40 dark:shadow-black/20">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                    Latest gold price
                  </p>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-white text-yellow-700 dark:bg-stone-700 dark:text-yellow-400">
                    <Coins size={19} />
                  </span>
                </div>
                <p className="stat-value">
                  {todayPrice?.gold_price_per_tola ?? "N/A"}
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700/40 dark:bg-slate-900/20 p-5 shadow-sm shadow-stone-200/40 dark:shadow-black/20">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    Latest silver price
                  </p>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-white text-slate-500 dark:bg-stone-700 dark:text-slate-400">
                    <Coins size={19} />
                  </span>
                </div>
                <p className="stat-value">
                  {todayPrice?.silver_price_per_tola ?? "N/A"}
                </p>
              </div>
            </div>

            <div className="panel">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              >
                <span className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-stone-100 text-stone-700 dark:bg-stone-700 dark:text-stone-300">
                    <History size={20} />
                  </span>
                  <span>
                    <span className="block text-lg font-bold text-stone-950 dark:text-stone-100">
                      Price history
                    </span>
                    <span className="text-sm text-stone-500 dark:text-stone-400">
                      {historyPrice.length} recorded updates
                    </span>
                  </span>
                </span>
                {isHistoryOpen ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>
              {isHistoryOpen && (
                <div className="space-y-3 border-t border-stone-100 dark:border-stone-700 p-5">
                  {historyPrice.length ? (
                    historyPrice.map((item) => (
                      <div
                        className="rounded-lg border border-[#efe5d3] bg-[#fffaf0] dark:border-stone-700 dark:bg-stone-800/80 p-4"
                        key={item.id}
                      >
                        <div className="mb-3">
                          <p className="font-semibold text-stone-950 dark:text-stone-100">
                            {formatDate(item.date)}
                          </p>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="rounded-md border border-yellow-200 bg-yellow-50/70 dark:border-yellow-700/40 dark:bg-yellow-900/20 px-3 py-2">
                            <p className="text-xs font-semibold uppercase tracking-wide text-yellow-800 dark:text-yellow-300">
                              Gold
                            </p>
                            <p className="mt-1 font-bold text-stone-950 dark:text-stone-100">
                              {item.gold_price_per_tola}
                            </p>
                          </div>
                          <div className="rounded-md border border-slate-200 bg-slate-50 dark:border-slate-700/40 dark:bg-slate-900/20 px-3 py-2">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                              Silver
                            </p>
                            <p className="mt-1 font-bold text-stone-950 dark:text-stone-100">
                              {item.silver_price_per_tola}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-lg border border-dashed border-stone-200 dark:border-stone-600 p-6 text-center text-sm text-stone-500 dark:text-stone-400">
                      No price history yet.
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          <aside className="panel h-fit">
            <div className="panel-header">
              <h2 className="text-lg font-bold text-stone-950 dark:text-stone-100">
                Set today's price
              </h2>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                Enter both metal rates before saving.
              </p>
            </div>
            <form className="panel-body space-y-4" onSubmit={handlePriceSubmit}>
              <div className="field">
                <label className="field-label" htmlFor="gold-price">
                  Gold price
                </label>
                <input
                  id="gold-price"
                  className="input"
                  type="number"
                  value={goldPrice}
                  onChange={(e) => setGoldPrice(e.target.value)}
                />
              </div>

              <div className="field">
                <label className="field-label" htmlFor="silver-price">
                  Silver price
                </label>
                <input
                  id="silver-price"
                  className="input"
                  type="number"
                  value={silverPrice}
                  onChange={(e) => setSilverPrice(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full"
              >
                <Save size={16} />
                {submitting ? "Updating..." : "Set new prices"}
              </button>
            </form>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default Prices;
