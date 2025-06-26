'use client'

import type React from 'react'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from '@/components/ui/sidebar'
import { Link2, BarChart3, LinkIcon, Plus, Globe, Zap } from 'lucide-react'
import { UserButton } from './user-button'
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogTitle,
	DialogDescription,
} from '@/components/ui/dialog'
import { Button } from './ui/button'
import { DialogHeader } from './ui/dialog'
import { UrlShortener } from './url-shortener'

const navigation = [
	{
		title: 'Overview',
		url: '/dashboard',
		icon: BarChart3,
		isActive: true,
	},
	{
		title: 'My Links',
		url: '/dashboard/links',
		icon: LinkIcon,
	},
	{
		title: 'Analytics',
		url: '/dashboard/analytics',
		icon: BarChart3,
	},
	{
		title: 'Domains',
		url: '/dashboard/domains',
		icon: Globe,
	},
]

const quickActions = [
	{
		title: 'Shorten URL',
		icon: Plus,
	},
	{
		title: 'Bulk Import',
		icon: Zap,
	},
]

export function DashboardSidebar({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar variant='inset' {...props}>
			<SidebarHeader>
				<div className='flex items-center gap-2 px-4 py-2'>
					<div className='w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center'>
						<Link2 className='w-4 h-4 text-white' />
					</div>
					<h1 className='text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
						better-url
					</h1>
				</div>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Navigation</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<Dialog>
								<SidebarMenuItem>
									<SidebarMenuButton asChild isActive={true}>
										<DialogTrigger asChild>
											<Button className='[color:_white_!important]  bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'>
												<Plus className='w-4 h-4 mr-2' />
												Create Link
											</Button>
										</DialogTrigger>
									</SidebarMenuButton>
								</SidebarMenuItem>
								<DialogContent className='sm:max-w-[425px]'>
									<DialogHeader>
										<DialogTitle>Create New Link</DialogTitle>
										<DialogDescription>
											Create a new shortened URL with optional customization.
										</DialogDescription>
									</DialogHeader>
									<UrlShortener vertical={true} />
								</DialogContent>
							</Dialog>
							{navigation.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild isActive={item.isActive}>
										<a href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup>
					<SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{quickActions.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton>
										<item.icon />
										<span>{item.title}</span>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<UserButton />
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}
