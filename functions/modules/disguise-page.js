/**
 * 伪装页面渲染模块
 * 当浏览器访问订阅链接时显示的伪装页面
/**
 * 伪装页面渲染模块
 * 当浏览器访问订阅链接时显示的伪装页面
 */

/**
 * 渲染默认伪装页面
 * @returns {Response} HTML响应
 */
export function renderDisguisePage() {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>404 Not Found</title>
    <style>
        body {
            width: 35em;
            margin: 0 auto;
            font-family: Tahoma, Verdana, Arial, sans-serif;
        }

        h1 {
            margin-top: 2em;
        }

        h1,
        p {
            text-align: center;
        }
    </style>
</head>
<body>
    <h1>404 Not Found</h1>
    <p>The requested URL was not found on this server.</p>
    <hr>
    <p>nginx</p>
</body>
</html>
    `;

    return new Response(html, {
        status: 404,
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-cache'
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
                headers: { Location: redirectUrl }
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
