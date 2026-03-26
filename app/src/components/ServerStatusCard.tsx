import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Server } from '../types';
import { Colors, StatusLabels } from '../constants';
import { formatBytes, formatUptime, formatPercentage } from '../utils';
import { useSettings } from '../stores';

interface ServerStatusCardProps {
  server: Server | null;
}

export function ServerStatusCard({ server }: ServerStatusCardProps) {
  const settings = useSettings();
  const colors = settings.theme === 'dark' ? Colors.dark : Colors.light;

  if (!server) {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface }]}>
        <Text style={[styles.noData, { color: colors.textSecondary }]}>
          未连接到服务器
        </Text>
      </View>
    );
  }

  const statusColor = server.status === 'online' ? colors.online : colors.offline;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={[styles.name, { color: colors.text }]}>{server.name}</Text>
        </View>
        <Text style={[styles.status, { color: statusColor }]}>
          {StatusLabels.server[server.status]}
        </Text>
      </View>

      {server.cpu && (
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>CPU</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {formatPercentage(server.cpu.usage)}
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${server.cpu.usage}%`, backgroundColor: Colors.light.primary },
                ]}
              />
            </View>
          </View>

          <View style={styles.stat}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>内存</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {formatPercentage(server.memory?.usage || 0)}
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${server.memory?.usage || 0}%`, backgroundColor: colors.success },
                ]}
              />
            </View>
          </View>
        </View>
      )}

      {server.uptime && (
        <Text style={[styles.uptime, { color: colors.textSecondary }]}>
          运行时间: {formatUptime(server.uptime)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 12,
  },
  stat: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  uptime: {
    fontSize: 12,
  },
  noData: {
    textAlign: 'center',
    paddingVertical: 20,
  },
});
