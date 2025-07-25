import dotenv from 'dotenv';
import { ArticleGenerator } from '../services/ArticleGenerator.js';
import { KeywordExtractor } from '../services/KeywordExtractor.js';
import { GitHubUploader } from '../services/GitHubUploader.js';
import fs from 'fs-extra';
import path from 'path';

// 加载环境变量
dotenv.config();

class ArticleGenerationScript {
  constructor() {
    this.articleGenerator = new ArticleGenerator();
    this.keywordExtractor = new KeywordExtractor();
    this.githubUploader = new GitHubUploader();
    this.dataDir = path.resolve('data');
    this.articlesFile = path.join(this.dataDir, 'articles.json');
  }

  async init() {
    // 确保数据目录存在
    await fs.ensureDir(this.dataDir);
    await fs.ensureDir(path.resolve('articles'));
    
    // 初始化文章数据文件
    if (!await fs.pathExists(this.articlesFile)) {
      await fs.writeJSON(this.articlesFile, [], { spaces: 2 });
    }
  }

  async loadExistingArticles() {
    try {
      return await fs.readJSON(this.articlesFile);
    } catch (error) {
      console.warn('加载现有文章失败，返回空数组');
      return [];
    }
  }

  async saveArticles(articles) {
    await fs.writeJSON(this.articlesFile, articles, { spaces: 2 });
  }

  async generateBatchArticles(count = 10) {
    console.log(`🚀 开始生成 ${count} 篇文章...`);
    console.log('⏰ 开始时间:', new Date().toLocaleString('zh-CN'));
    
    try {
      // 获取热点关键词
      const keywords = await this.keywordExtractor.getHotKeywords();
      console.log(`📝 获取到 ${keywords.length} 个关键词:`, keywords.slice(0, 10));
      
      // 加载现有文章
      const existingArticles = await this.loadExistingArticles();
      console.log(`📚 当前已有 ${existingArticles.length} 篇文章`);
      
      // 生成新文章
      const newArticles = [];
      
      for (let i = 0; i < count; i++) {
        try {
          const keyword = keywords[i % keywords.length];
          console.log(`📝 正在生成第 ${i + 1}/${count} 篇文章，关键词: ${keyword}`);
          
          const article = await this.articleGenerator.generateArticle(keyword);
          
          const fullArticle = {
            id: Date.now() + i,
            ...article,
            timestamp: new Date().toISOString(),
            keyword,
            status: 'published'
          };
          
          newArticles.push(fullArticle);
          console.log(`✅ 完成: ${article.title}`);
          
          // 避免API限制
          if (i < count - 1) {
            console.log('⏳ 等待2秒避免API限制...');
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        } catch (error) {
          console.error(`❌ 生成第 ${i + 1} 篇文章失败:`, error.message);
        }
      }
      
      // 合并文章列表
      const allArticles = [...newArticles, ...existingArticles];
      
      // 保存到本地
      await this.saveArticles(allArticles);
      
      // 上传到GitHub
      if (process.env.GITHUB_TOKEN && newArticles.length > 0) {
        console.log('📤 开始上传到GitHub...');
        await this.githubUploader.uploadArticleFiles(newArticles);
        await this.githubUploader.updateIndexWithArticles(allArticles);
        console.log('✅ GitHub上传完成');
      }
      
      // 更新本地index.html
      await this.updateLocalIndex(allArticles);
      
      console.log('🎉 批量生成完成!');
      console.log(`📊 本次生成: ${newArticles.length} 篇`);
      console.log(`📊 总计文章: ${allArticles.length} 篇`);
      console.log('⏰ 结束时间:', new Date().toLocaleString('zh-CN'));
      
      return {
        newArticles,
        totalArticles: allArticles.length,
        success: true
      };
      
    } catch (error) {
      console.error('❌ 批量生成失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async updateLocalIndex(articles) {
    try {
      const indexPath = path.resolve('index.html');
      let htmlContent = await fs.readFile(indexPath, 'utf-8');
      
      // 生成最新的文章卡片
      const latestArticles = articles
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 12);
      
      const articleCards = latestArticles.map(article => `
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
          </article>`).join('');
      
      // 替换博客网格内容
      const blogGridRegex = /(<div class="blog-grid">)([\s\S]*?)(<\/div>)/;
      htmlContent = htmlContent.replace(blogGridRegex, `$1${articleCards}$3`);
      
      // 写入更新的HTML
      await fs.writeFile(indexPath, htmlContent, 'utf-8');
      console.log('✅ 本地index.html更新完成');
      
    } catch (error) {
      console.error('❌ 更新本地index.html失败:', error);
    }
  }

  async generateSingleArticle(keyword) {
    console.log(`📝 生成单篇文章，关键词: ${keyword}`);
    
    try {
      const article = await this.articleGenerator.generateArticle(keyword);
      
      const fullArticle = {
        id: Date.now(),
        ...article,
        timestamp: new Date().toISOString(),
        keyword,
        status: 'published'
      };
      
      // 加载现有文章
      const existingArticles = await this.loadExistingArticles();
      const allArticles = [fullArticle, ...existingArticles];
      
      // 保存到本地
      await this.saveArticles(allArticles);
      
      console.log(`✅ 文章生成完成: ${article.title}`);
      return fullArticle;
      
    } catch (error) {
      console.error('❌ 单篇文章生成失败:', error);
      throw error;
    }
  }

  async scheduleGeneration() {
    const interval = parseInt(process.env.GENERATE_INTERVAL_MINUTES) || 5;
    const batchSize = parseInt(process.env.ARTICLES_PER_BATCH) || 10;
    
    console.log(`⏰ 设置定时生成: 每 ${interval} 分钟生成 ${batchSize} 篇文章`);
    
    // 立即执行一次
    await this.generateBatchArticles(batchSize);
    
    // 设置定时器
    setInterval(async () => {
      console.log('🔄 定时生成开始...');
      await this.generateBatchArticles(batchSize);
    }, interval * 60 * 1000);
  }

  async getStats() {
    const articles = await this.loadExistingArticles();
    const today = new Date().toDateString();
    const todayArticles = articles.filter(article => 
      new Date(article.timestamp).toDateString() === today
    );
    
    const stats = {
      total: articles.length,
      today: todayArticles.length,
      categories: {},
      lastGenerated: articles[0]?.timestamp || null
    };
    
    // 统计分类
    articles.forEach(article => {
      const category = article.category || '未分类';
      stats.categories[category] = (stats.categories[category] || 0) + 1;
    });
    
    return stats;
  }
}

// 命令行参数处理
async function main() {
  const script = new ArticleGenerationScript();
  await script.init();
  
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'generate':
      const count = parseInt(args[1]) || 10;
      await script.generateBatchArticles(count);
      break;
      
    case 'single':
      const keyword = args[1] || '人工智能';
      await script.generateSingleArticle(keyword);
      break;
      
    case 'schedule':
      await script.scheduleGeneration();
      break;
      
    case 'stats':
      const stats = await script.getStats();
      console.log('📊 文章统计:', JSON.stringify(stats, null, 2));
      break;
      
    default:
      console.log(`
📝 AI文章生成器

使用方法:
  node scripts/generateArticles.js generate [数量]     # 生成指定数量文章 (默认10篇)
  node scripts/generateArticles.js single [关键词]     # 生成单篇文章
  node scripts/generateArticles.js schedule            # 启动定时生成
  node scripts/generateArticles.js stats               # 查看统计信息

示例:
  node scripts/generateArticles.js generate 5
  node scripts/generateArticles.js single "Vue.js最佳实践"
      `);
      break;
  }
}

// 如果直接运行此文件
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export default ArticleGenerationScript;
