import dns from 'dns';
import { promisify } from 'util';

const resolveDns = promisify(dns.resolve);

export const dnsService = {
  async checkDomain(domain) {
    try {
      await resolveDns(domain);
      return true;
    } catch (error) {
      return false;
    }
  }
};