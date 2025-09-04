'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { ClipboardIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface HistoryEntry {
  id: string;
  method: string;
  inputText: string;
  outputText: string;
  key: string | null;
  qrCodeData: string;
  createdAt: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHistory = async (page: number = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/history?page=${page}&limit=10`);
      const data = await response.json();

      if (response.ok) {
        setHistory(data.history);
        setPagination(data.pagination);
        setError('');
      } else {
        setError(data.error || 'Failed to fetch history');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const downloadQRCode = (qrCodeData: string, method: string, id: string) => {
    const link = document.createElement('a');
    link.href = qrCodeData;
    link.download = `qrcode-${method.toLowerCase()}-${id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading && history.length === 0) {
    return (
      <DashboardLayout currentPage="history">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800 mx-auto"></div>
            <p className="mt-4 text-stone-600">Loading history...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout currentPage="history">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-amber-900">Cipher History</h1>
          <div className="text-sm text-stone-600">
            Total entries: {pagination.total}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {history.length === 0 && !loading ? (
          <div className="bg-white/95 backdrop-blur-sm border border-stone-200 shadow-lg rounded-xl p-8 text-center">
            <p className="text-stone-700 text-lg">No cipher history found.</p>
            <p className="text-stone-600 mt-2">Start encrypting text to see your history here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((entry) => (
              <div key={entry.id} className="bg-white/95 backdrop-blur-sm border border-stone-200 shadow-lg rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-amber-900">
                      {entry.method} Cipher
                    </h3>
                    <p className="text-sm text-stone-500">
                      {formatDate(entry.createdAt)}
                    </p>
                    {entry.key && (
                      <p className="text-sm text-stone-600 mt-1">
                        Key: <span className="font-mono text-amber-800">{entry.key}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Input Text */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Input Text
                    </label>
                    <div className="relative">
                      <textarea
                        rows={3}
                        className="w-full px-3 py-2 border border-stone-300 rounded-md bg-stone-50 resize-none text-sm text-stone-900"
                        value={entry.inputText}
                        readOnly
                      />
                      <button
                        onClick={() => copyToClipboard(entry.inputText)}
                        className="absolute top-2 right-2 p-1 text-stone-400 hover:text-amber-700 transition-colors"
                        title="Copy to clipboard"
                      >
                        <ClipboardIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Output Text */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Output Text
                    </label>
                    <div className="relative">
                      <textarea
                        rows={3}
                        className="w-full px-3 py-2 border border-stone-300 rounded-md bg-stone-50 resize-none text-sm text-stone-900"
                        value={entry.outputText}
                        readOnly
                      />
                      <button
                        onClick={() => copyToClipboard(entry.outputText)}
                        className="absolute top-2 right-2 p-1 text-stone-400 hover:text-amber-700 transition-colors"
                        title="Copy to clipboard"
                      >
                        <ClipboardIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="flex flex-col items-center">
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      QR Code
                    </label>
                    <div className="border border-stone-300 rounded-lg p-2 bg-white mb-2">
                      <Image
                        src={entry.qrCodeData}
                        alt="QR Code"
                        width={100}
                        height={100}
                        className="mx-auto"
                      />
                    </div>
                    <button
                      onClick={() => downloadQRCode(entry.qrCodeData, entry.method, entry.id)}
                      className="flex items-center space-x-1 text-xs bg-amber-800 text-white py-1 px-2 rounded hover:bg-amber-900 transition-colors"
                    >
                      <ArrowDownTrayIcon className="h-3 w-3" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center space-x-2">
            <button
              onClick={() => fetchHistory(pagination.page - 1)}
              disabled={pagination.page === 1 || loading}
              className="px-3 py-1 border border-stone-300 rounded-md text-sm text-stone-700 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            <span className="px-3 py-1 text-sm text-stone-700">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            
            <button
              onClick={() => fetchHistory(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages || loading}
              className="px-3 py-1 border border-stone-300 rounded-md text-sm text-stone-700 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
