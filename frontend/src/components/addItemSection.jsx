import { useState } from "react";
import { addGoldItem, addSilverItem } from "../api/inventory";
import useToast from "./useToast";

function AddGoldItemSection({ item_id, itemAdded }) {
  const toast = useToast();
  const [karat, setKarat] = useState("24");
  const [weight, setWeight] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!item_id) {
      return toast.warning("Please select an item type before adding gold");
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
      toast.error("Could not add gold item");
      return;
    } finally {
      itemAdded();
      setWeight("");
      setPurchasePrice("");
    }
    toast.success("Gold item added");
  };

  const handleKarat = (e) => {
    setKarat(e.target.value);
  };
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="field">
        <label className="field-label" htmlFor="gold-karat">
          Karat
        </label>
        <select
          id="gold-karat"
          className="select"
          value={karat}
          onChange={handleKarat}
          required
        >
          <option value="24">24K</option>
          <option value="22">22K</option>
          <option value="18">18K</option>
        </select>
      </div>
      <div className="field">
        <label className="field-label" htmlFor="gold-weight">
          Weight
        </label>
        <input
          id="gold-weight"
          type="number"
          value={weight}
          placeholder="Weight in tola"
          className="input"
          onChange={(e) => setWeight(e.target.value)}
          required
        />
      </div>
      <div className="field">
        <label className="field-label" htmlFor="gold-purchase">
          Purchase price
        </label>
        <input
          id="gold-purchase"
          type="number"
          className="input"
          placeholder="Purchase price"
          value={purchasePrice}
          onChange={(e) => setPurchasePrice(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn-primary w-full">
        Add gold item
      </button>
    </form>
  );
}

function AddSilverItemSection({ item_id, itemAdded }) {
  const toast = useToast();
  const [purity, setPurity] = useState("100");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [weight, setWeight] = useState("");
  const handlePurity = (e) => {
    setPurity(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!item_id) {
      return toast.warning("Please select an item type before adding silver");
    }

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
      toast.error("Could not add silver item");
      return;
    } finally {
      itemAdded();
      setWeight("");
      setPurchasePrice("");
    }
    toast.success("Silver item added");
  };
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="field">
        <label className="field-label" htmlFor="silver-purity">
          Purity
        </label>
        <input
          id="silver-purity"
          type="number"
          className="input"
          value={purity}
          onChange={handlePurity}
          min="0"
          max="100"
        />
      </div>
      <div className="field">
        <label className="field-label" htmlFor="silver-weight">
          Weight
        </label>
        <input
          id="silver-weight"
          className="input"
          type="number"
          placeholder="Weight in tola"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
      </div>
      <div className="field">
        <label className="field-label" htmlFor="silver-purchase">
          Purchase price
        </label>
        <input
          id="silver-purchase"
          type="number"
          value={purchasePrice}
          className="input"
          placeholder="Purchase price"
          onChange={(e) => setPurchasePrice(e.target.value)}
        />
      </div>
      <button type="submit" className="btn-primary w-full">
        Add silver item
      </button>
    </form>
  );
}

export { AddGoldItemSection, AddSilverItemSection };
