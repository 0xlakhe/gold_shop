import React, { useEffect, useState } from "react";
import { getSoldGoldItem, getSoldSilverItem } from "../api/inventory";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";

function SoldItems() {
  const location = useLocation();
  const isGold = location.state?.isGold ?? true;
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
    <div>
      <Navbar />
      <div className="p-6">Loading...</div>
    </div>;
  }

  if (error) {
    <div>
      <Navbar />
      <div className="p-6 text-red-500">{error}</div>
    </div>;
  }

  return (
    <div>
      <Navbar />
      {isGold
        ? goldData?.map((item) => (
            <div className="pt-5" key={item.id}>
              Id:{item.id} <br /> name:{item.item_type_name} <br />karat:{item.karat} <br />purchase price: {item.purchase_price} <br /> selling
              price:{item.selling_price} <br /> sold date: {formatDate(item.sold_at)}
            </div>
          ))
        : silverData?.map((item) => <div key={item.id}>{item.id}</div>)}
    </div>
  );
}

export default SoldItems;
