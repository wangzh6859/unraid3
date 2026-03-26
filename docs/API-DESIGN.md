# Unraid 手机客户端 - API 设计文档

## 概述

本项目旨在为 Unraid 服务器管理开发一个手机客户端应用，使用现有的 UnraidAPI 作为后端接口。

## 技术栈选择

### 推荐方案: React Native + Expo
- **跨平台**: iOS 和 Android 一套代码
- **开发效率高**: 热重载、快速迭代
- **生态丰富**: 大量第三方组件
- **易于维护**: JavaScript/TypeScript

### 备选方案: Flutter
- 性能优秀
- UI 一致性好
- 学习曲线较陡

## 后端 API 集成

### 基于 UnraidAPI (ElectricBrainUK/UnraidAPI)

**API 基础地址**: `http://<unraid-server>:<port>/api/`

### 核心 API 端点

| 端点 | 方法 | 功能 |
|------|------|------|
| `/login` | POST | 用户认证登录 |
| `/getServers` | GET | 获取服务器列表 |
| `/changeServerStatus` | POST | 服务器启停控制 |
| `/changeDockerStatus` | POST | Docker 容器管理 |
| `/changeVMStatus` | POST | 虚拟机管理 |
| `/changeArrayStatus` | POST | 磁盘阵列管理 |
| `/mqttDevices` | GET | MQTT 设备列表 |
| `/gpuSwap` | POST | GPU 切换 |
| `/pciAttach` | POST | PCI 设备挂载 |
| `/usbAttach` | POST | USB 设备挂载 |

## 核心功能模块

### 1. 仪表盘 (Dashboard)
- 服务器状态概览
- CPU/内存/存储使用率
- 网络流量监控
- 快速操作入口

### 2. 服务器管理
- 多服务器支持
- 服务器启停
- 系统信息查看
- 日志查看

### 3. Docker 管理
- 容器列表展示
- 容器启停控制
- 容器日志查看
- 镜像管理

### 4. 虚拟机管理
- VM 列表展示
- VM 启停控制
- VNC 控制台接入
- GPU/USB/PCI 设备挂载

### 5. 存储管理
- 磁盘阵列状态
- 磁盘健康监控
- 阵列启停控制
- 存储空间统计

### 6. 设置页面
- 服务器连接配置
- 认证信息管理
- 推送通知设置
- 主题切换（暗色/亮色）

## 数据模型

### Server
```typescript
interface Server {
  id: string;
  name: string;
  url: string;
  apiKey?: string;
  username?: string;
  password?: string;
  status: 'online' | 'offline' | 'unknown';
  lastSeen?: Date;
}
```

### DockerContainer
```typescript
interface DockerContainer {
  id: string;
  name: string;
  image: string;
  status: 'running' | 'stopped' | 'paused';
  cpu: number;
  memory: number;
  network: {
    rx: number;
    tx: number;
  };
}
```

### VirtualMachine
```typescript
interface VirtualMachine {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'paused';
  cpuCores: number;
  memory: number;
  gpu?: string[];
  usb?: string[];
}
```

### ArrayStatus
```typescript
interface ArrayStatus {
  state: 'started' | 'stopped' | 'starting' | 'stopping';
  disks: Disk[];
  parity: Disk[];
  cache: Disk[];
}

interface Disk {
  id: string;
  name: string;
  path: string;
  size: number;
  used: number;
  temperature: number;
  health: 'healthy' | 'warning' | 'error';
}
```

## 安全考虑

1. **认证存储**: 使用 Keychain/Keystore 安全存储凭证
2. **HTTPS**: 强制使用 HTTPS 连接（自签名证书支持）
3. **API Key**: 支持 API Key 认证方式
4. **会话管理**: Token 过期处理和自动刷新
5. **敏感数据**: 不在日志中记录敏感信息

## 离线支持

- 缓存上次已知状态
- 离线时显示提示
- 恢复连接后自动同步

## 推送通知（未来功能）

- 服务器状态变更
- 磁盘健康警告
- 容器异常停止
- 自定义告警规则

## 下一步

1. 搭建 React Native 项目骨架
2. 实现核心 API 封装
3. 开发基础 UI 框架
4. 实现登录和服务器添加功能
5. 逐步添加各功能模块
