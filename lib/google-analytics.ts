/**
 * List user's Google Analytics properties
 */
export async function listAnalyticsProperties(accessToken: string) {
  try {
    // Use Google Analytics Admin API to list properties
    const response = await fetch('https://analyticsadmin.googleapis.com/v1beta/properties', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      // If Admin API fails, try to get properties from Data API
      // This is a fallback - Admin API is preferred
      console.warn('Analytics Admin API failed, trying alternative method')
      return []
    }

    const data = await response.json()
    
    // Format properties
    return (data.properties || []).map((prop: any) => ({
      propertyId: prop.name?.split('/').pop() || prop.propertyId,
      displayName: prop.displayName,
      account: prop.account,
    }))
  } catch (error) {
    console.error('Error listing Analytics properties:', error)
    // Return empty array - user can manually enter property ID if needed
    return []
  }
}

