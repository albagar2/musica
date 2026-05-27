import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '';
const API_URL = `${API_BASE}/api/tracks`;

export const trackService = {
  async getAll() {
    const response = await axios.get(API_URL);
    return response.data.data;
  },

  async search(query: string) {
    const response = await axios.get(`${API_URL}/search`, { params: { q: query } });
    return response.data.data;
  },

  async getById(id: string) {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data.data;
  },

  async updateTrack(id: string, formData: FormData, token: string) {
    const response = await axios.put(`${API_URL}/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.data;
  },

  async deleteTrack(id: string, token: string) {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};
