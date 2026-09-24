const axios = require('axios');
const { getHeadersWithReferer } = require('../utils/apiClient');

async function getMessageView(email, messageID) {
  try {
    const url = `https://www.emailnator.com/api/message/${messageID}`;
    const headers = getHeadersWithReferer(`https://www.emailnator.com/inbox/${encodeURIComponent(email)}/${messageID}`);

    const response = await axios.get(url, { 
      headers,
      timeout: 15000
    });

    return response.data;

  } catch (error) {
    console.error('Failed to get message view:', error.message || error);
    throw error;
  }
}

module.exports = { getMessageView };
