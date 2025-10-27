const axios = require('axios');
const { CookieJar } = require('tough-cookie');
const { wrapper: axiosCookieJarSupport } = require('axios-cookiejar-support');
const SpoofHead = require('../utils/spoof-head');
const { extractCsrfFromHtml, extractCsrfFromSetCookie } = require('../utils/httpUtils');
const { getGenerateClientHeaders, getGeneratePostHeaders } = require('../utils/emailHeaders');

axiosCookieJarSupport(axios);

async function generateEmail() {
  const jar = new CookieJar();
  const client = axios.create({
    jar,
    withCredentials: true,
    headers: getGenerateClientHeaders(),
    maxRedirects: 5,
    timeout: 15000
  });

  try {
    const homeUrl = 'https://www.emailnator.com/';
    const homeResponse = await client.get(homeUrl);
    const homeHtml = homeResponse.data;

    const setCookieToken = extractCsrfFromSetCookie(homeResponse.headers['set-cookie']);
    if (setCookieToken) {
      return await postGenerate(client, setCookieToken, homeUrl);
    }

    const htmlToken = extractCsrfFromHtml(homeHtml);
    if (htmlToken) {
      return await postGenerate(client, htmlToken, homeUrl);
    }

    const cookies = await new Promise((resolve, reject) => {
      jar.getCookies(homeUrl, (err, cookies) => {
        if (err) return reject(err);
        resolve(cookies || []);
      });
    });

    for (const c of cookies) {
      if (/XSRF-TOKEN/i.test(c.key) || /csrftoken/i.test(c.key) || /csrf/i.test(c.key)) {
        try {
          const val = decodeURIComponent(c.value || c.cookieString());
          return await postGenerate(client, val, homeUrl);
        } catch (e) {
          return await postGenerate(client, c.value, homeUrl);
        }
      }
    }

    throw new Error('CSRF token not found (checked meta tags, scripts, Set-Cookie and cookie jar).');

  } catch (error) {
    console.error('Failed to generate email:', error.message || error);
    throw error;
  }
}


async function postGenerate(client, csrfToken, refererUrl) {
  const url = 'https://www.emailnator.com/generate-email';

  const spoofedHeaders = SpoofHead();

  const headers = getGeneratePostHeaders(csrfToken, refererUrl, spoofedHeaders);

  const emailTypes = ["dotGmail", "googleMail"];

  const numToSelect = Math.floor(Math.random() * 2) + 1;
  const selectedEmails = [];
  for (let i = 0; i < numToSelect; i++) {
    const randomIndex = Math.floor(Math.random() * emailTypes.length);
    selectedEmails.push(emailTypes[randomIndex]);
  }

  const data = { email: selectedEmails };

  const res = await client.post(url, data, { headers, timeout: 15000 });
  return res.data;
}

module.exports = { generateEmail };
