# 🦞 Lobster Pet — OpenClaw 桌面宠物

> 一只悬浮在桌面上的小龙虾，点击即可与你的 OpenClaw AI Agent 对话。

## 📌 项目简介

Lobster Pet 是一款 Windows 桌面宠物应用，将 OpenClaw AI Agent 带到你的桌面上。小龙虾形象悬浮在屏幕边缘，支持拖拽移动、动画交互，点击即可打开对话窗口，直接与 OpenClaw 后端通信。

**项目亮点：**
- 🦞 **可爱的桌面宠物** — 小龙虾形象，悬浮在桌面，支持拖拽、动画
- 💬 **一键对话** — 点击宠物打开聊天窗口，直接与 OpenClaw 交互
- 🔌 **OpenClaw 原生集成** — 通过 OpenAI 兼容 API 对接 OpenClaw Gateway
- 🎨 **Electron 跨架构** — 基于 Electron + Vite + React 构建
- 🧩 **可扩展** — 支持自定义宠物形象、Agent 切换、快捷指令

## 🖼 效果预览

```
┌─────────────────────────────────────────┐
│                              🦞 ←── 小龙虾悬浮在桌面边缘
│                         (可拖拽移动)     │
│                                         │
│          ┌─────────────────┐            │
│          │  🦞 对话窗口     │  ←── 点击宠物弹出
│          │─────────────────│            │
│          │  你好！开心~     │            │
│          │  💻 嗨 Boss！   │            │
│          │─────────────────│            │
│          │  输入消息...  发送│            │
│          └─────────────────┘            │
│                                         │
└─────────────────────────────────────────┘
```

## 🏗 架构设计

### 系统架构

```
┌─────────────────────────────────────────────────┐
│                  Lobster Pet (Electron)           │
│                                                   │
│  ┌──────────────┐    ┌────────────────────────┐  │
│  │  Main Process │    │    Renderer Process     │  │
│  │               │    │                        │  │
│  │  · 窗口管理    │◄──►│  · 宠物窗口 (透明置顶)  │  │
│  │  · 托盘图标    │    │  · 聊天窗口            │  │
│  │  · 系统通知    │    │  · 右键菜单            │  │
│  │  · IPC 通信    │    │  · 宠物动画/状态机     │  │
│  └──────┬────────┘    └────────────────────────┘  │
│         │                                          │
│         │ OpenAI Compatible API                     │
│         ▼                                          │
│  ┌────────────────────────────────────────────┐   │
│  │          OpenClaw Gateway                    │   │
│  │     POST /v1/chat/completions               │   │
│  │     WebSocket (streaming)                    │   │
│  └────────────────────────────────────────────┘   │
│                                                   │
└─────────────────────────────────────────────────┘
```

### 宠物状态机

```
                    ┌──────────┐
         ┌────────►│   空闲    │◄────────┐
         │         │  (待机动画) │         │
         │         └─────┬─────┘         │
         │               │               │
         │          鼠标悬停         超时无交互
         │               │               │
         │         ┌─────▼─────┐         │
         │         │   关注    │         │
         │         │ (转头看鼠标)│         │
         │         └─────┬─────┘         │
         │               │               │
         │            点击宠物             │
         │               │               │
         │         ┌─────▼─────┐         │
         │         │   对话中   │─────────┘
         │         │ (打开聊天窗) │  关闭聊天窗
         │         └─────┬─────┘
         │               │
         │         消息正在生成
         │               │
         │         ┌─────▼─────┐
         │         │   思考中   │
         └─────────│ (冒泡动画) │
  收到回复/出错    └───────────┘
```

## 🛠 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 桌面框架 | **Electron 33+** | 跨平台桌面应用 |
| 构建工具 | **electron-vite** | Vite 集成的 Electron 构建工具 |
| UI 框架 | **React 19** | 渲染层界面开发 |
| 样式 | **Tailwind CSS 4** | 原子化 CSS |
| 动画 | **CSS Animations + Canvas** | 宠物动画系统 |
| 状态管理 | **Zustand** | 轻量级状态管理 |
| HTTP | **fetch API / SSE** | 对接 OpenClaw Gateway |
| 打包 | **electron-builder** | 安装包生成 |
| 语言 | **TypeScript** | 全栈类型安全 |

### OpenClaw 集成方式

```typescript
// 通过 OpenAI 兼容 API 与 OpenClaw Gateway 通信
const response = await fetch('http://127.0.0.1:18789/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${gatewayToken}`,
  },
  body: JSON.stringify({
    model: 'openclaw:main',  // 指定 OpenClaw Agent
    messages: [{ role: 'user', content: '你好！' }],
    stream: true,  // 流式输出
  }),
});
```

## 📁 项目结构

```
lobster-pet/
├── README.md
├── package.json
├── tsconfig.json
├── electron.vite.config.ts
├── electron-builder.yml
├── .gitignore
├── src/
│   ├── main/                    # Electron 主进程
│   │   ├── index.ts             # 主入口
│   │   ├── pet-window.ts        # 宠物窗口（透明置顶）
│   │   ├── chat-window.ts       # 聊天窗口
│   │   ├── tray.ts              # 系统托盘
│   │   └── ipc-handlers.ts      # IPC 通信处理
│   ├── renderer/                # Electron 渲染进程
│   │   ├── pet/                 # 宠物模块
│   │   │   ├── Pet.tsx          # 宠物组件
│   │   │   ├── PetAnimation.tsx # 动画系统
│   │   │   └── PetStateMachine.ts # 状态机
│   │   ├── chat/                # 聊天模块
│   │   │   ├── ChatWindow.tsx   # 聊天窗口
│   │   │   ├── MessageList.tsx  # 消息列表
│   │   │   ├── InputBar.tsx     # 输入栏
│   │   │   └── Markdown.tsx     # Markdown 渲染
│   │   ├── components/          # 通用组件
│   │   │   ├── ContextMenu.tsx  # 右键菜单
│   │   │   └── Settings.tsx     # 设置面板
│   │   ├── styles/              # 全局样式
│   │   ├── assets/              # 静态资源
│   │   │   ├── sprites/         # 宠物精灵图
│   │   │   └── icons/           # 图标
│   │   └── index.html           # HTML 模板
│   ├── shared/                  # 主进程/渲染进程共享
│   │   ├── types.ts             # 类型定义
│   │   └── constants.ts         # 常量配置
│   └── services/                # 服务层
│       ├── openclaw.ts          # OpenClaw API 客户端
│       ├── config.ts            # 配置管理
│       └── store.ts             # Zustand 状态
└── resources/                   # 构建资源
    └── icon.ico                 # 应用图标
```

## ✨ 功能规划

### Phase 1 — MVP（核心功能）
- [x] 项目架构搭建
- [ ] 透明置顶宠物窗口
- [ ] 小龙虾精灵图 + 待机动画
- [ ] 拖拽移动
- [ ] 点击打开聊天窗口
- [ ] OpenClaw Gateway 连接与对话
- [ ] 流式消息输出
- [ ] 系统托盘图标

### Phase 2 — 体验优化
- [ ] 宠物状态机（空闲/关注/思考/对话）
- [ ] 鼠标悬停反应（转头、冒泡）
- [ ] 右键菜单（设置、切换 Agent、退出）
- [ ] 消息通知（托盘弹窗）
- [ ] Markdown 渲染（代码块、表格）
- [ ] 对话历史持久化
- [ ] 快捷键（Ctrl+Shift+L 唤出/隐藏）

### Phase 3 — 高级功能
- [ ] 设置面板（Gateway 地址、Token、Agent 选择）
- [ ] 多 Agent 快速切换
- [ ] 自定义宠物皮肤系统
- [ ] 宠物表情包（开心、忙碌、困惑等）
- [ ] 桌面边缘吸附与自动隐藏
- [ ] 开机自启动
- [ ] 消息中工具调用展示

## 🔧 开发

### 环境要求
- Node.js >= 20
- npm >= 10
- OpenClaw Gateway 运行中

### 安装与启动

```bash
# 克隆仓库
git clone https://github.com/KeaiPandas/lobster-pet.git
cd lobster-pet

# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 打包安装程序
npm run package
```

### 配置 OpenClaw 连接

1. 确保 OpenClaw Gateway 正在运行：`openclaw gateway`
2. 启用 OpenAI HTTP API 端点（Gateway 配置）：
```json5
{
  gateway: {
    http: {
      endpoints: {
        chatCompletions: { enabled: true }
      }
    }
  }
}
```
3. 在 Lobster Pet 设置中填入 Gateway 地址和 Token

## 💡 设计理念

1. **轻盈无感** — 宠物不遮挡工作，只在需要时出现
2. **情感化设计** — 小龙虾有表情和反应，不只是工具
3. **原生集成** — 通过 OpenClaw API 直接对话，不经过中间层
4. **可定制** — 支持换皮肤、换 Agent，宠物是你的

## 📄 License

MIT

---

_小龙虾在桌面上等你~ 🦞_
