/**
 * 伪装页面渲染模块
 * 当浏览器访问订阅链接时显示的伪装页面
 * 精确还原 nginx 默认错误页格式
 */

/**
 * 渲染 nginx 风格默认伪装页面
 * @returns {Response} HTML响应
 */
export function renderDisguisePage() {
    // 精确还原 nginx 默认 404 错误页 HTML
    const html = `<html>\r
<head><title>404 Not Found</title></head>\r
<body>\r
<center><h1>404 Not Found</h1></center>\r
<hr><center>nginx</center>\r
</body>\r
</html>\r
`;

    return new Response(html, {
        status: 404,
        headers: {
            'Content-Type': 'text/html',
            'Server': 'nginx',
        }
    });
}

/**
 * 根据配置生成伪装响应 (Redirect 或 404 Page)
 * @param {Object} disguiseConfig 
 * @param {string} [baseUrl]
 * @returns {Response}
 */
export function createDisguiseResponse(disguiseConfig, baseUrl) {
    if (disguiseConfig && disguiseConfig.pageType === 'redirect' && disguiseConfig.redirectUrl) {
        const redirectUrl = normalizeRedirectUrl(disguiseConfig.redirectUrl, baseUrl);
        if (redirectUrl) {
            return new Response(null, {
                status: 302,
                headers: {
                    Location: redirectUrl,
                    'Server': 'nginx',
                }
            });
        }
    }
    return renderDisguisePage();
}

function normalizeRedirectUrl(rawUrl, baseUrl) {
    if (typeof rawUrl !== 'string') {
        return null;
    }

    const trimmed = rawUrl.trim();
    if (!trimmed) {
        return null;
    }

    let candidate = trimmed;
    const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(candidate);
    if (!hasScheme && !candidate.startsWith('/') && !candidate.startsWith('//')) {
        candidate = `https://${candidate}`;
    }

    try {
        const normalized = encodeURI(candidate);
        const resolved = baseUrl ? new URL(normalized, baseUrl) : new URL(normalized);
        if (!['http:', 'https:'].includes(resolved.protocol)) {
            return null;
        }
        return resolved.toString();
    } catch (error) {
        return null;
    }
}
