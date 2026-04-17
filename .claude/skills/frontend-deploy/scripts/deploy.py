#!/usr/bin/env python3
"""
前端项目自动化部署脚本
当前项目: Vue 2 + Vue CLI, 默认 Node.js 20.19.5, 打包命令 build, 输出目录 dist
"""

import paramiko
import os
import sys
import json
import subprocess
from datetime import datetime
from pathlib import Path

# 默认配置
DEFAULT_NODE_VERSION = "20.19.5"
DEFAULT_BUILD_COMMAND = "build"
DEFAULT_SSH_PORT = 22
LOCAL_DIST_PATH = "./dist"


class Colors:
    """终端颜色"""
    RED = '\033[0;31m'
    GREEN = '\033[0;32m'
    YELLOW = '\033[1;33m'
    BLUE = '\033[0;34m'
    NC = '\033[0m'


def print_color(message, color=Colors.NC):
    """打印带颜色的消息"""
    print(f"{color}{message}{Colors.NC}")


def run_command(cmd, check=True):
    """执行 shell 命令"""
    print_color(f"执行: {cmd}", Colors.BLUE)
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if check and result.returncode != 0:
        print_color(f"命令失败: {result.stderr}", Colors.RED)
        sys.exit(1)
    return result


def check_vfox():
    """检查 vfox 是否安装"""
    result = subprocess.run("which vfox || where vfox", shell=True, capture_output=True)
    if result.returncode != 0:
        print_color("错误: vfox 未安装", Colors.RED)
        print("请先安装 vfox: https://vfox.lhan.me/")
        sys.exit(1)
    print_color("vfox 已安装", Colors.GREEN)


def check_package_json():
    """检查 package.json 是否存在"""
    if not os.path.exists("package.json"):
        print_color("错误: 当前目录未找到 package.json", Colors.RED)
        print("请在项目根目录运行此脚本")
        sys.exit(1)
    print_color("package.json 存在", Colors.GREEN)


def get_available_scripts():
    """从 package.json 获取可用的 build 脚本"""
    with open("package.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    scripts = data.get("scripts", {})
    build_scripts = {k: v for k, v in scripts.items() if "build" in k.lower() or "report" in k.lower()}
    return build_scripts


def switch_node_version(version):
    """切换 Node.js 版本"""
    print_color(f"\n[1/4] 检查 Node.js 版本...", Colors.YELLOW)

    # 检查指定版本是否已安装
    result = subprocess.run(f"vfox list nodejs", shell=True, capture_output=True, text=True)

    if version not in result.stdout:
        print_color(f"Node.js {version} 未安装，正在安装...", Colors.YELLOW)
        run_command(f"vfox install nodejs@{version}")

    # 切换版本
    print_color(f"切换到 Node.js {version}...", Colors.YELLOW)
    run_command(f"vfox use nodejs@{version}")

    # 验证版本
    result = run_command("node -v", check=False)
    current_version = result.stdout.strip()
    print_color(f"当前 Node.js 版本: {current_version}", Colors.GREEN)

    if version not in current_version:
        print_color(f"警告: 版本切换可能未生效，当前版本为 {current_version}", Colors.YELLOW)


def install_dependencies():
    """安装项目依赖"""
    print_color("\n[2/4] 安装依赖...", Colors.YELLOW)
    run_command("npm install")
    print_color("依赖安装完成", Colors.GREEN)


def build_project(build_command):
    """生产环境打包"""
    print_color(f"\n[3/4] 执行打包: npm run {build_command}...", Colors.YELLOW)
    run_command(f"npm run {build_command}")

    if not os.path.exists(LOCAL_DIST_PATH):
        print_color(f"错误: {LOCAL_DIST_PATH} 目录不存在，打包可能失败", Colors.RED)
        sys.exit(1)

    print_color("打包成功！", Colors.GREEN)


def backup_remote_dir(ssh, remote_path):
    """备份远程服务器上的旧版本"""
    print_color("备份远程服务器上的旧版本...", Colors.YELLOW)
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    backup_cmd = f"""
        if [ -d '{remote_path}' ]; then
            mv '{remote_path}' '{remote_path}.bak.{timestamp}'
        fi
        mkdir -p '{remote_path}'
    """
    stdin, stdout, stderr = ssh.exec_command(backup_cmd)
    exit_status = stdout.channel.recv_exit_status()

    if exit_status != 0:
        error = stderr.read().decode()
        print_color(f"备份失败: {error}", Colors.RED)
        return False

    print_color("备份成功", Colors.GREEN)
    return True


def upload_dir(sftp, local_dir, remote_dir):
    """递归上传目录"""
    for item in os.listdir(local_dir):
        local_path = os.path.join(local_dir, item)
        remote_path = remote_dir.replace("\\", "/") + "/" + item

        if os.path.isfile(local_path):
            print_color(f"上传: {item}", Colors.BLUE)
            sftp.put(local_path, remote_path)
        elif os.path.isdir(local_path):
            try:
                sftp.mkdir(remote_path)
            except IOError:
                pass
            upload_dir(sftp, local_path, remote_path)


def deploy_to_server(server_config):
    """部署到服务器"""
    print_color("\n[4/4] 部署到服务器...", Colors.YELLOW)
    print_color(f"服务器: {server_config['host']}:{server_config['port']}", Colors.BLUE)
    print_color(f"目标路径: {server_config['remote_path']}", Colors.BLUE)

    # 建立 SSH 连接
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    try:
        ssh.connect(
            server_config['host'],
            server_config['port'],
            server_config['username'],
            server_config['password']
        )
        print_color("SSH 连接成功", Colors.GREEN)

        # 备份远程目录
        if not backup_remote_dir(ssh, server_config['remote_path']):
            sys.exit(1)

        # 上传文件
        print_color("开始上传文件...", Colors.YELLOW)
        sftp = ssh.open_sftp()
        upload_dir(sftp, LOCAL_DIST_PATH, server_config['remote_path'])
        sftp.close()

        print_color("\n========================================", Colors.GREEN)
        print_color("部署成功！", Colors.GREEN)
        print_color(f"服务器: {server_config['host']}", Colors.GREEN)
        print_color(f"路径: {server_config['remote_path']}", Colors.GREEN)
        print_color("前端访问路径前缀: /schedule/", Colors.GREEN)
        print_color("========================================", Colors.GREEN)

    except Exception as e:
        print_color(f"部署失败: {e}", Colors.RED)
        sys.exit(1)
    finally:
        ssh.close()


def main():
    """主函数 - 实际逻辑在 skill 中通过 AskUserQuestion 收集信息后调用"""
    print_color("前端项目自动化部署", Colors.GREEN)
    print("=" * 50)

    # 前置检查
    check_vfox()
    check_package_json()

    # 显示可用的 build 脚本
    scripts = get_available_scripts()
    if scripts:
        print_color("\n可用的打包脚本:", Colors.YELLOW)
        for name, cmd in scripts.items():
            print(f"  - {name}: {cmd}")


if __name__ == "__main__":
    main()
