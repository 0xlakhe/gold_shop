import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { dashboard } from "../api/dashboard";
import { Link } from "react-router-dom";

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
      <div>
        <Navbar />
        <div className="p-6">Loading...</div>
      </div>
    );

  if (error)
    return (
      <div>
        <Navbar />
        <div className="p-6 text-red-500">{error}</div>
      </div>
    );

  return (
    <div>
      <Navbar />
      <div className="flex flex-col gap-5 pt-5 pb-5 pl-10 pt-10">
        <p className="font-bold text-xl">
          Today's Gold price: {data.today_gold_price}
        </p>
        <p className="font-bold text-xl">
          Today's Silver price: {data.today_silver_price}
        </p>
        <p className="font-bold text-xl">Price Note: {data.price_note}</p>
      </div>

      <div className="inventory ">
        <div className="gold-inventory pl-10 pt-10">
          <p className="font-bold text-xl">Gold Inventory</p>
          <div>
            <p>Total Items: {data.gold_inventory.total_items}</p>
            <p>Total Value: {data.gold_inventory.total_value}</p>
            <div>
              {Object.keys(data.gold_inventory.items_by_types).map((key) => (
                <p key={key}>
                  {key}: {String(data.gold_inventory.items_by_types[key])}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="silver-inventory pl-10 pt-10">
          <p className="font-bold text-xl">Silver Inventory</p>
          <div>
            <p>Total Items: {data.silver_inventory.total_items}</p>
            <p>Total Value: {data.silver_inventory.total_value}</p>
            <div>
              {Object.keys(data.silver_inventory.items_by_types).map((key) => (
                <p key={key}>
                  {key}:{String(data.gold_inventory.items_by_types[key])}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="this-month pl-10 pt-10">
          <p className="font-bold text-xl">This Month Report</p>
          <div className="gold-report">
            <p>
                
              Total Gold Items sold:{" "}
              <Link to="/sold-items" state={{ isGold: true }}>
                {data.this_month.gold_sold}
              </Link>
            </p>
            <p>Total Gold Profit: {data.this_month.gold_profit}</p>
          </div>
          <div className="silver-report">
            <p>Total Silver Items sold: {data.this_month.silver_sold}</p>
            <p>Total Silver Profit: {data.this_month.silver_profit}</p>
          </div>

          <div>
            <p>
              Total profit:
              {data.this_month.gold_profit + data.this_month.silver_profit}
            </p>
          </div>
        </div>
      </div>
      {JSON.stringify(data, null, 2)}
    </div>
  );
}

export default Dashboard;
