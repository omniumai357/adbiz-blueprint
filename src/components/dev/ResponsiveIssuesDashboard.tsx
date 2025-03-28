
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useResponsive } from '@/hooks/useResponsive';
import { 
  BarChart, 
  LineChart, 
  Cell, 
  Pie, 
  PieChart, 
  ResponsiveContainer, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Line,
  Legend
} from 'recharts';

/**
 * Responsive Issues Dashboard Component
 * 
 * A comprehensive dashboard for tracking and managing responsive design issues
 * across the application. Displays statistics, trends, and actionable items.
 */
const ResponsiveIssuesDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { isXs, isSm, isMd } = useResponsive();
  const isMobile = isXs || isSm;
  
  // Sample data - in a real application, this would come from an API
  const mockData = {
    issuesByComponent: [
      { name: 'MilestoneCard', total: 5, critical: 1, high: 2, medium: 1, low: 1 },
      { name: 'RewardCard', total: 3, critical: 0, high: 1, medium: 1, low: 1 },
      { name: 'MilestonesDashboard', total: 7, critical: 2, high: 3, medium: 1, low: 1 },
      { name: 'CheckoutForm', total: 8, critical: 3, high: 2, medium: 2, low: 1 },
      { name: 'Navigation', total: 4, critical: 1, high: 1, medium: 1, low: 1 },
    ],
    issuesByBreakpoint: [
      { name: 'xs', total: 12, resolved: 5 },
      { name: 'sm', total: 8, resolved: 4 },
      { name: 'md', total: 6, resolved: 3 },
      { name: 'lg', total: 4, resolved: 2 },
      { name: 'xl', total: 3, resolved: 1 },
      { name: 'xxl', total: 2, resolved: 1 },
    ],
    issuesByType: [
      { name: 'Layout', value: 35 },
      { name: 'Content', value: 25 },
      { name: 'Interactive', value: 20 },
      { name: 'Animation', value: 10 },
      { name: 'Performance', value: 10 },
    ],
    trendData: Array.from({ length: 12 }, (_, i) => ({
      name: new Date(2023, i, 1).toLocaleString('default', { month: 'short' }),
      new: Math.floor(Math.random() * 20) + 5,
      resolved: Math.floor(Math.random() * 15) + 3,
    })),
    activeIssues: [
      { id: 'RESP-123', component: 'MilestonesDashboard', breakpoint: 'xs', severity: 'critical', title: 'Content overflow in cards on small screens', reportedDate: '2023-05-15' },
      { id: 'RESP-124', component: 'CheckoutForm', breakpoint: 'sm', severity: 'high', title: 'Form inputs not properly aligned in landscape mode', reportedDate: '2023-05-16' },
      { id: 'RESP-125', component: 'RewardCard', breakpoint: 'xs', severity: 'medium', title: 'Text truncation not working correctly', reportedDate: '2023-05-17' },
      { id: 'RESP-126', component: 'Navigation', breakpoint: 'md', severity: 'high', title: 'Menu items overlap on tablet devices', reportedDate: '2023-05-18' },
      { id: 'RESP-127', component: 'MilestoneCard', breakpoint: 'lg', severity: 'low', title: 'Progress bar renders inconsistently at lg breakpoint', reportedDate: '2023-05-19' },
    ],
    testCoverage: {
      visual: 75,
      functional: 68,
      accessibility: 62,
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
  const getSeverityBadge = (severity: string) => {
    const colors: Record<string, string> = {
      critical: 'bg-red-500',
      high: 'bg-orange-500',
      medium: 'bg-yellow-500',
      low: 'bg-blue-500',
    };
    
    return (
      <Badge className={colors[severity] || 'bg-gray-500'}>
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Responsive Issues Dashboard</h1>
        <p className="text-muted-foreground">Monitor and manage responsive design issues across the application</p>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="breakpoints">Breakpoints</TabsTrigger>
          <TabsTrigger value="issues">Active Issues</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Total Issues</CardTitle>
                <CardDescription>Across all components</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">27</div>
                <div className="text-sm text-muted-foreground mt-2">
                  <span className="text-green-500">▼ 8% </span>
                  <span>from last month</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Critical Issues</CardTitle>
                <CardDescription>High priority problems</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-red-500">7</div>
                <div className="text-sm text-muted-foreground mt-2">
                  <span className="text-red-500">▲ 2 </span>
                  <span>from last week</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Test Coverage</CardTitle>
                <CardDescription>Responsive testing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Visual</span>
                    <span className="text-sm">{mockData.testCoverage.visual}%</span>
                  </div>
                  <Progress value={mockData.testCoverage.visual} />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Functional</span>
                    <span className="text-sm">{mockData.testCoverage.functional}%</span>
                  </div>
                  <Progress value={mockData.testCoverage.functional} />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Accessibility</span>
                    <span className="text-sm">{mockData.testCoverage.accessibility}%</span>
                  </div>
                  <Progress value={mockData.testCoverage.accessibility} />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
                <CardDescription>New vs. Resolved Issues</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={mockData.trendData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="new" stroke="#f43f5e" name="New Issues" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="resolved" stroke="#10b981" name="Resolved Issues" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Issue Distribution</CardTitle>
                <CardDescription>By Type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockData.issuesByType}
                        cx="50%"
                        cy="50%"
                        labelLine={!isMobile}
                        label={!isMobile ? ({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%` : undefined}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {mockData.issuesByType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Components Tab */}
        <TabsContent value="components" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Issues by Component</CardTitle>
              <CardDescription>Breakdown of responsive issues by UI component</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={mockData.issuesByComponent}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="critical" stackId="a" fill="#f43f5e" name="Critical" />
                    <Bar dataKey="high" stackId="a" fill="#f97316" name="High" />
                    <Bar dataKey="medium" stackId="a" fill="#eab308" name="Medium" />
                    <Bar dataKey="low" stackId="a" fill="#3b82f6" name="Low" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Component Risk Assessment</CardTitle>
              <CardDescription>Components ranked by severity of responsive issues</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Component</TableHead>
                    <TableHead>Total Issues</TableHead>
                    <TableHead className="hidden md:table-cell">Critical</TableHead>
                    <TableHead className="hidden md:table-cell">High</TableHead>
                    <TableHead className="hidden lg:table-cell">Medium</TableHead>
                    <TableHead className="hidden lg:table-cell">Low</TableHead>
                    <TableHead>Risk Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockData.issuesByComponent.sort((a, b) => b.total - a.total).map((component) => (
                    <TableRow key={component.name}>
                      <TableCell className="font-medium">{component.name}</TableCell>
                      <TableCell>{component.total}</TableCell>
                      <TableCell className="hidden md:table-cell">{component.critical}</TableCell>
                      <TableCell className="hidden md:table-cell">{component.high}</TableCell>
                      <TableCell className="hidden lg:table-cell">{component.medium}</TableCell>
                      <TableCell className="hidden lg:table-cell">{component.low}</TableCell>
                      <TableCell>
                        {component.critical > 0 ? (
                          <Badge className="bg-red-500">High</Badge>
                        ) : component.high > 1 ? (
                          <Badge className="bg-orange-500">Medium</Badge>
                        ) : (
                          <Badge className="bg-green-500">Low</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Breakpoints Tab */}
        <TabsContent value="breakpoints" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Issues by Breakpoint</CardTitle>
              <CardDescription>Distribution of issues across responsive breakpoints</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={mockData.issuesByBreakpoint}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" fill="#8884d8" name="Total Issues" />
                    <Bar dataKey="resolved" fill="#82ca9d" name="Resolved" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].map((breakpoint) => {
              const data = mockData.issuesByBreakpoint.find(b => b.name === breakpoint) || { total: 0, resolved: 0 };
              const progress = data.total ? Math.round((data.resolved / data.total) * 100) : 100;
              
              return (
                <Card key={breakpoint}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between">
                      {breakpoint.toUpperCase()}
                      <Badge className={data.total > 0 ? 'bg-amber-500' : 'bg-green-500'}>
                        {data.total - data.resolved} open
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {breakpoint === 'xs' ? '< 640px' : 
                       breakpoint === 'sm' ? '640-767px' :
                       breakpoint === 'md' ? '768-1023px' :
                       breakpoint === 'lg' ? '1024-1279px' :
                       breakpoint === 'xl' ? '1280-1535px' : '≥ 1536px'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Resolution Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        
        {/* Issues Tab */}
        <TabsContent value="issues" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Issues</CardTitle>
              <CardDescription>All currently open responsive issues</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Component</TableHead>
                    <TableHead className="hidden md:table-cell">Breakpoint</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead className="hidden sm:table-cell">Title</TableHead>
                    <TableHead className="hidden lg:table-cell">Reported</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockData.activeIssues.map((issue) => (
                    <TableRow key={issue.id}>
                      <TableCell className="font-medium">{issue.id}</TableCell>
                      <TableCell>{issue.component}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline">{issue.breakpoint}</Badge>
                      </TableCell>
                      <TableCell>{getSeverityBadge(issue.severity)}</TableCell>
                      <TableCell className="hidden sm:table-cell max-w-xs truncate">
                        {issue.title}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">{issue.reportedDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResponsiveIssuesDashboard;
