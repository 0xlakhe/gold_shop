import { useEffect, useState } from "react";
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
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp, PackagePlus, X } from "lucide-react";

function Inventory() {
  const location = useLocation();
  const navigate = useNavigate();
  const inventoryFilter = location.state || {};
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

  const handleMetal = (e) => {
    setMetal(e.target.value);
  };
  const handleRefresh = () => {
    setRefresh((i) => i + 1);
  };

  const handleItemTypes = (e) => {
    setSelectedType(e.target.value);
    console.log(selectedType);
  };

  const filterItems = (items, metalName) => {
    if (!inventoryFilter.typeName || inventoryFilter.metal !== metalName) {
      return items;
    }

    return items.filter(
      (item) => item.item_type_name === inventoryFilter.typeName,
    );
  };

  const filteredSoldGoldItems = filterItems(soldGoldItems, "gold");
  const filteredUnsoldGoldItems = filterItems(unsoldGoldItems, "gold");
  const filteredSoldSilverItems = filterItems(soldSilverItems, "silver");
  const filteredUnsoldSilverItems = filterItems(unsoldSilverItems, "silver");
  const showGoldSections =
    !inventoryFilter.metal || inventoryFilter.metal === "gold";
  const showSilverSections =
    !inventoryFilter.metal || inventoryFilter.metal === "silver";

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

  return (
    <div className="app-page">
      <Navbar />
      <main className="page-wrap">
        <header className="page-header">
          <div>
            <p className="eyebrow">Stock room</p>
            <h1 className="page-title">Inventory</h1>
            <p className="page-subtitle">
              Review sold and unsold pieces, then add new stock from the side
              panel.
            </p>
          </div>
        </header>

        {loading && <div className="panel panel-body">Loading inventory...</div>}

        {!loading && (
          <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
            <section className="space-y-4">
              {inventoryFilter.typeName && (
                <div className="panel panel-body flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-stone-950">
                      Showing {inventoryFilter.typeName} items
                    </p>
                    <p className="text-sm text-stone-500">
                      Filtered from the dashboard{" "}
                      {inventoryFilter.metal
                        ? `for ${inventoryFilter.metal} stock`
                        : "stock"}
                      .
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => navigate("/inventory", { replace: true })}
                  >
                    <X size={16} />
                    Clear filter
                  </button>
                </div>
              )}

              <div className="grid items-start gap-4 lg:grid-cols-2">
                <div className="space-y-4">
                  <div className="px-1">
                    <p className="text-sm font-bold text-stone-900">
                      Available stock
                    </p>
                    <p className="text-xs text-stone-500">
                      Items still in inventory
                    </p>
                  </div>
                  {showGoldSections && (
                    <InventorySection
                      title="Unsold Gold Items"
                      items={filteredUnsoldGoldItems}
                      callRefresh={handleRefresh}
                    />
                  )}
                  {showSilverSections && (
                    <InventorySection
                      title="Unsold Silver Items"
                      items={filteredUnsoldSilverItems}
                      callRefresh={handleRefresh}
                    />
                  )}
                </div>

                <div className="space-y-4">
                  <div className="px-1">
                    <p className="text-sm font-bold text-stone-900">
                      Sold stock
                    </p>
                    <p className="text-xs text-stone-500">
                      Completed sale records
                    </p>
                  </div>
                  {showGoldSections && (
                    <InventorySection
                      title="Sold Gold Items"
                      items={filteredSoldGoldItems}
                      showSellingPrice={true}
                      callRefresh={handleRefresh}
                    />
                  )}
                  {showSilverSections && (
                    <InventorySection
                      title="Sold Silver Items"
                      items={filteredSoldSilverItems}
                      showSellingPrice={true}
                      callRefresh={handleRefresh}
                    />
                  )}
                </div>
              </div>
            </section>

            <aside className="panel h-fit">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 bg-white px-5 py-4 text-left text-stone-950 transition hover:bg-stone-50"
                onClick={() => setIsAddItem(!isAddItem)}
              >
                <span className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-stone-100 text-stone-700">
                    <PackagePlus size={20} />
                  </span>
                  <span>
                    <span className="block text-lg font-bold text-stone-950">
                      Add item
                    </span>
                    <span className="text-sm text-stone-500">
                      Create gold or silver stock
                    </span>
                  </span>
                </span>
                {isAddItem ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {isAddItem && (
                <div className="space-y-4 border-t border-stone-100 p-5">
                  <div className="field">
                    <label className="field-label" htmlFor="item-type">
                      Select type
                    </label>
                    <select
                      id="item-type"
                      className="select"
                      value={selectedType}
                      onChange={handleItemTypes}
                    >
                      <option value="" disabled>
                        Choose an option
                      </option>
                      {itemTypes.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="field">
                    <label className="field-label" htmlFor="metal">
                      Select metal
                    </label>
                    <select
                      id="metal"
                      className="select"
                      value={metal}
                      onChange={handleMetal}
                    >
                      <option value="" disabled>
                        Choose an option
                      </option>
                      <option value="gold">Gold</option>
                      <option value="silver">Silver</option>
                    </select>
                  </div>

                  {metal === "gold" && (
                    <AddGoldItemSection
                      item_id={selectedType}
                      itemAdded={handleRefresh}
                    />
                  )}
                  {metal === "silver" && (
                    <AddSilverItemSection
                      item_id={selectedType}
                      itemAdded={handleRefresh}
                    />
                  )}
                </div>
              )}
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}

export default Inventory;
