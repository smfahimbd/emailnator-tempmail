const crypto = require("crypto");

const SpoofHead = (extra = {}) => {
  const ip = [10, crypto.randomInt(256), crypto.randomInt(256), crypto.randomInt(256)].join(".");
  const genericHeaders = {
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
    ...genericHeaders,
    ...extra
  };
};

module.exports = SpoofHead;
