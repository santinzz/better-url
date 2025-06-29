import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  BarChart3,
  Plus,
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
} from 'lucide-react'
import { DataTable } from '@/components/data-table'
import { columns } from './columns'
import { UrlShortener } from '@/components/url-shortener'
import { getLinksSessionStats } from '@/actions/getLinksSessionStats'

export default async function DashboardPage() {
  const { links, session, stats: dbStats } = await getLinksSessionStats()

  const stats = [
    {
      title: 'Total Links',
      value: dbStats.totalLinks,
      trend: 'up',
    },
    {
      title: 'Total Clicks',
      value: dbStats.totalClicks,
    },
    {
      title: 'Click Rate',
      value: `${dbStats.clickRate}%`,
    },
    {
      title: 'Active Links',
      value: dbStats.activeLinks,
    },
  ]

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
          <div className='flex items-center gap-2 px-4'>
            <SidebarTrigger className='-ml-1' />
            <Separator orientation='vertical' className='mr-2 h-4' />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className='hidden md:block'>
                  <BreadcrumbLink href='/dashboard'>Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className='hidden md:block' />
                <BreadcrumbItem>
                  <BreadcrumbPage>Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
          {/* Welcome Section */}
          <div className='mb-6'>
            <h1 className='text-3xl font-bold text-gray-900'>
              Welcome back, {session?.user?.name}!
            </h1>
            <p className='text-gray-600 mt-1'>
              Here's what's happening with your links today.
            </p>
          </div>

          {/* Quick URL Shortener */}
          <Card className='mb-6'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Plus className='w-5 h-5' />
                Quick Shorten
              </CardTitle>
              <CardDescription>
                Create a new short URL instantly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UrlShortener />
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6'>
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    {stat.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Links Table */}
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle>Recent Links</CardTitle>
                  <CardDescription>
                    Your most recently created short URLs
                  </CardDescription>
                </div>
                <Button variant='outline' size='sm'>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={links} />
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
