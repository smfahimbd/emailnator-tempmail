const crypto = require("crypto");

function getCommonHeaders() {
  return {
    'accept': 'application/json',
    'accept-language': 'en-US,en;q=0.9,bn-BD;q=0.8,bn;q=0.7',
    'content-type': 'application/json',
    'origin': 'https://www.emailnator.com',
    'priority': 'u=1, i',
    'sec-ch-ua': '"Google Chrome";v="153", "Not_A Brand";v="8", "Chromium";v="153"',
    'sec-ch-ua-arch': '"x86"',
    'sec-ch-ua-bitness': '"64"',
    'sec-ch-ua-full-version': '153.0.8010.53',
    'sec-ch-ua-full-version-list': '"Google Chrome";v="153.0.8010.53", "Not_A Brand";v="8.0.0.0", "Chromium";v="153.0.8010.53"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-model': '""',
    'sec-ch-ua-platform': '"Windows"',
    'sec-ch-ua-platform-version': '10.0.0',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36'
  };
}

function getHeadersWithReferer(referer) {
  const ip = [10, crypto.randomInt(256), crypto.randomInt(256), crypto.randomInt(256)].join(".");
  return {
    ...getCommonHeaders(),
    'referer': referer,
    'x-forwarded-for': ip,
    'x-real-ip': ip
  };
}

function getSpoofHeaders(extra = {}) {
  const ip = [10, crypto.randomInt(256), crypto.randomInt(256), crypto.randomInt(256)].join(".");
  const spoofHeaders = {
    "x-forwarded-for": ip,
    "x-real-ip": ip,
    "client-ip": ip,
    "x-client-ip": ip,
    "x-cluster-client-ip": ip,
    "x-original-forwarded-for": ip,
    "x-forwarded-proto": "https",
    "x-forwarded-host": "www.emailnator.com",
    "x-forwarded-port": "443"
  };
  return {
    ...spoofHeaders,
    ...extra
  };
}

module.exports = {
  getCommonHeaders,
  getHeadersWithReferer,
  getSpoofHeaders
};