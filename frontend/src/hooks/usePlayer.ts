import { create } from 'zustand';

interface Track {
  id: string;
  title: string;
  url: string;
  coverUrl?: string;
  artist?: { name: string };
}

interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  queue: Track[];
  isShuffle: boolean;
  isRepeat: boolean;
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  setVolume: (volume: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setQueue: (tracks: Track[]) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  volume: 0.7,
  queue: [],

  isShuffle: false,
  isRepeat: false,

  toggleShuffle: () => {
    set({ isShuffle: !get().isShuffle });
  },

  toggleRepeat: () => {
    set({ isRepeat: !get().isRepeat });
  },

  playTrack: (track) => {
    set({ currentTrack: track, isPlaying: true });
  },

  togglePlay: () => {
    set({ isPlaying: !get().isPlaying });
  },

  setVolume: (volume) => {
    set({ volume });
  },

  setQueue: (tracks) => {
    set({ queue: tracks });
  },

  nextTrack: () => {
    const { currentTrack, queue, isShuffle } = get();
    if (!currentTrack || queue.length === 0) return;
    
    if (isShuffle) {
      let randomIndex = Math.floor(Math.random() * queue.length);
      if (queue.length > 1 && queue[randomIndex].id === currentTrack.id) {
         randomIndex = (randomIndex + 1) % queue.length;
      }
      set({ currentTrack: queue[randomIndex], isPlaying: true });
      return;
    }

    const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % queue.length;
    set({ currentTrack: queue[nextIndex], isPlaying: true });
  },

  prevTrack: () => {
    const { currentTrack, queue, isShuffle } = get();
    if (!currentTrack || queue.length === 0) return;
    
    if (isShuffle) {
      let randomIndex = Math.floor(Math.random() * queue.length);
      if (queue.length > 1 && queue[randomIndex].id === currentTrack.id) {
         randomIndex = (randomIndex + 1) % queue.length;
      }
      set({ currentTrack: queue[randomIndex], isPlaying: true });
      return;
    }

    const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    set({ currentTrack: queue[prevIndex], isPlaying: true });
  }
}));
