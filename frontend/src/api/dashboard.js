import api from "./axios";

export const dashboard = () => api.get("/dashboard");
