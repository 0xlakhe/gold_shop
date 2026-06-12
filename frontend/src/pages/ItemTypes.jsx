import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import {
  createNewType,
  deleteType,
  getAllTypes,
  updateType,
} from "../api/itemTypes";
import { Pencil, RecycleIcon, Trash2 } from "lucide-react";

function ItemTypes() {
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
      alert("deleted successfully!");
    } catch (err) {
      console.log(err);
    } finally {
      triggerRefresh();
    }
  };

  const handleEditSubmit = async (e, id) => {
    e.preventDefault();
    if (!editValue) {
      return alert("cannot be empty");
    }
    try {
      await updateType(id, { name: editValue });
      alert("updated");
      setEditValue(null);
    } catch (err) {
      console.log(err);
    } finally {
      setIsEdit(false);
      triggerRefresh();
    }
  };

  const handleCreateNewType = async (e) => {
    e.preventDefault();
    if (!newType) {
      alert("Field cannot be empty");
    }
    setSubmitting(true);
    try {
      await createNewType({
        name: newType,
      });
      alert("new type created");
    } catch (err) {
      if (err.response) {
        if (err.response.status == 409) {
          alert("This item name already exists!");
        }
      } else {
        alert("Server error");
      }
    } finally {
      setNewType("");
      setSubmitting(false);
      triggerRefresh();
    }
  };

  return (
    <div>
      <Navbar />
      {loading && <div>Loading...</div>}
      <div className="flex mt-10 pl-10 justify-around">
        <div className="all-types ">
          <button
            className="hover:cursor-pointer bg-amber-200"
            onClick={() => setTypeOpen(!typeOpen)}
          >
            <h3>All Types</h3>
          </button>
          {typeOpen && (
            <>
              {allTypes?.map((item) => {
                return (
                  <div className="flex" key={item.id}>
                    <div>{item.name}</div>
                    <div className="edit">
                      <button
                        className="edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          (setEditingId(item.id),
                            setEditValue(item.name),
                            setIsEdit(true));
                        }}
                      >
                        <Pencil size={20} />
                      </button>
                      {editingId === item.id && isEdit && (
                        <form
                          className="flex gap-1"
                          ref={editFormRef}
                          onSubmit={(e) => handleEditSubmit(e, item.id)}
                        >
                          <input
                            type="text"
                            className="border border-amber-200"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                          />
                          <button
                            type="submit"
                            className="hover:cursor-pointer bg-amber-200"
                          >
                            Submit
                          </button>
                          <button
                            type="button"
                            className="hover:cursor-pointer bg-amber-200"
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </button>
                        </form>
                      )}
                    </div>
                    <div className="delete">
                      <button
                        className="hover:cursor-pointer"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
        <div className="create-types">
          <form onSubmit={handleCreateNewType}>
            <div className=" flex flex-col gap-1">
              <label>Create New Type</label>
              <input
                type="text"
                className="border border-amber-400"
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="hover:cursor-pointer bg-amber-200"
              disabled={submitting}
            >
              {submitting ? "Creating" : "Create type"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ItemTypes;
