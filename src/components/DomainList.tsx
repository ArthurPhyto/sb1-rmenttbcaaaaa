import React from 'react';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import type { DomainStatus } from '../types';

export function DomainList({ domains }: { domains: DomainStatus[] }) {
  return (
    <div className="mt-6">
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Domaine
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Code HTTP
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dernière vérification
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {domains.map((domain) => (
              <tr key={domain.url}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{domain.url}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="flex items-center">
                    {domain.status === 'valid' && (
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    )}
                    {domain.status === 'expired_dns' && (
                      <XCircle className="w-5 h-5 text-red-500 mr-2" />
                    )}
                    {domain.status === 'expired_http' && (
                      <AlertCircle className="w-5 h-5 text-yellow-500 mr-2" />
                    )}
                    {domain.status === 'checking' && (
                      <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mr-2" />
                    )}
                    {domain.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-500">
                    {domain.httpCode || '-'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {domain.lastChecked.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}