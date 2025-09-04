'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { CipherType } from '@/lib/ciphers';
import { ClipboardIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface CipherResult {
  id: string;
  inputText: string;
  outputText: string;
  method: CipherType;
  key: string | number | null;
  qrCodeData: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [selectedCipher, setSelectedCipher] = useState<CipherType>('ATBASH');
  const [inputText, setInputText] = useState('');
  const [key, setKey] = useState('');
  const [isDecrypt, setIsDecrypt] = useState(false);
  const [result, setResult] = useState<CipherResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCipherOperation = async () => {
    if (!inputText.trim()) {
      alert('Please enter text to encrypt/decrypt');
      return;
    }

    if ((selectedCipher === 'CAESAR' || selectedCipher === 'VIGENERE') && !key.trim()) {
      alert(`Please enter a ${selectedCipher === 'CAESAR' ? 'shift value' : 'key'}`);
      return;
    }

    setLoading(true);

    try {
      const payload: { text: string; method: CipherType; decrypt: boolean; key?: string | number } = {
        text: inputText,
        method: selectedCipher,
        decrypt: isDecrypt
      };

      if (selectedCipher === 'CAESAR') {
        const shiftValue = parseInt(key);
        if (isNaN(shiftValue) || shiftValue < 0 || shiftValue > 25) {
          alert('Caesar cipher shift must be a number between 0 and 25');
          setLoading(false);
          return;
        }
        payload.key = shiftValue;
      } else if (selectedCipher === 'VIGENERE') {
        payload.key = key;
      }

      const response = await fetch('/api/cipher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        alert(data.error || 'Cipher operation failed');
        setResult(null);
      }
    } catch (error) {
      alert('Network error. Please try again.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const downloadQRCode = () => {
    if (!result?.qrCodeData) return;
    
    const link = document.createElement('a');
    link.href = result.qrCodeData;
    link.download = `qrcode-${result.method.toLowerCase()}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout currentPage="cipher">
      <div className="space-y-8">
        {/* Cipher Selection */}
        <div className="bg-white/95 backdrop-blur-sm border border-stone-200 shadow-lg rounded-xl p-6">
          <h2 className="text-lg font-medium text-amber-900 mb-4">Choose Cipher Method</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['ATBASH', 'CAESAR', 'VIGENERE'] as CipherType[]).map((cipher) => (
              <button
                key={cipher}
                onClick={() => {
                  setSelectedCipher(cipher);
                  setResult(null);
                }}
                className={`p-4 rounded-lg border-2 transition-all transform hover:-translate-y-1 ${
                  selectedCipher === cipher
                    ? 'border-amber-600 bg-amber-50 text-amber-900 shadow-lg'
                    : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-white'
                }`}
              >
                <h3 className="font-medium">{cipher}</h3>
                <p className="text-sm mt-1 opacity-75">
                  {cipher === 'ATBASH' && 'Simple substitution cipher'}
                  {cipher === 'CAESAR' && 'Shift cipher with numeric key'}
                  {cipher === 'VIGENERE' && 'Polyalphabetic cipher with keyword'}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-white/95 backdrop-blur-sm border border-stone-200 shadow-lg rounded-xl p-6">
          <h2 className="text-lg font-medium text-amber-900 mb-4">Input</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="inputText" className="block text-sm font-medium text-stone-700 mb-2">
                Text to {isDecrypt ? 'Decrypt' : 'Encrypt'}
              </label>
              <textarea
                id="inputText"
                rows={4}
                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 bg-white text-stone-900 placeholder-stone-400"
                placeholder="Enter your text here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </div>

            {(selectedCipher === 'CAESAR' || selectedCipher === 'VIGENERE') && (
              <div>
                <label htmlFor="key" className="block text-sm font-medium text-stone-700 mb-2">
                  {selectedCipher === 'CAESAR' ? 'Shift Value (0-25)' : 'Key'}
                </label>
                <input
                  id="key"
                  type={selectedCipher === 'CAESAR' ? 'number' : 'text'}
                  min={selectedCipher === 'CAESAR' ? '0' : undefined}
                  max={selectedCipher === 'CAESAR' ? '25' : undefined}
                  className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 bg-white text-stone-900 placeholder-stone-400"
                  placeholder={selectedCipher === 'CAESAR' ? 'Enter shift value' : 'Enter key'}
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                />
              </div>
            )}

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  id="encrypt"
                  name="operation"
                  type="radio"
                  checked={!isDecrypt}
                  onChange={() => setIsDecrypt(false)}
                  className="h-4 w-4 text-amber-700 focus:ring-amber-500 border-stone-300 bg-white"
                />
                <label htmlFor="encrypt" className="ml-2 text-sm text-stone-700">
                  Encrypt
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="decrypt"
                  name="operation"
                  type="radio"
                  checked={isDecrypt}
                  onChange={() => setIsDecrypt(true)}
                  className="h-4 w-4 text-amber-700 focus:ring-amber-500 border-stone-300 bg-white"
                />
                <label htmlFor="decrypt" className="ml-2 text-sm text-stone-700">
                  Decrypt
                </label>
              </div>
            </div>

            <button
              onClick={handleCipherOperation}
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-800 to-orange-900 text-white py-2 px-4 rounded-lg hover:from-amber-900 hover:to-red-900 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? 'Processing...' : `${isDecrypt ? 'Decrypt' : 'Encrypt'} Text`}
            </button>
          </div>
        </div>

        {/* Result Section */}
        {result && (
          <div className="bg-white/95 backdrop-blur-sm border border-stone-200 shadow-lg rounded-xl p-6">
            <h2 className="text-lg font-medium text-amber-900 mb-4">Result</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  {isDecrypt ? 'Decrypted' : 'Encrypted'} Text
                </label>
                <div className="relative">
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-stone-300 rounded-md bg-stone-50 resize-none text-stone-900"
                    value={result.outputText}
                    readOnly
                  />
                  <button
                    onClick={() => copyToClipboard(result.outputText)}
                    className="absolute top-2 right-2 p-1 text-stone-500 hover:text-amber-700 transition-colors"
                    title="Copy to clipboard"
                  >
                    <ClipboardIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-center space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2 text-center">
                    QR Code
                  </label>
                  <div className="border border-stone-300 rounded-lg p-4 bg-white">
                    <Image
                      src={result.qrCodeData}
                      alt="QR Code"
                      width={200}
                      height={200}
                      className="mx-auto"
                    />
                  </div>
                </div>
                
                <button
                  onClick={downloadQRCode}
                  className="flex items-center space-x-2 bg-amber-800 text-white py-2 px-4 rounded-lg hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  <span>Download QR Code</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
