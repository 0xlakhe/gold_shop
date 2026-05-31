import api from "./axios";

export const addGoldItem = (data) => api.post("/gold", data);
export const getUnsoldGoldItem = () => api.get("/gold");
export const getSoldGoldItem = () => api.get("/gold/sold");
export const getSingleGoldItem = (item_id) => api.get(`/gold/${item_id}`);
export const sellGoldItem = (item_id, data) =>
  api.put(`/gold/${item_id}/sell`, data);
export const deleteGoldItem = (item_id) => api.delete(`/gold/${item_id}`);

export const addSilverItem = (data) => api.post("/silver", data);
export const getUnsoldSilverItem = () => api.get("/silver");
export const getSoldSilverItem = () => api.get("/silver/sold");
export const getSingleSilverItem = (item_id) => api.get(`/silver/${item_id}`);
export const sellSilverItem = (item_id, data) =>
  api.put(`/silver/${item_id}/sell`, data);
export const deleteSilverItem = (item_id) => api.delete(`/silver/${item_id}`);
