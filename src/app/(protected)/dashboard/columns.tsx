'use client'

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
			const url = process.env.NEXT_PUBLIC_VERCEL_URL
			const href = `${url}/${row.original.shortUrl}`

			return (
				<NextLink
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
