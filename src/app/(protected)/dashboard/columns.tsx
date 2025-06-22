'use client'

import { Badge } from '@/components/ui/badge'
import type { Link } from '@/lib/db/schema'
import { ColumnDef } from '@tanstack/react-table'
import NextLink from 'next/link'

export const columns: ColumnDef<Link>[] = [
	{
		accessorKey: 'url',
		header: 'Original URL',
	},
	{
		accessorKey: 'shortUrl',
		header: 'Short URL',
		cell: ({ row }) => {
			const url = process.env.NEXT_PUBLIC_BASE_URL
			const href = `${url}/${row.original.shortUrl}`

			return (
				<NextLink
					prefetch={false}
					href={href}
					className='flex underline items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 ease-linear'
				>
					{href}
				</NextLink>
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
]
