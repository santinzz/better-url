import type { Link } from "@/lib/db/schema";
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Link>[] = [
  {
    accessorKey: 'url',
    header: 'Original URL',
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
  }
]