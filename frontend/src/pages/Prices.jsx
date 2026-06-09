import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getAllPrice, getPrice, setPrice } from "../api/prices";

function Prices() {
  const [todayPrice, setTodayPrice] = useState("");
  const [historyPrice, setHistoryPrice] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
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
      alert("Please enter both gold and silver prices.");
      return;
    }
    setSubmitting(true);
    try {
      await setPrice({
        gold_price_per_tola: Number(goldPrice),
        silver_price_per_tola: Number(silverPrice),
      });
      alert("Price updated!");
    } catch (err) {
      console.error("Failed to update price", err);
      alert("error updating price");
    } finally {
      setSubmitting(false);
    }
  };
  if (loading) {
    return (
      <div>
        <Navbar />
        Loading...
      </div>
    );
  }
  return (
    <div>
      <Navbar />
      <div className="prices flex justify-around mt-10 flex-wrap">
        <div className="latest-price">
          <h2>Latest Price: </h2>
          <div>
            {/* optional chaining ? will render only if data arrives */}
            <p>Gold Price: {todayPrice?.gold_price_per_tola}</p>
            <p>Silver price: {todayPrice?.silver_price_per_tola}</p>
          </div>
        </div>
        <div className="history-price ">
          <button
            className="hover:bg-yellow-600 hover:cursor-pointer"
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
          >
            <p>History Price</p>
          </button>
          {isHistoryOpen && (
            <>
              {historyPrice.map((item) => (
                <div className="pb-10" key={item.id}>
                  <p>date: {formatDate(item["date"])}</p>
                  <p>gold price:{item["gold_price_per_tola"]}</p>
                  <p>silver price: {item["silver_price_per_tola"]}</p>
                </div>
              ))}
            </>
          )}
        </div>
        <div>
          <form onSubmit={handlePriceSubmit}>
            <h3>Set Today's Price</h3>
            <div className="gold-price">
              <label>Gold Price</label>
              <input
                type="number"
                value={goldPrice}
                onChange={(e) => setGoldPrice(e.target.value)}
              />
            </div>

            <div className="silver-price">
              <label>Silver Price</label>
              <input
                type="number"
                value={silverPrice}
                onChange={(e) => setSilverPrice(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="hover:cursor-pointer bg-amber-200"
            >
              {submitting ? "Updating..." : "Set New Prices"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Prices;
