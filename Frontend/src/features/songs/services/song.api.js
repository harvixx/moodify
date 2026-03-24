// src/services/song.api.js
import api from "../../../api/axios.api";

// Mood based / category based / paginated
export const getSongs = async (data) => {
  const res = await api.post("/songs/getSongs", data);
  return res.data;
};

// Top 10 Indian categories
export const getCategories = async () => {
  const res = await api.get("/songs/categories");
  return res.data;
};

// YouTube search — direct query
export const searchSongs = async (query) => {
  const res = await api.post("/songs/getSongs", { query });
  return res.data;
};