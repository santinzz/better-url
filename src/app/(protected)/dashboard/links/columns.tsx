'use client'

import { Badge } from '@/components/ui/badge'
import type { Link } from '@/lib/db/schema'
import { ColumnDef } from '@tanstack/react-table'
import { formatDistanceToNow } from 'date-fns'
import {
	BarChart3,
	Copy,
	ExternalLink,
	MoreHorizontal,
	Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import NextLink from 'next/link'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { deleteLink } from '@/actions/delete-link'

export const columns: ColumnDef<Link>[] = [
	{
		accessorKey: 'url',
		header: 'Link Details',
		cell: ({ row }) => (
			<div className='space-y-1'>
				<div className='font-medium'>{row.original.title}</div>
				<NextLink
					href={row.original.url}
					className='text-sm truncate max-w-[300px] hover:underline'
					title={row.original.url}
				>
					{row.original.url}
				</NextLink>
			</div>
		),
	},
	{
		accessorKey: 'shortUrl',
		header: 'Short URL',
		cell: ({ row }) => {
			const handleCopyUrl = (url: string) => {
				navigator.clipboard.writeText(
					`${window.location.origin}/${url}`
				)
				toast('Copied!', {
					description: 'Short URL copied to clipboard',
					richColors: true,
				})
			}

			return (
				<div className='text-sm text-muted-foreground flex items-center gap-2'>
					<NextLink
						href={`${window.location.origin}/${row.original.shortUrl}`}
						target='_blank'
						rel='noopener noreferrer'
						className='text-blue-600 hover:underline'
					>
						{window.location.origin}/{row.original.shortUrl}
					</NextLink>
					<Copy
						className='w-4 h-4 cursor-pointer hover:text-black transition-colors'
						onClick={() => handleCopyUrl(row.original.shortUrl)}
					/>
				</div>
			)
		},
	},
	{
		accessorKey: 'clickCount',
		header: 'Click Count',
	},
	{
		accessorKey: 'isActive',
		header: 'Status',
		cell: ({ row }) => (
			<Badge variant={row.original.isActive ? 'default' : 'secondary'}>
				{row.original.isActive ? 'Active' : 'Paused'}
			</Badge>
		),
	},
	{
		accessorKey: 'createdAt',
		header: 'Created',
		cell: ({ row }) => {
			const date = new Date(row.original.createdAt)
			return (
				<div className='text-sm text-muted-foreground'>
					{date.toLocaleDateString()} {date.toLocaleTimeString()}
				</div>
			)
		},
	},
	{
		accessorKey: 'lastClick',
		header: 'Last Click',
		cell: ({ row }) => {
			const lastClick = row.original.lastClick
				? new Date(row.original.lastClick)
				: null
			return (
				<div className='text-sm text-muted-foreground'>
					{lastClick
						? formatDistanceToNow(lastClick, {
								addSuffix: true,
						  })
						: 'Never'}
				</div>
			)
		},
	},
	{
		id: 'actions',
		enableHiding: false,
		cell: ({ row }) => {
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='ghost' className='size-8 p-0 cursor-pointer'>
							<MoreHorizontal className='w-4 h-4 text-muted-foreground hover:text-black transition-colors' />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem>
							<ExternalLink className='w-4 h-4 mr-2 text-muted-foreground hover:text-black transition-colors' />
							Visit
						</DropdownMenuItem>
						<DropdownMenuItem>
							<BarChart3 className='w-4 h-4 mr-2 text-muted-foreground hover:text-black transition-colors' />
							Analytics
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Copy className='w-4 h-4 mr-2 text-muted-foreground hover:text-black transition-colors' />
							Copy
						</DropdownMenuItem>
						<DropdownMenuItem className='text-red-600' onClick={() => deleteLink(row.original.id)}>
							<Trash2 className='w-4 h-4 mr-2 hover:text-black transition-colors text-red-600' />
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		},
	},
]
