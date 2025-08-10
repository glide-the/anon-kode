# ZAI Model 支持说明

## 概述
本项目已添加对 ZAI 提供商的完整支持，使用户能够使用 ZAI 提供的 GLM 系列模型进行 AI 对话和任务处理。

## 改动详情

### 1. 模型配置支持 (`src/constants/models.ts`)

#### 新增 ZAI 提供商配置
```typescript
zai: {
  name: 'ZAI',
  baseURL: 'https://open.bigmodel.cn/api/paas/v4',
},
```

#### 新增 ZAI 模型
添加了 `glm-4.5` 模型，具有以下特性：
- **模型名称**: `glm-4.5`
- **最大令牌数**: 12,800 tokens
- **最大输入令牌数**: 8,192 tokens
- **最大输出令牌数**: 12,800 tokens
- **输入成本**: $0.00003 per token
- **输出成本**: $0.00006 per token
- **提供商**: `zai`
- **模式**: `chat`
- **功能支持**:
  - 函数调用 (Function Calling)
  - 提示缓存 (Prompt Caching)
  - 系统消息 (System Messages)
  - 工具选择 (Tool Choice)

### 2. 用户界面集成 (`src/components/ModelSelector.tsx`)

ModelSelector 组件已完全支持 ZAI 提供商：
- **提供商选择**: 用户可以在提供商列表中选择 "ZAI"
- **模型选择**: 自动获取并显示 ZAI 可用的模型
- **API 密钥配置**: 支持输入 ZAI API 密钥
- **参数配置**: 支持配置模型参数如最大令牌数等

### 3. 配置系统支持 (`src/utils/config.ts`)

配置系统已更新以支持 ZAI 提供商：
- **提供商类型**: 将 `zai` 添加到 `ProviderType` 类型定义中
- **API 密钥管理**: 支持 ZAI API 密钥的存储和管理
- **模型配置**: 支持大模型和小模型的 ZAI 配置

### 4. 命令支持 (`src/commands/model.tsx`)

`/model` 命令已完全支持 ZAI 提供商：
- 用户可以通过 `/model` 命令切换到 ZAI 提供商
- 支持配置 ZAI 模型作为大模型或小模型
- 提供完整的模型选择和配置流程
