const axios = require('axios');
const { getHeadersWithReferer } = require('../utils/apiClient');


/**
 * Email type configuration
 * Available options: [1, 2, 3, 8]
 * 1: Domain
 * 2: +Gmail
 * 3: .Gmail
 * 8: GoogleMail
 */

const EMAIL_TYPES = {
  1: [1],
  2: [2],
  3: [3],
  4: [8],
  all: [1, 2, 3, 8]
};

async function generateEmail(emailType = 3) {
  try {
    const url = 'https://www.emailnator.com/api/generate-email';
    const headers = getHeadersWithReferer('https://www.emailnator.com/');
    const types = EMAIL_TYPES[emailType] || EMAIL_TYPES[3];
    const data = { ids: types };

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
