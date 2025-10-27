function extractCsrfFromHtml(html) {
  if (!html) return null;

  const patterns = [
    /name=["']csrf-token["']\s+content=["']([^"']+)["']/i,
    /<meta[^>]*content=["']([^"']+)["'][^>]*name=["']csrf-token["'][^>]*>/i,
    /window\.__INITIAL_STATE__\s*=\s*({[\s\S]*?})\s*;/i,
    /_token\s*[:=]\s*['"]([^'"]+)['"]/i,
    /csrfToken\s*[:=]\s*['"]([^'"]+)['"]/i,
    /"csrf-token"\s*:\s*"([^"]+)"/i,
    /"XSRF-TOKEN"\s*:\s*"([^"]+)"/i
  ];

  for (const re of patterns) {
    const m = html.match(re);
    if (m && m[1]) return m[1];
  }

  return null;
}

function extractCsrfFromSetCookie(setCookieArray = []) {
  if (!Array.isArray(setCookieArray)) return null;
  for (const cookieStr of setCookieArray) {
    const m = cookieStr.match(/(?:XSRF-TOKEN|csrftoken)=([^;]+)/i);
    if (m && m[1]) {
      try {
        return decodeURIComponent(m[1]);
      } catch (e) {
        return m[1];
      }
    }
  }
  return null;
}

module.exports = { extractCsrfFromHtml, extractCsrfFromSetCookie };
