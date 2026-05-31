import api from "./axios";

export const setPrice=(data)=>api.post("/prices",data);
export const getPrice=()=>api.get("/prices/latest");
export const getAllPrice=()=>api.get("/prices/history");