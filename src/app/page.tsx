import Link from 'next/link';
import { MessageCircle, Zap, Star, CheckCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <span className="text-xl font-bold text-blue-600 flex items-center gap-2">
                <MessageCircle className="w-6 h-6" />
                ReviewReply.ai
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900 font-medium text-sm">
                Pricing
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium text-sm">
                Sign in
              </Link>
              <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
            Reply to every Google <br className="hidden md:block" /> review in <span className="text-blue-600">10 seconds</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Stop losing customers to unanswered reviews. AI writes perfect, human-sounding replies instantly.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/signup" className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">
              Start for free
            </Link>
            <Link href="#demo" className="bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-50 transition-colors">
              See it in action
            </Link>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Try it yourself right now</h2>
            <p className="mt-4 text-lg text-gray-600">No signup required for the first 3 tries.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xl">S</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Sarah M.</h3>
                <div className="flex text-yellow-400">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
              </div>
            </div>
            <p className="text-gray-700 mb-8 italic">
              "Absolutely amazing experience at this restaurant! The pasta was perfectly cooked and the service was impeccable. We will definitely be coming back."
            </p>

            <div className="p-6 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-blue-900">AI Generated Reply</span>
                <span className="text-xs font-medium bg-blue-200 text-blue-800 px-2 py-1 rounded-full">Friendly Tone</span>
              </div>
              <p className="text-blue-900">
                Hi Sarah! Thank you so much for the 5-star review. We're thrilled to hear that you loved the pasta and that our team provided impeccable service. We put a lot of love into our dishes, and it means the world to know it shows. We can't wait to welcome you back for another amazing meal soon!
              </p>
            </div>

            <div className="mt-8 text-center">
              <Link href="/tool" className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors">
                <Zap className="w-4 h-4" /> Go to the Full Tool
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">How it works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Paste the review</h3>
              <p className="text-gray-600">Copy your customer's Google review and paste it into our tool.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Choose tone & business</h3>
              <p className="text-gray-600">Select your business type and how you want to sound (friendly, professional, etc).</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Generate & Copy</h3>
              <p className="text-gray-600">Click generate and instantly get a perfectly crafted reply ready to paste back into Google.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Trusted by local businesses</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">JD</div>
                <div>
                  <h4 className="font-bold text-gray-900">John D.</h4>
                  <p className="text-sm text-gray-500">Restaurant Owner</p>
                </div>
              </div>
              <p className="text-gray-700">"I used to dread answering reviews. Now I spend 5 minutes a week clearing them all out. The AI sounds exactly like me."</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">AS</div>
                <div>
                  <h4 className="font-bold text-gray-900">Amanda S.</h4>
                  <p className="text-sm text-gray-500">Salon Manager</p>
                </div>
              </div>
              <p className="text-gray-700">"ReviewReply.ai is a game changer for our salon. We reply to every single client now, and our Google ranking has skyrocketed."</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">MR</div>
                <div>
                  <h4 className="font-bold text-gray-900">Michael R.</h4>
                  <p className="text-sm text-gray-500">Plumbing Service</p>
                </div>
              </div>
              <p className="text-gray-700">"I don't have time to write paragraphs when I'm on a job. I use this on my phone and reply instantly. Highly recommend."</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">LT</div>
                <div>
                  <h4 className="font-bold text-gray-900">Lisa T.</h4>
                  <p className="text-sm text-gray-500">Dental Clinic</p>
                </div>
              </div>
              <p className="text-gray-700">"The professional tone setting is perfect for handling our patient feedback. It's polite, compliant, and saves my front desk hours."</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Simple, transparent pricing</h2>
          <div className="flex justify-center items-center gap-8 text-left max-w-3xl mx-auto">
            <div className="flex-1 bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Free</h3>
              <p className="text-gray-500 mb-4">5 replies per month</p>
              <div className="text-3xl font-bold text-gray-900 mb-6">$0</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-gray-600"><CheckCircle className="w-5 h-5 text-blue-600" /> Basic tones</li>
                <li className="flex items-center gap-2 text-gray-600"><CheckCircle className="w-5 h-5 text-blue-600" /> Standard AI model</li>
              </ul>
            </div>
            <div className="flex-1 bg-blue-600 p-8 rounded-2xl shadow-xl border border-blue-500 transform scale-105">
              <h3 className="text-xl font-bold text-white">Pro</h3>
              <p className="text-blue-100 mb-4">Unlimited replies</p>
              <div className="text-3xl font-bold text-white mb-6">$19<span className="text-lg font-normal text-blue-200">/mo</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-white"><CheckCircle className="w-5 h-5 text-blue-200" /> All tones available</li>
                <li className="flex items-center gap-2 text-white"><CheckCircle className="w-5 h-5 text-blue-200" /> Priority support</li>
              </ul>
              <Link href="/pricing" className="block w-full bg-white text-blue-600 text-center py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                View all plans
              </Link>
            </div>
            <div className="flex-1 bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hidden md:block">
              <h3 className="text-xl font-bold text-gray-900">Agency</h3>
              <p className="text-gray-500 mb-4">For multiple locations</p>
              <div className="text-3xl font-bold text-gray-900 mb-6">$49<span className="text-lg font-normal text-gray-500">/mo</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-gray-600"><CheckCircle className="w-5 h-5 text-blue-600" /> Up to 10 locations</li>
                <li className="flex items-center gap-2 text-gray-600"><CheckCircle className="w-5 h-5 text-blue-600" /> White label</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-8">
            <div>
              <h4 className="text-lg font-bold text-gray-900">How does the AI write the replies?</h4>
              <p className="mt-2 text-gray-600">We use OpenAI's advanced GPT-4o model, specifically prompted with rules on how to act as a professional reputation manager. It reads the specific context of the review and writes a tailored response.</p>
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900">Can I edit the replies before posting?</h4>
              <p className="mt-2 text-gray-600">Yes! The tool generates text that you can copy to your clipboard. You can paste it into Google and make any edits you want before hitting publish.</p>
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900">Do I have to connect my Google My Business account?</h4>
              <p className="mt-2 text-gray-600">No integration is needed. You simply copy the text of the review, paste it here, get your reply, and paste it back into Google. It's completely secure and hassle-free.</p>
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900">What if I get a negative review?</h4>
              <p className="mt-2 text-gray-600">Select the "Apologetic" or "Professional" tone. The AI is trained to de-escalate situations, apologize for the specific issue mentioned, and invite the customer to contact management offline.</p>
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900">Is there a free trial?</h4>
              <p className="mt-2 text-gray-600">We offer a forever-free plan that gives you 5 replies per month. No credit card required. If you need more, our Pro plan is only $19/month for unlimited replies.</p>
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900">Can I use this for Yelp or Facebook reviews?</h4>
              <p className="mt-2 text-gray-600">Absolutely. While we mention Google reviews because they are the most common, the AI-generated replies work perfectly for Yelp, Facebook, TripAdvisor, or any other review platform.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            <span className="text-lg font-bold text-gray-900">ReviewReply.ai</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/pricing" className="hover:text-gray-900">Pricing</Link>
            <Link href="/tool" className="hover:text-gray-900">Tool</Link>
            <Link href="/login" className="hover:text-gray-900">Login</Link>
            <span>© {new Date().getFullYear()} ReviewReply.ai</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
