const axios = require('axios');
const { CookieJar } = require('tough-cookie');
const { wrapper: axiosCookieJarSupport } = require('axios-cookiejar-support');
const SpoofHead = require('../utils/spoof-head');
const { extractCsrfFromHtml, extractCsrfFromSetCookie } = require('../utils/httpUtils');
const { getMessageClientHeaders, getMessagePostHeaders } = require('../utils/emailHeaders');


axiosCookieJarSupport(axios);

async function getMessageView(email, messageID) {
  const jar = new CookieJar();
  const client = axios.create({
    jar,
    withCredentials: true,
    headers: getMessageClientHeaders(),
    maxRedirects: 5,
    timeout: 15000
  });

  try {
    const mailboxUrl = `https://www.emailnator.com/mailbox/${email}/${messageID}`;
    const mailboxResponse = await client.get(mailboxUrl);
    const mailboxHtml = mailboxResponse.data;

    const setCookieToken = extractCsrfFromSetCookie(mailboxResponse.headers['set-cookie']);
    if (setCookieToken) {
      return await postMessageView(client, setCookieToken, mailboxUrl, email, messageID);
    }

    const htmlToken = extractCsrfFromHtml(mailboxHtml);
    if (htmlToken) {
      return await postMessageView(client, htmlToken, mailboxUrl, email, messageID);
    }

    const cookies = await new Promise((resolve, reject) => {
      jar.getCookies(mailboxUrl, (err, cookies) => {
        if (err) return reject(err);
        resolve(cookies || []);
      });
    });

    for (const c of cookies) {
      if (/XSRF-TOKEN/i.test(c.key) || /csrftoken/i.test(c.key) || /csrf/i.test(c.key)) {
        try {
          const val = decodeURIComponent(c.value || c.cookieString());
          return await postMessageView(client, val, mailboxUrl, email, messageID);
        } catch (e) {
          return await postMessageView(client, c.value, mailboxUrl, email, messageID);
        }
      }
    }

    throw new Error('CSRF token not found (checked meta tags, scripts, Set-Cookie and cookie jar).');

  } catch (error) {
    console.error('Failed to get message view:', error.message || error);
    throw error;
  }
}


async function postMessageView(client, csrfToken, refererUrl, email, messageID) {
  const url = 'https://www.emailnator.com/message-list';

  const spoofedHeaders = SpoofHead();

  const headers = getMessagePostHeaders(csrfToken, refererUrl, spoofedHeaders);

  const data = { email, messageID };

  const res = await client.post(url, data, { headers, timeout: 15000 });
  return res.data;
}

module.exports = { getMessageView };
