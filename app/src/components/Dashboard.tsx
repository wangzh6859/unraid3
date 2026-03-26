import React from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { ServerStatusCard } from './ServerStatusCard';
import { DockerList } from './DockerList';
import { VMList } from './VMList';
import { StorageCard } from './StorageCard';
import { useAutoRefresh } from '../hooks';
import { useAppStore } from '../stores';

export function Dashboard() {
  const { refreshNow } = useAutoRefresh();
  const { isLoading, serverStatus, containers, vms, arrayStatus } = useAppStore();

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refreshNow} />
      }
    >
      <View style={styles.content}>
        <ServerStatusCard server={serverStatus} />
        <StorageCard arrayStatus={arrayStatus} />
        <DockerList containers={containers} />
        <VMList vms={vms} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
    gap: 16,
  },
});
