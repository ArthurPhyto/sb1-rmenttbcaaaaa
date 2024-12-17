import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { CrawlForm } from './components/CrawlForm';
import { CrawlProgress } from './components/CrawlProgress';
import { DomainList } from './components/DomainList';
import { Console } from './components/Console';
import { startCrawl, subscribeToCrawl } from './services/socket';
import type { CrawlJob, DomainStatus, CrawlMessage } from './types';

function App() {
  const [activeJobs, setActiveJobs] = useState<CrawlJob[]>([]);
  const [domains, setDomains] = useState<DomainStatus[]>([]);

  const handleMessage = useCallback((jobId: string, message: CrawlMessage) => {
    setActiveJobs((jobs) => {
      const jobIndex = jobs.findIndex((job) => job.id === jobId);
      if (jobIndex === -1) return jobs;

      const updatedJobs = [...jobs];
      const job = { ...updatedJobs[jobIndex] };

      switch (message.type) {
        case 'url_checked':
          job.checkedUrls += 1;
          job.progress = (job.checkedUrls / job.totalUrls) * 100;
          job.logs.push(`Vérifié: ${message.url}`);
          if (message.status && message.url) {
            job.results.push({
              url: message.url,
              status: message.status,
              httpCode: message.httpCode,
              lastChecked: new Date(),
            });
          }
          break;
        case 'completed':
          job.status = 'completed';
          job.progress = 100;
          job.logs.push('Analyse terminée');
          setDomains((prev) => [...prev, ...job.results]);
          break;
        case 'error':
          job.logs.push(`Erreur: ${message.message}`);
          break;
      }

      updatedJobs[jobIndex] = job;
      return updatedJobs;
    });
  }, []);

  const handleSubmit = (url: string) => {
    const jobId = startCrawl(url);
    const newJob: CrawlJob = {
      id: jobId,
      url,
      progress: 0,
      status: 'running',
      totalUrls: 0,
      checkedUrls: 0,
      results: [],
      startedAt: new Date(),
      logs: [`Démarrage de l'analyse de ${url}`],
    };
    
    setActiveJobs((jobs) => [...jobs, newJob]);
    subscribeToCrawl(jobId, (message) => handleMessage(jobId, message));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Nouvelle analyse
            </h2>
            <CrawlForm onSubmit={handleSubmit} />
          </div>

          {activeJobs.length > 0 && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Analyses en cours
              </h2>
              <div className="space-y-4">
                {activeJobs.map((job) => (
                  <div key={job.id}>
                    <CrawlProgress job={job} />
                    <Console logs={job.logs} />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Résultats
            </h2>
            <DomainList domains={domains} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;