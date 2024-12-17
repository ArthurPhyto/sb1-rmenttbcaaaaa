import cheerio from 'cheerio';
import axios from 'axios';
import { dnsService } from './dns.service.js';
import { urlService } from './url.service.js';
import { logger } from '../utils/logger.js';

export class CrawlerService {
  constructor() {
    this.visited = new Set();
    this.queue = [];
  }

  async crawlWebsite(startUrl, onMessage) {
    this.queue = [startUrl];
    this.visited.clear();
    const domain = urlService.extractDomain(startUrl);

    if (!domain) {
      throw new Error('URL invalide');
    }

    while (this.queue.length > 0) {
      await this.processUrl(this.queue.shift(), domain, onMessage);
    }

    onMessage({
      type: 'completed',
      message: 'Analyse terminée'
    });
  }

  async processUrl(url, baseDomain, onMessage) {
    if (this.visited.has(url)) return;
    this.visited.add(url);

    try {
      const { status, code } = await urlService.checkUrl(url);
      
      onMessage({
        type: 'url_checked',
        url,
        status,
        httpCode: code,
        message: `Vérifié ${url} - Status: ${status} (${code})`
      });

      if (status === 'expired_http') {
        await this.checkDomainDns(url, onMessage);
        return;
      }

      await this.extractLinks(url, baseDomain);
    } catch (error) {
      logger.error(`Erreur lors du traitement de ${url}: ${error.message}`);
      onMessage({
        type: 'error',
        url,
        message: `Erreur lors de l'analyse de ${url}: ${error.message}`
      });
    }
  }

  async checkDomainDns(url, onMessage) {
    const urlDomain = urlService.extractDomain(url);
    if (urlDomain) {
      const hasDns = await dnsService.checkDomain(urlDomain);
      if (!hasDns) {
        onMessage({
          type: 'dns_checked',
          url,
          status: 'expired_dns',
          message: `DNS invalide pour ${urlDomain}`
        });
      }
    }
  }

  async extractLinks(url, baseDomain) {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    $('a').each((_, element) => {
      const href = $(element).attr('href');
      if (!href) return;

      try {
        const absoluteUrl = new URL(href, url).toString();
        const linkDomain = urlService.extractDomain(absoluteUrl);
        
        if (linkDomain && linkDomain.includes(baseDomain) && !this.visited.has(absoluteUrl)) {
          this.queue.push(absoluteUrl);
        }
      } catch (error) {
        logger.debug(`URL invalide ignorée: ${href}`);
      }
    });
  }
}