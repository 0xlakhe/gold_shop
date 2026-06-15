import api from "./axios";



export const sendMessage = (data) => api.post("/assistant/chat", data);
