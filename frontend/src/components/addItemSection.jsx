import React, { useState } from "react";
import { addGoldItem, addSilverItem } from "../api/inventory";

function AddGoldItemSection({ item_id, itemAdded }) {
  const [karat, setKarat] = useState("24");
  const [weight, setWeight] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!item_id) {
      return alert("Please select an item type before adding a gold item.");
    }

    try {
      const addItem = await addGoldItem({
        item_type_id: item_id,
        weight_tola: weight,
        karat: karat,
        purchase_price: purchasePrice,
      });
      console.log(addItem);
    } catch (error) {
      console.error("Failed to add gold item", error);
    } finally {
      alert("added");
      itemAdded();
      setWeight("");
      setPurchasePrice("");
    }
  };

  const handleKarat = (e) => {
    setKarat(e.target.value);
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="karat">
          <p>Karat</p>
          <select value={karat} onChange={handleKarat} required>
            <option value="24">24K</option>
            <option value="22">22K</option>
            <option value="18">18K</option>
          </select>
        </div>
        <div className="weight">
          <p>Enter weight</p>
          <input
            type="number"
            value={weight}
            placeholder="weight here"
            className="border border-amber-300"
            onChange={(e) => setWeight(e.target.value)}
            required
          />
        </div>
        <div className="purchase-price">
          <p>Purchase Price</p>
          <input
            type="number"
            className="border border-amber-300"
            placeholder="purchase price here"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="bg-amber-200">
          submit
        </button>
      </form>
    </div>
  );
}

function AddSilverItemSection({ item_id, itemAdded }) {
  const [purity, setPurity] = useState("100");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [weight, setWeight] = useState("");
  const handlePurity = (e) => {
    setPurity(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const addItem = await addSilverItem({
        item_type_id: item_id,
        weight_tola: weight,
        purity_percent: purity,
        purchase_price: purchasePrice,
      });
      console.log(addItem);
    } catch (err) {
      console.log(err);
    } finally {
      alert("Success");
      itemAdded();
      setWeight("");
      setPurchasePrice("");
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="purity">
          <p>Purity</p>
          <input
            type="number"
            className="border border-amber-200"
            value={purity}
            onChange={handlePurity}
            min="0"
            max="100"
          />
        </div>
        <div className="weight">
          <p>Enter Weight</p>
          <input
            className="border border-amber-200"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>
        <div className="purchase-price">
          <p>Purchase Price</p>
          <input
            type="number"
            value={purchasePrice}
            className="border border-amber-200"
            onChange={(e) => setPurchasePrice(e.target.value)}
          />
        </div>
        <button type="submit" className="bg-amber-200">
          submit
        </button>
      </form>
    </div>
  );
}

export { AddGoldItemSection, AddSilverItemSection };
