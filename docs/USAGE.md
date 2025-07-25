# 🤖 AI博客使用指南

## 🚀 快速开始

### 1. 环境准备

**方法一：使用启动脚本（推荐）**
```bash
# Windows
start.bat

# Linux/Mac  
./start.sh
```

**方法二：手动启动**
```bash
# 安装依赖
npm install

# 配置环境变量（重要！）
cp .env.example .env
# 编辑 .env 文件，添加 OPENAI_API_KEY

# 启动服务
npm start
```

### 2. 获取OpenAI API Key

1. 访问 https://platform.openai.com/api-keys
2. 登录您的OpenAI账户
3. 创建新的API Key
4. 复制API Key到 `.env` 文件中

```bash
OPENAI_API_KEY=sk-your-api-key-here
```

## 🎯 功能使用

### AI写作控制面板

访问博客页面，点击导航栏中的"AI写作"即可看到：

1. **状态面板**
   - 当前生成状态
   - 已生成文章数量
   - 自动生成开关

2. **生成控制**
   - 自定义关键词输入
   - 生成数量设置（1-50篇）
   - 获取热点关键词
   - 立即生成按钮

3. **进度显示**
   - 实时生成进度
   - 当前处理的关键词
   - 完成状态提示

### 命令行操作

```bash
# 生成指定数量文章
npm run generate

# 或者直接使用脚本
node scripts/generateArticles.js generate 5

# 生成单篇文章
node scripts/generateArticles.js single "React最佳实践"

# 查看统计信息
node scripts/generateArticles.js stats
```

### API接口

**获取文章列表:**
```bash
curl http://localhost:3000/api/articles
```

**获取热点关键词:**
```bash
curl http://localhost:3000/api/keywords
```

**生成文章:**
```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"count": 5, "keywords": ["AI", "Vue.js"]}'
```

**查看状态:**
```bash
curl http://localhost:3000/api/status
```

## ⚙️ 配置选项

### 基础配置
```bash
# .env 文件
OPENAI_API_KEY=sk-xxx              # OpenAI API密钥（必需）
PORT=3000                          # 服务端口
AUTO_PUSH_ENABLED=true            # 是否自动推送到GitHub
```

### AI模型配置
```bash
AI_MODEL=gpt-3.5-turbo            # AI模型（gpt-3.5-turbo, gpt-4）
MAX_TOKENS=2000                   # 最大令牌数
TEMPERATURE=0.7                   # 创造性（0-1）
```

### 生成配置
```bash
ARTICLES_PER_BATCH=10             # 每批生成数量
GENERATE_INTERVAL_MINUTES=5       # 自动生成间隔（分钟）
```

### GitHub集成
```bash
GITHUB_TOKEN=ghp_xxx              # GitHub Personal Access Token
GITHUB_REPO=username/repo         # 仓库地址
GITHUB_BRANCH=main                # 推送分支
```

## 🔧 高级功能

### 自定义关键词来源

编辑 `services/KeywordExtractor.js` 添加新的关键词来源：

```javascript
// 添加新的数据源
this.sources.custom = {
    url: 'https://your-api.com/keywords',
    enabled: true
};
```

### 自定义文章模板

编辑 `services/ArticleGenerator.js` 修改文章生成模板：

```javascript
const prompt = `
请为关键词"${keyword}"生成一篇技术博客文章：
1. 标题要有吸引力
2. 内容要专业且实用
3. 包含代码示例
4. 字数在2000字左右
...您的自定义要求
`;
```

### 批量管理

```bash
# 批量生成不同主题的文章
node scripts/generateArticles.js generate 3
sleep 5
node scripts/generateArticles.js single "前端性能优化"
sleep 5  
node scripts/generateArticles.js single "后端架构设计"
```

## 📊 监控与维护

### 查看日志
```bash
# 实时查看服务器日志
tail -f server.log

# 查看错误日志
grep "ERROR" server.log
```

### 数据备份
```bash
# 备份文章数据
cp data/articles.json backup/articles_$(date +%Y%m%d).json

# 备份整个articles目录
tar -czf backup/articles_$(date +%Y%m%d).tar.gz articles/
```

### 性能优化

1. **API调用限制**
   - 调整生成间隔避免触发限制
   - 使用批处理减少API调用

2. **缓存策略**
   - 热点关键词缓存1小时
   - 文章内容本地存储

3. **错误处理**
   - API失败自动重试
   - 降级到默认关键词

## 🚨 故障排除

### 常见问题

**1. OpenAI API调用失败**
```bash
# 检查API Key
echo $OPENAI_API_KEY

# 测试API连接
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
  https://api.openai.com/v1/models
```

**2. 服务启动失败**
```bash
# 检查端口占用
netstat -ano | findstr :3000

# 清理并重新安装依赖
rm -rf node_modules package-lock.json
npm install
```

**3. 文章生成质量不佳**
```bash
# 调整AI参数
TEMPERATURE=0.5        # 降低随机性
MAX_TOKENS=3000       # 增加文章长度
AI_MODEL=gpt-4        # 使用更高级模型
```

**4. GitHub推送失败**
```bash
# 检查Token权限
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/user

# 检查仓库权限
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/username/repo
```

### 调试模式

启用调试输出：
```bash
DEBUG=true npm start
```

## 🔒 安全注意事项

1. **API Key保护**
   - 不要将API Key提交到公共仓库
   - 定期轮换API Key
   - 设置使用限额

2. **GitHub Token**
   - 使用最小权限原则
   - 定期检查Token使用情况
   - 启用Token过期时间

3. **服务器安全**
   - 不要在生产环境暴露调试信息
   - 使用HTTPS
   - 启用访问日志

## 📈 性能监控

### 关键指标
- API响应时间
- 文章生成成功率
- 内存使用情况
- 磁盘空间占用

### 监控命令
```bash
# 查看内存使用
free -h

# 查看磁盘使用
df -h

# 查看进程状态
ps aux | grep node

# 实时监控
htop
```

## 🎯 最佳实践

1. **内容质量**
   - 定期检查生成的文章质量
   - 调整prompt模板提高相关性
   - 人工审核重要文章

2. **SEO优化**
   - 确保文章标题有吸引力
   - 添加相关标签和分类
   - 优化文章摘要

3. **用户体验**
   - 保持页面加载速度
   - 优化移动端显示
   - 添加搜索功能

4. **运维管理**
   - 定期备份数据
   - 监控系统资源
   - 及时更新依赖包

---

💡 **提示**: 如果遇到问题，请查看项目的 [GitHub Issues](https://github.com/q877220/gffdfs/issues) 或创建新的issue寻求帮助。
