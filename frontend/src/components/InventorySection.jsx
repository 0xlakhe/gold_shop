import { useState } from "react";
import {
  deleteGoldItem,
  deleteSilverItem,
  sellGoldItem,
  sellSilverItem,
} from "../api/inventory";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleDollarSign,
  Gem,
  Trash2,
} from "lucide-react";
import useToast from "./useToast";

function InventorySection({
  title,
  items,
  showSellingPrice = false,
  callRefresh,
}) {
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [sellingPrice, setSellingPrice] = useState("");
  const [sellingItemId, setSellingItemId] = useState(null);
  const [sellingSubmittingId, setSellingSubmittingId] = useState(null);
  const [deleteCandidateId, setDeleteCandidateId] = useState(null);
  const isGoldSection = title.toLowerCase().includes("gold");

  const handleDelete = async (id) => {
    if (isGoldSection) {
      try {
        await deleteGoldItem(id);
        toast.success("Gold item deleted");
      } catch (err) {
        console.log(err);
        toast.error("Could not delete gold item");
      } finally {
        setDeleteCandidateId(null);
        callRefresh?.();
      }
    } else {
      try {
        await deleteSilverItem(id);
        toast.success("Silver item deleted");
      } catch (err) {
        console.log(err);
        toast.error("Could not delete silver item");
      } finally {
        setDeleteCandidateId(null);
        callRefresh?.();
      }
    }
  };

  const handleIsChecked = (e) => {
    setIsChecked(e.target.checked);
  };
  const handleSellingPrice = async (e, id) => {
    e.preventDefault();
    if (!sellingPrice) {
      return toast.warning("Enter a selling price first");
    }

    setSellingSubmittingId(id);
    if (isGoldSection) {
      try {
        await sellGoldItem(id, { selling_price: sellingPrice });
        toast.success("Gold item marked as sold");
      } catch (err) {
        console.log(err);
        toast.error("Could not sell gold item");
      } finally {
        setSellingSubmittingId(null);
        setSellingItemId(null);
        setIsChecked(false);
        setSellingPrice("");
        callRefresh?.();
      }
    } else {
      try {
        await sellSilverItem(id, { selling_price: sellingPrice });
        toast.success("Silver item marked as sold");
      } catch (err) {
        console.log(err);
        toast.error("Could not sell silver item");
      } finally {
        setSellingSubmittingId(null);
        setSellingItemId(null);
        setIsChecked(false);
        setSellingPrice("");
        callRefresh?.();
      }
    }
  };
  return (
    <div className="panel self-start overflow-hidden">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 bg-white px-4 py-3 text-left text-stone-950 transition hover:bg-stone-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center gap-3">
          <span
            className={`inline-flex h-9 w-9 items-center justify-center rounded-md ${
              isGoldSection
                ? "bg-yellow-50 text-yellow-700"
                : "bg-slate-50 text-slate-500"
            }`}
          >
            <Gem size={17} />
          </span>
          <span>
            <span className="block font-bold text-stone-950">{title}</span>
            <span className="text-xs font-medium text-stone-500">
              {items.length} {items.length === 1 ? "entry" : "entries"}
            </span>
          </span>
        </span>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {isOpen && (
        <div className="space-y-3 border-t border-stone-100 p-4">
          {items.length ? (
            items.map((item) => (
              <div
                className="rounded-lg border border-stone-100 bg-stone-50/70 p-4"
                key={item.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-stone-950">
                      {item.item_type_name}
                    </p>
                    <p className="mt-1 text-sm text-stone-500">
                      {isGoldSection
                        ? `Karat: ${item.karat}`
                        : `Purity: ${item.purity_percent}%`}
                    </p>
                  </div>
                  {!showSellingPrice && (
                    <button
                      type="button"
                      className="btn-danger"
                      onClick={() => setDeleteCandidateId(item.id)}
                      aria-label={`Delete ${item.item_type_name}`}
                    >
                      <Trash2 size={17} />
                    </button>
                  )}
                </div>

                {deleteCandidateId === item.id && (
                  <div className="mt-4 rounded-md border border-red-100 bg-red-50 px-3 py-3">
                    <p className="text-sm font-semibold text-red-900">
                      Delete this unsold item?
                    </p>
                    <p className="mt-1 text-xs text-red-700">
                      This removes {item.item_type_name} from inventory.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-md bg-red-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-800"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete item
                      </button>
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => setDeleteCandidateId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <div className="rounded-md bg-white px-3 py-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                      Purchase
                    </p>
                    <p className="font-semibold text-stone-900">
                      {item.purchase_price}
                    </p>
                  </div>
                  {showSellingPrice && (
                    <div className="rounded-md bg-white px-3 py-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                        Selling
                      </p>
                      <p className="font-semibold text-stone-900">
                        {item.selling_price}
                      </p>
                    </div>
                  )}
                </div>

                {!showSellingPrice && (
                  <div className="mt-4 rounded-md border border-stone-200 bg-white p-3">
                    <label className="flex items-center gap-2 text-sm font-semibold text-stone-700">
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-stone-700"
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
                      Mark as sold
                    </label>
                    {item.id === sellingItemId && isChecked && (
                      <form
                        className="mt-3 flex flex-col gap-2 sm:flex-row"
                        onSubmit={(e) => handleSellingPrice(e, item.id)}
                      >
                        <input
                          type="number"
                          placeholder="Selling price"
                          className="input"
                          value={sellingPrice}
                          onChange={(e) => setSellingPrice(e.target.value)}
                        />
                        <button
                          type="submit"
                          className="btn-primary"
                          disabled={sellingSubmittingId === item.id}
                        >
                          <CircleDollarSign size={16} />
                          {sellingSubmittingId === item.id ? "Selling..." : "Sell"}
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {showSellingPrice && (
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 size={14} />
                    Sold
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-dashed border-stone-200 p-5 text-center text-sm text-stone-500">
              No items in this section.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default InventorySection;
