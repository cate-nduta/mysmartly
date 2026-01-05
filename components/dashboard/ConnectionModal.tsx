'use client'

import { useState } from 'react'

interface ConnectionModalProps {
  isOpen: boolean
  onClose: () => void
  onConnect: (connectionDetails: {
    connectionUrl?: string
    accountId?: string
    apiKey?: string
    storeUrl?: string
    propertyId?: string
  }) => Promise<void>
  connectionType: string
  connectionName: string
  connecting: boolean
}

const getConnectionFields = (connectionType: string) => {
  switch (connectionType) {
    case 'google_analytics':
      return {
        title: 'Connect Google Analytics',
        description: 'Enter your Google Analytics property ID or account URL',
        fields: [
          {
            name: 'propertyId',
            label: 'Property ID or Account URL',
            placeholder: 'e.g., GA4-123456789 or https://analytics.google.com/analytics/web/#/p123456789',
            type: 'text',
            required: true,
          },
        ],
      }
    case 'shopify':
      return {
        title: 'Connect Shopify',
        description: 'Enter your Shopify store URL',
        fields: [
          {
            name: 'storeUrl',
            label: 'Store URL',
            placeholder: 'e.g., mystore.myshopify.com',
            type: 'text',
            required: true,
          },
        ],
      }
    case 'stripe':
      return {
        title: 'Connect Stripe',
        description: 'Enter your Stripe account details',
        fields: [
          {
            name: 'accountId',
            label: 'Account ID or Dashboard URL',
            placeholder: 'e.g., acct_1234567890 or https://dashboard.stripe.com/...',
            type: 'text',
            required: true,
          },
        ],
      }
    case 'facebook_ads':
      return {
        title: 'Connect Facebook Ads',
        description: 'Enter your Facebook Ads Manager account ID',
        fields: [
          {
            name: 'accountId',
            label: 'Ad Account ID',
            placeholder: 'e.g., act_123456789',
            type: 'text',
            required: true,
          },
        ],
      }
    case 'quickbooks':
      return {
        title: 'Connect QuickBooks',
        description: 'Enter your QuickBooks company details',
        fields: [
          {
            name: 'accountId',
            label: 'Company ID or Dashboard URL',
            placeholder: 'e.g., Company ID or https://quickbooks.intuit.com/...',
            type: 'text',
            required: true,
          },
        ],
      }
    case 'salesforce':
      return {
        title: 'Connect Salesforce',
        description: 'Enter your Salesforce instance URL',
        fields: [
          {
            name: 'connectionUrl',
            label: 'Salesforce Instance URL',
            placeholder: 'e.g., https://yourcompany.my.salesforce.com',
            type: 'text',
            required: true,
          },
        ],
      }
    case 'hubspot':
      return {
        title: 'Connect HubSpot',
        description: 'Enter your HubSpot portal ID',
        fields: [
          {
            name: 'accountId',
            label: 'Portal ID',
            placeholder: 'e.g., 12345678',
            type: 'text',
            required: true,
          },
        ],
      }
    case 'microsoft_dynamics':
      return {
        title: 'Connect Microsoft Dynamics 365',
        description: 'Enter your Dynamics 365 instance URL',
        fields: [
          {
            name: 'connectionUrl',
            label: 'Instance URL',
            placeholder: 'e.g., https://yourorg.crm.dynamics.com',
            type: 'text',
            required: true,
          },
        ],
      }
    case 'oracle':
      return {
        title: 'Connect Oracle Cloud',
        description: 'Enter your Oracle Cloud instance URL',
        fields: [
          {
            name: 'connectionUrl',
            label: 'Instance URL',
            placeholder: 'e.g., https://yourorg.oraclecloud.com',
            type: 'text',
            required: true,
          },
        ],
      }
    case 'sap':
      return {
        title: 'Connect SAP',
        description: 'Enter your SAP system details',
        fields: [
          {
            name: 'connectionUrl',
            label: 'SAP System URL',
            placeholder: 'e.g., https://yourcompany.sap.com',
            type: 'text',
            required: true,
          },
        ],
      }
    case 'tableau':
      return {
        title: 'Connect Tableau',
        description: 'Enter your Tableau server URL',
        fields: [
          {
            name: 'connectionUrl',
            label: 'Tableau Server URL',
            placeholder: 'e.g., https://yourcompany.tableau.com',
            type: 'text',
            required: true,
          },
        ],
      }
    case 'zendesk':
      return {
        title: 'Connect Zendesk',
        description: 'Enter your Zendesk subdomain',
        fields: [
          {
            name: 'storeUrl',
            label: 'Zendesk Subdomain',
            placeholder: 'e.g., yourcompany',
            type: 'text',
            required: true,
          },
        ],
      }
    default:
      return {
        title: `Connect ${connectionType}`,
        description: 'Enter your connection details',
        fields: [
          {
            name: 'connectionUrl',
            label: 'Connection URL',
            placeholder: 'Enter connection URL or identifier',
            type: 'text',
            required: true,
          },
        ],
      }
  }
}

export default function ConnectionModal({
  isOpen,
  onClose,
  onConnect,
  connectionType,
  connectionName,
  connecting,
}: ConnectionModalProps) {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!isOpen) return null

  const connectionFields = getConnectionFields(connectionType)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validate required fields
    const newErrors: Record<string, string> = {}
    connectionFields.fields.forEach((field) => {
      if (field.required && !formData[field.name]?.trim()) {
        newErrors[field.name] = `${field.label} is required`
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      await onConnect(formData as any)
      setFormData({})
    } catch (error) {
      console.error('Connection error:', error)
    }
  }

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-primary">{connectionFields.title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={connecting}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-text-secondary mb-6">{connectionFields.description}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {connectionFields.fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-primary mb-2">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type={field.type}
                value={formData[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent ${
                  errors[field.name] ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={connecting}
              />
              {errors[field.name] && (
                <p className="mt-1 text-sm text-red-600">{errors[field.name]}</p>
              )}
            </div>
          ))}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={connecting}
              className="flex-1 px-4 py-3 bg-gray-100 text-primary rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={connecting}
              className="flex-1 px-4 py-3 bg-accent text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {connecting ? 'Connecting...' : 'Connect'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

