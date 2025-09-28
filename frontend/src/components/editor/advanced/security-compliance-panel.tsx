'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Shield,
  Lock,
  Eye,
  AlertTriangle,
  CheckCircle,
  FileText,
  Download,
  Upload,
  Settings,
  Users,
  Database,
  Globe,
  Key,
  Scan,
  Clock
} from 'lucide-react'

interface SecurityCompliancePanelProps {
  onClose?: () => void
}

interface SecurityConfig {
  id: string
  name: string
  type: 'gdpr' | 'ccpa' | 'hipaa' | 'sox' | 'iso27001' | 'pci-dss' | 'custom'
  status: 'enabled' | 'disabled' | 'pending'
  requirements: string[]
  lastAudit: Date
  nextAudit: Date
  complianceScore: number
}

interface SecurityPolicy {
  id: string
  name: string
  description: string
  category: 'data-protection' | 'access-control' | 'encryption' | 'monitoring' | 'incident-response'
  isActive: boolean
  lastUpdated: Date
}

export function SecurityCompliancePanel({ onClose }: SecurityCompliancePanelProps) {
  const [securityConfigs, setSecurityConfigs] = useState<SecurityConfig[]>([
    {
      id: 'sc_1',
      name: 'GDPR Compliance',
      type: 'gdpr',
      status: 'enabled',
      requirements: [
        'Data encryption at rest',
        'User consent management',
        'Right to be forgotten',
        'Data portability',
        'Privacy by design'
      ],
      lastAudit: new Date('2024-01-15'),
      nextAudit: new Date('2024-07-15'),
      complianceScore: 95
    },
    {
      id: 'sc_2',
      name: 'PCI DSS',
      type: 'pci-dss',
      status: 'enabled',
      requirements: [
        'Secure network infrastructure',
        'Cardholder data protection',
        'Vulnerability management',
        'Access control measures',
        'Network monitoring'
      ],
      lastAudit: new Date('2024-02-01'),
      nextAudit: new Date('2024-08-01'),
      complianceScore: 88
    }
  ])

  const [securityPolicies, setSecurityPolicies] = useState<SecurityPolicy[]>([
    {
      id: 'sp_1',
      name: 'Data Encryption Policy',
      description: 'All sensitive data must be encrypted using AES-256',
      category: 'encryption',
      isActive: true,
      lastUpdated: new Date('2024-01-01')
    },
    {
      id: 'sp_2',
      name: 'Access Control Policy',
      description: 'Multi-factor authentication required for all admin accounts',
      category: 'access-control',
      isActive: true,
      lastUpdated: new Date('2024-01-15')
    },
    {
      id: 'sp_3',
      name: 'Incident Response Plan',
      description: '24/7 monitoring and automated incident response',
      category: 'incident-response',
      isActive: true,
      lastUpdated: new Date('2024-02-01')
    }
  ])

  const [auditLogs, setAuditLogs] = useState([
    {
      id: 'al_1',
      action: 'User login',
      user: 'admin@company.com',
      timestamp: new Date('2024-03-15T10:30:00'),
      ip: '192.168.1.100',
      status: 'success'
    },
    {
      id: 'al_2',
      action: 'Data export',
      user: 'user@company.com',
      timestamp: new Date('2024-03-15T09:15:00'),
      ip: '192.168.1.101',
      status: 'success'
    },
    {
      id: 'al_3',
      action: 'Failed login attempt',
      user: 'unknown@attacker.com',
      timestamp: new Date('2024-03-15T08:45:00'),
      ip: '203.0.113.1',
      status: 'failed'
    }
  ])

  const getComplianceIcon = (type: SecurityConfig['type']) => {
    switch (type) {
      case 'gdpr': return '🇪🇺'
      case 'ccpa': return '🇺🇸'
      case 'hipaa': return '🏥'
      case 'sox': return '📊'
      case 'iso27001': return '🔒'
      case 'pci-dss': return '💳'
      default: return '🛡️'
    }
  }

  const getComplianceColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getStatusColor = (status: SecurityConfig['status']) => {
    switch (status) {
      case 'enabled': return 'bg-green-500'
      case 'disabled': return 'bg-red-500'
      default: return 'bg-yellow-500'
    }
  }

  const getCategoryIcon = (category: SecurityPolicy['category']) => {
    switch (category) {
      case 'data-protection': return <Database className="h-4 w-4" />
      case 'access-control': return <Key className="h-4 w-4" />
      case 'encryption': return <Lock className="h-4 w-4" />
      case 'monitoring': return <Eye className="h-4 w-4" />
      case 'incident-response': return <AlertTriangle className="h-4 w-4" />
      default: return <Shield className="h-4 w-4" />
    }
  }

  return (
    <div className="w-96 bg-card border-l border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security & Compliance
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            ×
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Enterprise security, compliance, and audit management.
        </p>
      </div>

      <Tabs defaultValue="compliance" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-4">
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="compliance" className="p-4 mt-0">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">95%</div>
                    <div className="text-sm text-muted-foreground">Overall Compliance</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">2</div>
                    <div className="text-sm text-muted-foreground">Active Standards</div>
                  </CardContent>
                </Card>
              </div>

              {securityConfigs.map(config => (
                <Card key={config.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getComplianceIcon(config.type)}</span>
                        <div>
                          <p className="font-semibold">{config.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Last audit: {config.lastAudit.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(config.status)}`} />
                        <span className={`text-sm font-medium ${getComplianceColor(config.complianceScore)}`}>
                          {config.complianceScore}%
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-3">
                      <p className="text-sm font-medium">Requirements:</p>
                      <div className="space-y-1">
                        {config.requirements.map((req, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span>{req}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        View Report
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="policies" className="p-4 mt-0">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Security Policies</h4>
                <Button size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Add Policy
                </Button>
              </div>

              {securityPolicies.map(policy => (
                <Card key={policy.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(policy.category)}
                        <p className="font-semibold">{policy.name}</p>
                      </div>
                      <Switch checked={policy.isActive} />
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{policy.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Last updated: {policy.lastUpdated.toLocaleDateString()}</span>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="h-6 px-2">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 px-2">
                          <Settings className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="audit" className="p-4 mt-0">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Audit Logs</h4>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Scan className="h-4 w-4 mr-2" />
                    Scan Now
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                {auditLogs.map(log => (
                  <div key={log.id} className="p-3 border rounded-md">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{log.action}</span>
                        <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                          {log.status}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {log.timestamp.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      User: {log.user} • IP: {log.ip}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  )
}
