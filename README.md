# 我的个性博客

一个现代化的静态个人博客，使用纯 HTML、CSS 和 JavaScript 构建。

## 🌟 特性

- **响应式设计**: 完美适配桌面、平板和移动设备
- **现代化界面**: 使用 CSS Grid 和 Flexbox 布局
- **平滑动画**: 丰富的 CSS 动画和过渡效果
- **PWA 支持**: 支持离线访问和添加到主屏幕
- **性能优化**: 使用 Service Worker 缓存和懒加载
- **SEO 友好**: 语义化 HTML 和 meta 标签优化

## 📁 项目结构

```
.
├── index.html          # 主页面
├── styles.css          # 样式文件
├── script.js           # 交互脚本
├── manifest.json       # PWA 配置
├── sw.js              # Service Worker
└── README.md          # 项目说明
```

## 🚀 快速开始

1. 克隆仓库
```bash
git clone https://github.com/q877220/gffdfs.git
cd gffdfs
```

2. 使用本地服务器运行
```bash
# 使用 Python
python -m http.server 8000

# 使用 Node.js
npx serve .

# 使用 Live Server (VS Code 扩展)
# 右键点击 index.html 选择 "Open with Live Server"
```

3. 在浏览器中访问 `http://localhost:8000`

## 🎨 自定义

### 修改主题颜色
在 `styles.css` 中的 `:root` 选择器中修改 CSS 变量：

```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --accent-color: #f093fb;
    /* 更多颜色变量... */
}
```

### 添加新内容
- 编辑 `index.html` 添加新的博客文章
- 在 `styles.css` 中添加自定义样式
- 在 `script.js` 中添加交互功能

### 更新个人信息
1. 修改 `index.html` 中的个人介绍部分
2. 更新联系信息
3. 替换技能标签
4. 更新博客文章内容

## 📱 PWA 功能

该博客支持 Progressive Web App 功能：

- **离线访问**: 使用 Service Worker 缓存关键资源
- **安装应用**: 可以添加到主屏幕作为独立应用
- **快速加载**: 智能缓存策略提高加载速度

## 🔧 技术栈

- **HTML5**: 语义化标记
- **CSS3**: 现代化样式和动画
- **JavaScript ES6+**: 交互功能和 PWA 支持
- **Service Worker**: 离线缓存
- **Web App Manifest**: PWA 配置

## 📈 性能优化

- CSS 和 JavaScript 压缩
- 图片懒加载
- Service Worker 缓存
- 防抖动滚动事件处理
- Critical CSS 内联

## 🌐 部署

### GitHub Pages
1. 推送代码到 GitHub 仓库
2. 在仓库设置中启用 GitHub Pages
3. 选择主分支作为源

### Netlify
1. 连接 GitHub 仓库
2. 设置构建命令（无需构建步骤）
3. 设置发布目录为根目录

### Vercel
1. 导入 GitHub 仓库
2. 自动部署

## 📄 许可证

MIT License - 查看 [LICENSE](LICENSE) 文件了解详情

## 🤝 贡献

欢迎提交 Issues 和 Pull Requests！

## 📞 联系

- 邮箱: example@email.com
- GitHub: [@username](https://github.com/username)
- Twitter: [@username](https://twitter.com/username)

---

⭐ 如果这个项目对你有帮助，请给它一个 star！
