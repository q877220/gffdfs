// 导航菜单切换
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger?.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 滚动时头部样式变化
const header = document.querySelector('.header');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
    
    lastScrollY = currentScrollY;
});

// 滚动到顶部按钮
const scrollToTopBtn = document.querySelector('.scroll-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.style.opacity = '0.8';
        scrollToTopBtn.style.visibility = 'visible';
    } else {
        scrollToTopBtn.style.opacity = '0';
        scrollToTopBtn.style.visibility = 'hidden';
    }
});

// 联系表单处理
const contactForm = document.querySelector('.contact-form');

contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // 获取表单数据
    const formData = new FormData(contactForm);
    const name = formData.get('name') || e.target.querySelector('input[type="text"]').value;
    const email = formData.get('email') || e.target.querySelector('input[type="email"]').value;
    const message = formData.get('message') || e.target.querySelector('textarea').value;
    
    // 这里可以添加发送邮件的逻辑
    // 目前只是显示一个提示
    alert('感谢您的消息！我会尽快回复您。');
    
    // 重置表单
    contactForm.reset();
});

// 博客卡片动画
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// 观察所有博客卡片
document.querySelectorAll('.blog-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// 技能标签动画
document.querySelectorAll('.skill').forEach((skill, index) => {
    skill.style.opacity = '0';
    skill.style.transform = 'translateY(20px)';
    skill.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(skill);
});

// 主题切换功能（可选）
let isDarkMode = false;

function toggleTheme() {
    isDarkMode = !isDarkMode;
    const root = document.documentElement;
    
    if (isDarkMode) {
        root.style.setProperty('--bg-color', '#1a1a1a');
        root.style.setProperty('--bg-secondary', '#2d2d2d');
        root.style.setProperty('--text-color', '#ffffff');
        root.style.setProperty('--text-light', '#cccccc');
        root.style.setProperty('--border-color', '#404040');
    } else {
        root.style.setProperty('--bg-color', '#ffffff');
        root.style.setProperty('--bg-secondary', '#f8fafc');
        root.style.setProperty('--text-color', '#333333');
        root.style.setProperty('--text-light', '#666666');
        root.style.setProperty('--border-color', '#e2e8f0');
    }
    
    localStorage.setItem('darkMode', isDarkMode);
}

// 加载保存的主题设置
const savedTheme = localStorage.getItem('darkMode');
if (savedTheme === 'true') {
    toggleTheme();
}

// 性能优化：防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 优化滚动事件处理
const handleScroll = debounce(() => {
    const currentScrollY = window.scrollY;
    
    // 头部样式变化
    if (currentScrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
    
    // 滚动到顶部按钮
    if (currentScrollY > 300) {
        scrollToTopBtn.style.opacity = '0.8';
        scrollToTopBtn.style.visibility = 'visible';
    } else {
        scrollToTopBtn.style.opacity = '0';
        scrollToTopBtn.style.visibility = 'hidden';
    }
}, 10);

window.addEventListener('scroll', handleScroll);

// 打字机效果（可选）
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', () => {
    // 检查是否支持Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    }
    
    // 添加页面加载动画
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// 错误处理
window.addEventListener('error', (event) => {
    console.error('页面错误:', event.error);
});

// 页面可见性变化处理
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.title = '👋 欢迎回来！- 我的博客';
    } else {
        document.title = '我的个性博客';
    }
});

// AI文章生成功能
class AIArticleManager {
    constructor() {
        this.apiBase = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '';
        this.isGenerating = false;
        this.autoGenerationEnabled = false;
        this.articles = [];
        this.keywords = [];
        
        this.initializeElements();
        this.bindEvents();
        this.loadInitialData();
    }
    
    initializeElements() {
        this.elements = {
            autoToggle: document.getElementById('auto-generation'),
            generateBtn: document.getElementById('generate-articles'),
            getKeywordsBtn: document.getElementById('get-hot-keywords'),
            customKeywords: document.getElementById('custom-keywords'),
            articleCountInput: document.getElementById('article-count-input'),
            generationStatus: document.getElementById('generation-status'),
            articleCount: document.getElementById('article-count'),
            keywordsList: document.getElementById('keywords-list'),
            progressFill: document.getElementById('progress-fill'),
            progressText: document.getElementById('progress-text'),
            latestArticles: document.getElementById('latest-articles')
        };
    }
    
    bindEvents() {
        this.elements.autoToggle?.addEventListener('change', (e) => {
            this.toggleAutoGeneration(e.target.checked);
        });
        
        this.elements.generateBtn?.addEventListener('click', () => {
            this.generateArticles();
        });
        
        this.elements.getKeywordsBtn?.addEventListener('click', () => {
            this.loadHotKeywords();
        });
    }
    
    async loadInitialData() {
        try {
            await this.loadHotKeywords();
            await this.loadArticles();
            this.updateUI();
        } catch (error) {
            console.error('初始化数据加载失败:', error);
        }
    }
    
    async loadHotKeywords() {
        try {
            this.updateStatus('获取热点关键词...');
            
            // 尝试从API获取，如果失败则使用默认关键词
            let keywords;
            try {
                const response = await fetch(`${this.apiBase}/api/keywords`);
                const data = await response.json();
                keywords = data.success ? data.keywords : this.getDefaultKeywords();
            } catch {
                keywords = this.getDefaultKeywords();
            }
            
            this.keywords = keywords;
            this.displayKeywords();
            this.updateStatus('就绪');
            
        } catch (error) {
            console.error('获取热点关键词失败:', error);
            this.keywords = this.getDefaultKeywords();
            this.displayKeywords();
        }
    }
    
    getDefaultKeywords() {
        return [
            'AI人工智能', 'ChatGPT应用', '前端开发', '后端架构', 'React最佳实践',
            'Vue.js进阶', 'JavaScript新特性', 'TypeScript开发', 'Node.js性能',
            'Python机器学习', '云原生技术', 'DevOps实践', '微服务架构', '容器化部署',
            '性能优化', '代码质量', '技术管理', '开源项目', '编程思维', '职业发展'
        ];
    }
    
    displayKeywords() {
        if (!this.elements.keywordsList) return;
        
        this.elements.keywordsList.innerHTML = this.keywords
            .slice(0, 20)
            .map(keyword => `<span class="keyword-tag" data-keyword="${keyword}">${keyword}</span>`)
            .join('');
        
        // 添加关键词点击事件
        this.elements.keywordsList.querySelectorAll('.keyword-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                const keyword = tag.dataset.keyword;
                this.elements.customKeywords.value = keyword;
            });
        });
    }
    
    async loadArticles() {
        try {
            // 尝试从API加载文章
            try {
                const response = await fetch(`${this.apiBase}/api/articles`);
                const data = await response.json();
                this.articles = data.success ? data.articles : [];
            } catch {
                // 如果API不可用，尝试从本地文件加载
                try {
                    const response = await fetch('./data/articles.json');
                    this.articles = await response.json();
                } catch {
                    this.articles = [];
                }
            }
            
            this.displayLatestArticles();
            
        } catch (error) {
            console.error('加载文章失败:', error);
            this.articles = [];
        }
    }
    
    displayLatestArticles() {
        if (!this.elements.latestArticles) return;
        
        const latestArticles = this.articles.slice(0, 6);
        
        this.elements.latestArticles.innerHTML = latestArticles
            .map(article => `
                <div class="mini-article-card">
                    <h4>${article.title}</h4>
                    <p>${article.summary || '暂无摘要'}</p>
                    <div class="mini-article-meta">
                        <span>${article.category || '技术'}</span>
                        <span>${this.formatDate(article.timestamp)}</span>
                    </div>
                </div>
            `).join('');
    }
    
    async generateArticles() {
        if (this.isGenerating) return;
        
        try {
            this.isGenerating = true;
            this.updateGenerateButton(true);
            
            const count = parseInt(this.elements.articleCountInput.value) || 10;
            const customKeywords = this.elements.customKeywords.value
                .split(',')
                .map(k => k.trim())
                .filter(k => k);
            
            this.updateStatus(`正在生成 ${count} 篇文章...`);
            this.updateProgress(0, '准备生成...');
            
            // 模拟生成过程（在实际环境中这里会调用API）
            await this.simulateGeneration(count, customKeywords);
            
        } catch (error) {
            console.error('生成文章失败:', error);
            this.updateStatus('生成失败');
            alert('生成文章失败: ' + error.message);
        } finally {
            this.isGenerating = false;
            this.updateGenerateButton(false);
            this.updateProgress(0, '等待开始...');
        }
    }
    
    async simulateGeneration(count, customKeywords) {
        // 模拟文章生成过程
        const keywords = customKeywords.length > 0 ? customKeywords : this.keywords;
        const newArticles = [];
        
        for (let i = 0; i < count; i++) {
            const progress = ((i + 1) / count) * 100;
            const keyword = keywords[i % keywords.length];
            
            this.updateProgress(progress, `生成第 ${i + 1}/${count} 篇: ${keyword}`);
            
            // 模拟文章数据
            const article = {
                id: Date.now() + i,
                title: `${keyword}：深度解析与实践指南`,
                category: this.getRandomCategory(),
                emoji: this.getRandomEmoji(),
                summary: `本文深入探讨${keyword}的相关技术和实践经验，为开发者提供全面的指导和建议。`,
                content: `# ${keyword}：深度解析与实践指南\n\n这是一篇关于${keyword}的详细文章...`,
                readTime: Math.floor(Math.random() * 10) + 3,
                timestamp: new Date().toISOString(),
                keyword,
                tags: [keyword, '技术', '实践', '指南']
            };
            
            newArticles.push(article);
            
            // 模拟生成延迟
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // 更新文章列表
        this.articles = [...newArticles, ...this.articles];
        this.displayLatestArticles();
        this.updateArticleCount();
        
        this.updateStatus(`成功生成 ${count} 篇文章`);
        
        // 3秒后重置状态
        setTimeout(() => {
            this.updateStatus('就绪');
        }, 3000);
    }
    
    toggleAutoGeneration(enabled) {
        this.autoGenerationEnabled = enabled;
        
        if (enabled) {
            this.updateStatus('自动生成已启用');
            // 模拟自动生成（每5分钟）
            this.autoGenerationTimer = setInterval(() => {
                if (!this.isGenerating) {
                    this.generateArticles();
                }
            }, 5 * 60 * 1000); // 5分钟
        } else {
            this.updateStatus('自动生成已禁用');
            if (this.autoGenerationTimer) {
                clearInterval(this.autoGenerationTimer);
            }
        }
    }
    
    updateStatus(status) {
        if (this.elements.generationStatus) {
            this.elements.generationStatus.textContent = status;
        }
    }
    
    updateProgress(percent, text) {
        if (this.elements.progressFill) {
            this.elements.progressFill.style.width = percent + '%';
        }
        if (this.elements.progressText) {
            this.elements.progressText.textContent = text;
        }
    }
    
    updateGenerateButton(generating) {
        if (this.elements.generateBtn) {
            if (generating) {
                this.elements.generateBtn.innerHTML = '<span class="loading"></span> 生成中...';
                this.elements.generateBtn.disabled = true;
            } else {
                this.elements.generateBtn.innerHTML = '立即生成';
                this.elements.generateBtn.disabled = false;
            }
        }
    }
    
    updateArticleCount() {
        if (this.elements.articleCount) {
            this.elements.articleCount.textContent = `已生成: ${this.articles.length} 篇`;
        }
    }
    
    updateUI() {
        this.updateArticleCount();
    }
    
    formatDate(timestamp) {
        return new Date(timestamp).toLocaleDateString('zh-CN');
    }
    
    getRandomCategory() {
        const categories = ['技术前沿', '开发实践', '架构设计', '工具推荐', '经验分享'];
        return categories[Math.floor(Math.random() * categories.length)];
    }
    
    getRandomEmoji() {
        const emojis = ['🚀', '💡', '🔥', '⚡', '🌟', '🎯', '💻', '📱'];
        return emojis[Math.floor(Math.random() * emojis.length)];
    }
}

// 全局文章阅读功能
window.readFullArticle = function(articleId) {
    // 这里可以实现文章详情展示
    alert(`阅读文章 ID: ${articleId}`);
};

// 重新定义页面初始化
document.addEventListener('DOMContentLoaded', () => {
    // 检查是否支持Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    }
    
    // 初始化AI文章管理器
    window.aiManager = new AIArticleManager();
    
    // 添加页面加载动画
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});
