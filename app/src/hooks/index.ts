import { useState, useEffect, useCallback, useRef } from 'react';
import { useAppStore } from '../stores';
import { UnraidAPIClient, createClientFromStorage } from '../api';
import { Server, DockerContainer, VirtualMachine, ArrayStatus } from '../types';
import { useSettings } from '../stores/appStore';

// Hook for managing API client
export function useAPIClient() {
  const [client, setClient] = useState<UnraidAPIClient | null>(null);
  const activeServer = useAppStore((state) =>
    state.servers.find((s) => s.id === state.activeServerId)
  );

  useEffect(() => {
    if (activeServer) {
      const url = `http://${activeServer.url}`;
      setClient(new UnraidAPIClient({ baseURL: url }));
    } else {
      setClient(null);
    }
  }, [activeServer]);

  return client;
}

// Hook for fetching and refreshing data
export function useRefreshData() {
  const client = useAPIClient();
  const settings = useSettings();
  const { setLoading, setError, setLastRefresh, setServerStatus, setContainers, setVMs, setArrayStatus } =
    useAppStore();

  const refreshAll = useCallback(async () => {
    if (!client) return;

    setLoading(true);
    setError(null);

    try {
      const [server, containers, vms, array] = await Promise.all([
        client.getServers().then((servers) => servers[0]),
        client.getContainers('default'),
        client.getVMs('default'),
        client.getArrayStatus('default'),
      ]);

      setServerStatus(server);
      setContainers(containers);
      setVMs(vms);
      setArrayStatus(array);
      setLastRefresh(Date.now());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [client, setLoading, setError, setLastRefresh, setServerStatus, setContainers, setVMs, setArrayStatus]);

  return { refreshAll };
}

// Hook for auto-refresh
export function useAutoRefresh() {
  const settings = useSettings();
  const { refreshAll } = useRefreshData();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (settings.refreshInterval > 0) {
      intervalRef.current = setInterval(refreshAll, settings.refreshInterval * 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [settings.refreshInterval, refreshAll]);

  return { refreshNow: refreshAll };
}

// Hook for container operations
export function useContainerOperations() {
  const client = useAPIClient();
  const { refreshAll } = useRefreshData();

  const startContainer = useCallback(
    async (containerId: string) => {
      if (!client) return;
      await client.changeContainerStatus({ containerId, action: 'start' });
      await refreshAll();
    },
    [client, refreshAll]
  );

  const stopContainer = useCallback(
    async (containerId: string) => {
      if (!client) return;
      await client.changeContainerStatus({ containerId, action: 'stop' });
      await refreshAll();
    },
    [client, refreshAll]
  );

  const restartContainer = useCallback(
    async (containerId: string) => {
      if (!client) return;
      await client.changeContainerStatus({ containerId, action: 'restart' });
      await refreshAll();
    },
    [client, refreshAll]
  );

  return { startContainer, stopContainer, restartContainer };
}

// Hook for VM operations
export function useVMOperations() {
  const client = useAPIClient();
  const { refreshAll } = useRefreshData();

  const startVM = useCallback(
    async (vmId: string) => {
      if (!client) return;
      await client.changeVMStatus({ vmId, action: 'start' });
      await refreshAll();
    },
    [client, refreshAll]
  );

  const stopVM = useCallback(
    async (vmId: string) => {
      if (!client) return;
      await client.changeVMStatus({ vmId, action: 'stop' });
      await refreshAll();
    },
    [client, refreshAll]
  );

  const restartVM = useCallback(
    async (vmId: string) => {
      if (!client) return;
      await client.changeVMStatus({ vmId, action: 'restart' });
      await refreshAll();
    },
    [client, refreshAll]
  );

  return { startVM, stopVM, restartVM };
}

// Hook for array operations
export function useArrayOperations() {
  const client = useAPIClient();
  const { refreshAll } = useRefreshData();

  const startArray = useCallback(async () => {
    if (!client) return;
    await client.startArray('default');
    await refreshAll();
  }, [client, refreshAll]);

  const stopArray = useCallback(async () => {
    if (!client) return;
    await client.stopArray('default');
    await refreshAll();
  }, [client, refreshAll]);

  return { startArray, stopArray };
}

// Hook for loading state with minimum display time
export function useMinLoadingState(minMs: number = 500) {
  const [isLoading, setIsLoading] = useState(false);
  const startTimeRef = useRef<number | null>(null);

  const startLoading = useCallback(() => {
    startTimeRef.current = Date.now();
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    if (startTimeRef.current) {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, minMs - elapsed);

      setTimeout(() => {
        setIsLoading(false);
        startTimeRef.current = null;
      }, remaining);
    } else {
      setIsLoading(false);
    }
  }, [minMs]);

  return { isLoading, startLoading, stopLoading };
}
