'use client'

const companies = ['Shopify', 'HubSpot', 'Notion', 'Stripe', 'Zoom']

export default function SocialProofBar() {
  return (
    <section className="py-8 bg-white border-y border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
          <div className="text-center md:text-left">
            <p className="text-sm font-medium text-text-secondary mb-1">
              Trusted by 1,200+ businesses
            </p>
            <div className="flex items-center gap-1">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-medium text-primary ml-2">4.9/5</span>
              <span className="text-sm text-text-secondary">from 340+ reviews</span>
            </div>
          </div>

          <div className="flex items-center gap-8 flex-wrap justify-center">
            {companies.map((company, index) => (
              <div
                key={index}
                className="flex items-center justify-center w-24 h-8 bg-gray-100 rounded text-text-secondary text-sm font-medium opacity-60 hover:opacity-100 transition-opacity"
                aria-label={`${company} logo`}
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

