# Webchat 前端统一样式规范

本文档供各功能模块成员在开发 Vue 页面与组件时遵循，保证 UI 与现有基础设施（蓝白主题、三栏布局、Element UI）一致。

**适用范围：** `frontend/` 下所有新页面、新组件；重构旧代码时建议逐步对齐。

---

## 1. 设计原则

| 项 | 约定 |
| --- | --- |
| 视觉风格 | 蓝白、简洁，与 Element UI 2.x 协调 |
| 主色 | `#409EFF`（Element 默认蓝） |
| 颜色来源 | 仅使用 `static/css/var.scss` 变量或 `theme.scss` 导出的 CSS 变量 |
| 组件库 | Element UI；新代码优先使用项目封装的 `app-*` 组件 |
| 禁止 | 在业务代码中硬编码旧色（如 `#3578E5`）、随意新增一套色板 |

---

## 2. 设计令牌（单一数据源）

### 2.1 SCSS 变量

**文件：** `frontend/static/css/var.scss`

| 类别 | 变量 | 用途 |
| --- | --- | --- |
| 主色 | `$primarycolor`, `$primarycolor-1`, `$primarycolor-rgb` | 按钮、链接、hover、顶栏渐变 |
| 语义色 | `$successcolor`, `$warningcolor`, `$dangercolor`, `$infocolor` | 成功 / 警告 / 危险 / 信息 |
| 文字 | `$primaryfont`, `$normalfont`, `$secondaryfont`, `$seatfont` | 标题 / 正文 / 辅助 / 占位 |
| 背景 | `$primarybg`, `$normalbg`, `$secondarybg`, `$seatbg` | 面板、页面底 |
| 边框 | `$border1` ~ `$border4` | 分割线、输入框边框 |
| 侧栏 | `$sidebar-bg`, `$sidebar-text`, `$sidebar-text-muted`, `$sidebar-hover-bg` | 左侧深色导航 |
| 布局 | `$layout-shell-bg`, `$layout-panel-border`, `$layout-header-height`, `$chat-panel-bg` | 主窗口三栏 |
| 圆角 | `$btn-radius` (8px), `$chat-icon-btn-radius` (12px), `$avatar-radius` (14px) | 按钮、图标钮、头像 |
| 字号 | `$fontSize-small` (12px), `$fontSize-medium` (14px), `$fontSize-large` (18px) 等 | 排版层级 |

### 2.2 CSS 变量（`:root`）

**文件：** `frontend/static/css/theme.scss`（由 `main.js` 全局引入）

在纯 CSS、或不便引入 SCSS 的场景可使用，例如：

- `--color-primary`, `--color-primary-dark`
- `--color-text-primary`, `--color-text-secondary`
- `--chat-panel-bg`, `--layout-header-height`
- `--avatar-size-md`, `--btn-radius`

### 2.3 JavaScript 常量

**文件：** `frontend/src/const/index.js`

须与 SCSS 保持一致：

| 常量 | 说明 |
| --- | --- |
| `THEME_PRIMARY` | 主色，对应 `$primarycolor` |
| `AVATAR_SIZE` | 头像尺寸映射 |
| `BUTTON_SIZE` | 按钮尺寸 → Element UI `size` |
| `APP_NAME`, `APP_TAGLINE`, `APP_HOME_HINT` | 产品名与文案，禁止在组件内硬编码 |

---

## 3. 全局样式入口

`frontend/src/main.js` 已引入：

```text
static/css/base.scss   → 工具类、通用排版
static/css/theme.scss  → var + avatar + button + layout + :root 变量
```

成员私有组件的 `<style lang="scss">` 中按需增加：

```scss
@import '../../../static/css/var.scss';  // 按相对路径调整层级
```

---

## 4. 必须复用的封装组件

已在 `main.js` 全局注册：

| 组件 | 路径 | 推荐用法 |
| --- | --- | --- |
| `<app-button>` | `components/appButton` | `variant="primary\|default\|success\|danger\|warning\|info\|text"`；`size="xs\|sm\|md\|lg"`；`block` 全宽 |
| `<app-avatar>` | `components/appAvatar` | `size="xs\|sm\|md\|lg\|ml\|xl"`；侧栏用 `variant="sidebar"` |
| `<app-logo>` | `components/appLogo` | `size="sm\|md\|lg"`；`:show-text="false"` 仅图标 |

**新功能请优先使用上述组件**，避免直接使用 `<el-button>`、`<el-avatar>`（遗留代码可逐步迁移）。

品牌与 Logo：

```vue
import { APP_NAME, APP_TAGLINE } from '@/const'
import AppLogo from '@/components/appLogo'
```

静态 Logo 资源：`frontend/static/image/logo.svg`。

---

## 5. 布局类命名（`layout.scss`）

采用 **`app-{区域}-{元素}`** 的 BEM 风格，与业务根类 **组合使用**。

| 类名 | 使用场景 |
| --- | --- |
| `app-layout-shell` | 主窗口容器（`layout/Index.vue` 的 `el-main`） |
| `app-conversation-panel` | 左侧会话列表 |
| `app-chat-shell` | 右侧聊天主区域（flex 纵向） |
| `app-chat-header` | 聊天区顶栏容器 |
| `app-chat-header__title` | 顶栏标题区 |
| `app-chat-header__actions` | 顶栏操作区 |
| `app-chat-icon-btn` | 图标按钮（36×36，圆角 12px，hover 主色浅底） |
| `app-chat-footer` | 消息输入区底栏 |
| `app-chat-textarea` | 多行输入框样式 |
| `app-chat-link-btn` | 文字型操作（如「历史记录」） |
| `app-chat-dropdown-panel` | 设置等下拉浮层 |
| `app-chat-subpanel` | 右侧固定子面板（如群资料） |
| `app-chat-floating-panel` | 浮层子面板（如历史消息） |
| `app-sidebar` | 最左侧深色导航容器 |
| `app-sidebar-icon-btn` | 侧栏图标按钮 |
| `app-sidebar__nickname` | 侧栏昵称 |

### 5.1 示例（聊天顶栏）

```html
<div class="chat-area__header app-chat-header">
  <div class="header-title app-chat-header__title">
    <span>会话标题</span>
  </div>
  <div class="header-operation app-chat-header__actions">
    <i class="operation-item app-chat-icon-btn el-icon-menu"></i>
  </div>
</div>
```

### 5.2 命名规则

- **业务根类**（如 `chat-area__header`、`setting-panel-cmp`）：描述模块结构与局部布局。
- **`app-*` 类**：跨模块统一的色彩、间距、hover、圆角。
- 新模块若处于聊天壳内，应挂上对应的 `app-chat-*` 壳类。

---

## 6. 全局工具类（`base.scss`）

| 类名 | 用途 |
| --- | --- |
| `.primary-font` / `.normal-font` / `.secondary-font` | 文字颜色与字号 |
| `.primary-bg` / `.normal-bg` / `.secondary-bg` / `.seat-bg` | 背景色 |
| `.hor-ver-center` | 绝对定位水平垂直居中 |
| `.space-bw` / `.space-ar` | flex 两端 / 环绕对齐 |
| `.ellipsis` | 单行文本省略 |
| `.bottom-line` | 底部 1px 分割线 |
| `.operation-text` | 可点击文字（主色） |
| `.operation-text__danger` | 可点击文字（危险色） |
| `.box-shadow1` / `.basics-box-shadow` | 卡片阴影 |
| `.offline` | 离线态（子元素 `img` 半透明） |
| `.curp` | `cursor: pointer` |

### 6.1 过渡动画

**文件：** `frontend/static/css/animation.scss`

与现有 `<transition>` 的 `name` 保持一致，例如：`fade`、`fade-left`、`fade-right`、`roll`、`slide-up`。

---

## 7. 模块开发 Checklist

### 开发前

- [ ] 确认不需要在 `var.scss` 重复定义已有颜色
- [ ] 新增 token 须与基础设施负责人评审
- [ ] 产品名、标语从 `@/const` 读取

### 开发中

- [ ] 面板背景使用 `$chat-panel-bg` 或 `$primarybg`
- [ ] 边框使用 `$layout-panel-border` 或 `$border2`
- [ ] 图标操作使用 `app-chat-icon-btn` 或 `app-sidebar-icon-btn`
- [ ] 主按钮：`<app-button variant="primary">`
- [ ] 危险操作：`<app-button variant="danger">`
- [ ] 头像：`<app-avatar size="md" />`
- [ ] 移动端参考现有 `device === 'Mobile'` 与 `*.mobile` 类写法

### 提交前

- [ ] 无硬编码主色以外的「第二套蓝色」
- [ ] 未引入与 Element UI 冲突的另一套 UI 皮肤
- [ ] 局部 `<style scoped>` 已 `@import` `var.scss`（若使用变量）

---

## 8. 推荐组件样式模板

```vue
<template>
  <div class="my-module">
    <h3 class="my-module__title">标题</h3>
    <p class="my-module__hint">辅助说明</p>
    <app-button variant="primary" size="md">确定</app-button>
  </div>
</template>

<style lang="scss" scoped>
@import '../../../static/css/var.scss';

.my-module {
  background: $chat-panel-bg;
  border: 1px solid $layout-panel-border;
  border-radius: $btn-radius;
  color: $primaryfont;
  padding: 16px;

  &__title {
    font-size: $fontSize-large;
    font-weight: 600;
    margin: 0 0 8px;
  }

  &__hint {
    font-size: $fontSize-small;
    color: $secondaryfont;
    margin: 0 0 16px;
  }
}
</style>
```

---

## 9. 文件职责与修改权限

| 文件 | 建议维护人 | 内容 |
| --- | --- | --- |
| `static/css/var.scss` | 基础设施 / 负责人 | 设计令牌 |
| `static/css/theme.scss` | 同上 | 聚合引入 + `:root` |
| `static/css/layout.scss` | 布局 / 聊天壳 | `app-chat-*`, `app-sidebar-*` |
| `static/css/button.scss` | 基础设施 | Element 按钮覆写、`app-btn` |
| `static/css/avatar.scss` | 基础设施 | `app-avatar` 变体 |
| `static/css/base.scss` | 全员只读为主 | 工具类；修改需评审 |
| `src/const/index.js` | 与 SCSS 同步 | JS 尺寸、品牌、业务枚举 |

**各成员模块**（好友、群聊、单聊消息、设置等）原则上只修改自己的 `views/`、`components/`，通过变量与 `app-*` 类扩展样式。

---

## 10. 与遗留代码的兼容

仓库中仍存在以下内容，**新代码不必模仿**，但合并时注意不要破坏：

| 遗留项 | 说明 |
| --- | --- |
| `co-messager-*` 类名 | 旧布局命名，可保留并逐步叠加 `app-*` |
| `chat-area__*` 等业务 BEM | 与 `app-*` 组合使用即可 |
| 直接使用 `el-button` / `el-avatar` | 旧页面；新功能请用 `app-*` |
| `localStorage` 前缀 `coMessager-*` | 存储键名，与 `APP_NAME` 品牌无关 |
| 顶栏旧名 Co-Messager | 已统一为 Webchat，见 `APP_NAME` |

---

## 11. 参考实现位置

| 功能 | 参考文件 |
| --- | --- |
| 三栏布局壳 | `src/views/layout/Index.vue` |
| 顶栏品牌 | `src/views/layout/components/Header.vue` |
| 聊天顶栏 / 输入区 | `src/views/Chat/components/Header.vue`, `ChatArea.vue` |
| 首页空状态 | `src/components/homeWelcome/index.vue` |
| 登录页品牌区 | `src/views/Login.vue` |
| 侧栏导航 | `src/views/layout/components/Aside.vue` |

---

## 12. PR 自检（可复制到 PR 描述）

```markdown
## 样式自检
- [ ] 颜色/圆角/间距来自 var.scss 或 app-* 类
- [ ] 使用 app-button / app-avatar（新 UI）
- [ ] 品牌文案来自 @/const
- [ ] 聊天相关区域已挂 app-chat-* 壳类（如适用）
- [ ] 未引入硬编码色值或与 Element 冲突的 UI 库
```

---

*文档版本与 `APP_VERSION`（`src/const/index.js`）同步维护；样式基础设施变更时请更新本章对应表格。*
