'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import ConnectionModal from './ConnectionModal'

interface DataConnection {
  id: string
  connection_type: string
  connection_name: string
  status: string
  last_sync_at: string | null
  connection_config?: any
}

const availableConnections = [
  { type: 'google_analytics', name: 'Google Analytics', icon: 'analytics' },
  { type: 'shopify', name: 'Shopify', icon: 'shopify' },
  { type: 'stripe', name: 'Stripe', icon: 'stripe' },
  { type: 'facebook_ads', name: 'Facebook Ads', icon: 'facebook' },
  { type: 'quickbooks', name: 'QuickBooks', icon: 'quickbooks' },
  { type: 'salesforce', name: 'Salesforce', icon: 'salesforce' },
  { type: 'hubspot', name: 'HubSpot', icon: 'hubspot' },
  { type: 'microsoft_dynamics', name: 'Microsoft Dynamics 365', icon: 'microsoft' },
  { type: 'oracle', name: 'Oracle Cloud', icon: 'oracle' },
  { type: 'sap', name: 'SAP', icon: 'sap' },
  { type: 'tableau', name: 'Tableau', icon: 'tableau' },
  { type: 'zendesk', name: 'Zendesk', icon: 'zendesk' },
]

const getConnectionIcon = (iconType: string) => {
  switch (iconType) {
    case 'analytics':
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    case 'shopify':
      return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16.841 4.269c.059.43.088.844.088 1.251 0 1.68-.428 3.056-1.283 4.132-.855 1.074-2.087 1.611-3.696 1.611-.131 0-.25-.01-.357-.028-.027-.23-.062-.458-.103-.689-.411-2.304-.057-3.983 1.064-5.038 1.123-1.056 2.653-1.584 4.594-1.584.044 0 .087.002.132.003.055-.251.125-.503.171-.662zm1.667 1.142c-.276.028-.613.043-1.009.043-1.584 0-2.81-.48-3.681-1.44-.871-.96-1.307-2.323-1.307-4.091h-2.896c-.056 0-.11.007-.166.021-.277.073-.45.33-.42.612.083.829.125 1.584.125 2.266 0 .45-.016.882-.048 1.296-.077 1.013-.23 1.92-.46 2.717-.054.186-.096.363-.125.53-.019.117-.028.225-.028.324 0 .054.005.107.015.159.125.81.596 1.474 1.414 1.987.817.515 1.865.772 3.145.772.054 0 .109-.002.165-.004.35-.014.691-.04 1.023-.082.88-.11 1.659-.331 2.338-.664.312-.153.577-.321.794-.503.027-.024.051-.048.073-.073.343-.385.518-.874.525-1.469-.007-.794-.493-1.589-1.457-2.386zM8.768 20.057l1.749-5.727.723 2.113c.063.183.2.315.359.355l1.768.428c.159.039.322.009.458-.086.136-.096.22-.24.215-.385l-.128-3.115v-.02l2.333-7.643c.037-.121.011-.252-.072-.351-.082-.1-.208-.158-.342-.157l-2.84.019c-.173 0-.335.093-.417.244l-.017.033-1.51 3.854-3.562 9.073c-.049.125-.032.264.045.376.077.111.201.179.336.186l1.633.066c.135.005.27-.024.384-.083zm-4.385 2.285c.751.789 1.685 1.183 2.803 1.183.821 0 1.528-.219 2.123-.659.594-.438 1.044-1.031 1.349-1.78.017-.043.033-.087.047-.131l1.238-3.233c.037-.1.014-.211-.064-.296-.077-.084-.192-.135-.313-.135l-1.759-.067a.412.412 0 00-.31.139c-.075.089-.098.204-.061.313l.008.022c.164.428.246.86.246 1.296 0 .589-.185 1.129-.555 1.621-.371.492-.896.738-1.576.738-.613 0-1.09-.188-1.43-.564-.34-.377-.51-.89-.51-1.539 0-.651.184-1.169.552-1.555.368-.386.881-.579 1.538-.579.262 0 .5.035.715.104.107.034.206.026.297-.025.091-.051.157-.131.192-.232l.874-2.855c.024-.077.02-.161-.012-.235-.032-.074-.09-.132-.167-.162l-5.445-1.744c-.077-.025-.162-.02-.239.012-.077.032-.138.091-.174.168L3.537 18.755c-.054.112-.038.239.044.334.082.095.207.151.339.151l.547-.008a.445.445 0 00.317-.138c.077-.083.105-.192.075-.306l-.027-.095c-.184-.642-.276-1.268-.276-1.879 0-1.612.464-2.914 1.391-3.907.928-.992 2.165-1.489 3.712-1.489.576 0 1.121.064 1.637.191.258.063.403.33.336.594-.067.263-.329.412-.587.35-.444-.109-.906-.163-1.386-.163-1.315 0-2.343.409-3.083 1.227-.741.818-1.111 1.959-1.111 3.424 0 .538.073 1.063.22 1.575l1.388-4.538c.037-.12.112-.223.217-.289.105-.065.231-.087.351-.058l3.372.844c.12.03.223.107.287.214.064.107.082.238.048.362l-.545 2.078c-.034.124-.118.23-.237.287-.119.058-.258.059-.378.004l-2.124-.854a.353.353 0 00-.341.027c-.101.063-.166.172-.177.293l-.43 4.514c-.011.121.034.24.122.323.088.084.21.124.332.106l1.78-.267c.122-.018.237-.082.313-.183.075-.1.103-.224.075-.346l-.068-.302c-.236-1.046-.354-2.062-.354-3.046 0-.821.12-1.606.358-2.357.119-.376.271-.729.455-1.06.092-.165.225-.3.388-.387.163-.087.35-.12.537-.096l5.777.925c.187.024.357.126.477.282.12.156.18.351.168.549l-.312 5.178c-.012.198-.1.384-.244.516-.144.132-.33.2-.52.19l-2.008-.096a.463.463 0 00-.412.18c-.089.107-.122.248-.088.383l.568 2.283c.034.135.13.249.262.303.132.054.28.042.402-.033.122-.075.205-.193.228-.326l.608-4.416c.023-.133-.014-.27-.099-.37-.085-.1-.208-.153-.337-.142l-1.613.11a.423.423 0 00-.347.192c-.071.1-.088.227-.044.343l1.392 3.703c.044.116.141.207.264.238.123.032.253.001.352-.082l.022-.019z" />
        </svg>
      )
    case 'stripe':
      return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.532-5.851-6.594-7.305h.003z" />
        </svg>
      )
    case 'facebook':
      return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      )
    case 'quickbooks':
      return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.045 16.538c-1.077 1.077-2.569 1.67-4.22 1.67-3.251 0-5.886-2.635-5.886-5.886 0-1.651.593-3.143 1.67-4.22 1.077-1.077 2.569-1.67 4.22-1.67 3.251 0 5.886 2.635 5.886 5.886 0 1.651-.593 3.143-1.67 4.22z" />
        </svg>
      )
    case 'salesforce':
      return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8.92 11.9c0 .73.13 1.41.4 2.04.26.63.64 1.17 1.14 1.62.5.44 1.09.79 1.76 1.03.67.24 1.39.36 2.16.36.78 0 1.5-.12 2.17-.36.67-.24 1.26-.59 1.76-1.03.5-.45.88-.99 1.14-1.62.26-.63.4-1.31.4-2.04 0-.73-.13-1.41-.4-2.04-.26-.63-.64-1.17-1.14-1.62-.5-.44-1.09-.79-1.76-1.03-.67-.24-1.39-.36-2.16-.36-.78 0-1.5.12-2.17.36-.67.24-1.26.59-1.76 1.03-.5.45-.88.99-1.14 1.62-.26.63-.4 1.31-.4 2.04zm-4.92-6.9c0 1.78.6 3.42 1.61 4.73-.62 1.15-1.04 2.46-1.23 3.88C2.83 13.34 2 11.73 2 10c0-2.21 1.79-4 4-4 1.53 0 2.85.85 3.52 2.1-.96.45-1.83 1.08-2.57 1.87-.74.79-1.34 1.73-1.75 2.77-.41-1.04-1.01-1.98-1.75-2.77C3.04 7.94 2 8.91 2 10c0 1.1.9 2 2 2 .73 0 1.37-.39 1.72-.97.35.58.99.97 1.72.97 1.1 0 2-.9 2-2 0-.57-.24-1.08-.63-1.45.25-.42.54-.81.87-1.16.33-.35.7-.66 1.1-.92C13.85 5.85 15.53 5 17.52 5c2.21 0 4 1.79 4 4 0 1.73-.83 3.34-2.16 4.39-.19-1.42-.61-2.73-1.23-3.88 1.01-1.31 1.61-2.95 1.61-4.73 0-3.87-3.13-7-7-7-2.37 0-4.45 1.18-5.72 2.98C8.45 2.18 6.37 1 4 1 1.79 1 0 2.79 0 5c0 2.21 1.79 4 4 4 .73 0 1.37-.39 1.72-.97C6.07 7.61 6.71 7 7.44 7c1.1 0 2 .9 2 2 0 .73-.39 1.37-.97 1.72C8.61 11.07 8 11.71 8 12.44c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2 0-2.21-1.79-4-4-4-.73 0-1.37.39-1.72.97C14.93 9.39 14.29 9 13.56 9c-1.1 0-2 .9-2 2 0 .57.24 1.08.63 1.45-.25.42-.54.81-.87 1.16-.33.35-.7.66-1.1.92C9.15 13.15 7.47 13 5.48 13c-2.21 0-4 1.79-4 4 0 1.73.83 3.34 2.16 4.39.19 1.42.61 2.73 1.23 3.88-1.01 1.31-1.61 2.95-1.61 4.73 0 3.87 3.13 7 7 7 2.37 0 4.45-1.18 5.72-2.98-1.27-1.8-3.35-2.98-5.72-2.98-3.87 0-7 3.13-7 7s3.13 7 7 7c3.87 0 7-3.13 7-7 0-1.78-.6-3.42-1.61-4.73.62-1.15 1.04-2.46 1.23-3.88C21.17 15.66 22 14.05 22 12.32c0-2.21-1.79-4-4-4-.73 0-1.37.39-1.72.97-.35-.58-.99-.97-1.72-.97-1.1 0-2 .9-2 2 0 .73.39 1.37.97 1.72.35.58.99.97 1.72.97 1.1 0 2-.9 2-2 0-2.21-1.79-4-4-4z" />
        </svg>
      )
    case 'hubspot':
      return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.1 12.6v-1.8c.6-.3 1.1-.8 1.5-1.3.2-.2.1-.5-.1-.6l-1.3-1.3c-.2-.2-.5-.2-.7 0-.5.5-1.1.9-1.8 1.2V7.3c0-.3-.2-.5-.5-.5h-1.8c-.3 0-.5.2-.5.5v1.8c-.7-.3-1.3-.7-1.8-1.2-.2-.2-.5-.2-.7 0L7.4 9.2c-.2.2-.2.5 0 .7.4.5.9 1 1.5 1.3V12.6c-.6.3-1.1.8-1.5 1.3-.2.2-.2.5 0 .7l1.3 1.3c.2.2.5.2.7 0 .5-.5 1.1-.9 1.8-1.2v1.8c0 .3.2.5.5.5h1.8c.3 0 .5-.2.5-.5v-1.8c.7.3 1.3.7 1.8 1.2.2.2.5.2.7 0l1.3-1.3c.2-.2.2-.5 0-.7-.4-.5-.9-1-1.5-1.3zm-3.6 1.8h-1.1v-1.1h1.1v1.1zm0-3.8h-1.1V9.5h1.1v1.1zM12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z"/>
        </svg>
      )
    case 'microsoft':
      return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/>
        </svg>
      )
    case 'oracle':
      return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16.412 4.412h-8.82a7.588 7.588 0 0 0-.008 15.176h8.828a7.588 7.588 0 0 0 0-15.176zm-.193 12.502H7.786a5.915 5.915 0 0 1 0-11.83h8.433a5.914 5.914 0 1 1 0 11.83z"/>
        </svg>
      )
    case 'sap':
      return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.906 4.742c-1.138 0-2.266.233-3.335.69L6.14 2.654C8.05 1.12 10.404 0 12.906 0c2.52 0 4.89 1.13 6.81 2.682l-3.48 2.767c-1.046-.443-2.167-.707-3.33-.707zm-6.443 2.442c-1.23 1.045-2.23 2.358-2.925 3.87L1.815 7.84C2.658 5.847 4.044 4.167 5.808 2.85l.655 4.335zm10.462.016l.654-4.33c1.764 1.317 3.15 2.997 3.993 4.99l-1.722 3.215c-.696-1.513-1.695-2.826-2.925-3.874zm-4.925.873c.352 0 .635.286.635.635 0 .35-.283.634-.635.634H9.678c-.349 0-.634-.284-.634-.634 0-.35.285-.635.634-.635h2.322zm-4.64 1.465l-3.48 2.77c.408.905.94 1.75 1.585 2.516l4.287-1.658-2.392-3.628zm9.288.017l-2.393 3.63 4.289 1.657c.646-.765 1.178-1.61 1.586-2.515l-3.482-2.772zm-4.648 2.28a.635.635 0 0 0-.634.634c0 .35.285.635.634.635h2.322c.352 0 .635-.286.635-.635a.636.636 0 0 0-.635-.634H12.9zm-4.65 3.026l.654 4.335c-1.764-1.317-3.15-2.997-3.993-4.99l1.722-3.215c.696 1.513 1.695 2.826 2.925 3.874zm10.462.016c1.23-1.045 2.23-2.36 2.926-3.873l1.721 3.216c-.843 1.992-2.23 3.672-3.993 4.99l-.654-4.334zm-4.912 1.807c1.137 0 2.265-.233 3.334-.69l3.431 2.778C17.762 22.88 15.408 24 12.906 24c-2.52 0-4.89-1.13-6.81-2.682l3.48-2.767c1.046.443 2.167.707 3.33.707z"/>
        </svg>
      )
    case 'tableau':
      return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8.63 14.16h4.28v1.86H8.63v-1.86zm8.4 0h4.28v1.86h-4.28v-1.86zm-8.4-3.48h4.28v1.86H8.63v-1.86zm8.4 0h4.28v1.86h-4.28v-1.86zM0 21.05h6.09V24H0v-2.95zm8.63 0h4.28V24H8.63v-2.95zm8.4 0h4.28V24h-4.28v-2.95zm-16.8-3.47h4.28v2.96H0v-2.96zm8.63 0h4.28v2.96H8.63v-2.96zm8.4 0h4.28v2.96h-4.28v-2.96zM0 10.68h6.09v2.96H0V10.68zm16.8 0H21v2.96h-4.2V10.68zm-8.17 0h4.28v2.96H8.63V10.68zm-8.63-3.48h4.28v2.96H0V7.2zm8.63 0h4.28v2.96H8.63V7.2zm8.4 0h4.28v2.96h-4.28V7.2zm-16.8-3.48h6.09v2.95H0V3.72zm16.8 0H21v2.95h-4.2V3.72zm-8.17 0h4.28v2.95H8.63V3.72z"/>
        </svg>
      )
    case 'zendesk':
      return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.914 2.904V16.29L24 2.904H12.914zM0 2.906l11.086 13.388V2.906H0zm11.086 18.19v-6.494L0 21.096h11.086zm12.828 0L12.828 14.602v6.494H23.914z"/>
        </svg>
      )
    default:
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      )
  }
}

export default function DataConnections({ userId }: { userId: string }) {
  const [connections, setConnections] = useState<DataConnection[]>([])
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedConnection, setSelectedConnection] = useState<{ type: string; name: string } | null>(null)

  useEffect(() => {
    fetchConnections()
  }, [userId])

  const fetchConnections = async () => {
    try {
      const { data, error } = await supabase
        .from('data_connections')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setConnections(data || [])
    } catch (error) {
      console.error('Error fetching connections:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConnectClick = (connectionType: string, connectionName: string) => {
    setSelectedConnection({ type: connectionType, name: connectionName })
    setModalOpen(true)
  }

  const handleConnect = async (connectionDetails: {
    connectionUrl?: string
    accountId?: string
    apiKey?: string
    storeUrl?: string
    propertyId?: string
  }) => {
    if (!selectedConnection) return

    setConnecting(selectedConnection.type)
    
    try {
      // Build connection URL based on connection type
      let connectionUrl = ''
      const config: any = {}

      switch (selectedConnection.type) {
        case 'google_analytics':
          if (connectionDetails.propertyId) {
            const propId = connectionDetails.propertyId.startsWith('http') 
              ? connectionDetails.propertyId 
              : `https://analytics.google.com/analytics/web/#/p${connectionDetails.propertyId}`
            connectionUrl = propId
            config.propertyId = connectionDetails.propertyId
          }
          break
        case 'shopify':
          if (connectionDetails.storeUrl) {
            const storeUrl = connectionDetails.storeUrl.startsWith('http')
              ? connectionDetails.storeUrl
              : `https://${connectionDetails.storeUrl.replace(/^https?:\/\//, '')}/admin`
            connectionUrl = storeUrl
            config.storeUrl = connectionDetails.storeUrl
          }
          break
        case 'stripe':
          if (connectionDetails.accountId) {
            const accId = connectionDetails.accountId.startsWith('http')
              ? connectionDetails.accountId
              : `https://dashboard.stripe.com/${connectionDetails.accountId}`
            connectionUrl = accId
            config.accountId = connectionDetails.accountId
          }
          break
        case 'facebook_ads':
          if (connectionDetails.accountId) {
            connectionUrl = `https://business.facebook.com/adsmanager/manage/campaigns?act=${connectionDetails.accountId}`
            config.accountId = connectionDetails.accountId
          }
          break
        case 'quickbooks':
          if (connectionDetails.accountId) {
            connectionUrl = connectionDetails.accountId.startsWith('http')
              ? connectionDetails.accountId
              : `https://quickbooks.intuit.com/global/`
            config.accountId = connectionDetails.accountId
          }
          break
        case 'salesforce':
        case 'microsoft_dynamics':
        case 'oracle':
        case 'sap':
        case 'tableau':
          if (connectionDetails.connectionUrl) {
            connectionUrl = connectionDetails.connectionUrl
            config.instanceUrl = connectionDetails.connectionUrl
          }
          break
        case 'hubspot':
          if (connectionDetails.accountId) {
            connectionUrl = `https://app.hubspot.com/contacts/${connectionDetails.accountId}/contacts/list/view/all/`
            config.portalId = connectionDetails.accountId
          }
          break
        case 'zendesk':
          if (connectionDetails.storeUrl) {
            connectionUrl = `https://${connectionDetails.storeUrl.replace(/^https?:\/\//, '').replace(/\.zendesk\.com$/, '')}.zendesk.com/agent`
            config.subdomain = connectionDetails.storeUrl
          }
          break
      }

      if (!connectionUrl) {
        throw new Error('Connection URL is required')
      }

      const { error } = await supabase
        .from('data_connections')
        .insert([{
          user_id: userId,
          connection_type: selectedConnection.type,
          connection_name: selectedConnection.name,
          status: 'connected',
          connection_config: config,
          last_sync_at: new Date().toISOString(),
        }])

      if (error) throw error
      
      setModalOpen(false)
      setSelectedConnection(null)
      await fetchConnections()
    } catch (error: any) {
      console.error('Error connecting:', error)
      alert(error.message || 'Failed to connect. Please try again.')
    } finally {
      setConnecting(null)
    }
  }

  const handleDisconnect = async (connectionId: string) => {
    if (!confirm('Are you sure you want to disconnect this data source?')) return

    try {
      const { error } = await supabase
        .from('data_connections')
        .delete()
        .eq('id', connectionId)

      if (error) throw error
      await fetchConnections()
    } catch (error) {
      console.error('Error disconnecting:', error)
      alert('Failed to disconnect. Please try again.')
    }
  }

  const getConnectionStatus = (type: string) => {
    return connections.find(c => c.connection_type === type)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <p className="text-text-secondary">Loading connections...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-primary mb-2">Data Connections</h2>
        <p className="text-text-secondary">
          Connect your business tools to get AI-powered insights and recommendations
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableConnections.map((conn) => {
          const existing = getConnectionStatus(conn.type)
          const isConnecting = connecting === conn.type

          return (
            <div
              key={conn.type}
              className={`p-4 border-2 rounded-lg ${
                existing
                  ? 'border-emerald-200 bg-emerald-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-accent">
                    {getConnectionIcon(conn.icon)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary">{conn.name}</h3>
                    {existing && (
                      <p className="text-xs text-emerald-600">Connected</p>
                    )}
                  </div>
                </div>
              </div>

              {existing ? (
                <div className="space-y-2">
                  <p className="text-xs text-text-secondary">
                    Last synced: {existing.last_sync_at 
                      ? new Date(existing.last_sync_at).toLocaleDateString()
                      : 'Never'}
                  </p>
                  <button
                    onClick={() => handleDisconnect(existing.id)}
                    className="w-full px-3 py-2 bg-red-100 text-red-700 rounded text-sm font-medium hover:bg-red-200 transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleConnectClick(conn.type, conn.name)}
                  disabled={isConnecting}
                  className="w-full px-3 py-2 bg-accent text-white rounded text-sm font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isConnecting ? 'Connecting...' : 'Connect'}
                </button>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Secure Integration:</strong> All connections use industry-standard OAuth protocols. 
          Your data is encrypted in transit and at rest. We never store your passwords.
        </p>
      </div>

      {selectedConnection && (
        <ConnectionModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false)
            setSelectedConnection(null)
          }}
          onConnect={handleConnect}
          connectionType={selectedConnection.type}
          connectionName={selectedConnection.name}
          connecting={connecting === selectedConnection.type}
        />
      )}
    </div>
  )
}
