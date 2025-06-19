import type { Link } from "@/lib/db/schema";
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Link>[] = [
  {
    accessorKey: 'url',
    header: 'Link Details',
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="font-medium">{row.original.title}</div>
        <div className="text-sm text-muted-foreground truncate max-w-[300px]" title={row.original.url}>
          {row.original.url}
        </div>
      </div>
    )
  },
  {
    accessorKey: 'shortUrl',
    header: 'Short URL',
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
      const date = new Date(row.original.createdAt);
      return (
        <div className="text-sm text-muted-foreground">
          {date.toLocaleDateString()} {date.toLocaleTimeString()}
        </div>
      );
    }
  },
  {
    accessorKey: 'updatedAt',
    header: 'Last Click',
  }
]