"use client";

import Link from "next/link";
import { useId, useMemo, useRef, useState } from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type FilterFn,
  type PaginationState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  CheckCircle,
  Circle,
  ChevronDown,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleAlert,
  CircleX,
  Columns3,
  Filter,
  ListFilter,
  Pencil,
  Trash,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deleteBlogPost } from "@/lib/actions/cms-blog-actions";
import { formatPublishedDate } from "@/lib/format-published-date";
import { BLOG_CATEGORIES } from "@/lib/blog-categories";
import type { CmsBlogPostRow } from "@/lib/data/cms-blog-posts";

const TAG_OPTIONS = BLOG_CATEGORIES.filter((c) => c !== "All");

const titleFilterFn: FilterFn<CmsBlogPostRow> = (row, _columnId, filterValue: string) => {
  return row.original.title.toLowerCase().includes((filterValue ?? "").toLowerCase());
};

const tagFilterFn: FilterFn<CmsBlogPostRow> = (row, columnId, filterValue: string[]) => {
  if (!filterValue?.length) return true;
  return filterValue.includes((row.getValue(columnId) as string) ?? "");
};

const statusFilterFn: FilterFn<CmsBlogPostRow> = (row, columnId, filterValue: string[]) => {
  if (!filterValue?.length) return true;
  return filterValue.includes((row.getValue(columnId) as string) ?? "");
};

function StatusBadge({ status }: { status: "draft" | "published" }) {
  return status === "published" ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium text-success">
      <CheckCircle size={14} />
      Published
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-cream px-2.5 py-1 text-xs font-medium text-muted">
      <Circle size={14} />
      Draft
    </span>
  );
}

function RowActions({ slug, title, onDeleted }: { slug: string; title: string; onDeleted: (slug: string) => void }) {
  const [open, setOpen] = useState(false);

  async function handleDelete() {
    await deleteBlogPost(slug);
    onDeleted(slug);
    setOpen(false);
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <Link
        href={`/cms/${slug}/edit`}
        aria-label={`Edit ${title}`}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-cream hover:text-text"
      >
        <Pencil size={16} />
      </Link>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <button
            type="button"
            aria-label={`Delete ${title}`}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-cream hover:text-text"
          >
            <Trash size={16} />
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-ink/10" aria-hidden="true">
              <CircleAlert className="opacity-80" size={16} strokeWidth={2} />
            </div>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete &quot;{title}&quot;?</AlertDialogTitle>
              <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export function BlogPostsDataTable({ posts: initialPosts }: { posts: CmsBlogPostRow[] }) {
  const id = useId();
  const [data, setData] = useState<CmsBlogPostRow[]>(initialPosts);
  const [sorting, setSorting] = useState<SortingState>([{ id: "published_at", desc: true }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const inputRef = useRef<HTMLInputElement>(null);

  function removeRow(slug: string) {
    setData((prev) => prev.filter((p) => p.slug !== slug));
  }

  const columns = useMemo<ColumnDef<CmsBlogPostRow>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
        ),
        size: 32,
        enableSorting: false,
        enableHiding: false,
      },
      {
        header: "Title",
        accessorKey: "title",
        filterFn: titleFilterFn,
        enableHiding: false,
        cell: ({ row }) => (
          <div className="flex min-w-0 items-center gap-3">
            <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-cream">
              {row.original.cover_image && (
                // eslint-disable-next-line @next/next/no-img-element -- list thumbnail, arbitrary user-typed path
                <img src={row.original.cover_image} alt="" className="h-full w-full object-cover" />
              )}
            </div>
            <span className="truncate font-medium text-text">{row.getValue("title")}</span>
          </div>
        ),
        size: 280,
      },
      {
        header: "Status",
        accessorKey: "status",
        filterFn: statusFilterFn,
        cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
        size: 130,
      },
      {
        header: "Tag",
        accessorKey: "tag",
        filterFn: tagFilterFn,
        cell: ({ row }) => <span className="text-sm text-muted">{row.getValue("tag")}</span>,
        size: 180,
      },
      {
        header: "Published",
        accessorKey: "published_at",
        cell: ({ row }) => <span className="text-sm text-muted">{formatPublishedDate(row.getValue("published_at"))}</span>,
        size: 140,
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => <RowActions slug={row.original.slug} title={row.original.title} onDeleted={removeRow} />,
        size: 90,
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, pagination, columnFilters, columnVisibility },
  });

  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const post of data) counts.set(post.tag, (counts.get(post.tag) ?? 0) + 1);
    return counts;
  }, [data]);

  const statusCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const post of data) counts.set(post.status, (counts.get(post.status) ?? 0) + 1);
    return counts;
  }, [data]);

  const selectedTags = useMemo(() => (table.getColumn("tag")?.getFilterValue() as string[]) ?? [], [table]);
  const selectedStatuses = useMemo(() => (table.getColumn("status")?.getFilterValue() as string[]) ?? [], [table]);

  function handleTagChange(checked: boolean, value: string) {
    const current = (table.getColumn("tag")?.getFilterValue() as string[]) ?? [];
    const next = checked ? [...current, value] : current.filter((v) => v !== value);
    table.getColumn("tag")?.setFilterValue(next.length ? next : undefined);
  }

  function handleStatusChange(checked: boolean, value: string) {
    const current = (table.getColumn("status")?.getFilterValue() as string[]) ?? [];
    const next = checked ? [...current, value] : current.filter((v) => v !== value);
    table.getColumn("status")?.setFilterValue(next.length ? next : undefined);
  }

  async function handleBulkDelete() {
    const slugs = table.getSelectedRowModel().rows.map((r) => r.original.slug);
    await Promise.all(slugs.map((slug) => deleteBlogPost(slug)));
    setData((prev) => prev.filter((p) => !slugs.includes(p.slug)));
    table.resetRowSelection();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Input
              id={`${id}-input`}
              ref={inputRef}
              className={`peer min-w-60 ps-9 ${table.getColumn("title")?.getFilterValue() ? "pe-9" : ""}`}
              value={(table.getColumn("title")?.getFilterValue() ?? "") as string}
              onChange={(e) => table.getColumn("title")?.setFilterValue(e.target.value)}
              placeholder="Search by title…"
              type="text"
              aria-label="Search by title"
            />
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted peer-disabled:opacity-50">
              <ListFilter size={16} strokeWidth={2} aria-hidden="true" />
            </div>
            {Boolean(table.getColumn("title")?.getFilterValue()) && (
              <button
                className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted transition-colors hover:text-text"
                aria-label="Clear filter"
                onClick={() => {
                  table.getColumn("title")?.setFilterValue("");
                  inputRef.current?.focus();
                }}
              >
                <CircleX size={16} strokeWidth={2} aria-hidden="true" />
              </button>
            )}
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Filter className="-ms-1 me-2 opacity-60" size={16} strokeWidth={2} aria-hidden="true" />
                Status
                {selectedStatuses.length > 0 && (
                  <span className="-me-1 ms-3 inline-flex h-5 items-center rounded border border-ink/10 bg-paper px-1 text-[0.625rem] font-medium text-muted">
                    {selectedStatuses.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="min-w-40 p-3" align="start">
              <div className="space-y-3">
                <div className="text-xs font-medium text-muted">Filter by status</div>
                <div className="space-y-3">
                  {(["published", "draft"] as const).map((value, i) => (
                    <div key={value} className="flex items-center gap-2">
                      <Checkbox
                        id={`${id}-status-${i}`}
                        checked={selectedStatuses.includes(value)}
                        onCheckedChange={(checked) => handleStatusChange(checked === true, value)}
                      />
                      <Label htmlFor={`${id}-status-${i}`} className="flex grow justify-between gap-2 font-normal capitalize">
                        {value} <span className="ms-2 text-xs text-muted">{statusCounts.get(value) ?? 0}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Filter className="-ms-1 me-2 opacity-60" size={16} strokeWidth={2} aria-hidden="true" />
                Tag
                {selectedTags.length > 0 && (
                  <span className="-me-1 ms-3 inline-flex h-5 items-center rounded border border-ink/10 bg-paper px-1 text-[0.625rem] font-medium text-muted">
                    {selectedTags.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="min-w-48 p-3" align="start">
              <div className="space-y-3">
                <div className="text-xs font-medium text-muted">Filter by tag</div>
                <div className="space-y-3">
                  {TAG_OPTIONS.map((value, i) => (
                    <div key={value} className="flex items-center gap-2">
                      <Checkbox
                        id={`${id}-tag-${i}`}
                        checked={selectedTags.includes(value)}
                        onCheckedChange={(checked) => handleTagChange(checked === true, value)}
                      />
                      <Label htmlFor={`${id}-tag-${i}`} className="flex grow justify-between gap-2 font-normal">
                        {value} <span className="ms-2 text-xs text-muted">{tagCounts.get(value) ?? 0}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Columns3 className="-ms-1 me-2 opacity-60" size={16} strokeWidth={2} aria-hidden="true" />
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    onSelect={(event) => event.preventDefault()}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-3">
          {table.getSelectedRowModel().rows.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline">
                  <Trash className="-ms-1 me-2 opacity-60" size={16} strokeWidth={2} aria-hidden="true" />
                  Delete
                  <span className="-me-1 ms-3 inline-flex h-5 items-center rounded border border-ink/10 bg-paper px-1 text-[0.625rem] font-medium text-muted">
                    {table.getSelectedRowModel().rows.length}
                  </span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-ink/10" aria-hidden="true">
                    <CircleAlert className="opacity-80" size={16} strokeWidth={2} />
                  </div>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete {table.getSelectedRowModel().rows.length} selected{" "}
                      {table.getSelectedRowModel().rows.length === 1 ? "post" : "posts"}.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleBulkDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Link
            href="/cms/new"
            className="inline-flex h-10 items-center rounded-lg bg-ink px-4 text-sm font-medium text-paper transition hover:bg-ink/90"
          >
            New Post
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-ink/10 bg-paper">
        <Table className="table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} style={{ width: `${header.getSize()}px` }} className="h-11">
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <div
                        className="flex h-full cursor-pointer items-center justify-between gap-2 select-none"
                        onClick={header.column.getToggleSortingHandler()}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            header.column.getToggleSortingHandler()?.(e);
                          }
                        }}
                        tabIndex={0}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{ asc: <ChevronUp size={16} className="shrink-0 opacity-60" />, desc: <ChevronDown size={16} className="shrink-0 opacity-60" /> }[
                          header.column.getIsSorted() as string
                        ] ?? null}
                      </div>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted">
                  No posts match these filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between gap-8">
        <div className="flex items-center gap-3">
          <Label htmlFor={id} className="max-sm:sr-only">
            Rows per page
          </Label>
          <Select value={table.getState().pagination.pageSize.toString()} onValueChange={(value) => table.setPageSize(Number(value))}>
            <SelectTrigger id={id} className="w-fit whitespace-nowrap">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 25, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <p className="flex grow justify-end text-sm text-muted" aria-live="polite">
          <span className="text-text">
            {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-
            {Math.min(
              table.getState().pagination.pageIndex * table.getState().pagination.pageSize + table.getState().pagination.pageSize,
              table.getRowCount(),
            )}
          </span>
          &nbsp;of&nbsp;<span className="text-text">{table.getRowCount()}</span>
        </p>

        <Pagination className="w-fit">
          <PaginationContent>
            <PaginationItem>
              <Button size="icon" variant="outline" disabled={!table.getCanPreviousPage()} onClick={() => table.firstPage()} aria-label="First page">
                <ChevronFirst size={16} />
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button size="icon" variant="outline" disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()} aria-label="Previous page">
                <ChevronLeft size={16} />
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button size="icon" variant="outline" disabled={!table.getCanNextPage()} onClick={() => table.nextPage()} aria-label="Next page">
                <ChevronRight size={16} />
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button size="icon" variant="outline" disabled={!table.getCanNextPage()} onClick={() => table.lastPage()} aria-label="Last page">
                <ChevronLast size={16} />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
