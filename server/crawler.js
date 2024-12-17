import axios from 'axios';
import cheerio from 'cheerio';
import dns from 'dns';
import { promisify } from 'util';

const resolveDns = promisify(dns.resolve);

const checkDns = async (domain) => {
  try {
    await resolveDns(domain);
    return true;
  } catch (error) {
    return false;
  }
};

const extractDomain = (url) => {
  try {
    const { hostname } = new URL(url);
    return hostname;
  } catch (error) {
    return null;
  }
};

const checkUrl = async (url) => {
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
};

export const crawlWebsite = async (startUrl, onMessage) => {
  const visited = new Set();
  const queue = [startUrl];
  const domain = extractDomain(startUrl);

  if (!domain) {
    throw new Error('URL invalide');
  }

  while (queue.length > 0) {
    const url = queue.shift();
    
    if (visited.has(url)) continue;
    visited.add(url);

    try {
      const { status, code } = await checkUrl(url);
      
      onMessage({
        type: 'url_checked',
        url,
        status,
        httpCode: code,
        message: `Vérifié ${url} - Status: ${status} (${code})`
      });

      if (status === 'expired_http') {
        const urlDomain = extractDomain(url);
        if (urlDomain) {
          const hasDns = await checkDns(urlDomain);
          if (!hasDns) {
            onMessage({
              type: 'dns_checked',
              url,
              status: 'expired_dns',
              message: `DNS invalide pour ${urlDomain}`
            });
          }
        }
        continue;
      }

      const response = await axios.get(url);
      const $ = cheerio.load(response.data);

      $('a').each((_, element) => {
        const href = $(element).attr('href');
        if (!href) return;

        try {
          const absoluteUrl = new URL(href, url).toString();
          const linkDomain = extractDomain(absoluteUrl);
          
          if (linkDomain && linkDomain.includes(domain) && !visited.has(absoluteUrl)) {
            queue.push(absoluteUrl);
          }
        } catch (error) {
          // Ignore invalid URLs
        }
      });
    } catch (error) {
      onMessage({
        type: 'error',
        url,
        message: `Erreur lors de l'analyse de ${url}: ${error.message}`
      });
    }
  }

  onMessage({
    type: 'completed',
    message: 'Analyse terminée'
  });
};