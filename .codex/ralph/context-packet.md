# Ralph Context Packet

Iteration: 1

## Objective
交付一个可上线的俄罗斯方块 Web 游戏，包含完整 UI/交互、GitHub 仓库、Railway 部署与 Agentation 反馈集成。

## PRD Summary
# PRD — 俄罗斯方块游戏完整交付

## 用户目标
交付一个可正式上线的俄罗斯方块 Web 游戏，具备完整 UI/UX、完整键盘交互、Railway 可访问部署、GitHub 代码仓库，以及内置 Agentation 反馈入口，便于上线后收集真实用户反馈。

## 约束
- 使用当前运行环境从零初始化项目。
- 主实现路径必须通过 Codex Ralph 循环推进。
- 产物需要可构建、可本地运行、可部署到 Railway。
- Agentation 必须内置到已交付站点本身，而不是替代性地接入其他系统。
- 不能伪造部署 URL、GitHub URL、QA 结果或 Playwright 验收结果。

## 非目标
- 不实现多人联机、账号系统、排行榜后端。
- 不承诺在本回合内替代 QA 团队完成“至少 10 轮有效打回”的组织流程；实现侧只负责提供可测试版本与证据，并在需要时继续修复。

## 范围
- 基于 React + TypeScript + Vite 构建前端。
- 实现标准俄罗斯方块核心玩法：方块生成、移动、旋转、软降、硬降、锁定、消行、得分、等级、速度提升、结束态。
- 实现完整界面：主标题、品牌说明、开始/暂停/继续/重开按钮、分数/等级/消行统计、下一个方块预览、操作说明、游戏状态反馈。
- 提供较完整视觉层：背景、玻璃卡片、棋盘格、方块配色、动画反馈、响应式布局。
- 集成 Agentation React 组件并配置 Consen webhook URL，附带已知任务/项目/聊天元数据。
- 提供 README、环境变量说明、部署配置、Playwright 截图脚本。

## 验收检查
1. `npm install`、`npm run build`、`npm run test:e2e` 可执行。
2. 本地预览可打开游戏并看到完整 UI。
3. Playwright 能输出至少一张 UI 截图作为验收证据。
4. Agentation 配置显式指向 Consen webhook ingress，且元数据包含已知的 `project_id/task_id/chat_id/workspace_id`。
5. Git 仓库有清晰提交历史。
6. GitHub 创建远程仓库并推送代码。
7. Railway 创建项目并成功部署，返回真实可访问 URL。

## 部署意图
- 创建新的 GitHub 仓库并推送当前项目。
- 在 Railway 创建并链接新项目，使用 `npm install && npm run build` 构建，使用 `npm run start` 进行静态预览服务。
- 部署完成后以实际输出 URL 做可达性校验。

## Overall Acceptance Checks
- test -f package.json
- test -f src/App.tsx
- test -f README.md
- test -f test-results/tetris-home.png
- npm run build
- git remote get-url origin | grep -E 'github.com[:/].+/.+'
- test -f .codex/ralph/deploy-url.txt

## Current Task
- id: task-1-bootstrap
- title: 初始化 Vite React TypeScript 项目并配置基础脚本
- status: in_progress
- goal: 

## Task Instructions
创建 Vite React TypeScript 项目，补齐 package.json 中 dev/build/start/test:e2e 脚本，确保可在 Railway 作为静态前端运行。

## Current Task Acceptance Checks
- test -f package.json
- node -e "const p=require('./package.json'); const s=p.scripts||{}; if(!s.dev||!s.build||!s.start||!s['test:e2e']) process.exit(1)"
- test -f src/main.tsx

## Outstanding Tasks
- [in_progress] task-1-bootstrap 初始化 Vite React TypeScript 项目并配置基础脚本
- [pending] task-2-gameplay-ui 实现俄罗斯方块核心玩法、完整 UI 与交互
- [pending] task-3-agentation-docs 集成 Agentation，补充 README 与部署说明
- [pending] task-4-verify 执行构建、本地预览和 Playwright 截图验证
- [pending] task-5-release 创建 GitHub 仓库、推送代码并部署 Railway

## Recent Progress
[2026-04-15] 初始化 Ralph 交付工件。
- 任务：俄罗斯方块完整交付（UI/交互 + GitHub + Railway + Agentation）
- 当前状态：已完成环境预检，当前目录无现成仓库，因此新建 /workspace/tetris-game 并初始化 git。
- 下一步：通过 Ralph loop 先完成项目脚手架与核心游戏实现。

## Working Tree
?? .codex/
?? .gitignore

## Diff Stat
(none)

## Latest Verification Summary
No verification has run yet.

## Instructions For Codex
- Work only on the current task above.
- Edit files in place in the repository.
- Stop after making the highest-value bounded progress for this task.
- Do not claim completion without passing the current task acceptance checks.
