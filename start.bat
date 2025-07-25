@echo off
chcp 65001 >nul

echo 🤖 AI博客生成器启动脚本
echo ==========================

:: 检查Node.js是否安装
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js 未安装，请先安装 Node.js
    pause
    exit /b 1
)

:: 检查npm是否安装
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm 未安装，请先安装 npm
    pause
    exit /b 1
)

echo ✅ Node.js 和 npm 已安装

:: 安装依赖
echo 📦 安装依赖包...
call npm install

:: 检查.env文件
if not exist ".env" (
    echo ⚠️  .env 文件不存在，复制 .env.example 为 .env
    copy ".env.example" ".env" >nul
    echo 📝 请编辑 .env 文件，添加您的 OpenAI API Key 和其他配置
    echo 🔑 OpenAI API Key 获取地址: https://platform.openai.com/api-keys
)

echo.
echo 🚀 启动选项：
echo 1. 启动开发服务器 (npm run dev)
echo 2. 启动生产服务器 (npm start)
echo 3. 生成文章 (npm run generate)
echo 4. 仅启动静态网站
echo.

set /p choice="请选择 (1-4): "

if "%choice%"=="1" (
    echo 🔧 启动开发服务器...
    call npm run dev
) else if "%choice%"=="2" (
    echo 🚀 启动生产服务器...
    call npm start
) else if "%choice%"=="3" (
    echo 📝 开始生成文章...
    call npm run generate
) else if "%choice%"=="4" (
    echo 🌐 启动静态网站...
    python --version >nul 2>&1
    if %errorlevel% equ 0 (
        python -m http.server 8000
    ) else (
        echo ❌ Python 未安装，无法启动静态服务器
        echo 💡 请安装 Python 或使用其他 HTTP 服务器
    )
) else (
    echo ❌ 无效选择
)

pause
