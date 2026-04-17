---
name: frontend-deploy
description: 前端项目自动化打包部署工具。当前项目为 Vue 2 + Vue CLI 项目。当用户需要打包并部署到服务器时使用此 skill。功能包括：使用 vfox 管理 Node.js 版本、安装依赖、生产环境打包、通过 SSH/SFTP 上传到服务器。支持多服务器配置管理，密码在流程开始时输入。
---

# 前端项目自动化部署

## 触发条件

当用户说以下关键词时触发此 skill：
- "部署前端"
- "打包部署"
- "前端上线"
- "build and deploy"
- "部署到服务器"

## 部署流程

### 第一步：收集部署信息（必须）

**在开始任何操作之前，必须使用 `AskUserQuestion` 工具收集以下信息：**

#### 问题 1：选择服务器配置

```json
{
  "question": "请选择要部署的目标服务器？",
  "options": [
    { "label": "生产环境", "description": "1.95.115.1:22 - /opt/1panel/www/sites/schedule/dist" },
    { "label": "测试环境", "description": "自定义测试服务器" },
    { "label": "自定义", "description": "输入其他服务器配置" }
  ]
}
```

**如果用户选择"自定义"，继续追问：**

```json
{
  "question": "请输入自定义服务器配置",
  "options": [
    { "label": "服务器 IP", "description": "例如: 192.168.1.100" },
    { "label": "端口", "description": "默认 22" },
    { "label": "用户名", "description": "例如: root" },
    { "label": "远程路径", "description": "例如: /var/www/html/dist" }
  ]
}
```

#### 问题 2：输入服务器密码

```json
{
  "question": "请输入服务器登录密码？",
  "options": [
    { "label": "输入密码", "description": "密码仅用于本次部署，不会存储" }
  ]
}
```

**注意：** 密码必须在流程最开始就收集，不存储在变量中，仅传递给 Paramiko 使用。

#### 问题 3：选择打包命令

当前项目 `package.json` 中的 scripts 为：dev、build、report。默认使用 `build`。

```json
{
  "question": "请选择打包命令？",
  "options": [
    { "label": "build", "description": "生产环境打包（默认）" },
    { "label": "report", "description": "打包并生成报告" }
  ]
}
```

### 第二步：前置检查

- 确认当前目录包含 `package.json`
- 确认 `vfox` 已安装
- 列出可用的 Node.js 版本

### 第三步：执行部署

按顺序执行：

1. **切换 Node.js 版本**
   ```bash
   vfox use nodejs@20.19.5
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **生产环境打包**
   ```bash
   npm run build
   ```
   打包输出目录为 `./dist`。

4. **上传到服务器**
   - 使用 Python + Paramiko 进行 SFTP 上传
   - 自动备份远程旧版本（`dist.bak.时间戳`）
   - 递归上传 `dist` 目录

### 第四步：部署确认

- 显示部署结果
- 报告成功或失败的文件列表
- 提示前端访问路径为 `/schedule/`

## 服务器配置

### 预设配置

| 环境 | IP | 端口 | 用户名 | 远程路径 |
|------|-----|------|--------|----------|
| 生产环境 | 1.95.115.1 | 22 | root | /opt/1panel/www/sites/schedule/dist |
| 测试环境 | - | 22 | root | - |

### 自定义配置

用户可选择输入自定义服务器信息。

## 脚本资源

- `scripts/deploy.py` - 主要部署脚本（Python + Paramiko）

## 错误处理

| 错误场景 | 处理方式 |
|----------|----------|
| vfox 未安装 | 提示安装 vfox 后退出 |
| Node.js 版本切换失败 | 尝试安装该版本，失败后退出 |
| npm install 失败 | 显示错误信息并退出 |
| 打包失败 | 显示错误信息并退出 |
| SSH 连接失败 | 检查网络和密码，提示重试 |
| 上传失败 | 显示失败的文件列表 |

## 技术栈支持

- **项目类型**: Vue 2 + Vue CLI 4
- **版本管理**: vfox（默认 Node.js 20.19.5）
- **部署协议**: SSH/SFTP（使用 Paramiko 库）
- **前端路径前缀**: `/schedule/`
- **操作系统**: Windows/Linux/macOS
