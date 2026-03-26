# Unraid Manager - 手机客户端

<div align="center">

![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Status](https://img.shields.io/badge/Status-In%20Development-orange)

**现代化的 Unraid 服务器管理手机应用**

[功能特性](#功能特性) • [技术栈](#技术栈) • [快速开始](#快速开始) • [截图](#截图) • [贡献](#贡献)

</div>

---

## 功能特性

### 📊 实时监控
- CPU、内存、存储使用率监控
- 网络流量实时统计
- 磁盘温度和健康状态
- 服务器在线状态

### 🐳 Docker 管理
- 容器列表和状态
- 一键启停、重启容器
- 容器日志实时查看
- 资源使用统计

### 🖥️ 虚拟机管理
- VM 状态查看和控制
- VNC 控制台集成
- GPU/USB/PCI 设备挂载
- VM 配置编辑

### 💾 存储管理
- 磁盘阵列状态
- 阵列启停控制
- 磁盘健康监控
- 存储空间可视化

### 🔧 其他特性
- 多服务器支持
- 推送通知
- 暗色模式
- 离线缓存
- Widget 支持（计划中）

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React Native + Expo |
| 语言 | TypeScript |
| 导航 | React Navigation |
| 状态管理 | Zustand |
| UI 组件 | React Native Paper / NativeBase |
| 图表 | Victory Native |
| HTTP | Axios |
| 安全存储 | expo-secure-store |

## 架构图

```
┌─────────────────────────────────────────────────┐
│                   Mobile App                     │
├─────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────┐  │
│  │  Dashboard  │  │   Docker    │  │   VM    │  │
│  └──────┬──────┘  └──────┬──────┘  └────┬────┘  │
│         │                │              │        │
│  ┌──────┴────────────────┴──────────────┴────┐  │
│  │              API Client Layer              │  │
│  └──────────────────────┬────────────────────┘  │
├─────────────────────────┼───────────────────────┤
│                         │                        │
│            ┌────────────┴────────────┐           │
│            │      UnraidAPI          │           │
│            │  (HTTP REST API)        │           │
│            └────────────┬────────────┘           │
│                         │                        │
└─────────────────────────┼───────────────────────┘
                          │
                 ┌────────┴────────┐
                 │  Unraid Server  │
                 └─────────────────┘
```

## 项目结构

```
unraid3/
├── app/                    # React Native 应用代码
│   ├── src/
│   │   ├── api/           # API 客户端封装
│   │   ├── components/    # 可复用组件
│   │   ├── screens/       # 页面组件
│   │   ├── navigation/    # 导航配置
│   │   ├── stores/        # 状态管理
│   │   ├── hooks/         # 自定义 Hooks
│   │   ├── utils/         # 工具函数
│   │   ├── types/         # TypeScript 类型定义
│   │   └── constants/     # 常量定义
│   ├── assets/            # 静态资源
│   └── App.tsx            # 应用入口
├── docs/                   # 文档
│   ├── API-DESIGN.md      # API 设计文档
│   └── ROADMAP.md         # 开发路线图
├── api-spec/              # API 规范
│   └── openapi.yaml       # OpenAPI 规范文件
└── README.md              # 本文件
```

## 快速开始

### 环境要求

- Node.js >= 18
- npm 或 yarn
- Expo CLI
- iOS Simulator / Android Emulator（或真机）

### 安装

```bash
# 克隆仓库
git clone https://github.com/wangzh6859/unraid3.git
cd unraid3

# 安装依赖（项目初始化后）
cd app
npm install

# 启动开发服务器
npx expo start
```

### 配置

1. 确保你的 Unraid 服务器已安装 UnraidAPI
2. 在应用中添加服务器地址和端口
3. 使用 Unraid 用户名密码登录

## 后端依赖

本应用需要 UnraidAPI 作为后端服务：

```yaml
# Docker Compose 示例
version: '3'
services:
  unraidapi:
    image: electricbrainuk/unraidapi
    container_name: unraidapi
    ports:
      - "8080:8080"
    environment:
      - PUID=99
      - PGID=100
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    restart: unless-stopped
```

## 截图

> 📸 截图将在应用开发后添加

## 贡献指南

欢迎贡献！请查看以下指南：

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

### 代码规范

- 使用 TypeScript
- 遵循 ESLint 规则
- 编写有意义的提交信息
- 添加必要的注释和文档

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 致谢

- [Unraid](https://unraid.net/) - 优秀的 NAS 操作系统
- [UnraidAPI](https://github.com/ElectricBrainUK/UnraidAPI) - 社区 API 项目
- [Expo](https://expo.dev/) - React Native 开发平台

## 联系方式

- 项目地址: [https://github.com/wangzh6859/unraid3](https://github.com/wangzh6859/unraid3)
- 问题反馈: [Issues](https://github.com/wangzh6859/unraid3/issues)

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给一个 Star！**

</div>
