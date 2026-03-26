// Theme colors
export const Colors = {
  light: {
    primary: '#FF6B35',        // Unraid orange
    secondary: '#2E3440',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#2E3440',
    textSecondary: '#666666',
    border: '#E0E0E0',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
    online: '#4CAF50',
    offline: '#F44336',
  },
  dark: {
    primary: '#FF6B35',
    secondary: '#ECEFF4',
    background: '#2E3440',
    surface: '#3B4252',
    text: '#ECEFF4',
    textSecondary: '#A3BE8C',
    border: '#4C566A',
    success: '#A3BE8C',
    warning: '#EBCB8B',
    error: '#BF616A',
    info: '#81A1C1',
    online: '#A3BE8C',
    offline: '#BF616A',
  },
};

// Status mappings
export const StatusLabels = {
  server: {
    online: '在线',
    offline: '离线',
    starting: '启动中',
    stopping: '停止中',
    unknown: '未知',
  },
  container: {
    running: '运行中',
    stopped: '已停止',
    paused: '已暂停',
    restarting: '重启中',
    unknown: '未知',
  },
  vm: {
    running: '运行中',
    stopped: '已停止',
    paused: '已暂停',
    starting: '启动中',
    stopping: '停止中',
    unknown: '未知',
  },
  array: {
    started: '已启动',
    stopped: '已停止',
    starting: '启动中',
    stopping: '停止中',
    rebuilding: '重建中',
    unknown: '未知',
  },
  disk: {
    healthy: '健康',
    warning: '警告',
    error: '错误',
    unknown: '未知',
  },
};

// Icon mappings
export const StatusIcons = {
  server: {
    online: 'server',
    offline: 'server-off',
    starting: 'loading',
    stopping: 'loading',
    unknown: 'help-circle',
  },
  container: {
    running: 'check-circle',
    stopped: 'stop-circle',
    paused: 'pause-circle',
    restarting: 'refresh',
    unknown: 'help-circle',
  },
  vm: {
    running: 'desktop',
    stopped: 'desktop',
    paused: 'pause-circle',
    starting: 'loading',
    stopping: 'loading',
    unknown: 'help-circle',
  },
};

// API defaults
export const API_CONFIG = {
  DEFAULT_PORT: 8080,
  DEFAULT_TIMEOUT: 30000,
  TOKEN_KEY: 'unraid_token',
  SERVER_URL_KEY: 'unraid_server_url',
};

// Refresh intervals (in seconds)
export const REFRESH_INTERVALS = {
  FAST: 5,
  NORMAL: 10,
  SLOW: 30,
};

// Chart colors
export const ChartColors = {
  cpu: '#FF6B35',
  memory: '#4CAF50',
  network: '#2196F3',
  disk: '#9C27B0',
  temperature: '#F44336',
};

// Limits
export const LIMITS = {
  MAX_SERVERS: 10,
  MAX_LOG_LINES: 500,
  MAX_NAME_LENGTH: 64,
};
