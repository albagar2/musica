const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const API_URL = `${API_BASE}/api`;

export const playlistService = {
  getAll: async (token: string) => {
    const res = await fetch(`${API_URL}/playlists`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Error fetching playlists');
    const data = await res.json();
    return data.data;
  },

  getById: async (id: string, token: string) => {
    const res = await fetch(`${API_URL}/playlists/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Error fetching playlist');
    const data = await res.json();
    return data.data;
  },

  create: async (name: string, token: string) => {
    const res = await fetch(`${API_URL}/playlists`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ name })
    });
    if (!res.ok) throw new Error('Error creating playlist');
    const data = await res.json();
    return data.data;
  },

  addTrack: async (playlistId: string, trackId: string, token: string) => {
    const res = await fetch(`${API_URL}/playlists/${playlistId}/tracks`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ trackId })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Error adding track');
    }
    const data = await res.json();
    return data.data;
  },

  removeTrack: async (playlistId: string, trackId: string, token: string) => {
    const res = await fetch(`${API_URL}/playlists/${playlistId}/tracks/${trackId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Error removing track');
    return true;
  },

  delete: async (playlistId: string, token: string) => {
    const res = await fetch(`${API_URL}/playlists/${playlistId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Error deleting playlist');
    return true;
  }
};
