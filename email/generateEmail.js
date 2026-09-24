const axios = require('axios');
const { getHeadersWithReferer } = require('../utils/apiClient');

// Email type configuration
// Available options: [1, 2, 3, 8]
// 1: Domain, 2: +Gmail, 3: .Gmail, 8: GoogleMail
const EMAIL_TYPES = [3];

async function generateEmail() {
  try {
    const url = 'https://www.emailnator.com/api/generate-email';
    const headers = getHeadersWithReferer('https://www.emailnator.com/');
    const data = { ids: EMAIL_TYPES };

    const response = await axios.post(url, data, { 
      headers,
      timeout: 15000
    });

    return response.data;

  } catch (error) {
    console.error('Failed to generate email:', error.message || error);
    throw error;
  }
}

module.exports = { generateEmail };
