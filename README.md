# 俄罗斯方块 Web 游戏（React + TypeScript + Vite）

可上线的单机俄罗斯方块，包含完整 UI/交互、键盘操作、Playwright 验收截图与 Agentation 反馈入口。

## 功能概览

- 标准玩法：生成、移动、旋转、软降、硬降、锁定、消行、结束判定
- 成长系统：`score / level / lines`，等级提升后自动加速
- 完整界面：品牌区、状态提示、开始/暂停/继续/重开、Next 预览、操作说明
- 反馈集成：站内 Agentation 反馈表单，直连 Consen webhook

## Agentation 配置

前端已内置并透传固定上下文：

- `webhookUrl`: `https://api.consen.app/webhooks/agentation`
- `task_id`: `tsk_01kp7nmabtfyb93dshv7zwahmx`
- `project_id`: `prj_01kp7njnewfm6bbzdaew554ydd`
- `chat_id`: `chat_01kp7nentvedfr6q52d1p00f1h`
- `workspace_id`: `ws_01kf0b8vzse7rb8tf8s2r1sgxj`

可选环境变量（未设置时使用上述默认值）：

- `VITE_AGENTATION_WEBHOOK_URL`
- `VITE_AGENTATION_TASK_ID`
- `VITE_AGENTATION_PROJECT_ID`
- `VITE_AGENTATION_CHAT_ID`
- `VITE_AGENTATION_WORKSPACE_ID`

## 本地运行

```bash
npm install
npm run dev
```

默认开发地址：`http://localhost:5173`

## 构建与预览

```bash
npm run build
npm run start
```

`start` 使用 `vite preview --host 0.0.0.0 --port ${PORT:-4173}`，可直接用于 Railway 启动命令。

## E2E 验收（Playwright）

```bash
npm run test:e2e
```

建议把截图落盘到 `test-results/` 目录（例如 `test-results/tetris-home.png`）作为交付证据。

## Railway 部署说明

1. 推送代码到 GitHub 仓库。
2. 在 Railway 新建项目并连接该 GitHub 仓库。
3. 配置构建命令：`npm install && npm run build`
4. 配置启动命令：`npm run start`
5. 部署成功后记录真实可访问 URL 到 `.codex/ralph/deploy-url.txt`

## 交付验收命令

```bash
test -f package.json
test -f src/App.tsx
test -f README.md
test -f test-results/tetris-home.png
npm run build
git remote get-url origin | grep -E 'github.com[:/].+/.+'
test -f .codex/ralph/deploy-url.txt
```

## 当前任务验收命令

```bash
grep -R 'api.consen.app/webhooks/agentation' -n src . >/dev/null
grep -RE 'tsk_01kp7nmabtfyb93dshv7zwahmx|prj_01kp7njnewfm6bbzdaew554ydd|chat_01kp7nentvedfr6q52d1p00f1h|ws_01kf0b8vzse7rb8tf8s2r1sgxj' -n src . >/dev/null
test -f README.md
```
