// Utility functions to extract plan limits from features array

export interface PlanLimits {
  connections: number | null // null means unlimited
  recommendations: number | null // null means unlimited
  tokens: number | null // null means unlimited - for AI chatbot
}

export function getPlanLimits(features: string[]): PlanLimits {
  const limits: PlanLimits = {
    connections: null,
    recommendations: null,
    tokens: null,
  }

  // Parse features to extract limits
  features.forEach((feature) => {
    // Extract connections limit (e.g., "3 data connections", "10 data connections", "Unlimited connections")
    if (feature.toLowerCase().includes('connection')) {
      if (feature.toLowerCase().includes('unlimited')) {
        limits.connections = null // Unlimited
      } else {
        const match = feature.match(/(\d+)\s*data?\s*connection/i)
        if (match) {
          limits.connections = parseInt(match[1], 10)
        }
      }
    }

    // Extract decisions/recommendations limit (e.g., "500 decisions/month", "5,000 decisions/month")
    if (feature.toLowerCase().includes('decision') || feature.toLowerCase().includes('recommendation')) {
      if (feature.toLowerCase().includes('unlimited')) {
        limits.recommendations = null // Unlimited
      } else {
        const match = feature.match(/([\d,]+)\s*(?:decision|recommendation)/i)
        if (match) {
          limits.recommendations = parseInt(match[1].replace(/,/g, ''), 10)
        }
      }
    }

    // Extract tokens limit (e.g., "500 tokens/month", "1,500 tokens/month", "10,000 tokens/month")
    if (feature.toLowerCase().includes('token')) {
      if (feature.toLowerCase().includes('unlimited')) {
        limits.tokens = null // Unlimited
      } else {
        const match = feature.match(/([\d,]+)\s*token/i)
        if (match) {
          limits.tokens = parseInt(match[1].replace(/,/g, ''), 10)
        }
      }
    }
  })

  // Default token limits if not specified in features
  // Starter: 10,000 tokens, Pro: 50,000 tokens, Enterprise: Unlimited
  if (limits.tokens === null && features.length > 0) {
    // We'll set defaults based on plan name if available, but for now we'll handle it in the component
  }

  return limits
}

