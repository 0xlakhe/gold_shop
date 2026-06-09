import api from "./axios";

export const createNewType = (data) => api.post("/item-types", data);
export const getAllTypes = () => api.get("/item-types");
export const deleteType = (item_id) => api.delete(`/item-types/${item_id}`);
export const updateType = (item_id, data) =>
  api.put(`/item-types/${item_id}`, data);
