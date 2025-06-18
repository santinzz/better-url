"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  BarChart3,
  Copy,
  ExternalLink,
  MoreHorizontal,
  Plus,
  TrendingUp,
  TrendingDown,
  Zap,
  CheckCircle,
  Eye,
  MousePointer,
} from "lucide-react"
import { toast } from "sonner"

export default function DashboardPage() {
  const [newUrl, setNewUrl] = useState("")
  const [isShortening, setIsShortening] = useState(false)

  const stats = [
    {
      title: "Total Links",
      value: "1,234",
      change: "+12%",
      trend: "up",
      icon: BarChart3,
    },
    {
      title: "Total Clicks",
      value: "45,678",
      change: "+8%",
      trend: "up",
      icon: MousePointer,
    },
    {
      title: "Click Rate",
      value: "3.2%",
      change: "-0.5%",
      trend: "down",
      icon: TrendingUp,
    },
    {
      title: "Active Links",
      value: "892",
      change: "+5%",
      trend: "up",
      icon: Eye,
    },
  ]

  const recentLinks = [
    {
      id: 1,
      original: "https://example.com/very-long-url-that-needs-shortening",
      short: "bttr.ly/abc123",
      clicks: 1247,
      created: "2 hours ago",
      status: "active",
    },
    {
      id: 2,
      original: "https://github.com/user/repository-name",
      short: "bttr.ly/def456",
      clicks: 892,
      created: "1 day ago",
      status: "active",
    },
    {
      id: 3,
      original: "https://docs.example.com/documentation/guide",
      short: "bttr.ly/ghi789",
      clicks: 456,
      created: "3 days ago",
      status: "active",
    },
    {
      id: 4,
      original: "https://blog.example.com/article-title",
      short: "bttr.ly/jkl012",
      clicks: 234,
      created: "1 week ago",
      status: "paused",
    },
    {
      id: 5,
      original: "https://shop.example.com/product/item",
      short: "bttr.ly/mno345",
      clicks: 1089,
      created: "2 weeks ago",
      status: "active",
    },
  ]

  const handleShortenUrl = async () => {
    if (!newUrl) return

    setIsShortening(true)
    // Simulate API call
    setTimeout(() => {
      setIsShortening(false)
      setNewUrl("")
      toast("URL Shortened!", {
        description: "Your new short URL has been created successfully.",
      })
    }, 1000)
  }

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(`https://${url}`)
    toast("Copied!", {
      description: "Short URL copied to clipboard",
    })
  }

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* Welcome Section */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, John!</h1>
            <p className="text-gray-600 mt-1">Here's what's happening with your links today.</p>
          </div>

          {/* Quick URL Shortener */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Quick Shorten
              </CardTitle>
              <CardDescription>Create a new short URL instantly</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="https://example.com/your-long-url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="flex-1"
                  onKeyPress={(e) => e.key === "Enter" && handleShortenUrl()}
                />
                <Button
                  onClick={handleShortenUrl}
                  disabled={!newUrl || isShortening}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isShortening ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Shorten
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    {stat.trend === "up" ? (
                      <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1 text-red-600" />
                    )}
                    <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>{stat.change}</span>
                    <span className="ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Links Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Links</CardTitle>
                  <CardDescription>Your most recently created short URLs</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Original URL</TableHead>
                    <TableHead>Short URL</TableHead>
                    <TableHead>Clicks</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentLinks.map((link) => (
                    <TableRow key={link.id}>
                      <TableCell className="max-w-[300px]">
                        <div className="truncate" title={link.original}>
                          {link.original}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono text-blue-600">{link.short}</code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyUrl(link.short)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MousePointer className="w-3 h-3 text-gray-400" />
                          {link.clicks.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={link.status === "active" ? "default" : "secondary"}>
                          {link.status === "active" ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Active
                            </>
                          ) : (
                            "Paused"
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{link.created}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Visit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <BarChart3 className="mr-2 h-4 w-4" />
                              Analytics
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="mr-2 h-4 w-4" />
                              Copy
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
