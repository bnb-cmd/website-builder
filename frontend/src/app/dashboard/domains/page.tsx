"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  Globe, 
  Check, 
  X,
  ExternalLink,
  Plus,
  Settings,
  Clock,
  AlertCircle,
  Copy,
  CheckCircle,
  Link2,
  RefreshCw,
  Play,
  Pause,
  Activity,
  Zap
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { apiHelpers } from '@/lib/api';

// Domain providers configuration
const DOMAIN_PROVIDERS = [
  {
    id: 'namecheap',
    name: 'Namecheap',
    logo: '🏷️',
    description: 'Affordable domains with free privacy',
    affiliateBaseUrl: 'https://www.namecheap.com/domains/registration/results/?domain=',
    pricing: { '.com': 8.88, '.net': 10.98, '.org': 11.98 }
  },
  {
    id: 'godaddy',
    name: 'GoDaddy',
    logo: '🔷',
    description: 'Popular with 24/7 support',
    affiliateBaseUrl: 'https://www.godaddy.com/domainsearch/find?domainToCheck=',
    pricing: { '.com': 9.99, '.net': 12.99, '.org': 12.99 }
  },
  {
    id: 'google',
    name: 'Google Domains',
    logo: '🔍',
    description: 'Simple and secure',
    affiliateBaseUrl: 'https://domains.google.com/registrar/search?searchTerm=',
    pricing: { '.com': 12.00, '.net': 12.00, '.org': 12.00 }
  },
  {
    id: 'cloudflare',
    name: 'Cloudflare',
    logo: '☁️',
    description: 'At-cost pricing',
    affiliateBaseUrl: 'https://www.cloudflare.com/products/registrar/',
    pricing: { '.com': 8.57, '.net': 8.57, '.org': 8.57 }
  },
  {
    id: 'porkbun',
    name: 'Porkbun',
    logo: '🐷',
    description: 'Low prices, great features',
    affiliateBaseUrl: 'https://porkbun.com/products/domains?search=',
    pricing: { '.com': 8.98, '.net': 10.98, '.org': 10.98 }
  }
];

// Sample linked domains data
const linkedDomains = [
  {
    id: '1',
    domain: 'mybusiness.com',
    status: 'active',
    websiteName: 'My Business Site',
    websiteId: '1',
    expiryDate: new Date('2025-12-15'),
    autoRenew: true,
    sslStatus: 'active',
    provider: 'namecheap'
  },
  {
    id: '2',
    domain: 'myportfolio.dev',
    status: 'pending_verification',
    websiteName: 'Portfolio Website',
    websiteId: '2',
    expiryDate: new Date('2025-11-20'),
    autoRenew: false,
    sslStatus: 'pending',
    provider: 'godaddy'
  }
];

export default function DomainsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExtension, setSelectedExtension] = useState('.com');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('namecheap');
  const [showDNSInstructions, setShowDNSInstructions] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [domains, setDomains] = useState(linkedDomains);
  const [dnsStats, setDnsStats] = useState<any>(null);
  const [dnsProviders, setDnsProviders] = useState<any[]>([]);
  const [verificationStatus, setVerificationStatus] = useState<{[key: string]: any}>({});
  const [isVerifying, setIsVerifying] = useState<{[key: string]: boolean}>({});
  const [showSettings, setShowSettings] = useState<string | null>(null);
  const [domainSettings, setDomainSettings] = useState<{[key: string]: any}>({});
  const [showImportModal, setShowImportModal] = useState(false);
  const [importDomain, setImportDomain] = useState('');
  const [importProvider, setImportProvider] = useState('');

  const extensions = ['.com', '.net', '.org', '.io', '.dev', '.app', '.co'];

  // Load DNS stats and providers on component mount
  useEffect(() => {
    loadDNSData();
  }, []);

  const loadDNSData = async () => {
    try {
      const [statsResponse, providersResponse] = await Promise.all([
        apiHelpers.getDNSStats(),
        apiHelpers.getDNSProviders()
      ]);
      
      setDnsStats(statsResponse.stats);
      setDnsProviders(providersResponse.providers);
    } catch (error) {
      console.error('Failed to load DNS data:', error);
    }
  };

  // Simulate domain search
  const searchDomain = async () => {
    if (!searchQuery) return;
    
    setIsSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      const results = extensions.map(ext => ({
        domain: `${searchQuery}${ext}`,
        available: Math.random() > 0.5,
        extension: ext,
        price: DOMAIN_PROVIDERS.find(p => p.id === selectedProvider)?.pricing[ext as keyof typeof DOMAIN_PROVIDERS[0]['pricing']] || 9.99
      }));
      
      setSearchResults(results);
      setIsSearching(false);
    }, 1000);
  };

  const openProviderRegistration = (domain: string, providerId: string) => {
    const provider = DOMAIN_PROVIDERS.find(p => p.id === providerId);
    if (provider) {
      const url = `${provider.affiliateBaseUrl}${domain}`;
      window.open(url, '_blank');
      
      // Track domain registration attempt
      console.log(`Domain registration initiated: ${domain} with ${provider.name}`);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // DNS Verification Functions
  const verifyDomainDNS = async (domain: string) => {
    try {
      setIsVerifying(prev => ({ ...prev, [domain]: true }));
      
      const result = await apiHelpers.verifyDomainDNS(domain);
      
      setVerificationStatus(prev => ({
        ...prev,
        [domain]: result.verification
      }));
      
      return result.verification;
    } catch (error) {
      console.error('DNS verification failed:', error);
      return null;
    } finally {
      setIsVerifying(prev => ({ ...prev, [domain]: false }));
    }
  };

  const startAutomatedVerification = async (domainId: string) => {
    try {
      await apiHelpers.startDNSVerification(domainId, 5); // Check every 5 minutes
      alert('Automated verification started! We\'ll check your DNS every 5 minutes.');
    } catch (error) {
      console.error('Failed to start automated verification:', error);
      alert('Failed to start automated verification');
    }
  };

  const stopAutomatedVerification = async (domainId: string) => {
    try {
      await apiHelpers.stopDNSVerification(domainId);
      alert('Automated verification stopped');
    } catch (error) {
      console.error('Failed to stop automated verification:', error);
      alert('Failed to stop automated verification');
    }
  };

  const testDNSProvider = async (provider: string, domain: string) => {
    try {
      const result = await apiHelpers.testDNSProvider(provider, domain);
      alert(`Provider test result: ${result.result.isValid ? 'Success' : 'Failed'}`);
    } catch (error) {
      console.error('Provider test failed:', error);
      alert('Provider test failed');
    }
  };

  // Domain Settings Functions
  const openDomainSettings = (domainId: string) => {
    setShowSettings(domainId);
    // Initialize settings for this domain
    const domain = domains.find(d => d.id === domainId);
    if (domain) {
      setDomainSettings(prev => ({
        ...prev,
        [domainId]: {
          autoRenew: domain.autoRenew,
          privacyProtection: (domain as any).privacyProtection || true,
          emailNotifications: true,
          sslEnabled: domain.sslStatus === 'active',
          dnsVerificationInterval: 5
        }
      }));
    }
  };

  const updateDomainSetting = (domainId: string, setting: string, value: any) => {
    setDomainSettings(prev => ({
      ...prev,
      [domainId]: {
        ...prev[domainId],
        [setting]: value
      }
    }));
  };

  const saveDomainSettings = async (domainId: string) => {
    try {
      const settings = domainSettings[domainId];
      if (!settings) return;

      // Update domain in the list
      setDomains(prev => prev.map(domain => 
        domain.id === domainId 
          ? { 
              ...domain, 
              autoRenew: settings.autoRenew,
              privacyProtection: settings.privacyProtection,
              sslStatus: settings.sslEnabled ? 'active' : 'pending'
            }
          : domain
      ));

      // Close settings modal
      setShowSettings(null);
      
      alert('Domain settings saved successfully!');
    } catch (error) {
      console.error('Failed to save domain settings:', error);
      alert('Failed to save domain settings');
    }
  };

  const deleteDomain = async (domainId: string) => {
    if (confirm('Are you sure you want to delete this domain? This action cannot be undone.')) {
      try {
        setDomains(prev => prev.filter(domain => domain.id !== domainId));
        setShowSettings(null);
        alert('Domain deleted successfully!');
      } catch (error) {
        console.error('Failed to delete domain:', error);
        alert('Failed to delete domain');
      }
    }
  };

  // External Domain Import Functions
  const importExternalDomain = async () => {
    if (!importDomain || !importProvider) {
      alert('Please enter domain name and select provider');
      return;
    }

    try {
      // Validate domain format
      const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
      if (!domainRegex.test(importDomain)) {
        alert('Please enter a valid domain name (e.g., example.com)');
        return;
      }

      // Create new domain entry
      const newDomain = {
        id: `ext-${Date.now()}`,
        domain: importDomain,
        status: 'pending_verification',
        provider: importProvider,
        websiteId: null,
        websiteName: null,
        sslStatus: 'pending',
        autoRenew: false,
        privacyProtection: false,
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        registrationDate: new Date(),
        isExternal: true
      };

      setDomains(prev => [...prev, newDomain]);
      setShowImportModal(false);
      setImportDomain('');
      setImportProvider('');
      
      alert(`External domain ${importDomain} imported successfully! Please configure DNS settings to connect it to your website.`);
    } catch (error) {
      console.error('Failed to import external domain:', error);
      alert('Failed to import external domain');
    }
  };

  const connectDomainToWebsite = async (domainId: string, websiteId: string) => {
    try {
      // Update domain to connect to website
      setDomains(prev => prev.map(domain => 
        domain.id === domainId 
          ? { 
              ...domain, 
              websiteId: websiteId,
              websiteName: 'My Business Site', // This would come from API
              status: 'active'
            }
          : domain
      ));

      // Automatically publish the website when domain is connected
      await publishWebsiteToDomain(websiteId, domainId);
      
      alert('Domain connected to website successfully! Your website has been automatically published to this domain.');
    } catch (error) {
      console.error('Failed to connect domain to website:', error);
      alert('Failed to connect domain to website');
    }
  };

  const publishWebsiteToDomain = async (websiteId: string, domainId: string) => {
    try {
      // Get the domain name
      const domain = domains.find(d => d.id === domainId);
      if (!domain) {
        throw new Error('Domain not found');
      }

      // Call the backend API to publish the website
      const result = await apiHelpers.publishWebsite(websiteId, domain.domain);
      
      console.log('Website published successfully:', result);
    } catch (error) {
      console.error('Failed to publish website:', error);
      throw error;
    }
  };

  const getDaysUntilExpiry = (expiryDate: Date) => {
    const days = Math.floor((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending_verification': return 'bg-yellow-500';
      case 'expired': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'pending_verification': return 'Pending Verification';
      case 'expired': return 'Expired';
      default: return 'Unknown';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
             <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
               <div>
                 <h1 className="text-2xl font-semibold">Domain Management</h1>
                 <p className="text-muted-foreground">
                   Register and manage custom domains for your websites
                 </p>
               </div>
               
               <div className="flex gap-2">
                 <Button 
                   variant="outline"
                   onClick={() => setShowImportModal(true)}
                 >
                   <Plus className="h-4 w-4 mr-2" />
                   Import External Domain
                 </Button>
               </div>
             </div>

      {/* DNS Verification Statistics */}
      {dnsStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              DNS Verification Statistics
            </CardTitle>
            <CardDescription>
              Real-time monitoring of your domain DNS configurations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{dnsStats.total}</div>
                <div className="text-sm text-muted-foreground">Total Domains</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-green-600">{dnsStats.active}</div>
                <div className="text-sm text-muted-foreground">Verified</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{dnsStats.pending}</div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{dnsStats.successRate.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>
            
            {dnsStats.providers && (
              <div className="mt-6">
                <h4 className="font-medium mb-3">Available DNS Providers</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {dnsStats.providers.map((provider: any) => (
                    <div key={provider.name} className="p-3 border rounded-lg text-center">
                      <div className="font-medium text-sm">{provider.name}</div>
                      <div className="text-xs text-muted-foreground">{provider.cost}</div>
                      <div className="text-xs text-muted-foreground">{provider.rateLimit}/hour</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Domain Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search for a Domain</CardTitle>
          <CardDescription>
            Find and register the perfect domain for your website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="flex gap-2">
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Enter domain name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchDomain()}
                className="flex-1"
              />
              <select
                value={selectedExtension}
                onChange={(e) => setSelectedExtension(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                {extensions.map(ext => (
                  <option key={ext} value={ext}>{ext}</option>
                ))}
              </select>
            </div>
            <Button onClick={searchDomain} disabled={isSearching}>
              {isSearching ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
              Search
            </Button>
          </div>

          {/* Provider Selection */}
          <div>
            <p className="text-sm font-medium mb-3">Select Provider</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {DOMAIN_PROVIDERS.map(provider => (
                <button
                  key={provider.id}
                  onClick={() => setSelectedProvider(provider.id)}
                  className={`p-3 border-2 rounded-lg transition-all hover:shadow-md ${
                    selectedProvider === provider.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="text-2xl mb-1">{provider.logo}</div>
                  <div className="text-sm font-medium">{provider.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    from ${provider.pricing['.com']}/yr
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-2 mt-6">
              <h3 className="font-medium">Search Results</h3>
              <div className="space-y-2">
                {searchResults.map((result, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${result.available ? 'bg-green-500' : 'bg-red-500'}`} />
                      <div>
                        <div className="font-medium">{result.domain}</div>
                        <div className="text-sm text-muted-foreground">
                          {result.available ? 'Available' : 'Taken'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {result.available && (
                        <>
                          <span className="font-semibold">${result.price}/year</span>
                          <Button 
                            size="sm"
                            onClick={() => openProviderRegistration(result.domain, selectedProvider)}
                          >
                            Register
                            <ExternalLink className="ml-2 h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Linked Domains */}
      <Card>
        <CardHeader>
          <CardTitle>Your Domains</CardTitle>
          <CardDescription>
            Manage domains linked to your websites
          </CardDescription>
        </CardHeader>
        <CardContent>
          {domains.length === 0 ? (
            <div className="text-center py-8">
              <Globe className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-medium mb-2">No domains yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Search and register a domain to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {domains.map((domain) => {
                const daysLeft = getDaysUntilExpiry(domain.expiryDate);
                const provider = DOMAIN_PROVIDERS.find(p => p.id === domain.provider);
                
                return (
                  <div key={domain.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-lg">{domain.domain}</h3>
                          <Badge variant={domain.status === 'active' ? 'default' : 'secondary'}>
                            {getStatusLabel(domain.status)}
                          </Badge>
                          {domain.sslStatus === 'active' && (
                            <Badge variant="outline" className="text-green-600">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              SSL Active
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Website:</span>
                            <span className="ml-2 font-medium">
                              {domain.websiteName ? (
                                <div className="flex items-center space-x-2">
                                  <span>{domain.websiteName}</span>
                                  <Badge variant="outline" className="text-green-600 border-green-600">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Published
                                  </Badge>
                                </div>
                              ) : (
                                <Button 
                                  variant="link" 
                                  size="sm" 
                                  className="p-0 h-auto text-blue-600"
                                  onClick={() => connectDomainToWebsite(domain.id, 'website-1')}
                                >
                                  Connect to Website
                                </Button>
                              )}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Provider:</span>
                            <span className="ml-2 font-medium">{provider?.name}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Expires in:</span>
                            <span className={`ml-2 font-medium ${daysLeft < 30 ? 'text-red-600' : ''}`}>
                              {daysLeft} days
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Auto-renew:</span>
                            <span className="ml-2 font-medium">{domain.autoRenew ? 'Enabled' : 'Disabled'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setShowDNSInstructions(showDNSInstructions === domain.id ? null : domain.id)}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          DNS
                        </Button>
                        
                        {/* DNS Verification Button */}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => verifyDomainDNS(domain.domain)}
                          disabled={isVerifying[domain.domain]}
                        >
                          {isVerifying[domain.domain] ? (
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4 mr-2" />
                          )}
                          Verify
                        </Button>
                        
                        {/* Automated Verification Controls */}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => startAutomatedVerification(domain.id)}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Auto
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openDomainSettings(domain.id)}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </Button>
                      </div>
                    </div>

                    {/* DNS Verification Status */}
                    {verificationStatus[domain.domain] && (
                      <div className="pt-4 border-t">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">DNS Verification Status</h4>
                          <Badge variant={verificationStatus[domain.domain].isValid ? 'default' : 'destructive'}>
                            {verificationStatus[domain.domain].isValid ? 'Verified' : 'Failed'}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Provider:</span>
                            <span className="ml-2 font-medium">{verificationStatus[domain.domain].provider}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Response Time:</span>
                            <span className="ml-2 font-medium">{verificationStatus[domain.domain].responseTime}ms</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Last Checked:</span>
                            <span className="ml-2 font-medium">
                              {verificationStatus[domain.domain].lastChecked 
                                ? new Date(verificationStatus[domain.domain].lastChecked).toLocaleString()
                                : 'Never checked'
                              }
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Records Found:</span>
                            <span className="ml-2 font-medium">{verificationStatus[domain.domain].records?.length || 0}</span>
                          </div>
                        </div>
                        
                        {verificationStatus[domain.domain].error && (
                          <Alert className="mt-3">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                              {verificationStatus[domain.domain].error}
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    )}

                    {/* DNS Instructions (Expandable) */}
                    {showDNSInstructions === domain.id && (
                      <div className="pt-4 border-t space-y-4">
                        {/* Provider-specific instructions */}
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <h5 className="font-medium text-blue-900 mb-2">
                            Configure DNS in {provider?.name || 'your domain provider'}
                          </h5>
                          <div className="text-sm text-blue-800 space-y-1">
                            {provider?.name === 'Namecheap' && (
                              <>
                                <div>1. Log into your Namecheap account</div>
                                <div>2. Go to Domain List → Manage → Advanced DNS</div>
                                <div>3. Add the DNS records below</div>
                              </>
                            )}
                            {provider?.name === 'GoDaddy' && (
                              <>
                                <div>1. Log into your GoDaddy account</div>
                                <div>2. Go to My Products → DNS → Manage</div>
                                <div>3. Add the DNS records below</div>
                              </>
                            )}
                            {provider?.name === 'Cloudflare' && (
                              <>
                                <div>1. Log into your Cloudflare account</div>
                                <div>2. Select your domain → DNS → Records</div>
                                <div>3. Add the DNS records below</div>
                              </>
                            )}
                            {!provider?.name && (
                              <>
                                <div>1. Log into your domain provider's control panel</div>
                                <div>2. Find the DNS management section</div>
                                <div>3. Add the DNS records below</div>
                              </>
                            )}
                          </div>
                        </div>

                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            Configure these DNS records at {provider?.name} to link your domain to your website
                          </AlertDescription>
                        </Alert>

                        <div className="space-y-3">
                          {/* A Record */}
                          <div className="bg-muted p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium">A Record (Required)</h4>
                              <Badge variant="outline">Primary</Badge>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm font-mono">
                              <div>
                                <span className="text-muted-foreground">Type:</span>
                                <div className="mt-1 flex items-center space-x-2">
                                  <span className="font-medium">A</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => copyToClipboard('A', 'a-type')}
                                  >
                                    {copiedField === 'a-type' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                  </Button>
                                </div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Name:</span>
                                <div className="mt-1 flex items-center space-x-2">
                                  <span className="font-medium">@</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => copyToClipboard('@', 'a-name')}
                                  >
                                    {copiedField === 'a-name' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                  </Button>
                                </div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Value:</span>
                                <div className="mt-1 flex items-center space-x-2">
                                  <span className="font-medium">192.168.1.100</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => copyToClipboard('192.168.1.100', 'a-value')}
                                  >
                                    {copiedField === 'a-value' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* CNAME Record */}
                          <div className="bg-muted p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium">CNAME Record (Optional)</h4>
                              <Badge variant="outline">WWW</Badge>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm font-mono">
                              <div>
                                <span className="text-muted-foreground">Type:</span>
                                <div className="mt-1 flex items-center space-x-2">
                                  <span className="font-medium">CNAME</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => copyToClipboard('CNAME', 'cname-type')}
                                  >
                                    {copiedField === 'cname-type' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                  </Button>
                                </div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Name:</span>
                                <div className="mt-1 flex items-center space-x-2">
                                  <span className="font-medium">www</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => copyToClipboard('www', 'cname-name')}
                                  >
                                    {copiedField === 'cname-name' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                  </Button>
                                </div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Value:</span>
                                <div className="mt-1 flex items-center space-x-2">
                                  <span className="font-medium">mywebsite.webbuilder.com</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => copyToClipboard('mywebsite.webbuilder.com', 'cname-value')}
                                  >
                                    {copiedField === 'cname-value' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Special note for external domains */}
                          {domain.isExternal && (
                            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                              <div className="flex items-start space-x-2">
                                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                                <div className="text-xs text-green-800">
                                  <strong>External Domain:</strong> Make sure to remove any existing A records 
                                  pointing to other hosting providers before adding these new records.
                                </div>
                              </div>
                            </div>
                          )}

                          <Alert>
                            <Clock className="h-4 w-4" />
                            <AlertDescription>
                              DNS changes may take up to 24-48 hours to propagate worldwide
                            </AlertDescription>
                          </Alert>

                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => verifyDomainDNS(domain.domain)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Verify DNS Configuration
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How Domain Registration Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-2">1. Search Domain</h3>
              <p className="text-sm text-muted-foreground">
                Find your perfect domain name using our search tool
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <ExternalLink className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-2">2. Register</h3>
              <p className="text-sm text-muted-foreground">
                Complete purchase directly with your chosen provider
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Settings className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-2">3. Configure DNS</h3>
              <p className="text-sm text-muted-foreground">
                Add our DNS records at your provider's dashboard
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Link2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-2">4. Link Website</h3>
              <p className="text-sm text-muted-foreground">
                Your domain is now connected to your website
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Domain Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Domain Settings
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowSettings(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription>
                Configure settings for {domains.find(d => d.id === showSettings)?.domain}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {domainSettings[showSettings] && (
                <>
                  {/* Auto Renewal */}
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Auto Renewal</label>
                      <p className="text-xs text-muted-foreground">
                        Automatically renew domain before expiry
                      </p>
                    </div>
                    <Button
                      variant={domainSettings[showSettings].autoRenew ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateDomainSetting(showSettings, 'autoRenew', !domainSettings[showSettings].autoRenew)}
                    >
                      {domainSettings[showSettings].autoRenew ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>

                  {/* Privacy Protection */}
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Privacy Protection</label>
                      <p className="text-xs text-muted-foreground">
                        Hide your contact information from public records
                      </p>
                    </div>
                    <Button
                      variant={domainSettings[showSettings].privacyProtection ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateDomainSetting(showSettings, 'privacyProtection', !domainSettings[showSettings].privacyProtection)}
                    >
                      {domainSettings[showSettings].privacyProtection ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>

                  {/* SSL Certificate */}
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">SSL Certificate</label>
                      <p className="text-xs text-muted-foreground">
                        Enable HTTPS for secure connections
                      </p>
                    </div>
                    <Button
                      variant={domainSettings[showSettings].sslEnabled ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateDomainSetting(showSettings, 'sslEnabled', !domainSettings[showSettings].sslEnabled)}
                    >
                      {domainSettings[showSettings].sslEnabled ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>

                  {/* Email Notifications */}
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Email Notifications</label>
                      <p className="text-xs text-muted-foreground">
                        Get notified about domain status changes
                      </p>
                    </div>
                    <Button
                      variant={domainSettings[showSettings].emailNotifications ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateDomainSetting(showSettings, 'emailNotifications', !domainSettings[showSettings].emailNotifications)}
                    >
                      {domainSettings[showSettings].emailNotifications ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>

                  {/* DNS Verification Interval */}
                  <div>
                    <label className="text-sm font-medium">DNS Verification Interval</label>
                    <p className="text-xs text-muted-foreground mb-2">
                      How often to check DNS configuration
                    </p>
                    <select
                      value={domainSettings[showSettings].dnsVerificationInterval}
                      onChange={(e) => updateDomainSetting(showSettings, 'dnsVerificationInterval', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value={1}>Every 1 minute</option>
                      <option value={5}>Every 5 minutes</option>
                      <option value={15}>Every 15 minutes</option>
                      <option value={30}>Every 30 minutes</option>
                      <option value={60}>Every hour</option>
                    </select>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-4">
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => deleteDomain(showSettings)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Delete Domain
                    </Button>
                    <Button 
                      className="flex-1"
                      onClick={() => saveDomainSettings(showSettings)}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Save Settings
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Import External Domain Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Import External Domain
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowImportModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription>
                Add a domain you purchased from another provider
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Domain Name</label>
                <p className="text-xs text-muted-foreground mb-2">
                  Enter the domain you want to connect (e.g., mydomain.com)
                </p>
                <input
                  type="text"
                  value={importDomain}
                  onChange={(e) => setImportDomain(e.target.value)}
                  placeholder="example.com"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Domain Provider</label>
                <p className="text-xs text-muted-foreground mb-2">
                  Where did you purchase this domain?
                </p>
                <select
                  value={importProvider}
                  onChange={(e) => setImportProvider(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Select Provider</option>
                  <option value="namecheap">Namecheap</option>
                  <option value="godaddy">GoDaddy</option>
                  <option value="google">Google Domains</option>
                  <option value="cloudflare">Cloudflare</option>
                  <option value="porkbun">Porkbun</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Next Steps:</h4>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li>1. Add your domain to our platform</li>
                  <li>2. Configure DNS records in your provider's panel</li>
                  <li>3. Connect the domain to your website</li>
                  <li>4. Verify DNS configuration</li>
                </ol>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowImportModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1"
                  onClick={importExternalDomain}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Import Domain
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

