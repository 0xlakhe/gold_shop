import { useEffect, useState } from "react";
import { getSoldGoldItem, getSoldSilverItem } from "../api/inventory";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import { BadgeCheck } from "lucide-react";

function SoldItems() {
  const location = useLocation();
  const isGold = location.state?.isGold ?? true;
  const currentMonthOnly = location.state?.currentMonthOnly ?? false;
  const [goldData, setGoldData] = useState(null);
  const [silverData, setSilverData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const goldRes = await getSoldGoldItem();
        const silverRes = await getSoldSilverItem();
        setGoldData(goldRes.data);
        setSilverData(silverRes.data);
        console.log(goldRes);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="app-page">
        <Navbar />
        <div className="page-wrap">
          <div className="panel panel-body">Loading sold items...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-page">
        <Navbar />
        <div className="page-wrap">
          <div className="panel panel-body text-red-600">
            Failed to load sold items.
          </div>
        </div>
      </div>
    );
  }

  const isCurrentMonth = (dateString) => {
    if (!dateString) return false;
    const soldDate = new Date(dateString);
    const today = new Date();

    return (
      soldDate.getFullYear() === today.getFullYear() &&
      soldDate.getMonth() === today.getMonth()
    );
  };

  const allItems = isGold ? goldData : silverData;
  const items = currentMonthOnly
    ? allItems?.filter((item) => isCurrentMonth(item.sold_at))
    : allItems;

  return (
    <div className="app-page">
      <Navbar />
      <main className="page-wrap">
        <header className="page-header">
          <div>
            <p className="eyebrow">Sales</p>
            <h1 className="page-title">
              {currentMonthOnly ? "This month sold" : "Sold"}{" "}
              {isGold ? "gold" : "silver"} items
            </h1>
            <p className="page-subtitle">
              Review {currentMonthOnly ? "this month's" : "completed"} sales
              with purchase and selling values.
            </p>
          </div>
          <span className="badge">{items?.length ?? 0} sold</span>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items?.length ? (
            items.map((item) => (
              <article className="panel panel-body" key={item.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-bold text-stone-950">
                      {item.item_type_name}
                    </p>
                    <p className="mt-1 text-sm text-stone-500">
                      Sold {formatDate(item.sold_at)}
                    </p>
                  </div>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
                    <BadgeCheck size={18} />
                  </span>
                </div>

                <div className="mt-5 grid gap-3 text-sm">
                  <div className="list-row">
                    <span className="text-stone-500">ID</span>
                    <span className="font-semibold text-stone-950">{item.id}</span>
                  </div>
                  <div className="list-row">
                    <span className="text-stone-500">
                      {isGold ? "Karat" : "Purity"}
                    </span>
                    <span className="font-semibold text-stone-950">
                      {isGold ? item.karat : `${item.purity_percent}%`}
                    </span>
                  </div>
                  <div className="list-row">
                    <span className="text-stone-500">Purchase price</span>
                    <span className="font-semibold text-stone-950">
                      {item.purchase_price}
                    </span>
                  </div>
                  <div className="list-row">
                    <span className="text-stone-500">Selling price</span>
                    <span className="font-semibold text-emerald-700">
                      {item.selling_price}
                    </span>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="panel panel-body text-sm text-stone-500">
              No sold items found.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default SoldItems;
