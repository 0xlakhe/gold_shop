import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import useToast from "../components/useToast";
import {
  createNewType,
  deleteType,
  getAllTypes,
  updateType,
} from "../api/itemTypes";
import { ChevronDown, ChevronUp, Pencil, Plus, Tags, Trash2, X } from "lucide-react";

function ItemTypes() {
  const toast = useToast();
  const [allTypes, setAllTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newType, setNewType] = useState("");
  const [typeOpen, setTypeOpen] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [refresh, setRefresh] = useState(0);

  const editFormRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (editFormRef.current && !editFormRef.current.contains(event.target)) {
        setEditingId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editingId]);

  const triggerRefresh = () => {
    setRefresh((r) => r + 1);
  };

  useEffect(() => {
    const fetchType = async () => {
      try {
        const types = await getAllTypes();
        setAllTypes(types.data);
        console.log(types);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchType();
  }, [refresh]);

  const handleDeleteItem = async (id) => {
    try {
      await deleteType(id);
      toast.success("Item type deleted");
    } catch (err) {
      console.log(err);
      toast.error("Could not delete item type");
    } finally {
      triggerRefresh();
    }
  };

  const handleEditSubmit = async (e, id) => {
    e.preventDefault();
    if (!editValue?.trim()) {
      return toast.warning("Type name cannot be empty");
    }
    try {
      await updateType(id, { name: editValue.trim() });
      toast.success("Item type updated");
      setEditValue("");
    } catch (err) {
      console.log(err);
      toast.error("Could not update item type");
    } finally {
      setIsEdit(false);
      triggerRefresh();
    }
  };

  const handleCreateNewType = async (e) => {
    e.preventDefault();
    if (!newType.trim()) {
      return toast.warning("Type name cannot be empty");
    }
    setSubmitting(true);
    try {
      await createNewType({
        name: newType.trim(),
      });
      toast.success("New item type created");
    } catch (err) {
      if (err.response) {
        if (err.response.status == 409) {
          toast.error("This item type already exists");
        }
      } else {
        toast.error("Server error while creating type");
      }
    } finally {
      setNewType("");
      setSubmitting(false);
      triggerRefresh();
    }
  };

  return (
    <div className="app-page">
      <Navbar />
      <main className="page-wrap">
        <header className="page-header">
          <div>
            <p className="eyebrow">Catalog</p>
            <h1 className="page-title">Item types</h1>
            <p className="page-subtitle">
              Keep the item names clean and reusable across gold and silver
              inventory entries.
            </p>
          </div>
          <span className="badge">{allTypes.length} types</span>
        </header>

        {loading && <div className="panel panel-body">Loading item types...</div>}

        {!loading && (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <section className="panel">
              <div className="panel-header flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                    <Tags size={20} />
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-stone-950">
                      All types
                    </h2>
                    <p className="text-sm text-stone-500">
                      Edit names inline or remove unused types.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-icon"
                  onClick={() => setTypeOpen(!typeOpen)}
                  aria-label={typeOpen ? "Collapse item types" : "Expand item types"}
                >
                  {typeOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
              </div>

              {typeOpen && (
                <div className="panel-body space-y-3">
                  {allTypes?.length ? (
                    allTypes.map((item) => (
                      <div className="list-row" key={item.id}>
                        {editingId === item.id && isEdit ? (
                          <form
                            className="flex w-full flex-col gap-3 sm:flex-row"
                            ref={editFormRef}
                            onSubmit={(e) => handleEditSubmit(e, item.id)}
                          >
                            <input
                              type="text"
                              className="input"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              autoFocus
                            />
                            <div className="flex gap-2">
                              <button type="submit" className="btn-primary">
                                Save
                              </button>
                              <button
                                type="button"
                                className="btn-secondary"
                                onClick={() => setEditingId(null)}
                              >
                                <X size={16} />
                                Cancel
                              </button>
                            </div>
                          </form>
                        ) : (
                          <>
                            <div>
                              <p className="font-semibold text-stone-950">
                                {item.name}
                              </p>
                              <p className="text-xs text-stone-500">
                                Type ID: {item.id}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                className="btn-icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingId(item.id);
                                  setEditValue(item.name);
                                  setIsEdit(true);
                                }}
                                aria-label={`Edit ${item.name}`}
                              >
                                <Pencil size={17} />
                              </button>
                              <button
                                type="button"
                                className="btn-danger"
                                onClick={() => handleDeleteItem(item.id)}
                                aria-label={`Delete ${item.name}`}
                              >
                                <Trash2 size={17} />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="rounded-lg border border-dashed border-stone-200 p-6 text-center text-sm text-stone-500">
                      No item types yet. Create the first one from the panel.
                    </div>
                  )}
                </div>
              )}
            </section>

            <aside className="panel h-fit">
              <div className="panel-header">
                <h2 className="text-lg font-bold text-stone-950">
                  Create type
                </h2>
                <p className="text-sm text-stone-500">
                  Add names like Ring, Chain, Bangle, or Coin.
                </p>
              </div>
              <form className="panel-body space-y-4" onSubmit={handleCreateNewType}>
                <div className="field">
                  <label className="field-label" htmlFor="new-type">
                    Type name
                  </label>
                  <input
                    id="new-type"
                    type="text"
                    className="input"
                    placeholder="e.g. Necklace"
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary w-full"
                  disabled={submitting}
                >
                  <Plus size={16} />
                  {submitting ? "Creating..." : "Create type"}
                </button>
              </form>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}

export default ItemTypes;
