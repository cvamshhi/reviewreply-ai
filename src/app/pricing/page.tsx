'use client';

import { useState } from 'react';
import { CheckCircle, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: 'pro' | 'agency') => {
    setLoading(plan);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to start checkout process');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-blue-600 flex items-center gap-2">
                <MessageCircle className="w-6 h-6" />
                ReviewReply.ai
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/tool" className="text-gray-600 hover:text-gray-900 font-medium text-sm">
                Tool
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium text-sm">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-grow py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
              Simple, transparent pricing
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the perfect plan for your business size. No hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Tier */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Free</h3>
                <p className="text-gray-500 h-10">Perfect for trying out the tool</p>
              </div>
              <div className="mb-8">
                <span className="text-4xl font-extrabold text-gray-900">$0</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <span className="text-gray-600">5 replies per month</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <span className="text-gray-600">Basic tones</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <span className="text-gray-600">Standard support</span>
                </li>
              </ul>
              <Link href="/signup" className="w-full block text-center py-3 px-4 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                Get Started
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="bg-blue-600 p-8 rounded-2xl shadow-xl border border-blue-500 flex flex-col transform md:scale-105 relative">
              <div className="absolute top-0 right-0 bg-blue-400 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg uppercase tracking-wide">
                Most Popular
              </div>
              <div className="mb-8 mt-2">
                <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
                <p className="text-blue-100 h-10">For small businesses and sole proprietors</p>
              </div>
              <div className="mb-8">
                <span className="text-4xl font-extrabold text-white">$19</span>
                <span className="text-blue-100">/month</span>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-200 shrink-0 mt-0.5" />
                  <span className="text-white font-medium">Unlimited replies</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-200 shrink-0 mt-0.5" />
                  <span className="text-blue-50">All professional tones</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-200 shrink-0 mt-0.5" />
                  <span className="text-blue-50">Bulk upload options</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-200 shrink-0 mt-0.5" />
                  <span className="text-blue-50">Priority support</span>
                </li>
              </ul>
              <button
                onClick={() => handleSubscribe('pro')}
                disabled={loading !== null}
                className="w-full py-3 px-4 bg-white text-blue-600 rounded-lg font-bold hover:bg-gray-50 transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {loading === 'pro' ? 'Processing...' : 'Subscribe to Pro'}
              </button>
            </div>

            {/* Agency Tier */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Agency</h3>
                <p className="text-gray-500 h-10">For marketing agencies managing clients</p>
              </div>
              <div className="mb-8">
                <span className="text-4xl font-extrabold text-gray-900">$49</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <span className="text-gray-600">Unlimited replies</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <span className="text-gray-600">Manage up to 10 locations</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <span className="text-gray-600">White label reports</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <span className="text-gray-600">API access</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <span className="text-gray-600">Dedicated account manager</span>
                </li>
              </ul>
              <button
                onClick={() => handleSubscribe('agency')}
                disabled={loading !== null}
                className="w-full py-3 px-4 border border-gray-300 text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {loading === 'agency' ? 'Processing...' : 'Subscribe to Agency'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
