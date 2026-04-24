#!/usr/bin/env python3
"""
前端项目自动化部署脚本
支持：Node 版本切换 → 安装依赖 → 生产打包 → tar.gz 打包 → SSH 上传 → 远程解压

用法:
    python scripts/deploy.py [选项]

默认配置（无需参数直接运行）:
    --host=1.95.115.1
    --remote-path=/opt/1panel/www/sites/schedule/dist
    --key-file=~/.ssh/id_ed25519_15syh

选项:
    --host          服务器地址 (默认: 1.95.115.1)
    --port          SSH 端口 (默认: 22)
    --username      SSH 用户名 (默认: root)
    --key-file      SSH 私钥路径 (默认: ~/.ssh/id_ed25519_15syh)
    --password      SSH 密码 (可选，密钥失败时后备)
    --remote-path   远程部署目录 (默认: /opt/1panel/www/sites/schedule/dist)
    --build-cmd     npm 打包命令 (默认: build)
    --node-version  Node.js 版本 (默认: 20.19.5)
"""

import argparse
import os
import sys
import tarfile
import time
import subprocess
import paramiko

DEFAULT_NODE_VERSION = "20.19.5"
DEFAULT_BUILD_COMMAND = "build"
DEFAULT_SSH_PORT = 22
DEFAULT_USERNAME = "root"
DEFAULT_REMOTE_PATH = "/opt/1panel/www/sites/schedule/dist"
LOCAL_DIST_PATH = "./dist"


def run_cmd(cmd, check=True):
    """执行 shell 命令并输出。"""
    print(f"  $ {cmd}")
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if result.stdout:
        print(result.stdout.strip())
    if check and result.returncode != 0:
        print(f"[错误] {result.stderr.strip()}", file=sys.stderr)
        sys.exit(1)
    return result


def check_vfox():
    """检查 vfox 是否已安装。"""
    result = subprocess.run("vfox --version", shell=True, capture_output=True)
    if result.returncode != 0:
        print("[错误] vfox 未安装，请先安装: https://vfox.lhan.me/")
        sys.exit(1)
    print("[OK] vfox 已安装")


def switch_node(version):
    """切换 Node.js 版本。"""
    print(f"\n[1/5] 切换 Node.js 版本到 {version} ...")
    run_cmd(f"vfox use nodejs@{version}")
    result = run_cmd("node -v", check=False)
    current = result.stdout.strip()
    print(f"[OK] 当前 Node.js 版本: {current}")


def install_deps():
    """安装依赖。"""
    print("\n[2/5] 安装依赖 ...")
    run_cmd("npm install")
    print("[OK] 依赖安装完成")


def build_project(build_cmd):
    """生产环境打包。"""
    print(f"\n[3/5] 执行打包: npm run {build_cmd} ...")
    run_cmd(f"npm run {build_cmd}")

    if not os.path.isdir(LOCAL_DIST_PATH):
        print(f"[错误] 打包后未找到 {LOCAL_DIST_PATH} 目录", file=sys.stderr)
        sys.exit(1)
    print("[OK] 打包成功")


def make_tar():
    """将 dist 目录打包为 tar.gz，返回文件路径。"""
    tar_path = os.path.abspath(LOCAL_DIST_PATH + ".tar.gz")
    print(f"\n[4/5] 打包 dist 为 tar.gz: {tar_path} ...")
    with tarfile.open(tar_path, "w:gz") as tar:
        for root, dirs, files in os.walk(LOCAL_DIST_PATH):
            for f in files:
                full = os.path.join(root, f)
                arcname = os.path.relpath(full, LOCAL_DIST_PATH)
                tar.add(full, arcname=arcname)
    print("[OK] 打包完成")
    return tar_path


def connect_ssh(host, port, username, password=None, key_file=None):
    """建立 SSH 连接，优先密钥认证，失败则回退密码认证。"""
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    pkey = None
    if key_file and os.path.isfile(key_file):
        try:
            pkey = paramiko.Ed25519Key.from_private_key_file(key_file)
        except Exception:
            try:
                pkey = paramiko.RSAKey.from_private_key_file(key_file)
            except Exception:
                pkey = None

    if pkey:
        try:
            ssh.connect(host, port=port, username=username, pkey=pkey, timeout=15)
            print("[OK] SSH 密钥认证成功")
            return ssh
        except Exception as e:
            if not password:
                print(f"[错误] SSH 密钥认证失败: {e}", file=sys.stderr)
                sys.exit(1)
            print("  密钥认证失败，尝试密码认证...")

    if not password:
        print("[错误] 无可用认证方式（密钥失败且未提供密码）", file=sys.stderr)
        sys.exit(1)

    try:
        ssh.connect(host, port=port, username=username, password=password, timeout=15)
        print("[OK] SSH 密码认证成功")
        return ssh
    except Exception as e:
        print(f"[错误] SSH 连接失败: {e}", file=sys.stderr)
        sys.exit(1)


def deploy(tar_path, host, port, username, password, key_file, remote_path):
    """SSH 连接、备份、上传、解压。"""
    print(f"\n[5/5] 部署到服务器 {host}:{port} ...")
    print(f"  远程路径: {remote_path}")

    ssh = connect_ssh(host, port, username, password, key_file)

    # 备份旧版本
    timestamp = time.strftime("%Y%m%d_%H%M%S")
    backup_path = f"{remote_path}.bak.{timestamp}"
    stdin, stdout, stderr = ssh.exec_command(f"test -d {remote_path} && echo yes || echo no")
    if stdout.read().decode().strip() == "yes":
        print(f"  备份旧版本 -> {backup_path}")
        ssh.exec_command(f"cp -r {remote_path} {backup_path}")
    else:
        print("  远程目录不存在，跳过备份")

    # 清空并重建远程目录
    print(f"  清空并重建远程目录 ...")
    ssh.exec_command(f"rm -rf {remote_path} && mkdir -p {remote_path}")

    # 上传 tar.gz
    remote_tar = f"/tmp/dist_deploy_{timestamp}.tar.gz"
    print(f"  上传压缩包 ...")
    sftp = ssh.open_sftp()
    sftp.put(tar_path, remote_tar)

    # 远程解压
    print(f"  远程解压 ...")
    stdin, stdout, stderr = ssh.exec_command(
        f"tar -xzf {remote_tar} -C {remote_path} && rm -f {remote_tar} && echo ok"
    )
    result = stdout.read().decode().strip()
    err = stderr.read().decode().strip()
    sftp.close()
    ssh.close()

    if result != "ok" or err:
        print(f"[错误] 解压失败: {err}", file=sys.stderr)
        sys.exit(1)

    print("[OK] 解压完成")


def main():
    parser = argparse.ArgumentParser(description="前端项目自动化部署脚本")
    parser.add_argument("--host", default="1.95.115.1", help="服务器地址 (默认: 1.95.115.1)")
    parser.add_argument("--port", type=int, default=DEFAULT_SSH_PORT, help="SSH 端口 (默认 22)")
    parser.add_argument("--username", default=DEFAULT_USERNAME, help="SSH 用户名 (默认 root)")
    parser.add_argument("--key-file", default=os.path.expanduser("~/.ssh/id_ed25519_15syh"),
                        help="SSH 私钥路径 (默认: ~/.ssh/id_ed25519_15syh)")
    parser.add_argument("--password", default=None, help="SSH 密码 (可选，密钥失败时后备)")
    parser.add_argument("--remote-path", default=DEFAULT_REMOTE_PATH, help="远程部署目录")
    parser.add_argument("--build-cmd", default=DEFAULT_BUILD_COMMAND, help="npm 打包命令 (默认 build)")
    parser.add_argument("--node-version", default=DEFAULT_NODE_VERSION, help="Node.js 版本 (默认 20.19.5)")
    args = parser.parse_args()

    print("=" * 50)
    print("前端项目自动化部署")
    print(f"  服务器: {args.host}")
    print(f"  路径:   {args.remote_path}")
    print("=" * 50)

    # 前置检查
    check_vfox()
    if not os.path.exists("package.json"):
        print("[错误] 当前目录未找到 package.json，请在项目根目录运行", file=sys.stderr)
        sys.exit(1)
    print("[OK] package.json 存在")

    # 执行部署流程
    switch_node(args.node_version)
    install_deps()
    build_project(args.build_cmd)
    tar_path = make_tar()
    deploy(tar_path, args.host, args.port, args.username, args.password, args.key_file, args.remote_path)

    # 清理本地 tar
    os.remove(tar_path)

    print("\n" + "=" * 50)
    print("部署成功！")
    print(f"  服务器: {args.host}")
    print(f"  路径:   {args.remote_path}")
    print("  访问:   /schedule/")
    print("=" * 50)


if __name__ == "__main__":
    main()
