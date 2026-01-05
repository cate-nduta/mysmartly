'use client'

import { useState, FormEvent } from 'react'
import { motion } from 'framer-motion'

export default function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: "Thank you! You've been added to the waitlist. We'll be in touch soon." })
        setEmail('')
      } else {
        setMessage({ type: 'error', text: data.error || 'Something went wrong. Please try again.' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Something went wrong. Please try again later.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          required
          disabled={loading}
          className="flex-1 px-5 py-3.5 border border-gray-200 rounded-lg font-sans text-[15px] text-text-primary bg-surface focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all disabled:opacity-50"
        />
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-8 py-3.5 bg-white text-primary rounded-lg font-medium text-[15px] hover:bg-accent hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shadow-lg"
        >
          {loading ? 'Joining...' : 'Join Waitlist'}
        </motion.button>
      </div>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-4 rounded-lg text-[15px] ${
            message.type === 'success'
              ? 'bg-secondary text-primary'
              : 'bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </motion.div>
      )}
    </form>
  )
}

