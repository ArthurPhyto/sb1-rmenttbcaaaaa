import React from 'react';
import type { CrawlJob } from '../types';

export function CrawlProgress({ job }: { job: CrawlJob }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mt-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-900">
          Analyse de {job.url}
        </h3>
        <span className="text-sm text-gray-500">
          {job.checkedUrls} / {job.totalUrls} URLs
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-orange-500 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${job.progress}%` }}
        ></div>
      </div>
    </div>
  );
}