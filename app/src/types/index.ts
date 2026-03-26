// Unraid API Types

export interface Server {
  id: string;
  name: string;
  ip: string;
  port: number;
  status: ServerStatus;
  version?: string;
  uptime?: number;
  cpu?: CPUInfo;
  memory?: MemoryInfo;
  disk?: DiskInfo[];
  lastSeen?: Date;
}

export type ServerStatus = 'online' | 'offline' | 'starting' | 'stopping' | 'unknown';

export interface CPUInfo {
  usage: number;      // 0-100
  cores: number;
  temperature?: number;
  model?: string;
}

export interface MemoryInfo {
  total: number;      // bytes
  used: number;       // bytes
  free: number;       // bytes
  usage: number;      // 0-100
}

export interface DiskInfo {
  id: string;
  name: string;
  path: string;
  size: number;       // bytes
  used: number;       // bytes
  free: number;       // bytes
  temperature?: number;
  health: DiskHealth;
  type: DiskType;
}

export type DiskHealth = 'healthy' | 'warning' | 'error' | 'unknown';
export type DiskType = 'data' | 'parity' | 'cache' | 'unassigned';

export interface DockerContainer {
  id: string;
  name: string;
  image: string;
  status: ContainerStatus;
  cpu: number;        // percentage
  memory: number;     // bytes
  network?: NetworkInfo;
  ports?: PortMapping[];
  volumes?: VolumeMapping[];
}

export type ContainerStatus = 'running' | 'stopped' | 'paused' | 'restarting' | 'unknown';

export interface NetworkInfo {
  rx: number;         // bytes received
  tx: number;         // bytes transmitted
}

export interface PortMapping {
  container: number;
  host: number;
  protocol: 'tcp' | 'udp';
}

export interface VolumeMapping {
  container: string;
  host: string;
  mode: 'rw' | 'ro';
}

export interface VirtualMachine {
  id: string;
  name: string;
  status: VMStatus;
  cpuCores: number;
  memory: number;     // bytes
  diskSize?: number;  // bytes
  gpu?: GPUInfo[];
  usb?: USBInfo[];
  pci?: PCIInfo[];
  vnc?: VNCInfo;
}

export type VMStatus = 'running' | 'stopped' | 'paused' | 'starting' | 'stopping' | 'unknown';

export interface GPUInfo {
  id: string;
  name: string;
  vendor: string;
  attachedToVM?: string;
}

export interface USBInfo {
  id: string;
  name: string;
  vendor: string;
  attachedToVM?: string;
}

export interface PCIInfo {
  id: string;
  name: string;
  attachedToVM?: string;
}

export interface VNCInfo {
  port: number;
  password?: string;
  url?: string;
}

export interface ArrayStatus {
  state: ArrayState;
  disks: DiskInfo[];
  parity: DiskInfo[];
  cache: DiskInfo[];
  progress?: number;  // 0-100 for array operations
  operation?: string; // e.g., "Starting", "Stopping", "Rebuilding"
}

export type ArrayState = 'started' | 'stopped' | 'starting' | 'stopping' | 'rebuilding' | 'unknown';

// API Request/Response Types

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
  user: UserInfo;
}

export interface UserInfo {
  id: string;
  username: string;
  role: 'admin' | 'user';
}

export interface ChangeServerStatusRequest {
  serverId: string;
  action: 'start' | 'stop' | 'restart' | 'shutdown';
}

export interface ChangeContainerStatusRequest {
  containerId: string;
  action: 'start' | 'stop' | 'restart' | 'pause' | 'unpause';
}

export interface ChangeVMStatusRequest {
  vmId: string;
  action: 'start' | 'stop' | 'restart' | 'pause' | 'resume';
}

export interface AttachDeviceRequest {
  vmId: string;
  deviceId: string;
}

// App State Types

export interface ServerConnection {
  id: string;
  name: string;
  url: string;
  apiKey?: string;
  username?: string;
  password?: string;
  isActive: boolean;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  refreshInterval: number;  // seconds
  notifications: boolean;
  temperatureUnit: 'celsius' | 'fahrenheit';
}
