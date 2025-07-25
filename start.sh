#!/bin/bash

echo "🤖 AI博客生成器启动脚本"
echo "=========================="

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    exit 1
fi

# 检查npm是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装，请先安装 npm"
    exit 1
fi

echo "✅ Node.js 和 npm 已安装"

# 安装依赖
echo "📦 安装依赖包..."
npm install

# 检查.env文件
if [ ! -f ".env" ]; then
    echo "⚠️  .env 文件不存在，复制 .env.example 为 .env"
    cp .env.example .env
    echo "📝 请编辑 .env 文件，添加您的 OpenAI API Key 和其他配置"
    echo "🔑 OpenAI API Key 获取地址: https://platform.openai.com/api-keys"
fi

echo ""
echo "🚀 启动选项："
echo "1. 启动开发服务器 (npm run dev)"
echo "2. 启动生产服务器 (npm start)"
echo "3. 生成文章 (npm run generate)"
echo "4. 仅启动静态网站"
echo ""

read -p "请选择 (1-4): " choice

case $choice in
    1)
        echo "🔧 启动开发服务器..."
        npm run dev
        ;;
    2)
        echo "🚀 启动生产服务器..."
        npm start
        ;;
    3)
        echo "📝 开始生成文章..."
        npm run generate
        ;;
    4)
        echo "🌐 启动静态网站..."
        if command -v python3 &> /dev/null; then
            python3 -m http.server 8000
        elif command -v python &> /dev/null; then
            python -m http.server 8000
        else
            echo "❌ Python 未安装，无法启动静态服务器"
            echo "💡 请安装 Python 或使用其他 HTTP 服务器"
        fi
        ;;
    *)
        echo "❌ 无效选择"
        ;;
esac
