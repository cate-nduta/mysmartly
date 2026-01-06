'use client'

import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WaitlistForm from '@/components/WaitlistForm'

export default function WaitlistPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-accent/5 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-3xl"></div>
      </div>

      <Header />
      <main className="py-12 lg:py-16 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-2 bg-accent/20 text-accent rounded-full text-sm font-medium mb-4"
            >
              Early Access
            </motion.span>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Join the Waitlist
            </h1>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Be among the first to experience mySmartly. Get early access to AI-powered business insights that transform your decision-making.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 p-8 md:p-12 max-w-2xl mx-auto relative overflow-hidden"
          >
            {/* Decorative gradient behind form */}
            <div className="absolute -z-10 top-0 right-0 w-64 h-64 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-3xl"></div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4">Get Early Access</h2>
              <p className="text-text-secondary">
                Sign up to be notified when mySmartly launches. You&apos;ll be the first to know about new features, exclusive offers, and early access opportunities.
              </p>
            </div>

            <WaitlistForm />

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 pt-8 border-t border-gray-200"
            >
              <h3 className="text-2xl font-bold text-primary mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Why Join the mySmartly Inner Circle?
              </h3>
              <p className="text-text-secondary mb-8">
                Join our founding community and help shape the AI business analyst that actually solves your data challenges.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    title: 'Founding Member Priority',
                    desc: "Be among the first to access mySmartly and",
                    boldText: "secure special launch pricing",
                    descEnd: "reserved for our earliest supporters.",
                    gradient: 'from-primary/10 to-primary/5',
                    borderColor: 'border-primary/20',
                    hoverBorder: 'hover:border-primary/40',
                    iconBg: 'bg-primary/20'
                  },
                  {
                    title: 'Direct Product Influence',
                    desc: "Your feedback will",
                    boldText: "directly shape our development roadmap",
                    descEnd: ". We're building this with our users, not just for them.",
                    gradient: 'from-accent/10 to-accent/5',
                    borderColor: 'border-accent/20',
                    hoverBorder: 'hover:border-accent/40',
                    iconBg: 'bg-accent/20'
                  },
                  {
                    title: 'Exclusive Development Updates',
                    desc: 'Get behind-the-scenes access to our progress, challenges, and breakthroughs as we build, not just polished announcements.',
                    gradient: 'from-secondary/10 to-secondary/5',
                    borderColor: 'border-secondary/20',
                    hoverBorder: 'hover:border-secondary/40',
                    iconBg: 'bg-secondary/20'
                  },
                  {
                    title: 'Priority Implementation Support',
                    desc: "When we launch, you'll receive",
                    boldText: "personalized onboarding and direct access",
                    descEnd: "to our team for your first 90 days.",
                    gradient: 'from-accent/10 to-primary/5',
                    borderColor: 'border-accent/20',
                    hoverBorder: 'hover:border-accent/40',
                    iconBg: 'bg-accent/20'
                  },
                  {
                    title: 'Community Collaboration',
                    desc: 'Connect with other forward-thinking business leaders who believe in data-driven decisions. Share challenges, solutions, and insights.',
                    gradient: 'from-primary/10 to-secondary/5',
                    borderColor: 'border-primary/20',
                    hoverBorder: 'hover:border-primary/40',
                    iconBg: 'bg-primary/20'
                  },
                  {
                    title: 'Founder-Led Development',
                    desc: 'Work directly with our founding team. Your voice will be heard by the people building the product, not through layers of management.',
                    gradient: 'from-accent/10 to-secondary/5',
                    borderColor: 'border-accent/20',
                    hoverBorder: 'hover:border-accent/40',
                    iconBg: 'bg-accent/20'
                  },
                ].map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className={`bg-gradient-to-br ${benefit.gradient} rounded-xl p-6 border-2 ${benefit.borderColor} ${benefit.hoverBorder} transition-all duration-300 cursor-default relative overflow-hidden group`}
                  >
                    {/* Animated background on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                    
                    <div className="relative z-10">
                      <div className={`w-10 h-10 ${benefit.iconBg} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                        <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-semibold text-primary mb-2">{benefit.title}</h4>
                      <p className="text-text-secondary text-sm leading-relaxed">
                        {benefit.boldText ? (
                          <>{benefit.desc} <strong className="text-primary">{benefit.boldText}</strong> {benefit.descEnd}</>
                        ) : (
                          benefit.desc
                        )}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

