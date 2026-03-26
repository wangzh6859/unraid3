import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  LoginRequest,
  LoginResponse,
  Server,
  DockerContainer,
  VirtualMachine,
  ArrayStatus,
  ChangeServerStatusRequest,
  ChangeContainerStatusRequest,
  ChangeVMStatusRequest,
  AttachDeviceRequest,
} from '../types';

const TOKEN_KEY = 'unraid_token';
const SERVER_URL_KEY = 'unraid_server_url';

export class UnraidAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'UnraidAPIError';
  }
}

export interface APIClientConfig {
  baseURL: string;
  timeout?: number;
  apiKey?: string;
}

export class UnraidAPIClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor(config: APIClientConfig) {
    this.baseURL = config.baseURL;
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for auth
    this.client.interceptors.request.use(async (config) => {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      if (config.apiKey) {
        config.headers['X-API-Key'] = config.apiKey;
      }
      return config;
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response) {
          throw new UnraidAPIError(
            error.response.data?.message || 'API request failed',
            error.response.status,
            error.response.data?.code
          );
        }
        if (error.request) {
          throw new UnraidAPIError('No response from server. Check connection.');
        }
        throw new UnraidAPIError(error.message);
      }
    );
  }

  // Authentication
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.client.post<LoginResponse>('/login', credentials);
    await AsyncStorage.setItem(TOKEN_KEY, response.data.token);
    return response.data;
  }

  async logout(): Promise<void> {
    await AsyncStorage.removeItem(TOKEN_KEY);
  }

  // Server Management
  async getServers(): Promise<Server[]> {
    const response = await this.client.get<Server[]>('/getServers');
    return response.data;
  }

  async getServerStatus(serverId: string): Promise<Server> {
    const response = await this.client.get<Server>(`/server/${serverId}/status`);
    return response.data;
  }

  async changeServerStatus(request: ChangeServerStatusRequest): Promise<void> {
    await this.client.post('/changeServerStatus', request);
  }

  // Docker Management
  async getContainers(serverId: string): Promise<DockerContainer[]> {
    const response = await this.client.get<DockerContainer[]>(
      `/server/${serverId}/docker/containers`
    );
    return response.data;
  }

  async getContainerLogs(
    serverId: string,
    containerId: string,
    tail?: number
  ): Promise<string[]> {
    const response = await this.client.get<string[]>(
      `/server/${serverId}/docker/${containerId}/logs`,
      { params: { tail } }
    );
    return response.data;
  }

  async changeContainerStatus(request: ChangeContainerStatusRequest): Promise<void> {
    await this.client.post('/changeDockerStatus', request);
  }

  // VM Management
  async getVMs(serverId: string): Promise<VirtualMachine[]> {
    const response = await this.client.get<VirtualMachine[]>(
      `/server/${serverId}/vms`
    );
    return response.data;
  }

  async changeVMStatus(request: ChangeVMStatusRequest): Promise<void> {
    await this.client.post('/changeVMStatus', request);
  }

  async attachGPU(request: AttachDeviceRequest): Promise<void> {
    await this.client.post('/gpuSwap', request);
  }

  async attachPCI(request: AttachDeviceRequest): Promise<void> {
    await this.client.post('/pciAttach', request);
  }

  async attachUSB(request: AttachDeviceRequest): Promise<void> {
    await this.client.post('/usbAttach', request);
  }

  // Array/Storage Management
  async getArrayStatus(serverId: string): Promise<ArrayStatus> {
    const response = await this.client.get<ArrayStatus>(
      `/server/${serverId}/array/status`
    );
    return response.data;
  }

  async startArray(serverId: string): Promise<void> {
    await this.client.post('/changeArrayStatus', { serverId, action: 'start' });
  }

  async stopArray(serverId: string): Promise<void> {
    await this.client.post('/changeArrayStatus', { serverId, action: 'stop' });
  }

  // System Info
  async getSystemInfo(serverId: string): Promise<{
    cpu: Server['cpu'];
    memory: Server['memory'];
    uptime: number;
    version: string;
  }> {
    const response = await this.client.get(`/server/${serverId}/system/info`);
    return response.data;
  }

  // Helper to update base URL
  updateBaseURL(newURL: string): void {
    this.baseURL = newURL;
    this.client.defaults.baseURL = newURL;
  }

  getBaseURL(): string {
    return this.baseURL;
  }
}

// Factory function to create client from stored config
export async function createClientFromStorage(): Promise<UnraidAPIClient | null> {
  const serverURL = await AsyncStorage.getItem(SERVER_URL_KEY);
  if (!serverURL) return null;

  return new UnraidAPIClient({ baseURL: serverURL });
}
