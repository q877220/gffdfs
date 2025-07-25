// 全局变量
let isDarkTheme = localStorage.getItem('theme') === 'dark';
let customSites = JSON.parse(localStorage.getItem('customSites') || '[]');

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeSearch();
    initializeCustomSites();
    addAccessibilityFeatures();
    addKeyboardShortcuts();
});

// 主题切换功能
function initializeTheme() {
    if (isDarkTheme) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
}

function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    
    if (isDarkTheme) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    }
    
    // 添加切换动画效果
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
}

// 搜索功能
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    // 搜索按钮点击事件
    searchBtn.addEventListener('click', performSearch);
    
    // 回车键搜索
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // 实时搜索过滤
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        filterCards(query);
    });
}

function performSearch() {
    const query = document.getElementById('searchInput').value.trim();
    if (query) {
        // 默认使用Google搜索
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
    }
}

function filterCards(query) {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
        const description = card.querySelector('p')?.textContent.toLowerCase() || '';
        const isMatch = title.includes(query) || description.includes(query);
        
        if (query === '' || isMatch) {
            card.style.display = 'flex';
            card.style.opacity = '1';
        } else {
            card.style.display = 'none';
            card.style.opacity = '0.5';
        }
    });
    
    // 显示/隐藏空的章节
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const visibleCards = section.querySelectorAll('.card[style*="flex"]');
        if (query === '' || visibleCards.length > 0) {
            section.style.display = 'block';
        } else {
            section.style.display = 'none';
        }
    });
}

// 自定义网站管理
function initializeCustomSites() {
    displayCustomSites();
}

function displayCustomSites() {
    if (customSites.length === 0) return;
    
    // 创建自定义网站区段
    const mainContent = document.querySelector('.main-content');
    let customSection = document.getElementById('custom-sites');
    
    if (!customSection) {
        customSection = document.createElement('section');
        customSection.id = 'custom-sites';
        customSection.className = 'custom-sites';
        customSection.innerHTML = `
            <h2 class="section-title">我的网站</h2>
            <div class="cards-grid" id="custom-cards-grid"></div>
        `;
        mainContent.appendChild(customSection);
    }
    
    const customGrid = document.getElementById('custom-cards-grid');
    customGrid.innerHTML = '';
    
    customSites.forEach((site, index) => {
        const card = createSiteCard(site, index);
        customGrid.appendChild(card);
    });
}

function createSiteCard(site, index) {
    const card = document.createElement('a');
    card.href = site.url;
    card.target = '_blank';
    card.className = 'card custom-card';
    card.innerHTML = `
        <div class="card-icon">${site.icon || '🌐'}</div>
        <div class="card-info">
            <h3>${site.name}</h3>
            <p>${site.description || '自定义网站'}</p>
        </div>
        <button class="delete-btn" onclick="event.preventDefault(); deleteSite(${index})" title="删除网站">
            ×
        </button>
    `;
    
    return card;
}

function deleteSite(index) {
    if (confirm('确定要删除这个网站吗？')) {
        customSites.splice(index, 1);
        localStorage.setItem('customSites', JSON.stringify(customSites));
        displayCustomSites();
    }
}

// 模态框管理
function showAddSiteModal() {
    const modal = document.getElementById('addSiteModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // 聚焦到第一个输入框
    setTimeout(() => {
        document.getElementById('siteName').focus();
    }, 100);
}

function closeAddSiteModal() {
    const modal = document.getElementById('addSiteModal');
    modal.classList.remove('show');
    document.body.style.overflow = '';
    
    // 清空表单
    document.getElementById('addSiteForm').reset();
}

// 点击模态框外部关闭
document.getElementById('addSiteModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeAddSiteModal();
    }
});

// 添加网站表单处理
document.getElementById('addSiteForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const newSite = {
        name: document.getElementById('siteName').value.trim(),
        url: document.getElementById('siteUrl').value.trim(),
        description: document.getElementById('siteDescription').value.trim(),
        icon: document.getElementById('siteIcon').value.trim() || '🌐'
    };
    
    // 验证URL格式
    try {
        new URL(newSite.url);
    } catch {
        alert('请输入有效的网站地址');
        return;
    }
    
    // 添加到自定义网站列表
    customSites.push(newSite);
    localStorage.setItem('customSites', JSON.stringify(customSites));
    
    // 更新显示
    displayCustomSites();
    closeAddSiteModal();
    
    // 显示成功提示
    showToast('网站添加成功！');
});

// 提示消息功能
function showToast(message, type = 'success') {
    // 创建提示元素
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: var(--shadow-large);
        z-index: 1001;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // 3秒后自动移除
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// 可访问性功能
function addAccessibilityFeatures() {
    // 为所有链接添加键盘导航支持
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.setAttribute('tabindex', '0');
        card.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // 添加跳转到主要内容的链接
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = '跳转到主要内容';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-color);
        color: white;
        padding: 8px;
        border-radius: 4px;
        text-decoration: none;
        z-index: 1000;
        transition: top 0.3s;
    `;
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

// 键盘快捷键
function addKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K: 聚焦搜索框
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('searchInput').focus();
        }
        
        // Ctrl/Cmd + Shift + D: 切换主题
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
            e.preventDefault();
            toggleTheme();
        }
        
        // Ctrl/Cmd + Shift + A: 添加网站
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
            e.preventDefault();
            showAddSiteModal();
        }
        
        // Escape: 关闭模态框
        if (e.key === 'Escape') {
            closeAddSiteModal();
        }
    });
}

// 性能优化 - 图片懒加载
function addLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // 回退方案
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

// 统计功能
function trackSiteVisit(siteName) {
    let visits = JSON.parse(localStorage.getItem('siteVisits') || '{}');
    visits[siteName] = (visits[siteName] || 0) + 1;
    localStorage.setItem('siteVisits', JSON.stringify(visits));
}

// 导出/导入配置
function exportSettings() {
    const settings = {
        theme: localStorage.getItem('theme'),
        customSites: customSites,
        visits: JSON.parse(localStorage.getItem('siteVisits') || '{}')
    };
    
    const blob = new Blob([JSON.stringify(settings, null, 2)], {
        type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'navigation-settings.json';
    a.click();
    URL.revokeObjectURL(url);
}

function importSettings() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const settings = JSON.parse(e.target.result);
                
                // 导入设置
                if (settings.theme) {
                    localStorage.setItem('theme', settings.theme);
                }
                if (settings.customSites) {
                    customSites = settings.customSites;
                    localStorage.setItem('customSites', JSON.stringify(customSites));
                }
                if (settings.visits) {
                    localStorage.setItem('siteVisits', JSON.stringify(settings.visits));
                }
                
                // 刷新页面应用新设置
                location.reload();
            } catch (error) {
                alert('导入失败：文件格式不正确');
            }
        };
        reader.readAsText(file);
    });
    
    input.click();
}

// 添加CSS动画样式
const style = document.createElement('style');
style.textContent = `
    .custom-card {
        position: relative;
    }
    
    .delete-btn {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        width: 24px;
        height: 24px;
        border: none;
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
        border-radius: 50%;
        cursor: pointer;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .custom-card:hover .delete-btn {
        opacity: 1;
    }
    
    .delete-btn:hover {
        background: #ef4444;
        color: white;
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// 服务工作者注册（PWA支持）
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// 网站健康检查（可选功能）
async function checkSiteHealth(url) {
    try {
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
        return response.ok;
    } catch (error) {
        return false;
    }
}

// 添加右键菜单功能
document.addEventListener('contextmenu', function(e) {
    const card = e.target.closest('.card');
    if (card && card.classList.contains('custom-card')) {
        e.preventDefault();
        // 可以在这里添加自定义右键菜单
    }
});

// 初始化完成提示
console.log('导航站已加载完成！');
console.log('快捷键：');
console.log('- Ctrl/Cmd + K: 聚焦搜索框');
console.log('- Ctrl/Cmd + Shift + D: 切换主题');
console.log('- Ctrl/Cmd + Shift + A: 添加网站');
console.log('- Escape: 关闭模态框');
