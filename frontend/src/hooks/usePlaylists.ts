import { create } from 'zustand';
import { playlistService } from '../services/playlistService';
import { useAuthStore } from './useAuth';

interface Playlist {
  id: string;
  name: string;
  userId: string;
  _count?: { tracks: number };
  tracks?: any[];
}

interface PlaylistState {
  playlists: Playlist[];
  currentPlaylist: Playlist | null;
  loading: boolean;
  error: string | null;
  
  fetchPlaylists: () => Promise<void>;
  fetchPlaylistById: (id: string) => Promise<void>;
  createPlaylist: (name: string) => Promise<boolean>;
  addTrack: (playlistId: string, trackId: string) => Promise<boolean>;
  removeTrack: (playlistId: string, trackId: string) => Promise<boolean>;
  deletePlaylist: (playlistId: string) => Promise<boolean>;
}

export const usePlaylistStore = create<PlaylistState>((set, get) => ({
  playlists: [],
  currentPlaylist: null,
  loading: false,
  error: null,

  fetchPlaylists: async () => {
    const token = useAuthStore.getState().token;
    if (!token) return;
    
    set({ loading: true, error: null });
    try {
      const playlists = await playlistService.getAll(token);
      set({ playlists, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchPlaylistById: async (id: string) => {
    const token = useAuthStore.getState().token;
    if (!token) return;
    
    set({ loading: true, error: null });
    try {
      const playlist = await playlistService.getById(id, token);
      set({ currentPlaylist: playlist, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  createPlaylist: async (name: string) => {
    const token = useAuthStore.getState().token;
    if (!token) return false;
    
    set({ loading: true, error: null });
    try {
      await playlistService.create(name, token);
      await get().fetchPlaylists();
      set({ loading: false });
      return true;
    } catch (err: any) {
      set({ error: err.message, loading: false });
      return false;
    }
  },

  addTrack: async (playlistId: string, trackId: string) => {
    const token = useAuthStore.getState().token;
    if (!token) return false;
    
    set({ loading: true, error: null });
    try {
      await playlistService.addTrack(playlistId, trackId, token);
      await get().fetchPlaylists();
      // If we are currently viewing this playlist, refresh it
      if (get().currentPlaylist?.id === playlistId) {
        await get().fetchPlaylistById(playlistId);
      }
      set({ loading: false });
      return true;
    } catch (err: any) {
      set({ error: err.message, loading: false });
      alert(err.message);
      return false;
    }
  },

  removeTrack: async (playlistId: string, trackId: string) => {
    const token = useAuthStore.getState().token;
    if (!token) return false;
    
    set({ loading: true, error: null });
    try {
      await playlistService.removeTrack(playlistId, trackId, token);
      await get().fetchPlaylists();
      if (get().currentPlaylist?.id === playlistId) {
        await get().fetchPlaylistById(playlistId);
      }
      set({ loading: false });
      return true;
    } catch (err: any) {
      set({ error: err.message, loading: false });
      return false;
    }
  },

  deletePlaylist: async (playlistId: string) => {
    const token = useAuthStore.getState().token;
    if (!token) return false;
    
    set({ loading: true, error: null });
    try {
      await playlistService.delete(playlistId, token);
      await get().fetchPlaylists();
      set({ loading: false });
      return true;
    } catch (err: any) {
      set({ error: err.message, loading: false });
      return false;
    }
  }
}));
