'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Copy, Check, RefreshCw, Download, MessageCircle, AlertCircle, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const BUSINESS_TYPES = [
  'Restaurant', 'Salon', 'Dental Clinic', 'Hotel', 'Plumber',
  'Real Estate Agent', 'Gym', 'Spa', 'Law Firm', 'Accounting Firm'
];

const TONES = [
  'Professional', 'Friendly', 'Apologetic', 'Thankful', 'Empathetic'
];

export default function ToolPage() {
  const [reviewText, setReviewText] = useState('');
  const [businessType, setBusinessType] = useState(BUSINESS_TYPES[0]);
  const [tone, setTone] = useState(TONES[0]);
  const [generatedReply, setGeneratedReply] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [plan, setPlan] = useState('free');
  const [usageCount, setUsageCount] = useState(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [localUsage, setLocalUsage] = useState(0);
  const [error, setError] = useState('');

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndUsage = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);

        const { data: userData } = await supabase
          .from('users')
          .select('plan')
          .eq('id', user.id)
          .single();

        if (userData) {
          setPlan(userData.plan);
        }

        if (userData?.plan === 'free') {
          const { data: usageData } = await supabase
            .from('usage')
            .select('reply_count, reset_date')
            .eq('user_id', user.id)
            .single();

          if (usageData) {
            // Check if month reset
            const resetDate = new Date(usageData.reset_date);
            const now = new Date();
            if (now > resetDate) {
               setUsageCount(0);
            } else {
               setUsageCount(usageData.reply_count);
            }
          }
        }
      } else {
        const storedUsage = localStorage.getItem('guest_usage');
        if (storedUsage) {
          setLocalUsage(parseInt(storedUsage, 10));
        }
      }
    };

    fetchUserAndUsage();
  }, []);

  const handleGenerate = async () => {
    if (!reviewText.trim()) {
      setError('Please enter a review to reply to.');
      return;
    }

    if (!user && localUsage >= 3) {
      router.push('/signup?reason=limit');
      return;
    }

    if (user && plan === 'free' && usageCount >= 5) {
      setShowUpgradeModal(true);
      return;
    }

    setIsGenerating(true);
    setError('');
    setGeneratedReply('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewText, businessType, tone }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.error === 'LIMIT_REACHED') {
           setShowUpgradeModal(true);
           return;
        }
        throw new Error(data.error || 'Failed to generate');
      }

      const data = await response.json();
      setGeneratedReply(data.reply);

      if (!user) {
        const newUsage = localUsage + 1;
        setLocalUsage(newUsage);
        localStorage.setItem('guest_usage', newUsage.toString());
      } else if (plan === 'free') {
        setUsageCount(prev => prev + 1);
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (generatedReply) {
      navigator.clipboard.writeText(generatedReply);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (generatedReply) {
      const element = document.createElement("a");
      const file = new Blob([generatedReply], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = "review_reply.txt";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const shareWhatsApp = () => {
    if (generatedReply) {
       const url = `https://wa.me/?text=${encodeURIComponent(generatedReply)}`;
       window.open(url, '_blank');
    }
  };

  const isLimitReached = (!user && localUsage >= 3) || (user && plan === 'free' && usageCount >= 5);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-xl text-gray-900">ReviewReply.ai</span>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                {plan === 'free' && (
                  <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2">
                    <span className={`font-semibold ${usageCount >= 4 ? 'text-orange-500' : ''}`}>
                      {usageCount} of 5
                    </span> free replies used
                    <Link href="/pricing" className="text-blue-600 hover:text-blue-700 ml-2 font-medium">Upgrade</Link>
                  </div>
                )}
                {plan !== 'free' && (
                  <div className="text-sm text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full font-medium">
                    {plan === 'pro' ? 'Pro Plan Active' : 'Agency Plan Active'}
                  </div>
                )}
                <button
                  onClick={() => supabase.auth.signOut().then(() => router.push('/'))}
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                 <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2">
                    <span className="font-semibold">{localUsage} of 3</span> trial replies
                  </div>
                 <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">Sign in</Link>
                 <Link href="/signup" className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Sign up</Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">

        {plan === 'free' && usageCount >= 5 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6 flex items-start">
            <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 mr-3 shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-orange-800">Free limit reached</h3>
              <p className="mt-1 text-sm text-orange-700">You've used all 5 of your free replies for this month. Upgrade to Pro for unlimited replies.</p>
              <div className="mt-3">
                <Link href="/pricing" className="text-sm font-medium text-orange-800 bg-orange-100 hover:bg-orange-200 px-3 py-1.5 rounded-md transition-colors">
                  View Plans
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8">

            {/* Input Section */}
            <div className="flex flex-col h-full">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">1. Paste the review</h2>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Paste your customer's Google review here..."
                className="flex-grow w-full border border-gray-300 rounded-lg p-4 min-h-[200px] resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />

              <div className="grid grid-cols-2 gap-4 mt-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    {BUSINESS_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reply Tone</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    {TONES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

              <button
                onClick={handleGenerate}
                disabled={isGenerating || isLimitReached || !reviewText.trim()}
                className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Reply...
                  </>
                ) : (
                  <>Generate Reply</>
                )}
              </button>
            </div>

            {/* Output Section */}
            <div className="flex flex-col h-full border-t md:border-t-0 md:border-l border-gray-100 md:pl-8 pt-8 md:pt-0">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex justify-between items-center">
                <span>2. Your Perfect Reply</span>
                {generatedReply && (
                  <span className="text-xs text-gray-500 font-normal">
                    {generatedReply.length} / 4096 chars
                  </span>
                )}
              </h2>

              <div className={`flex-grow border rounded-lg p-4 relative ${generatedReply ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50 flex items-center justify-center text-gray-400'}`}>
                {generatedReply ? (
                  <p className="text-gray-800 whitespace-pre-wrap">{generatedReply}</p>
                ) : (
                  <div className="text-center">
                     <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-50" />
                     <p>Your generated reply will appear here.</p>
                  </div>
                )}
              </div>

              {generatedReply && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
                  <button
                    onClick={handleCopy}
                    className="flex items-center justify-center gap-2 py-2 px-3 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors col-span-2"
                  >
                    {copied ? <><Check className="w-4 h-4 text-green-500" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Reply</>}
                  </button>
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || isLimitReached}
                    className="flex items-center justify-center gap-2 py-2 px-3 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    title="Regenerate"
                  >
                    <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center justify-center gap-2 py-2 px-3 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    title="Download .txt"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={shareWhatsApp}
                    className="flex items-center justify-center gap-2 py-2 px-3 bg-[#25D366] text-white rounded-md text-sm font-medium hover:bg-[#128C7E] transition-colors col-span-2 sm:col-span-4 mt-2"
                  >
                    Share via WhatsApp
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl relative">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">You're out of free replies!</h3>
            <p className="text-gray-600 mb-6">Upgrade to Pro to get unlimited AI replies, unlock all professional tones, and never miss a review again.</p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
              >
                Maybe later
              </button>
              <Link
                href="/pricing"
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 text-center"
              >
                View Plans
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
