'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface Job {
  id: string
  title: string
  department: string
  location: string
  type: string
  description: string
  requirements: string[]
  salary: number | null
  is_active: boolean
}

export default function JobsList() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      // Check if Supabase is properly configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        setError('Database connection not configured')
        setLoading(false)
        return
      }

      const { data, error: fetchError } = await supabase
        .from('jobs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      setJobs(data || [])
    } catch (error: any) {
      console.error('Error fetching jobs:', error)
      setError(error.message || 'Failed to load jobs')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-12 lg:py-16 bg-gradient-to-b from-white to-blue-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center">
            <p className="text-text-secondary">Loading job openings...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-12 lg:py-16 bg-gradient-to-b from-white to-blue-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-primary mb-4">No Open Positions</h2>
            <p className="text-text-secondary mb-8">
              We don&apos;t have any open positions at the moment, but we&apos;re always interested in hearing from talented people.
            </p>
            <p className="text-text-secondary">
              Send us your resume at <a href="mailto:careers@mysmartly.app" className="text-accent hover:underline">careers@mysmartly.app</a>
            </p>
          </div>
        </div>
      </section>
    )
  }

  if (jobs.length === 0) {
    return (
      <section className="py-12 lg:py-16 bg-gradient-to-b from-white to-blue-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-primary mb-4">No Open Positions</h2>
            <p className="text-text-secondary mb-8">
              We don&apos;t have any open positions at the moment, but we&apos;re always interested in hearing from talented people.
            </p>
            <p className="text-text-secondary">
              Send us your resume at <a href="mailto:careers@mysmartly.app" className="text-accent hover:underline">careers@mysmartly.app</a>
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-12">
          Open Positions
        </h2>
        <div className="space-y-6">
          {jobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-50 border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-primary mb-2">{job.title}</h3>
                       <div className="flex flex-wrap gap-4 text-text-secondary text-sm mb-4">
                         <span>{job.department}</span>
                         <span>•</span>
                         <span>{job.location}</span>
                         <span>•</span>
                         <span>{job.type}</span>
                         {job.salary && (
                           <>
                             <span>•</span>
                             <span className="font-medium text-primary">${job.salary.toLocaleString('en-US')}</span>
                           </>
                         )}
                       </div>
                  <p className="text-text-secondary leading-relaxed mb-4">{job.description}</p>
                  {job.requirements && job.requirements.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-primary mb-2">Requirements:</h4>
                      <ul className="list-disc list-inside text-text-secondary space-y-1">
                        {job.requirements.map((req, i) => (
                          <li key={i}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <Link
                  href={`/careers/apply/${job.id}`}
                  className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors whitespace-nowrap"
                >
                  Apply Now
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
