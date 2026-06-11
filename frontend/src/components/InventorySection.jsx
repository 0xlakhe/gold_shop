import React, { useEffect, useState } from "react";
import {
  deleteGoldItem,
  deleteSilverItem,
  sellGoldItem,
  sellSilverItem,
} from "../api/inventory";
import { Trash2 } from "lucide-react";

function InventorySection({
  title,
  items,
  showSellingPrice = false,
  callRefresh,
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [sellingPrice, setSellingPrice] = useState("");
  const [sellingItemId, setSellingItemId] = useState(null);
  const [whatItem, setWhatItem] = useState(false);

  useEffect(() => {
    if (title.toLowerCase().includes("gold")) {
      setWhatItem(true);
    }
  }, []);
  const handleDelete = async (e, id) => {
    e.preventDefault();
    const check = confirm("Are you sure?");
    if (check) {
      if (title.toLowerCase().includes("gold")) {
        try {
          const result = await deleteGoldItem(id);
          console.log(result.data);
        } catch (err) {
          console.log(err);
        } finally {
          callRefresh?.();
        }
      } else {
        try {
          const result = await deleteSilverItem(id);
        } catch (err) {
          console.log(err);
        } finally {
          callRefresh?.();
        }
      }
    }
  };

  const handleIsChecked = (e) => {
    setIsChecked(e.target.checked);
  };
  const handleSellingPrice = async (e, id) => {
    e.preventDefault();
    if (title.toLowerCase().includes("gold")) {
      try {
        await sellGoldItem(id, { selling_price: sellingPrice });
        callRefresh?.();
      } catch (err) {
        console.log(err);
      } finally {
        alert("sold");
      }
    } else {
      try {
        await sellSilverItem(id, { selling_price: sellingPrice });
        callRefresh?.();
      } catch (err) {
        console.log(err);
      } finally {
        alert("sold");
      }
    }
  };
  return (
    <div>
      <button
        className="hover:cursor-pointer bg-amber-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
      </button>
      {isOpen && (
        <div>
          {items.map((item) => (
            <div className="pt-5" key={item.id}>
              <div className="trash flex items-center gap-5">
                Name:{item.item_type_name}
                {!showSellingPrice && (
                  <button
                    className="hover:cursor-pointer bg-amber-200"
                    onClick={(e) => handleDelete(e, item.id)}
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
              <div>
                {whatItem
                  ? `Karat: ${item.karat}`
                  : `Purity: ${item.purity_percent}`}
              </div>
              Purchase Price: {item.purchase_price} <br />
              {!showSellingPrice && (
                <span>
                  Mark as sold{" "}
                  <input
                    type="checkbox"
                    checked={isChecked && item.id === sellingItemId}
                    onChange={(e) => {
                      if (!e.target.checked) {
                        setSellingItemId(null);
                        setIsChecked(false);
                      } else {
                        setSellingItemId(item.id);
                        handleIsChecked(e);
                      }
                    }}
                  />
                  {item.id === sellingItemId && isChecked && (
                    <form onSubmit={(e) => handleSellingPrice(e, item.id)}>
                      <input
                        type="number"
                        placeholder="Rs 49834"
                        className="border border-amber-100"
                        value={sellingPrice}
                        onChange={(e) => setSellingPrice(e.target.value)}
                      />
                      <button
                        type="submit"
                        className="hover:cursor-pointer bg-amber-200"
                      >
                        Submit
                      </button>
                    </form>
                  )}
                </span>
              )}
              {showSellingPrice && (
                <span>Selling Price: {item.selling_price}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default InventorySection;
