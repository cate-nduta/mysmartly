import Logo from './Logo'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-primary text-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Logo & Description */}
          <div className="md:col-span-1">
            <Logo className="mb-4" textColor="#FFFFFF" />
            <p className="text-gray-400 text-sm leading-relaxed">
              Your automated business analyst. Smart Decisions, AI-Validated. Every Time.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
              <li><a href="/careers" className="hover:text-white transition-colors">Careers</a></li>
              <li><Link href="/resources/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/waitlist" className="hover:text-white transition-colors">Join Waitlist</Link></li>
            </ul>
          </div>

          {/* Legal & Contact */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400 text-sm mb-4">
              <li><a href="/privacy" className="hover:text-white transition-colors">Privacy</a></li>
              <li><a href="/terms" className="hover:text-white transition-colors">Terms</a></li>
              <li><a href="/security" className="hover:text-white transition-colors">Security</a></li>
            </ul>
            <a href="mailto:hello@mysmartly.app" className="text-burgundy-200 hover:text-burgundy-100 transition-colors text-sm">
              hello@mysmartly.app
            </a>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2026 mySmartly. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            {/* Social icons placeholder */}
            <a href="#" aria-label="Twitter" className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors">
              <span className="text-xs">T</span>
            </a>
            <a href="#" aria-label="LinkedIn" className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors">
              <span className="text-xs">L</span>
            </a>
            <a href="#" aria-label="GitHub" className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors">
              <span className="text-xs">G</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
