import Header from '@/components/Header'
import Footer from '@/components/Footer'
import JobsList from '@/components/careers/JobsList'

export const metadata = {
  title: 'Careers - mySmartly',
  description: 'Join the mySmartly team and help build the future of business intelligence.',
}

export default function CareersPage() {
  return (
    <main className="min-h-screen">
      <Header />
      {/* Hero Section */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-blue-50/50 via-white to-burgundy-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6">
              Join Our Team
            </h1>
            <p className="text-xl md:text-2xl text-text-secondary mb-8 leading-relaxed">
              Help us build the future of business intelligence and decision automation.
            </p>
            <p className="text-lg text-text-secondary max-w-3xl mx-auto leading-relaxed">
              At mySmartly, we&apos;re transforming how businesses make decisions. We&apos;re looking for talented, driven individuals who share our passion for using AI and data to solve real business problems. If you&apos;re ready to make an impact, we&apos;d love to hear from you.
            </p>
          </div>
        </div>
      </section>

      <JobsList />
      <Footer />
    </main>
  )
}

