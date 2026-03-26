import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Server, DockerContainer, VirtualMachine, ArrayStatus, ServerConnection, AppSettings } from '../types';

interface AppState {
  // Server connections
  servers: ServerConnection[];
  activeServerId: string | null;

  // Cached data
  serverStatus: Server | null;
  containers: DockerContainer[];
  vms: VirtualMachine[];
  arrayStatus: ArrayStatus | null;

  // App settings
  settings: AppSettings;

  // Loading states
  isLoading: boolean;
  lastRefresh: number | null;
  error: string | null;

  // Actions
  addServer: (server: ServerConnection) => void;
  removeServer: (id: string) => void;
  setActiveServer: (id: string | null) => void;
  updateServer: (id: string, updates: Partial<ServerConnection>) => void;

  // Data setters
  setServerStatus: (status: Server | null) => void;
  setContainers: (containers: DockerContainer[]) => void;
  setVMs: (vms: VirtualMachine[]) => void;
  setArrayStatus: (status: ArrayStatus | null) => void;

  // Settings
  updateSettings: (updates: Partial<AppSettings>) => void;

  // Loading states
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setLastRefresh: (timestamp: number) => void;

  // Reset
  reset: () => void;
}

const defaultSettings: AppSettings = {
  theme: 'system',
  refreshInterval: 10,
  notifications: true,
  temperatureUnit: 'celsius',
};

const initialState = {
  servers: [],
  activeServerId: null,
  serverStatus: null,
  containers: [],
  vms: [],
  arrayStatus: null,
  settings: defaultSettings,
  isLoading: false,
  lastRefresh: null,
  error: null,
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialState,

      // Server connection actions
      addServer: (server) =>
        set((state) => ({
          servers: [...state.servers, server],
        })),

      removeServer: (id) =>
        set((state) => ({
          servers: state.servers.filter((s) => s.id !== id),
          activeServerId: state.activeServerId === id ? null : state.activeServerId,
        })),

      setActiveServer: (id) =>
        set({
          activeServerId: id,
          // Clear cached data when switching servers
          serverStatus: null,
          containers: [],
          vms: [],
          arrayStatus: null,
        }),

      updateServer: (id, updates) =>
        set((state) => ({
          servers: state.servers.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        })),

      // Data setters
      setServerStatus: (status) => set({ serverStatus: status }),
      setContainers: (containers) => set({ containers }),
      setVMs: (vms) => set({ vms }),
      setArrayStatus: (status) => set({ arrayStatus: status }),

      // Settings
      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),

      // Loading states
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      setLastRefresh: (timestamp) => set({ lastRefresh: timestamp }),

      // Reset
      reset: () => set(initialState),
    }),
    {
      name: 'unraid-app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        servers: state.servers,
        activeServerId: state.activeServerId,
        settings: state.settings,
      }),
    }
  )
);

// Selectors for optimized re-renders
export const useActiveServer = () =>
  useAppStore((state) =>
    state.servers.find((s) => s.id === state.activeServerId)
  );

export const useIsLoading = () => useAppStore((state) => state.isLoading);
export const useError = () => useAppStore((state) => state.error);
export const useSettings = () => useAppStore((state) => state.settings);
