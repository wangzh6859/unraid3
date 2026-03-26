import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useActiveServer, useSettings } from '../stores';
import { Colors } from '../constants';

interface HeaderProps {
  title?: string;
  showServer?: boolean;
}

export function Header({ title, showServer = true }: HeaderProps) {
  const activeServer = useActiveServer();
  const settings = useSettings();
  const colors = settings.theme === 'dark' ? Colors.dark : Colors.light;

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <Text style={styles.title}>{title || 'Unraid Manager'}</Text>
      {showServer && activeServer && (
        <TouchableOpacity style={styles.serverBadge}>
          <View style={[styles.statusDot, { backgroundColor: colors.online }]} />
          <Text style={styles.serverName}>{activeServer.name}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 48, // Safe area
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  serverBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  serverName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});
