import Link from 'next/link';
import { KeyIcon } from '@heroicons/react/24/outline';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-neutral-50 to-amber-50">
      <div className="relative overflow-hidden">
        <div className="pb-80 pt-16 sm:pb-40 sm:pt-24 lg:pb-48 lg:pt-40">
          <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
            <div className="sm:max-w-lg">
              <div className="flex items-center mb-8">
                <div className="h-12 w-12 bg-gradient-to-r from-amber-800 to-orange-900 rounded-lg flex items-center justify-center shadow-lg">
                  <KeyIcon className="h-8 w-8 text-white" />
                </div>
                <h1 className="ml-4 text-4xl font-bold text-amber-900">CipherSphere</h1>
              </div>
              
              <p className="text-xl text-stone-700 mb-8">
                Secure text encryption and decryption with multiple cipher algorithms. 
                Generate QR codes for your encrypted messages and keep track of your cipher history.
              </p>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link
                    href="/login"
                    className="bg-gradient-to-r from-amber-800 to-orange-900 text-white text-center py-3 px-6 rounded-lg text-lg font-medium hover:from-amber-900 hover:to-red-900 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="bg-white text-amber-800 border border-stone-300 text-center py-3 px-6 rounded-lg text-lg font-medium hover:bg-stone-50 hover:text-amber-900 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="mt-16">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-stone-200 hover:border-amber-300 transition-all duration-200">
                  <h3 className="text-lg font-medium text-amber-900 mb-2">ATBASH Cipher</h3>
                  <p className="text-stone-600">Simple substitution cipher that reverses the alphabet.</p>
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-stone-200 hover:border-amber-300 transition-all duration-200">
                  <h3 className="text-lg font-medium text-amber-900 mb-2">Caesar Cipher</h3>
                  <p className="text-stone-600">Classic shift cipher with customizable shift values.</p>
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-stone-200 hover:border-amber-300 transition-all duration-200">
                  <h3 className="text-lg font-medium text-amber-900 mb-2">Vigenère Cipher</h3>
                  <p className="text-stone-600">Polyalphabetic cipher using a keyword for encryption.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
