import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  getSoldGoldItem,
  getSoldSilverItem,
  getUnsoldGoldItem,
  getUnsoldSilverItem,
} from "../api/inventory";
import InventorySection from "../components/InventorySection";
import { getAllTypes } from "../api/itemTypes";
import {
  AddGoldItemSection,
  AddSilverItemSection,
} from "../components/addItemSection";

function Inventory() {
  //used in function /useEffect
  const [soldGoldItems, setSoldGoldItems] = useState([]);
  const [soldSilverItems, setSoldSilverItems] = useState([]);
  const [unsoldGoldItems, setUnSoldGoldItems] = useState([]);
  const [unsoldSilverItems, setUnsoldSilverItems] = useState([]);
  const [itemTypes, setItemTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  //used in return
  const [selectedType, setSelectedType] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [metal, setMetal] = useState("");
  const [isAddItem, setIsAddItem] = useState(true);

  const handlePurity = (e) => {
    setPurity(e.target.value);
    console.log(e.target.value);
  };
  const handleMetal = (e) => {
    setMetal(e.target.value);
  };
  const handleRefresh = () => {
    setRefresh((i) => i + 1);
  };

  const handleKarat = (e) => {
    setKarat(e.target.value);
  };
  const handleItemTypes = (e) => {
    setSelectedType(e.target.value);
    console.log(selectedType);
  };
  useEffect(() => {
    const getAllItems = async () => {
      try {
        const [soldGold, unSoldGold, soldSilver, unSoldSilver, allTypes] =
          await Promise.all([
            getSoldGoldItem(),
            getUnsoldGoldItem(),
            getSoldSilverItem(),
            getUnsoldSilverItem(),
            getAllTypes(),
          ]);
        setSoldGoldItems(soldGold.data);
        setUnSoldGoldItems(unSoldGold.data);
        setSoldSilverItems(soldSilver.data);
        setUnsoldSilverItems(unSoldSilver.data);
        setItemTypes(allTypes.data);
        console.log(unSoldSilver);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    getAllItems();
  }, [refresh]);

  if (loading) {
    return <div>Loading</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="flex">
        <div className="show-items flex justify-around w-1/2 ">
          <div className="gold-items pt-5 pl-5 flex gap-10 w-full">
            <div className="sold-gold-items w-full">
              <InventorySection
                title="Sold Gold Items"
                items={soldGoldItems}
                showSellingPrice={true}
                callRefresh={handleRefresh}
              />
            </div>
            <div className="unsold-gold-items w-full">
              <InventorySection
                title={"Unsold Gold items"}
                items={unsoldGoldItems}
                callRefresh={handleRefresh}
              />
            </div>
          </div>
          <div className="silver-items pt-5 pl-5 flex gap-10 w-full">
            <div className="sold-silver-items w-full">
              <InventorySection
                title={"Sold Silver items"}
                items={soldSilverItems}
                showSellingPrice={true}
                callRefresh={handleRefresh}
              />
            </div>
            <div className="unsold-silver-items w-full">
              <InventorySection
                title={"Unsold Silver items"}
                items={unsoldSilverItems}
                callRefresh={handleRefresh}
              />
            </div>
          </div>
        </div>

        <div className="Add Item w-45">
          <div>
            <button
              className="add-item mt-5 pl-5 flex gap-10 w-full bg-amber-200 hover:cursor-pointer"
              onClick={() => setIsAddItem(!isAddItem)}
            >
              Add Item
            </button>
            {isAddItem && (
              <div>
                <div className="select-type">
                  <p>Select Type</p>
                  <select value={selectedType} onChange={handleItemTypes}>
                    <option value="" disabled>
                      --Choose an option--
                    </option>
                    {itemTypes.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="select-metal">
                  <p>Select metal</p>
                  <select value={metal} onChange={handleMetal}>
                    <option value="" disabled>
                      --Choose an option--
                    </option>
                    <option value="gold">Gold</option>
                    <option value="silver">Silver</option>
                  </select>
                </div>

                {metal === "gold" && (
                  <div>
                    <AddGoldItemSection
                      item_id={selectedType}
                      itemAdded={handleRefresh}
                    />
                  </div>
                )}
                {metal === "silver" && (
                  <AddSilverItemSection
                    item_id={selectedType}
                    itemAdded={handleRefresh}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inventory;
