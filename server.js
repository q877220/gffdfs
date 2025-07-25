import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { ArticleGenerator } from './services/ArticleGenerator.js';
import { KeywordExtractor } from './services/KeywordExtractor.js';
import { GitHubUploader } from './services/GitHubUploader.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// 服务实例
const articleGenerator = new ArticleGenerator();
const keywordExtractor = new KeywordExtractor();
const githubUploader = new GitHubUploader();

// 存储生成的文章
let articles = [];
let isGenerating = false;

// API路由
app.get('/api/articles', (req, res) => {
  res.json({
    success: true,
    articles: articles.slice(0, 50), // 返回最新50篇
    total: articles.length
  });
});

app.get('/api/keywords', async (req, res) => {
  try {
    const keywords = await keywordExtractor.getHotKeywords();
    res.json({
      success: true,
      keywords
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/generate', async (req, res) => {
  if (isGenerating) {
    return res.json({
      success: false,
      message: '正在生成文章，请稍后...'
    });
  }

  try {
    isGenerating = true;
    const { count = 10, keywords = [] } = req.body;
    
    const newArticles = await generateArticles(count, keywords);
    articles = [...newArticles, ...articles];
    
    // 自动推送到GitHub
    if (process.env.AUTO_PUSH_ENABLED === 'true') {
      await updateBlogWithArticles(newArticles);
    }
    
    res.json({
      success: true,
      articles: newArticles,
      message: `成功生成 ${newArticles.length} 篇文章`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  } finally {
    isGenerating = false;
  }
});

app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    status: {
      isGenerating,
      totalArticles: articles.length,
      lastGenerated: articles[0]?.timestamp || null
    }
  });
});

// 生成文章的核心函数
async function generateArticles(count = 10, customKeywords = []) {
  console.log(`开始生成 ${count} 篇文章...`);
  
  // 获取热点关键词
  let keywords = customKeywords;
  if (keywords.length === 0) {
    keywords = await keywordExtractor.getHotKeywords();
  }
  
  const newArticles = [];
  
  for (let i = 0; i < count; i++) {
    try {
      const keyword = keywords[i % keywords.length];
      const article = await articleGenerator.generateArticle(keyword);
      
      newArticles.push({
        id: Date.now() + i,
        ...article,
        timestamp: new Date().toISOString(),
        keyword
      });
      
      console.log(`✅ 生成文章 ${i + 1}/${count}: ${article.title}`);
      
      // 避免API限制，添加延迟
      if (i < count - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error(`❌ 生成文章 ${i + 1} 失败:`, error.message);
    }
  }
  
  console.log(`🎉 成功生成 ${newArticles.length} 篇文章`);
  return newArticles;
}

// 更新博客页面
async function updateBlogWithArticles(newArticles) {
  try {
    // 读取当前的index.html
    const fs = await import('fs-extra');
    const indexPath = path.join(__dirname, 'index.html');
    let htmlContent = await fs.readFile(indexPath, 'utf-8');
    
    // 生成新的文章HTML
    const articlesHtml = newArticles.map(article => `
      <article class="blog-card" data-id="${article.id}">
        <div class="blog-image">
          <div class="placeholder-image">${article.emoji || '📝'}</div>
        </div>
        <div class="blog-content">
          <span class="blog-category">${article.category}</span>
          <h3>${article.title}</h3>
          <p>${article.summary}</p>
          <div class="blog-meta">
            <span class="blog-date">${new Date(article.timestamp).toLocaleDateString('zh-CN')}</span>
            <span class="read-time">${article.readTime} 分钟阅读</span>
          </div>
          <div class="blog-actions">
            <button onclick="readFullArticle('${article.id}')" class="read-more-btn">阅读全文</button>
          </div>
        </div>
      </article>
    `).join('');
    
    // 替换博客网格内容
    const blogGridRegex = /(<div class="blog-grid">)([\s\S]*?)(<\/div>)/;
    const match = htmlContent.match(blogGridRegex);
    
    if (match) {
      // 保留原有文章，添加新文章
      const existingArticles = match[2];
      const updatedContent = articlesHtml + existingArticles;
      htmlContent = htmlContent.replace(blogGridRegex, `$1${updatedContent}$3`);
      
      // 写入更新的HTML
      await fs.writeFile(indexPath, htmlContent, 'utf-8');
      
      // 推送到GitHub
      if (process.env.GITHUB_TOKEN) {
        await githubUploader.pushToGitHub('自动更新博客文章', [
          { path: 'index.html', content: htmlContent },
          { path: 'data/articles.json', content: JSON.stringify(articles, null, 2) }
        ]);
      }
    }
  } catch (error) {
    console.error('更新博客失败:', error);
  }
}

// 定时任务 - 每5分钟自动生成文章
cron.schedule('*/5 * * * *', async () => {
  if (!isGenerating && process.env.AUTO_PUSH_ENABLED === 'true') {
    console.log('🤖 开始定时生成文章...');
    try {
      const newArticles = await generateArticles(parseInt(process.env.ARTICLES_PER_BATCH) || 10);
      articles = [...newArticles, ...articles];
      await updateBlogWithArticles(newArticles);
      console.log('✅ 定时生成完成');
    } catch (error) {
      console.error('❌ 定时生成失败:', error);
    }
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 AI博客生成器启动成功!`);
  console.log(`📡 服务地址: http://localhost:${PORT}`);
  console.log(`🤖 自动生成: ${process.env.AUTO_PUSH_ENABLED === 'true' ? '已启用' : '已禁用'}`);
  console.log(`⏰ 生成间隔: ${process.env.GENERATE_INTERVAL_MINUTES || 5} 分钟`);
});

export default app;
