'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface SpendingSectionProps {
  userId: string
}

export default function SpendingSection({ userId }: SpendingSectionProps) {
  const [spendingLimit, setSpendingLimit] = useState<any>(null)
  const [budget, setBudget] = useState('0')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchSpendingLimit()
  }, [userId])

  const fetchSpendingLimit = async () => {
    try {
      const { data, error } = await supabase
        .from('spending_limits')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        setSpendingLimit(data)
        setBudget(data.on_demand_budget?.toString() || '0')
      } else {
        // Create default spending limit
        const { data: newLimit } = await supabase
          .from('spending_limits')
          .insert({
            user_id: userId,
            on_demand_budget: 0,
            current_spending: 0,
            is_active: false,
          })
          .select()
          .single()

        if (newLimit) {
          setSpendingLimit(newLimit)
        }
      }
    } catch (error) {
      console.error('Error fetching spending limit:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveBudget = async () => {
    setSaving(true)
    setMessage(null)

    try {
      const budgetAmount = parseFloat(budget) || 0

      if (budgetAmount < 0) {
        setMessage({ type: 'error', text: 'Budget cannot be negative' })
        setSaving(false)
        return
      }

      const { error } = await supabase
        .from('spending_limits')
        .upsert({
          user_id: userId,
          on_demand_budget: budgetAmount,
          is_active: budgetAmount > 0,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id',
        })

      if (error) throw error

      setMessage({ type: 'success', text: 'On-demand budget updated successfully!' })
      fetchSpendingLimit()
    } catch (error: any) {
      console.error('Error saving budget:', error)
      setMessage({ type: 'error', text: error.message || 'Failed to save budget' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">
          <p className="text-text-secondary">Loading spending data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-primary mb-2">On-Demand Spending</h2>
        <p className="text-text-secondary">
          Set a budget for on-demand usage. When your plan limits are exceeded, charges will be deducted from this budget.
        </p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success'
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-2xl">
        <div className="mb-6">
          <label className="block text-sm font-medium text-primary mb-2">
            On-Demand Budget (USD)
          </label>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary">$</span>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  min="0"
                  step="0.01"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="0.00"
                />
              </div>
            </div>
            <button
              onClick={handleSaveBudget}
              disabled={saving}
              className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {saving ? 'Saving...' : 'Save Budget'}
            </button>
          </div>
          <p className="mt-2 text-sm text-text-secondary">
            Set the maximum amount you want to spend on on-demand usage per billing period.
          </p>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-primary mb-4">Current Spending</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-text-secondary mb-1">Budget Set</p>
              <p className="text-2xl font-bold text-primary">
                ${spendingLimit?.on_demand_budget?.toFixed(2) || '0.00'}
              </p>
            </div>
            <div>
              <p className="text-sm text-text-secondary mb-1">Spent This Period</p>
              <p className="text-2xl font-bold text-primary">
                ${spendingLimit?.current_spending?.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>

          {spendingLimit && spendingLimit.on_demand_budget > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-secondary">Remaining Budget</span>
                <span className="text-sm font-semibold text-primary">
                  ${(spendingLimit.on_demand_budget - (spendingLimit.current_spending || 0)).toFixed(2)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    ((spendingLimit.current_spending || 0) / spendingLimit.on_demand_budget) >= 0.9
                      ? 'bg-red-500'
                      : ((spendingLimit.current_spending || 0) / spendingLimit.on_demand_budget) >= 0.7
                      ? 'bg-yellow-500'
                      : 'bg-accent'
                  }`}
                  style={{
                    width: `${Math.min(((spendingLimit.current_spending || 0) / spendingLimit.on_demand_budget) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">How On-Demand Spending Works</h4>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>When you exceed your plan limits mid-month, additional usage is charged from your on-demand budget</li>
            <li>You cannot renew your current plan early - you must wait until your billing period ends</li>
            <li>5 days before your subscription renews, you&apos;ll receive an email invoice for all on-demand charges</li>
            <li>You must pay the on-demand invoice before your subscription can renew</li>
            <li>If you prefer, you can upgrade to a higher tier instead of using on-demand</li>
            <li>You can update your budget at any time</li>
            <li>Unused budget does not roll over to the next period</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

