import OpenAI from 'openai';
import natural from 'natural';

export class ArticleGenerator {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    this.categories = [
      '科技前沿', '人工智能', '编程开发', '互联网资讯', 
      '数字生活', '创业故事', '产品分析', '行业观察',
      '技术教程', '工具推荐', '趋势分析', '深度思考'
    ];
    
    this.emojis = [
      '🚀', '💡', '🔥', '⚡', '🌟', '🎯', '💻', '📱',
      '🛠️', '🎨', '📊', '🔍', '🎪', '🌈', '🚪', '🔮'
    ];
  }

  async generateArticle(keyword) {
    try {
      // 生成文章结构
      const structure = await this.generateStructure(keyword);
      
      // 生成完整文章内容
      const content = await this.generateContent(keyword, structure);
      
      // 生成摘要
      const summary = await this.generateSummary(content);
      
      // 计算阅读时间
      const readTime = this.calculateReadTime(content);
      
      return {
        title: structure.title,
        category: this.getRandomCategory(),
        emoji: this.getRandomEmoji(),
        summary,
        content,
        readTime,
        tags: structure.tags,
        seo: {
          metaDescription: summary,
          keywords: [keyword, ...structure.tags]
        }
      };
    } catch (error) {
      console.error('生成文章失败:', error);
      throw error;
    }
  }

  async generateStructure(keyword) {
    const prompt = `
请为关键词"${keyword}"生成一篇技术博客文章的结构，要求：
1. 文章标题要吸引人且SEO友好
2. 提供5个相关标签
3. 给出文章大纲（3-5个主要部分）

请以JSON格式回复：
{
  "title": "文章标题",
  "tags": ["标签1", "标签2", "标签3", "标签4", "标签5"],
  "outline": [
    "引言：介绍${keyword}的重要性",
    "主体部分1：...",
    "主体部分2：...",
    "主体部分3：...",
    "结论：总结和展望"
  ]
}
`;

    const response = await this.openai.chat.completions.create({
      model: process.env.AI_MODEL || 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.7
    });

    try {
      return JSON.parse(response.choices[0].message.content);
    } catch (parseError) {
      // 如果JSON解析失败，返回默认结构
      return {
        title: `${keyword}：技术趋势与实践分析`,
        tags: [keyword, '技术', '分析', '趋势', '实践'],
        outline: [
          `引言：${keyword}的现状和重要性`,
          `${keyword}的核心技术原理`,
          `${keyword}的实际应用场景`,
          `${keyword}的发展趋势与挑战`,
          `总结与思考`
        ]
      };
    }
  }

  async generateContent(keyword, structure) {
    const prompt = `
请根据以下信息写一篇高质量的技术博客文章：

标题：${structure.title}
关键词：${keyword}
大纲：${structure.outline.join('\n')}

要求：
1. 文章长度1500-2500字
2. 内容专业且通俗易懂
3. 包含实际案例和见解
4. 使用Markdown格式
5. 包含适当的代码示例（如果适用）
6. 语言风格现代化、有趣味性

请开始写作：
`;

    const response = await this.openai.chat.completions.create({
      model: process.env.AI_MODEL || 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: parseInt(process.env.MAX_TOKENS) || 2000,
      temperature: parseFloat(process.env.TEMPERATURE) || 0.7
    });

    return response.choices[0].message.content;
  }

  async generateSummary(content) {
    const prompt = `
请为以下文章生成一个简洁的摘要（100-150字）：

${content.substring(0, 1000)}...

摘要要求：
1. 突出文章核心观点
2. 吸引读者阅读
3. 适合作为SEO描述
`;

    const response = await this.openai.chat.completions.create({
      model: process.env.AI_MODEL || 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
      temperature: 0.5
    });

    return response.choices[0].message.content.trim();
  }

  calculateReadTime(content) {
    const wordsPerMinute = 200; // 中文阅读速度
    const wordCount = content.length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return Math.max(1, readTime);
  }

  getRandomCategory() {
    return this.categories[Math.floor(Math.random() * this.categories.length)];
  }

  getRandomEmoji() {
    return this.emojis[Math.floor(Math.random() * this.emojis.length)];
  }

  // 批量生成文章
  async generateBatchArticles(keywords, count = 10) {
    const articles = [];
    const batchSize = 3; // 每批处理3篇文章
    
    for (let i = 0; i < count; i += batchSize) {
      const batch = [];
      const endIndex = Math.min(i + batchSize, count);
      
      for (let j = i; j < endIndex; j++) {
        const keyword = keywords[j % keywords.length];
        batch.push(this.generateArticle(keyword));
      }
      
      try {
        const batchResults = await Promise.all(batch);
        articles.push(...batchResults);
        console.log(`✅ 完成第 ${Math.floor(i/batchSize) + 1} 批文章生成`);
        
        // 批次间延迟，避免API限制
        if (endIndex < count) {
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      } catch (error) {
        console.error(`❌ 第 ${Math.floor(i/batchSize) + 1} 批文章生成失败:`, error);
      }
    }
    
    return articles;
  }
}
