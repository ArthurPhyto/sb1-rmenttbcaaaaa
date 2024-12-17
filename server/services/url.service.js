import axios from 'axios';

export const urlService = {
  extractDomain(url) {
    try {
      const { hostname } = new URL(url);
      return hostname;
    } catch (error) {
      return null;
    }
  },

  async checkUrl(url) {
    try {
      const response = await axios.get(url, {
        timeout: 5000,
        maxRedirects: 5,
      });
      return { status: 'valid', code: response.status };
    } catch (error) {
      if (error.response) {
        return { status: 'expired_http', code: error.response.status };
      }
      return { status: 'expired_http', code: 0 };
    }
  }
};