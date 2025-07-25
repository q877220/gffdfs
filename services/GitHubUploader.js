import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';

export class GitHubUploader {
  constructor() {
    this.token = process.env.GITHUB_TOKEN;
    this.repo = process.env.GITHUB_REPO || 'q877220/gffdfs';
    this.branch = process.env.GITHUB_BRANCH || 'main';
    this.apiBase = 'https://api.github.com';
  }

  async pushToGitHub(commitMessage, files) {
    if (!this.token) {
      console.warn('⚠️ GitHub token未配置，跳过推送');
      return;
    }

    try {
      console.log('📤 开始推送到GitHub...');
      
      // 获取最新commit SHA
      const latestCommit = await this.getLatestCommit();
      
      // 获取tree SHA
      const baseTree = latestCommit.commit.tree.sha;
      
      // 创建新的tree
      const tree = await this.createTree(baseTree, files);
      
      // 创建新的commit
      const commit = await this.createCommit(commitMessage, tree.sha, latestCommit.sha);
      
      // 更新分支引用
      await this.updateBranch(commit.sha);
      
      console.log('✅ 成功推送到GitHub');
      return commit;
      
    } catch (error) {
      console.error('❌ GitHub推送失败:', error.message);
      throw error;
    }
  }

  async getLatestCommit() {
    const response = await axios.get(
      `${this.apiBase}/repos/${this.repo}/commits/${this.branch}`,
      {
        headers: {
          'Authorization': `token ${this.token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );
    return response.data;
  }

  async createTree(baseTreeSha, files) {
    const tree = files.map(file => ({
      path: file.path,
      mode: '100644',
      type: 'blob',
      content: file.content
    }));

    const response = await axios.post(
      `${this.apiBase}/repos/${this.repo}/git/trees`,
      {
        base_tree: baseTreeSha,
        tree: tree
      },
      {
        headers: {
          'Authorization': `token ${this.token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );
    
    return response.data;
  }

  async createCommit(message, treeSha, parentSha) {
    const response = await axios.post(
      `${this.apiBase}/repos/${this.repo}/git/commits`,
      {
        message: message,
        tree: treeSha,
        parents: [parentSha]
      },
      {
        headers: {
          'Authorization': `token ${this.token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );
    
    return response.data;
  }

  async updateBranch(commitSha) {
    const response = await axios.patch(
      `${this.apiBase}/repos/${this.repo}/git/refs/heads/${this.branch}`,
      {
        sha: commitSha
      },
      {
        headers: {
          'Authorization': `token ${this.token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );
    
    return response.data;
  }

  // 批量上传文章文件
  async uploadArticleFiles(articles) {
    const files = [];
    
    // 创建articles数据文件
    files.push({
      path: 'data/articles.json',
      content: JSON.stringify(articles, null, 2)
    });
    
    // 为每篇文章创建独立的Markdown文件
    articles.forEach((article, index) => {
      const filename = `article-${article.id || Date.now() + index}.md`;
      const markdownContent = this.generateMarkdownContent(article);
      
      files.push({
        path: `articles/${filename}`,
        content: markdownContent
      });
    });
    
    // 更新文章索引
    const indexContent = this.generateArticleIndex(articles);
    files.push({
      path: 'articles/index.md',
      content: indexContent
    });
    
    return await this.pushToGitHub('🤖 自动生成新文章', files);
  }

  generateMarkdownContent(article) {
    return `---
title: "${article.title}"
date: "${article.timestamp}"
category: "${article.category}"
tags: [${article.tags?.map(tag => `"${tag}"`).join(', ') || ''}]
emoji: "${article.emoji}"
readTime: ${article.readTime}
---

# ${article.title}

> ${article.summary}

${article.content}

---

**标签:** ${article.tags?.join(', ') || ''}  
**阅读时间:** ${article.readTime} 分钟  
**发布时间:** ${new Date(article.timestamp).toLocaleString('zh-CN')}
`;
  }

  generateArticleIndex(articles) {
    const sortedArticles = articles
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 100); // 只显示最新100篇

    let indexContent = `# 文章索引

> 自动生成的文章列表，共 ${articles.length} 篇文章

`;

    sortedArticles.forEach((article, index) => {
      const date = new Date(article.timestamp).toLocaleDateString('zh-CN');
      indexContent += `## ${index + 1}. ${article.title}

- **分类:** ${article.category}
- **发布时间:** ${date}
- **阅读时间:** ${article.readTime} 分钟
- **摘要:** ${article.summary}
- **标签:** ${article.tags?.join(', ') || ''}

---

`;
    });

    indexContent += `\n_最后更新: ${new Date().toLocaleString('zh-CN')}_`;
    
    return indexContent;
  }

  // 更新主页文章展示
  async updateIndexWithArticles(articles) {
    try {
      // 读取当前index.html
      const indexPath = path.resolve('index.html');
      let htmlContent = await fs.readFile(indexPath, 'utf-8');
      
      // 生成文章卡片HTML
      const articleCards = articles.slice(0, 12).map(article => `
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
      const blogGridStart = htmlContent.indexOf('<div class="blog-grid">');
      const blogGridEnd = htmlContent.indexOf('</div>', blogGridStart) + 6;
      
      if (blogGridStart !== -1 && blogGridEnd !== -1) {
        const beforeGrid = htmlContent.substring(0, blogGridStart);
        const afterGrid = htmlContent.substring(blogGridEnd);
        
        htmlContent = beforeGrid + 
          `<div class="blog-grid">${articleCards}</div>` + 
          afterGrid;
        
        // 推送更新的HTML文件
        return await this.pushToGitHub('🔄 更新博客主页文章展示', [
          { path: 'index.html', content: htmlContent }
        ]);
      }
    } catch (error) {
      console.error('更新主页失败:', error);
      throw error;
    }
  }

  // 创建GitHub Pages配置
  async setupGitHubPages() {
    const workflowContent = `name: Auto Deploy AI Articles

on:
  push:
    branches: [ main ]
    paths: 
      - 'data/articles.json'
      - 'articles/**'
      - 'index.html'
  schedule:
    # 每5分钟检查一次新文章
    - cron: '*/5 * * * *'

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Generate articles if needed
      env:
        OPENAI_API_KEY: \${{ secrets.OPENAI_API_KEY }}
        GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
      run: npm run generate
      
    - name: Setup Pages
      uses: actions/configure-pages@v4
      
    - name: Upload artifact
      uses: actions/upload-pages-artifact@v3
      with:
        path: '.'
        
    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v4`;

    return await this.pushToGitHub('🚀 设置自动部署工作流', [
      { path: '.github/workflows/auto-deploy.yml', content: workflowContent }
    ]);
  }
}
