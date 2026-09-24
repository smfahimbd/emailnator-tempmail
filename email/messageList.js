const axios = require('axios');
const { getHeadersWithReferer } = require('../utils/apiClient');

async function getMessageList(email) {
  try {
    const url = 'https://www.emailnator.com/api/message-list';
    const headers = getHeadersWithReferer('https://www.emailnator.com/inbox');
    const data = { email, limit: 20 };

    const response = await axios.post(url, data, { 
      headers,
      timeout: 15000
    });

    return response.data;

  } catch (error) {
    console.error('Failed to get message list:', error.message || error);
    throw error;
  }
}

module.exports = { getMessageList };
