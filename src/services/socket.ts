import { io } from 'socket.io-client';
import type { CrawlMessage } from '../types';

const SOCKET_URL = process.env.NODE_ENV === 'production'
  ? window.location.origin
  : 'http://localhost:3001';

export const socket = io(SOCKET_URL);

export const startCrawl = (url: string): string => {
  const jobId = Math.random().toString(36).substr(2, 9);
  socket.emit('start_crawl', { url, jobId });
  return jobId;
};

export const subscribeToCrawl = (jobId: string, callback: (message: CrawlMessage) => void) => {
  socket.on(`crawl:${jobId}`, callback);
  return () => {
    socket.off(`crawl:${jobId}`, callback);
  };
};