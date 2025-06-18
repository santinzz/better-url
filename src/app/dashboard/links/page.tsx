"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
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
  Search,
  Filter,
  CheckCircle,
  Pause,
  MousePointer,
  Calendar,
  Edit,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"

export default function LinksPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newLinkData, setNewLinkData] = useState({
    url: "",
    alias: "",
    title: "",
  })
  const allLinks = [
    {
      id: 1,
      original: "https://example.com/very-long-url-that-needs-shortening",
      short: "bttr.ly/abc123",
      title: "Example Landing Page",
      clicks: 1247,
      created: "2024-01-15",
      status: "active",
      lastClick: "2 hours ago",
    },
    {
      id: 2,
      original: "https://github.com/user/repository-name",
      short: "bttr.ly/def456",
      title: "GitHub Repository",
      clicks: 892,
      created: "2024-01-14",
      status: "active",
      lastClick: "5 hours ago",
    },
    {
      id: 3,
      original: "https://docs.example.com/documentation/guide",
      short: "bttr.ly/ghi789",
      title: "Documentation Guide",
      clicks: 456,
      created: "2024-01-12",
      status: "active",
      lastClick: "1 day ago",
    },
    {
      id: 4,
      original: "https://blog.example.com/article-title",
      short: "bttr.ly/jkl012",
      title: "Blog Article",
      clicks: 234,
      created: "2024-01-08",
      status: "paused",
      lastClick: "3 days ago",
    },
    {
      id: 5,
      original: "https://shop.example.com/product/item",
      short: "bttr.ly/mno345",
      title: "Product Page",
      clicks: 1089,
      created: "2024-01-01",
      status: "active",
      lastClick: "6 hours ago",
    },
  ]

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(`https://${url}`)
    toast("Copied!", {
      description: "Short URL copied to clipboard",
    })
  }

  const handleCreateLink = () => {
    // Simulate API call
    setIsCreateDialogOpen(false)
    setNewLinkData({ url: "", alias: "", title: "" })
    toast("Link Created!", {
      description: "Your new short URL has been created successfully.",
    })
  }

  const filteredLinks = allLinks.filter(
    (link) =>
      link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.original.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.short.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
                  <BreadcrumbPage>My Links</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Links</h1>
              <p className="text-gray-600 mt-1">Manage all your shortened URLs in one place</p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Link
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Link</DialogTitle>
                  <DialogDescription>Create a new shortened URL with optional customization.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="url">Original URL</Label>
                    <Input
                      id="url"
                      placeholder="https://example.com/your-long-url"
                      value={newLinkData.url}
                      onChange={(e) => setNewLinkData({ ...newLinkData, url: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="alias">Custom Alias (Optional)</Label>
                    <Input
                      id="alias"
                      placeholder="my-custom-link"
                      value={newLinkData.alias}
                      onChange={(e) => setNewLinkData({ ...newLinkData, alias: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title (Optional)</Label>
                    <Input
                      id="title"
                      placeholder="My Link Title"
                      value={newLinkData.title}
                      onChange={(e) => setNewLinkData({ ...newLinkData, title: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateLink} disabled={!newLinkData.url}>
                    Create Link
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search links by title, URL, or alias..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Links Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Links ({filteredLinks.length})</CardTitle>
              <CardDescription>Manage and track all your shortened URLs</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Link Details</TableHead>
                    <TableHead>Short URL</TableHead>
                    <TableHead>Clicks</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Click</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLinks.map((link) => (
                    <TableRow key={link.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{link.title}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-[300px]" title={link.original}>
                            {link.original}
                          </div>
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
                            <>
                              <Pause className="w-3 h-3 mr-1" />
                              Paused
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {link.created}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{link.lastClick}</TableCell>
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
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="mr-2 h-4 w-4" />
                              Copy
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              {link.status === "active" ? (
                                <>
                                  <Pause className="mr-2 h-4 w-4" />
                                  Pause
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
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
