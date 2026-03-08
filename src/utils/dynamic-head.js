/**
 * 动态 Head 管理模块
 * 用于在伪装模式和正常模式之间切换 <head> 中的元素
 * 
 * 伪装模式：移除所有暴露应用身份的元素（favicon、manifest、PWA meta 等）
 * 正常模式：注入完整的应用头部元素
 */

const APP_TITLE = 'MISUB';
const DISGUISE_TITLE = '404 Not Found';

// 标记动态注入的元素
const DYNAMIC_ATTR = 'data-dynamic-head';

/**
 * 移除所有带有动态标记的 head 元素
 */
function removeDynamicElements() {
    document.querySelectorAll(`[${DYNAMIC_ATTR}]`).forEach(el => el.remove());
}

/**
 * 创建并追加一个带动态标记的元素到 <head>
 */
function appendToHead(tag, attrs) {
    const el = document.createElement(tag);
    el.setAttribute(DYNAMIC_ATTR, '');
    for (const [key, value] of Object.entries(attrs)) {
        el.setAttribute(key, value);
    }
    document.head.appendChild(el);
    return el;
}

/**
 * 切换到伪装状态
 * 移除 favicon、manifest、PWA meta 等暴露应用身份的元素
 */
export function resetToDisguise() {
    // 设置伪装 title
    document.title = DISGUISE_TITLE;

    // 移除动态注入的元素
    removeDynamicElements();

    // 移除所有 favicon 相关 link（静态 + 动态）
    document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]').forEach(el => el.remove());

    // 注入空白 favicon，覆盖浏览器缓存和自动发现
    const blankFavicon = document.createElement('link');
    blankFavicon.setAttribute(DYNAMIC_ATTR, '');
    blankFavicon.rel = 'icon';
    blankFavicon.href = 'data:,';
    document.head.appendChild(blankFavicon);

    // 移除 manifest
    document.querySelectorAll('link[rel="manifest"]').forEach(el => el.remove());

    // 移除 PWA 相关 meta 标签
    const pwaMetas = [
        'meta[name="theme-color"]',
        'meta[name="apple-mobile-web-app-capable"]',
        'meta[name="apple-mobile-web-app-status-bar-style"]',
        'meta[name="apple-mobile-web-app-title"]',
        'meta[name="mobile-web-app-capable"]',
        'meta[name="msapplication-TileColor"]',
        'meta[name="msapplication-navbutton-color"]',
        'meta[name="msapplication-config"]',
        'meta[name="description"]',
        'meta[name="format-detection"]',
        'meta[name="msapplication-tap-highlight"]',
    ];
    pwaMetas.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => el.remove());
    });

    // 移除 Google Fonts
    document.querySelectorAll('link[href*="fonts.googleapis.com"], link[href*="fonts.gstatic.com"]').forEach(el => el.remove());
}

/**
 * 注入完整的应用 head 元素
 * 在用户认证成功后调用，恢复 favicon、manifest、字体等
 */
export function injectAppHead() {
    // 先清理旧的动态元素
    removeDynamicElements();

    // 恢复 title
    document.title = APP_TITLE;

    // Favicon
    appendToHead('link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' });

    // Google Fonts
    appendToHead('link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' });
    appendToHead('link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' });
    appendToHead('link', {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap'
    });

    // PWA Meta Tags
    appendToHead('meta', { name: 'description', content: '基于 Cloudflare 的订阅转换和管理工具' });
    appendToHead('meta', { name: 'theme-color', content: '#f8fafc' });
    appendToHead('meta', { name: 'apple-mobile-web-app-capable', content: 'yes' });
    appendToHead('meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' });
    appendToHead('meta', { name: 'apple-mobile-web-app-title', content: 'MiSub' });
    appendToHead('meta', { name: 'format-detection', content: 'telephone=no' });
    appendToHead('meta', { name: 'msapplication-tap-highlight', content: 'no' });
    appendToHead('meta', { name: 'mobile-web-app-capable', content: 'yes' });
    appendToHead('meta', { name: 'msapplication-TileColor', content: '#4f46e5' });
    appendToHead('meta', { name: 'msapplication-navbutton-color', content: '#4f46e5' });
    appendToHead('meta', { name: 'msapplication-config', content: '/browserconfig.xml' });

    // Apple Touch Icons
    const appleSizes = [
        { sizes: '57x57', href: '/icons/icon-72x72.png?v=2' },
        { sizes: '60x60', href: '/icons/icon-72x72.png?v=2' },
        { sizes: '72x72', href: '/icons/icon-72x72.png?v=2' },
        { sizes: '76x76', href: '/icons/icon-96x96.png?v=2' },
        { sizes: '114x114', href: '/icons/icon-128x128.png?v=2' },
        { sizes: '120x120', href: '/icons/icon-128x128.png?v=2' },
        { sizes: '144x144', href: '/icons/icon-144x144.png?v=2' },
        { sizes: '152x152', href: '/icons/icon-152x152.png?v=2' },
        { sizes: '180x180', href: '/icons/icon-180x180.png?v=2' },
    ];
    appleSizes.forEach(({ sizes, href }) => {
        appendToHead('link', { rel: 'apple-touch-icon', sizes, href });
    });
    // Default apple touch icon
    appendToHead('link', { rel: 'apple-touch-icon', href: '/icons/icon-180x180.png?v=2' });

    // Android Chrome Icons
    appendToHead('link', { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/icons/icon-192x192.png' });
    appendToHead('link', { rel: 'icon', type: 'image/png', sizes: '512x512', href: '/icons/icon-512x512.png' });
    appendToHead('link', { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/icons/icon-96x96.png' });
    appendToHead('link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/icons/icon-96x96.png' });
    appendToHead('link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/icons/icon-96x96.png' });

    // Manifest
    appendToHead('link', { rel: 'manifest', href: '/manifest.json' });
}
