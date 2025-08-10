# Provider 初始化业务说明

## 概述
Provider 初始化主要在 `ProjectOnboarding` 组件中处理。这个组件负责首次使用时的引导和版本更新提示。

## 初始化逻辑

### 1. 项目引导 (Project Onboarding)
- 检查项目是否已完成初始化：`!projectConfig.hasCompletedProjectOnboarding`
- 如果未完成，显示初始化提示
- 初始化完成后调用 `markProjectOnboardingComplete()` 保存状态

### 2. 版本更新提示 (Release Notes)
- 比较当前版本与上次查看版本：`gt(MACRO.VERSION, previousVersion)`
- 如果有新版本更新说明，显示更新内容
- 查看后调用 `markReleaseNotesSeen()` 保存状态

### 3. 初始化条件检查
- 检查是否存在项目配置文件：`existsSync(join(workspaceDir, PROJECT_FILE))`
- 检查工作目录是否为空：`isDirEmpty(workspaceDir)`
- 根据条件显示不同的初始化建议

## 主要功能点
1. 新用户引导列表（任务列表）
2. 版本更新说明展示
3. 终端集成提示（如适用）
4. 工作目录检查和警告

## 状态管理
- 使用 `getCurrentProjectConfig()` 和 `saveCurrentProjectConfig()` 管理项目配置
- 使用 `getGlobalConfig()` 和 `saveGlobalConfig()` 管理全局配置