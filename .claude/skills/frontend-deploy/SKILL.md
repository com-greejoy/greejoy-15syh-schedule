---
name: frontend-deploy
description: 前端项目自动化打包部署工具。当前项目为 Vue 2 + Vue CLI 项目。当用户需要打包并部署到服务器时使用此 skill。功能包括：使用 vfox 管理 Node.js 版本、安装依赖、生产环境打包、通过 SSH/SFTP 上传到服务器。默认使用 SSH 密钥认证，无需输入密码。
---

# 前端项目自动化部署

## 触发条件

当用户说以下关键词时触发此 skill：
- "部署前端"
- "打包部署"
- "前端上线"
- "build and deploy"
- "部署到服务器"

## 默认配置

以下为项目级默认值，用户未指定时直接使用：

| 配置项        | 默认值                                                           |
| ------------- | ---------------------------------------------------------------- |
| 服务器地址    | `1.95.115.1`                                                     |
| SSH 用户      | `root`                                                           |
| SSH 端口      | `22`                                                             |
| 远程路径      | `/opt/1panel/www/sites/schedule/dist`                            |
| Node.js 版本  | `20.19.5`                                                        |
| 打包命令      | `build`                                                          |
| SSH 密钥      | `~/.ssh/id_ed25519_15syh`（密钥认证优先，失败则提示密码）       |

## 部署流程

### 第一步：一键执行部署脚本（使用默认配置，无需询问）

**直接运行 skill 目录下的部署脚本：**

```bash
python .claude/skills/frontend-deploy/scripts/deploy.py
```

需要覆盖默认值时：

```bash
python .claude/skills/frontend-deploy/scripts/deploy.py \
  --host=1.95.115.1 \
  --remote-path=/opt/1panel/www/sites/schedule/dist \
  [--key-file ~/.ssh/id_ed25519_15syh] \
  [--password 密码] \
  [--build-cmd build] \
  [--node-version 20.19.5]
```

**脚本内部自动执行以下步骤：**

1. **前置检查** - 确认 `package.json` 存在，确认 `vfox` 已安装
2. **切换 Node.js 版本** - `vfox use nodejs@20.19.5`
3. **安装依赖** - `npm install`
4. **生产环境打包** - `npm run build`（输出到 `./dist`）
5. **打包 tar.gz** - 将 `dist` 目录压缩为 `dist.tar.gz`
6. **上传到服务器** - 通过 SSH/SFTP 上传 tar.gz 到远程 `/tmp`
7. **远程解压** - 在服务器上解压到目标目录，自动备份旧版本
8. **清理** - 删除本地 tar.gz

**密钥认证说明：**

- 脚本默认读取 `~/.ssh/id_ed25519_15syh` 进行密钥认证，无需输入密码
- 如果密钥认证失败，且提供了 `--password`，则自动回退到密码认证
- 如果密钥和密码都失败，脚本会报错退出

### 第二步：部署确认

- 显示部署结果
- 报告成功或失败
- 提示前端访问路径为 `/schedule/`

## 服务器配置

### 预设配置

| 环境 | IP | 端口 | 用户名 | 远程路径 |
|------|-----|------|--------|----------|
| 生产环境 | 1.95.115.1 | 22 | root | /opt/1panel/www/sites/schedule/dist |
| 测试环境 | - | 22 | root | - |

### 自定义配置

用户可选择输入自定义服务器信息，通过 `--host`、`--port`、`--username`、`--remote-path` 等参数传入脚本。

## 脚本资源

- `.claude/skills/frontend-deploy/scripts/deploy.py` - 一键部署脚本（Python + Paramiko）
  - 自动完成 Node 切换、依赖安装、打包、tar.gz 压缩、上传、解压全流程
  - 支持命令行参数：`--host`、`--port`、`--username`、`--key-file`、`--password`、`--remote-path`、`--build-cmd`、`--node-version`

## 错误处理

| 错误场景 | 处理方式 |
|----------|----------|
| vfox 未安装 | 提示安装 vfox 后退出 |
| Node.js 版本切换失败 | 尝试安装该版本，失败后退出 |
| npm install 失败 | 显示错误信息并退出 |
| 打包失败 | 显示错误信息并退出 |
| SSH 密钥认证失败 | 如提供了密码则回退密码认证，否则退出 |
| 上传失败 | 显示错误信息并退出 |
| 远程解压失败 | 显示错误信息并退出 |

## 技术栈支持

- **项目类型**: Vue 2 + Vue CLI 4
- **版本管理**: vfox（默认 Node.js 20.19.5）
- **部署协议**: SSH/SFTP（使用 Paramiko 库）
- **上传策略**: 本地 tar.gz 打包 → SFTP 上传 → 远程解压（避免逐文件上传的目录层级问题）
- **前端路径前缀**: `/schedule/`
- **操作系统**: Windows/Linux/macOS

## 密钥配置说明

首次使用密钥认证前，需将本地公钥添加到服务器的 `~/.ssh/authorized_keys`：

```bash
# 在本地执行，将公钥复制到服务器
cat ~/.ssh/id_ed25519_15syh.pub | ssh root@1.95.115.1 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"
```

或使用密码方式（如服务器仍允许密码登录）：

```bash
ssh root@1.95.115.1 "mkdir -p ~/.ssh && echo '$(cat ~/.ssh/id_ed25519_15syh.pub)' >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"
```
