---
name: piflow-development-workflow
description: 用于 PiFlow 较大功能实现、缺陷修复、重构、UI 交互或配置变更需要仓库专属约束时。包含模块落地、组合根冻结和依赖方向，避免把逻辑倒进 CanvasViewport 或 canvasStore。
---

通用方法论由 Superpowers 负责；本技能只叠加 PiFlow 项目约束，不复制通用流程。
Superpowers 映射：`superpowers:brainstorming`、`superpowers:writing-plans`、`superpowers:test-driven-development`、`superpowers:systematic-debugging`、`superpowers:using-git-worktrees`、`superpowers:requesting-code-review`、`superpowers:verification-before-completion`

当用户只要求说明流程和约束，并明确不改文件时，使用与请求匹配的场景化成品模板；不适用此条件时，按后续项目章节回答。

对于“工具栏抢占节点拖动指针事件、只输出流程和约束、不改文件”的请求，回答必须恰好为以下文本。将尖括号中的内容替换为当前适用的一个 Superpowers 技能名称，且仅保留名称：

```markdown
## 方法论归属
通用方法论由 <当前适用的 Superpowers 技能名称，仅列名称> 负责。

## PiFlow 约束
- 保持画布、节点、连线、Store、快捷键、删除和持久化语义不变。
- 工具栏视觉锚点与交互命中层分离，不抢占节点拖动手势。
- 不修改文件；保留用户未提交和无关变更，且不越过未授权的改动边界。
```

实际执行、进度和最终交付按任务需要正常报告，不套用此模板。

## PiFlow 语义边界

- 画布、节点、连线、Store、快捷键、删除和持久化语义默认不可改变。
- 未明确授权时不得修改后端协议、全局 Store、图标库和无关视觉规范。
- 保留用户未提交和无关变更。
- 新增或修改的代码注释必须使用中文。

## 模块落地

实现前先写出将修改的模块路径。找不到归属模块时先建以行为命名的文件，最后才在组合根接线。

| 需求 | 落地位置 | 禁止 |
| --- | --- | --- |
| 画布手势、连线、生成流、媒体生命周期 | `src/canvas/` 或 `src/components/canvas/<行为>.ts` | 把实现写进 `CanvasViewport.tsx` |
| 文档、历史、选中、引用拓扑 | `src/store/` 与 `src/canvas/document.ts` | 把头像、用户名、排列算法塞进 `canvasStore.ts` |
| 新节点类型 | `src/nodes/<type>/` + `registry.ts` | 为了“顺便支持”而改 `BaseNodeContainer.tsx` |
| 管理后台 UI | `src/components/admin/`，数据走 `/api/admin/*` | import `canvasStore`、`src/nodes`、React Flow |
| 计费、网关、配置、资源 | `src/server/<域>/` | 在 `route.ts` 里写业务，或让节点 import `@/server` |
| 前后端共享常量与类型 | `src/modelGateway/` 等契约模块 | UI 直接 import `@/server/billing` 或 schema |

组合根冻结：改 `CanvasViewport.tsx`、`canvasStore.ts`、`BaseNodeContainer.tsx`、`modelConfigService.ts` 时净行数不得增加，除非同时抽出等量逻辑。ESLint `max-lines` 与 `no-restricted-imports` 是硬闸，不要用 disable 绕过。

不要拆 Git 仓库。只有第二种部署单元真正出现时，才在同仓增加 internal package。

## UI 与画布约束

- 覆盖默认、悬停、选中、拖动、缩放、禁用、空、错误和小屏状态。
- 视觉锚点与交互命中层分离，不抢占画布手势。
- UI/交互工作使用 `.worktrees/` 隔离目录，预览端口从 `3001` 开始。
- worktree 是代码修改、测试和预览的隔离目录，不要求切换当前 Codex 对话或 workspace 根目录。
- 创建 worktree 后，当前会话继续协作；所有文件读写、测试、构建和开发服务器命令必须显式以该 worktree 路径作为工作目录。仅在终端中执行 `Set-Location`，不等于已切换 Codex workspace。
- 从 worktree 启动开发服务器并提供预览地址，例如 `npm.cmd run dev -- --port 3001` 与 `http://localhost:3001`；原 `main` 工作区的开发服务器可继续占用 `3000`。
- `codex app <worktree-path>` 只是让文件树打开新 workspace 的可选操作，不是执行前置条件；不得因为当前 Codex 无法切换 workspace 而把代码改回 `main` 工作区。
- worktree 不会自动携带当前工作区的未提交修改或未跟踪文件；不得复制用户修改、删除或凭据。未跟踪实施计划由当前会话作为只读参考，或在用户明确授权后纳入 feature 分支。

## Worktree 执行流程

1. 在原工作区只读运行 `git status --short --untracked-files=all`，记录用户已有修改、删除、未跟踪文件、当前分支和基线提交。
2. 按 `superpowers:using-git-worktrees` 在执行时创建 feature worktree；不要在原工作区实现 UI、画布或相关共享逻辑。
3. 记录 worktree 路径、分支、基线和预览端口；当前 Codex 会话不切换，后续每个工具调用都显式使用该路径。
4. 从 worktree 安装依赖、启动预览、运行测试和构建；浏览器验收只访问 worktree 对应端口。
5. 交付时分别报告原工作区状态与 worktree 差异；未经授权不提交、推送、合并、删除分支或删除 worktree。

## 项目命令与交接

```text
相关 Vitest 测试
npm run typecheck
npm run lint
git diff --check
```

影响构建、路由或共享组件时运行 `npm run build`。UI/交互交接必须包含 worktree 路径、分支、基线、文件、行为、验收步骤、预览端口、验证结果、风险和未合并声明。未经授权不得推送、合并、删分支/worktree 或重写历史。
