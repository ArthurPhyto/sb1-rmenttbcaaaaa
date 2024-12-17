import React, { useRef, useEffect } from 'react';
import { Terminal } from 'lucide-react';

interface ConsoleProps {
  logs: string[];
}

export function Console({ logs }: ConsoleProps) {
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-gray-900 rounded-lg p-4 mt-4">
      <div className="flex items-center gap-2 mb-2">
        <Terminal className="w-5 h-5 text-gray-400" />
        <h3 className="text-sm font-medium text-gray-400">Console</h3>
      </div>
      <div
        ref={consoleRef}
        className="font-mono text-sm text-gray-300 h-48 overflow-y-auto"
      >
        {logs.map((log, index) => (
          <div key={index} className="py-1">
            <span className="text-gray-500">[{new Date().toLocaleTimeString()}]</span>{' '}
            {log}
          </div>
        ))}
      </div>
    </div>
  );
}