'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Link } from '@/lib/db/schema'
import { ColumnDef } from '@tanstack/react-table'
import { formatDistanceToNow } from 'date-fns'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'
import NextLink from 'next/link'

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
				navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_VERCEL_URL}/${url}`)
				toast('Copied!', {
					description: 'Short URL copied to clipboard',
          richColors: true,
				})
			}

			return (
				<div className='text-sm text-muted-foreground flex items-center gap-2'>
					<NextLink
						href={`${process.env.NEXT_PUBLIC_VERCEL_URL}/${row.original.shortUrl}`}
						target='_blank'
						rel='noopener noreferrer'
						className='text-blue-600 hover:underline'
					>
						{process.env.NEXT_PUBLIC_VERCEL_URL}/{row.original.shortUrl}
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
]
