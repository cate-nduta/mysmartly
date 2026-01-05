import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import FinalCTA from '@/components/FinalCTA'

// Blog posts content - in production, this would come from a database or CMS
const blogPosts: Record<string, any> = {
  'real-cost-analysis-paralysis': {
    title: 'The Real Cost of Analysis Paralysis in Business',
    author: 'mySmartly Team',
    date: '2026-01-15',
    readTime: '5 min read',
    category: 'Strategy',
    content: `
      <p>Analysis paralysis is one of the most costly business problems that rarely gets the attention it deserves. While most business leaders recognize the symptoms—endless meetings, delayed decisions, and teams stuck in planning mode—few realize the true cost of this condition.</p>
      
      <h2>The Hidden Costs</h2>
      <p>When businesses get stuck in analysis mode, they're not just wasting time. They're:</p>
      <ul>
        <li><strong>Missing opportunities:</strong> While you're analyzing, competitors are moving. Market windows close fast.</li>
        <li><strong>Burning resources:</strong> Time spent analyzing is time not spent executing or generating revenue.</li>
        <li><strong>Losing momentum:</strong> Teams lose enthusiasm when decisions are delayed, leading to decreased productivity.</li>
        <li><strong>Increasing costs:</strong> Extended analysis periods mean more meetings, more reports, more overhead.</li>
      </ul>

      <h2>The Data-Driven Solution</h2>
      <p>The solution isn't to stop analyzing—it's to analyze faster and more effectively. Modern AI-powered analytics platforms can process data in minutes that would take teams weeks to analyze manually.</p>

      <h2>Breaking Free</h2>
      <p>Start by setting clear decision deadlines. Use data to inform decisions, not to delay them. And most importantly, remember that perfect data is the enemy of good decisions. In business, good decisions made quickly often beat perfect decisions made too late.</p>
    `,
  },
  'calculate-marketing-roi': {
    title: 'How to Calculate Marketing ROI: A Simple Guide',
    author: 'mySmartly Team',
    date: '2026-01-10',
    readTime: '7 min read',
    category: 'Marketing',
    content: `
      <p>Marketing ROI seems straightforward: revenue from marketing divided by marketing costs. But true ROI calculation is more nuanced than this simple formula suggests.</p>

      <h2>The Basic Formula</h2>
      <p>At its simplest, Marketing ROI = (Revenue from Marketing - Marketing Costs) / Marketing Costs × 100</p>
      <p>But this basic formula misses several important factors.</p>

      <h2>Including Customer Lifetime Value</h2>
      <p>If you're only counting immediate revenue, you're underestimating your ROI. A customer acquired through marketing doesn't just generate revenue once—they generate revenue over their lifetime.</p>
      <p>Calculate LTV-based ROI: (LTV × Number of Customers - Marketing Costs) / Marketing Costs × 100</p>

      <h2>Attribution Challenges</h2>
      <p>Modern customers interact with multiple touchpoints before converting. Proper attribution ensures you're crediting the right channels with the right value.</p>

      <h2>Indirect Benefits</h2>
      <p>Marketing also generates indirect benefits: brand awareness, customer education, and competitive positioning. While harder to measure, these shouldn't be ignored.</p>
    `,
  },
  'ecommerce-data-mistakes': {
    title: '5 Data Mistakes E-commerce Stores Make (And How to Fix Them)',
    author: 'mySmartly Team',
    date: '2026-01-05',
    readTime: '6 min read',
    category: 'E-commerce',
    content: `
      <p>E-commerce stores have access to more data than ever before, but many are making critical mistakes that cost them revenue and growth. Here are the five most common mistakes and how to fix them.</p>

      <h2>1. Ignoring Customer Lifetime Value</h2>
      <p>Many e-commerce stores optimize for immediate conversion while ignoring the long-term value of customers. Focus on metrics that matter for long-term growth.</p>

      <h2>2. Not Tracking Abandoned Carts Properly</h2>
      <p>Cart abandonment is a goldmine of opportunity. Track it, analyze it, and create targeted campaigns to recover those sales.</p>

      <h2>3. Poor Inventory Management</h2>
      <p>Too much inventory ties up capital; too little loses sales. Use data to predict demand and optimize stock levels.</p>

      <h2>4. Neglecting Post-Purchase Data</h2>
      <p>What happens after purchase matters. Return rates, repeat purchase behavior, and customer satisfaction all inform future strategies.</p>

      <h2>5. Analysis Without Action</h2>
      <p>Data is useless if it doesn't lead to decisions. Implement systems that translate insights into actionable recommendations.</p>
    `,
  },
  'automated-decisions-2026': {
    title: 'Why 2026 is the Year of Automated Business Decisions',
    author: 'mySmartly Team',
    date: '2026-01-01',
    readTime: '8 min read',
    category: 'Trends',
    content: `
      <p>2026 marks a turning point for business decision-making. The convergence of advanced AI, accessible analytics platforms, and economic pressures is making automated decision-making not just viable, but necessary.</p>

      <h2>The Perfect Storm</h2>
      <p>Several factors are converging to make 2026 the year of automated decisions:</p>
      <ul>
        <li><strong>AI Maturity:</strong> AI models have reached a level of sophistication where they can handle complex business scenarios.</li>
        <li><strong>Data Accessibility:</strong> More business data is accessible than ever before, making automation feasible.</li>
        <li><strong>Economic Pressure:</strong> Businesses need to do more with less, making efficiency critical.</li>
        <li><strong>Competitive Necessity:</strong> Companies that don't automate are falling behind those that do.</li>
      </ul>

      <h2>The Benefits</h2>
      <p>Automated decision-making offers clear advantages: speed, consistency, scalability, and the ability to process more data than humans ever could.</p>

      <h2>Getting Started</h2>
      <p>Start small. Automate simple, high-frequency decisions first. As you build confidence and infrastructure, expand to more complex scenarios.</p>
    `,
  },
  'case-study-profit-increase': {
    title: 'Case Study: How a SaaS Company Increased Profits by 34% with Data Automation',
    author: 'mySmartly Team',
    date: '2023-12-20',
    readTime: '10 min read',
    category: 'Case Study',
    content: `
      <p>This case study examines how a mid-size SaaS company transformed their decision-making process and achieved dramatic results in just six months.</p>

      <h2>The Challenge</h2>
      <p>The company was drowning in data but starving for insights. Their team spent 60% of their time on data collection and analysis, leaving little time for execution.</p>

      <h2>The Solution</h2>
      <p>They implemented an AI-powered decision automation platform that:</p>
      <ul>
        <li>Connected to all their data sources automatically</li>
        <li>Generated daily recommendations with clear action steps</li>
        <li>Prioritized actions based on projected impact</li>
        <li>Tracked outcomes to improve recommendations over time</li>
      </ul>

      <h2>The Results</h2>
      <p>Within six months:</p>
      <ul>
        <li>34% increase in profits</li>
        <li>40% reduction in time spent on analysis</li>
        <li>28% improvement in decision speed</li>
        <li>25% reduction in customer churn</li>
      </ul>

      <h2>Key Takeaways</h2>
      <p>The success wasn't just about the technology—it was about changing the decision-making culture. The platform enabled faster, data-driven decisions, but it was the team's willingness to act on recommendations that drove the results.</p>
    `,
  },
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = blogPosts[params.slug]
  
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: `${post.title} | mySmartly Blog`,
    description: post.excerpt || post.content.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.substring(0, 160),
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || post.content.substring(0, 160),
    },
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug]

  if (!post) {
    notFound()
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Resources', href: '/resources' },
    { label: 'Blog', href: '/resources/blog' },
    { label: post.title, href: `/resources/blog/${params.slug}` },
  ]

  return (
    <main className="min-h-screen">
      <Header />
      <Breadcrumb items={breadcrumbItems} />

      {/* Article */}
      <article className="py-20 lg:py-32 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Article Header */}
          <header className="mb-12">
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
                {post.category}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              {post.title}
            </h1>
            <div className="flex items-center gap-6 text-text-secondary">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{post.readTime}</span>
              </div>
            </div>
          </header>

          {/* Article Content */}
          <div
            className="prose prose-lg max-w-none prose-headings:text-primary prose-p:text-text-secondary prose-li:text-text-secondary prose-a:text-accent prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Back to Blog */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link
              href="/resources/blog"
              className="inline-flex items-center text-accent font-semibold hover:underline"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Blog
            </Link>
          </div>
        </div>
      </article>

      <FinalCTA />
      <Footer />
    </main>
  )
}

