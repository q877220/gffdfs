# 🤖 AI智能博客生成器

一个集成了AI自动写作功能的现代化静态个人博客，支持自动获取热点关键词并生成高质量文章。

## 🌟 核心特性

### 🎯 AI自动写作
- **智能文章生成**: 基于OpenAI GPT模型自动生成高质量技术文章
- **热点关键词获取**: 自动抓取微博、百度等平台的热搜关键词
- **批量生成**: 支持一次生成多篇文章（默认10篇）
- **定时生成**: 每5分钟自动生成新文章
- **自动推送**: 生成后自动推送到GitHub并部署

### � 现代化界面
- **响应式设计**: 完美适配桌面、平板和移动设备
- **现代化UI**: 使用 CSS Grid 和 Flexbox 布局
- **平滑动画**: 丰富的 CSS 动画和过渡效果
- **PWA 支持**: 支持离线访问和添加到主屏幕
- **AI控制面板**: 可视化的文章生成管理界面

### ⚡ 性能优化
- **Service Worker**: 智能缓存和离线支持
- **懒加载**: 图片和内容的懒加载优化
- **SEO 友好**: 语义化 HTML 和 meta 标签优化
- **GitHub Actions**: 自动化部署流程

## 📁 项目结构

```
.
├── index.html              # 主页面（含AI管理界面）
├── styles.css              # 样式文件（含AI组件样式）
├── script.js               # 前端脚本（含AI管理器）
├── server.js               # Express服务器
├── package.json            # 依赖配置
├── .env.example            # 环境变量模板
├── start.bat/start.sh      # 启动脚本
├── services/               # 后端服务
│   ├── ArticleGenerator.js # AI文章生成服务
│   ├── KeywordExtractor.js # 热点关键词提取
│   └── GitHubUploader.js   # GitHub自动上传
├── scripts/                # 工具脚本
│   └── generateArticles.js # 文章生成脚本
├── data/                   # 数据存储
│   └── articles.json       # 生成的文章数据
├── .github/workflows/      # GitHub Actions
│   ├── deploy.yml          # 静态部署工作流
│   └── auto-deploy.yml     # AI自动部署工作流
└── articles/               # 生成的文章文件
```

## 🚀 快速开始

### 方法一：自动启动（推荐）

**Windows用户:**
```bash
# 双击运行或在命令行执行
start.bat
```

**Linux/Mac用户:**
```bash
# 给脚本执行权限
chmod +x start.sh
# 运行启动脚本
./start.sh
```

### 方法二：手动启动

1. **克隆仓库**
```bash
git clone https://github.com/q877220/gffdfs.git
cd gffdfs
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**
```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，添加必要配置
# 最重要的是 OPENAI_API_KEY
```

4. **启动服务**

**开发模式（推荐）:**
```bash
npm run dev
```

**生产模式:**
```bash
npm start
```

**仅生成文章:**
```bash
npm run generate
```

**静态模式（无AI功能）:**
```bash
python -m http.server 8000
# 或使用任何静态文件服务器
```

## 🔧 环境配置

### 必需配置
- `OPENAI_API_KEY`: OpenAI API密钥（必须）
  - 获取地址: https://platform.openai.com/api-keys

### 可选配置
- `GITHUB_TOKEN`: GitHub个人访问令牌（用于自动推送）
- `PORT`: 服务器端口（默认3000）
- `ARTICLES_PER_BATCH`: 每批生成文章数量（默认10）
- `GENERATE_INTERVAL_MINUTES`: 自动生成间隔（默认5分钟）

### 示例配置
```bash
OPENAI_API_KEY=sk-your-openai-api-key
GITHUB_TOKEN=ghp_your-github-token
PORT=3000
ARTICLES_PER_BATCH=10
GENERATE_INTERVAL_MINUTES=5
AUTO_PUSH_ENABLED=true
```

## 🎯 使用指南

### AI写作功能

1. **访问AI控制面板**
   - 打开博客网站
   - 点击导航栏中的"AI写作"
   
2. **获取热点关键词**
   - 点击"获取热点"按钮
   - 系统会自动获取当前热门话题
   
3. **生成文章**
   - 选择生成数量（1-50篇）
   - 可选：自定义关键词
   - 点击"立即生成"
   
4. **自动模式**
   - 开启"自动生成"开关
   - 系统每5分钟自动生成10篇文章

### 命令行工具

```bash
# 生成10篇文章
node scripts/generateArticles.js generate 10

# 生成单篇文章
node scripts/generateArticles.js single "Vue.js最佳实践"

# 启动定时生成
node scripts/generateArticles.js schedule

# 查看统计信息
node scripts/generateArticles.js stats
```

## � 部署指南

### GitHub Pages 自动部署

1. **推送代码到GitHub**
```bash
git add .
git commit -m "🤖 添加AI写作功能"
git push origin main
```

2. **配置GitHub Secrets**
   - 仓库设置 → Secrets → Actions
   - 添加 `OPENAI_API_KEY`
   - 添加 `GITHUB_TOKEN`（可选）

3. **启用GitHub Pages**
   - 仓库设置 → Pages
   - 选择 "GitHub Actions" 作为源

### 其他部署选项

**Vercel:**
```bash
# 安装Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

**Netlify:**
- 连接GitHub仓库
- 构建命令: `npm run build`（如需要）
- 发布目录: 根目录

## 🎨 自定义配置

### 修改AI模型
在 `.env` 文件中：
```bash
AI_MODEL=gpt-4  # 使用GPT-4（需要API访问权限）
MAX_TOKENS=3000  # 增加最大令牌数
TEMPERATURE=0.8  # 调整创造性（0-1）
```

### 自定义关键词来源
```bash
KEYWORD_SOURCES=weibo,baidu,zhihu,github  # 添加或移除来源
```

### 修改生成频率
```bash
GENERATE_INTERVAL_MINUTES=10  # 改为每10分钟
ARTICLES_PER_BATCH=5         # 每次生成5篇
```

## � 功能详解

### AI文章生成流程
1. **关键词获取**: 从多个平台抓取热点关键词
2. **文章结构**: AI生成文章大纲和结构
3. **内容生成**: 基于关键词和结构生成完整文章
4. **后处理**: 添加元数据、计算阅读时间等
5. **存储推送**: 保存到本地并推送到GitHub

### 关键词来源
- **微博热搜**: 实时社会热点
- **百度热搜**: 搜索趋势数据
- **知乎热榜**: 知识分享热点
- **GitHub趋势**: 技术项目趋势
- **技术关键词库**: 预设技术词汇

### 文章质量控制
- **内容长度**: 1500-2500字
- **SEO优化**: 自动生成meta描述和关键词
- **可读性**: 包含代码示例和实际案例
- **分类标签**: 自动分类和标签生成

## � 监控与统计

访问 `/api/stats` 查看：
- 总文章数量
- 今日生成数量
- 分类统计
- 生成状态

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

MIT License - 查看 [LICENSE](LICENSE) 文件了解详情

## 🆘 常见问题

**Q: OpenAI API调用失败**
A: 检查API密钥是否正确，账户是否有足够余额

**Q: 热点关键词获取失败**
A: 系统会自动使用默认技术关键词库

**Q: 自动推送失败**
A: 检查GitHub Token权限和仓库配置

**Q: 生成的文章质量不好**
A: 调整TEMPERATURE参数或使用更高级的AI模型

## 📞 联系支持

- 📧 邮箱: your-email@example.com
- 🐙 GitHub: [问题反馈](https://github.com/q877220/gffdfs/issues)
- 💬 讨论: [GitHub Discussions](https://github.com/q877220/gffdfs/discussions)

---

⭐ 如果这个项目对你有帮助，请给它一个 star！
🤖 体验AI自动写作的魅力，让技术博客自动生长！
