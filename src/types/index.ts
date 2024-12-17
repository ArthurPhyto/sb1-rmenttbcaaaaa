export type DomainStatus = {
  url: string;
  status: 'checking' | 'expired_dns' | 'expired_http' | 'valid';
  httpCode?: number;
  lastChecked: Date;
};

export type CrawlJob = {
  id: string;
  url: string;
  progress: number;
  status: 'running' | 'completed' | 'failed';
  totalUrls: number;
  checkedUrls: number;
  results: DomainStatus[];
  startedAt: Date;
  logs: string[];
};

export type CrawlMessage = {
  type: 'url_checked' | 'dns_checked' | 'error' | 'completed';
  url?: string;
  message: string;
  status?: DomainStatus['status'];
  httpCode?: number;
};