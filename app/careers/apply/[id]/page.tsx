import Header from '@/components/Header'
import Footer from '@/components/Footer'
import JobApplicationForm from '@/components/careers/JobApplicationForm'

export async function generateMetadata({ params }: { params: { id: string } }) {
  return {
    title: 'Apply for Position - mySmartly',
    description: 'Apply for a position at mySmartly',
  }
}

export default function ApplyPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen">
      <Header />
      <section className="py-12 lg:py-16 bg-gradient-to-br from-blue-50/50 via-white to-burgundy-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Apply for Position
            </h1>
            <p className="text-xl text-text-secondary">
              Tell us about yourself and why you&apos;d be a great fit for our team.
            </p>
          </div>
          <JobApplicationForm jobId={params.id} />
        </div>
      </section>
      <Footer />
    </main>
  )
}

