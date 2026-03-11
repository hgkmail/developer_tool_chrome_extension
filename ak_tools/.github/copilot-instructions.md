# AK Tools — Chrome 扩展开发指引

这是一个基于 **Vue 3 + Vite + TypeScript + Element Plus** 的 Chrome 扩展前端工程，核心功能方向为**开发类小工具集**。

## 技术栈

| 类别      | 技术                                                         |
| --------- | ------------------------------------------------------------ |
| 框架      | Vue 3.5（Composition API + `<script setup>`）                |
| 路由      | Vue Router 5                                                 |
| 状态管理  | Pinia（Setup Store 函数式风格）                              |
| 国际化    | vue-i18n 11，默认 `zh-CN`，回退 `en-US`                      |
| UI 组件库 | Element Plus 2（自动按需导入）                               |
| 工具函数  | VueUse                                                       |
| 样式      | UnoCSS（原子化）+ SCSS（`@/assets/variables.scss` 全局注入） |
| 构建工具  | Vite 7，**`base: './'`（Chrome 扩展必须保留此配置）**        |
| Node 版本 | `>=20.19` 或 `>=22.12`                                       |

## 构建 & 测试命令

```bash
npm run dev          # 开发服务器
npm run build        # 类型检查 + 构建（生产）
npm run type-check   # 仅 vue-tsc 类型检查
npm run test:unit    # Vitest 单元测试（jsdom 环境）
npm run test:e2e     # Playwright E2E 测试
npm run lint         # oxlint --fix，再 eslint --fix
npm run format       # Prettier 格式化 src/
```

## 代码规范

### 组件写法

所有 `.vue` 文件统一使用 `<script setup lang="ts">`，禁止 Options API：

```vue
<script setup lang="ts">
// 组合式 API，无需手动 import Vue/Router/Pinia 核心 API（auto-import 已配置）
</script>

<template>...</template>

<style scoped></style>
```

### 自动导入

以下 API **无需手动 import**，由 `unplugin-auto-import` 自动注入：

- Vue 核心：`ref`、`computed`、`watch`、`onMounted` 等
- Vue Router：`useRouter`、`useRoute`
- Pinia：`defineStore`、`storeToRefs`

Element Plus 组件也无需手动注册，由 `unplugin-vue-components` 自动按需导入。

### 路径别名

始终使用 `@/` 代替相对路径访问 `src/` 下的模块：

```ts
import { useCounterStore } from '@/stores/counter'
```

### 样式约定

- 优先使用 **UnoCSS 原子类**处理工具性样式
- 组件私有样式写在 `<style scoped>` 块内
- 共享 SCSS 变量和 mixins 放在 `@/assets/variables.scss`（通过 Vite 全局注入，无需 import）

### 国际化

- 所有用户可见的文案必须走 i18n，不得硬编码中文或英文字符串
- 翻译 key 采用嵌套结构，例如 `setting.title`
- 在 `src/locales/zh-CN.ts` 和 `src/locales/en-US.ts` 中同步维护译文

### Pinia Store

使用 Setup Store（函数式），返回需要暴露的响应式数据和方法：

```ts
export const useXxxStore = defineStore('xxx', () => {
  const state = ref(...)
  function action() { ... }
  return { state, action }
})
```

## 架构说明

```
src/
├── components/   # 纯展示或复用组件
├── hooks/        # 可复用的组合式函数（useXxx.ts）
├── stores/       # Pinia stores
├── router/       # 路由配置（createWebHistory + BASE_URL）
├── i18n/         # i18n 初始化
├── locales/      # 翻译词条
└── assets/       # 静态资源、全局 SCSS 变量
```

## Chrome 扩展注意事项

- `vite.config.ts` 中 `base: './'` **不得修改**，Chrome 扩展以本地文件协议加载资源，必须使用相对路径
- `public/manifest.json` 遵循 **Manifest V3** 规范
- 如需多入口（popup / options / content script / background），在 `vite.config.ts` 中配置 `build.rollupOptions.input`
- Content Script 与页面 DOM 交互，不可使用 `chrome.storage` 以外的跨域 API

## Lint & 格式化

- **两套 Linter 串行执行**：`oxlint`（Rust，快）先跑，再 `eslint`（含 Vue/TS 规则）
- Prettier 仅负责格式化，不做语义检查（`skipFormatting` 已在 ESLint 中配置）
- 提交前运行 `npm run lint && npm run format` 保证代码风格一致
