"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type FilterFn,
  type PaginationState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleAlert,
  Columns3,
  Eye,
  EyeOff,
  Filter,
  ListFilter,
  CircleX,
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
import { WorkProjectDrawer } from "./WorkProjectDrawer";
import { deleteWorkProject, toggleWorkProjectVisibility } from "@/lib/actions/cms-work-actions";
import type { WorkProjectRow } from "@/lib/data/work-db";
import { PROJECT_CATEGORIES } from "@/types/work";

// Remembered across sessions so "rows per page" stays what it was last
// set to (on request — "misalnya pagi ini aku set 10. nanti kalo login
// lagi malam hari, tetap 10") instead of resetting to the default every
// time this page loads. A per-browser convenience, not real data, so
// `localStorage` is the right place for it rather than the database.
const PAGE_SIZE_STORAGE_KEY = "paistudio-cms-work-page-size";
const DEFAULT_PAGE_SIZE = 10;

function readStoredPageSize(): number {
  try {
    const stored = localStorage.getItem(PAGE_SIZE_STORAGE_KEY);
    const parsed = stored ? Number(stored) : NaN;
    return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_PAGE_SIZE;
  } catch {
    // Private browsing / blocked storage — fall back to the default
    // rather than breaking the table over a convenience feature.
    return DEFAULT_PAGE_SIZE;
  }
}

const titleFilterFn: FilterFn<WorkProjectRow> = (row, _columnId, filterValue: string) => {
  return row.original.title.toLowerCase().includes((filterValue ?? "").toLowerCase());
};

const categoryFilterFn: FilterFn<WorkProjectRow> = (row, columnId, filterValue: string[]) => {
  if (!filterValue?.length) return true;
  const rowCategories = (row.getValue(columnId) as string[]) ?? [];
  return filterValue.some((v) => rowCategories.includes(v));
};

function VisibilityBadge({ visible }: { visible: boolean }) {
  return (
    <span
      className={
        visible
          ? "inline-flex items-center rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium text-success"
          : "inline-flex items-center rounded-full bg-cream px-2.5 py-1 text-xs font-medium text-muted"
      }
    >
      {visible ? "Visible" : "Hidden"}
    </span>
  );
}

function RowActions({
  project,
  onDeleted,
  onToggled,
  onEdit,
}: {
  project: WorkProjectRow;
  onDeleted: (slug: string) => void;
  onToggled: (slug: string, isVisible: boolean) => void;
  onEdit: (project: WorkProjectRow) => void;
}) {
  const { slug, title, is_visible: isVisible } = project;
  const [open, setOpen] = useState(false);
  const [toggling, setToggling] = useState(false);

  async function handleDelete() {
    await deleteWorkProject(slug);
    onDeleted(slug);
    setOpen(false);
  }

  async function handleToggleVisibility() {
    const next = !isVisible;
    setToggling(true);
    // Optimistic — the row's badge/icon flips immediately; revert on
    // failure rather than making every click wait on a round trip.
    onToggled(slug, next);
    try {
      await toggleWorkProjectVisibility(slug, next);
    } catch {
      onToggled(slug, isVisible);
    } finally {
      setToggling(false);
    }
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        disabled={toggling}
        aria-label={isVisible ? `Hide ${title} from /work` : `Show ${title} on /work`}
        title={isVisible ? "Hide from /work" : "Show on /work"}
        onClick={handleToggleVisibility}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-cream hover:text-text disabled:opacity-50"
      >
        {isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
      </button>
      <button
        type="button"
        aria-label={`Edit ${title}`}
        onClick={() => onEdit(project)}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-cream hover:text-text"
      >
        <Pencil size={16} />
      </button>
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

export function WorkProjectsDataTable({ projects: initialProjects }: { projects: WorkProjectRow[] }) {
  const id = useId();
  const [data, setData] = useState<WorkProjectRow[]>(initialProjects);
  const [sorting, setSorting] = useState<SortingState>([{ id: "sort_order", desc: false }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  // Starts at the SSR-safe default, then syncs to whatever was saved in
  // `localStorage` right after mount (can't read `localStorage` during
  // the initial render without risking a hydration mismatch) — see
  // `readStoredPageSize` above.
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: DEFAULT_PAGE_SIZE });
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageSize: readStoredPageSize() }));
  }, []);
  const inputRef = useRef<HTMLInputElement>(null);
  const [editingProject, setEditingProject] = useState<WorkProjectRow | null>(null);

  // `ProjectForm`'s own save action redirects to `/cms/work` on success —
  // since we're already here, that's a real navigation that re-fetches
  // this page's Server Component and hands `initialProjects` down again
  // (a new array reference, unlike any of this table's own local
  // optimistic updates). Treat that as "a save just completed" and close
  // the drawer, without `ProjectForm` needing an explicit success callback.
  useEffect(() => {
    setEditingProject(null);
  }, [initialProjects]);

  function removeRow(slug: string) {
    setData((prev) => prev.filter((p) => p.slug !== slug));
  }

  function updateRowVisibility(slug: string, isVisible: boolean) {
    setData((prev) => prev.map((p) => (p.slug === slug ? { ...p, is_visible: isVisible } : p)));
  }

  const columns = useMemo<ColumnDef<WorkProjectRow>[]>(
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
        size: 260,
      },
      {
        header: "Categories",
        accessorKey: "categories",
        filterFn: categoryFilterFn,
        enableSorting: false,
        cell: ({ row }) => {
          const categories = row.getValue("categories") as string[];
          return <span className="text-sm text-muted">{categories.length ? categories.join(", ") : "—"}</span>;
        },
        size: 220,
      },
      {
        header: "Badge",
        accessorKey: "badge",
        cell: ({ row }) => <span className="text-sm text-muted">{row.getValue("badge") ?? "—"}</span>,
        size: 140,
      },
      {
        header: "Tags",
        accessorKey: "tags",
        enableSorting: false,
        cell: ({ row }) => <span className="text-sm text-muted">{(row.getValue("tags") as string[]).join(", ")}</span>,
        size: 200,
      },
      {
        header: "Order",
        accessorKey: "sort_order",
        size: 80,
      },
      {
        header: "Visibility",
        accessorKey: "is_visible",
        cell: ({ row }) => <VisibilityBadge visible={row.getValue("is_visible")} />,
        size: 110,
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <RowActions project={row.original} onDeleted={removeRow} onToggled={updateRowVisibility} onEdit={setEditingProject} />
        ),
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
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: { sorting, pagination, columnFilters, columnVisibility },
  });

  // `getFacetedUniqueValues()` treats each cell's value as one opaque key —
  // fine for a scalar column, but `categories` is an array per row, so counts
  // are built by hand: how many rows include each category at all.
  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const project of data) {
      for (const category of project.categories) {
        counts.set(category, (counts.get(category) ?? 0) + 1);
      }
    }
    return counts;
  }, [data]);

  const selectedCategories = useMemo(() => {
    return (table.getColumn("categories")?.getFilterValue() as string[]) ?? [];
  }, [table]);

  function handleCategoryChange(checked: boolean, value: string) {
    const current = (table.getColumn("categories")?.getFilterValue() as string[]) ?? [];
    const next = checked ? [...current, value] : current.filter((v) => v !== value);
    table.getColumn("categories")?.setFilterValue(next.length ? next : undefined);
  }

  async function handleBulkDelete() {
    const slugs = table.getSelectedRowModel().rows.map((r) => r.original.slug);
    await Promise.all(slugs.map((slug) => deleteWorkProject(slug)));
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
                Category
                {selectedCategories.length > 0 && (
                  <span className="-me-1 ms-3 inline-flex h-5 items-center rounded border border-ink/10 bg-paper px-1 text-[0.625rem] font-medium text-muted">
                    {selectedCategories.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="min-w-48 p-3" align="start">
              <div className="space-y-3">
                <div className="text-xs font-medium text-muted">Filter by category</div>
                <div className="space-y-3">
                  {PROJECT_CATEGORIES.map((value, i) => (
                    <div key={value} className="flex items-center gap-2">
                      <Checkbox
                        id={`${id}-cat-${i}`}
                        checked={selectedCategories.includes(value)}
                        onCheckedChange={(checked) => handleCategoryChange(checked === true, value)}
                      />
                      <Label htmlFor={`${id}-cat-${i}`} className="flex grow justify-between gap-2 font-normal">
                        {value} <span className="ms-2 text-xs text-muted">{categoryCounts.get(value) ?? 0}</span>
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
                      {table.getSelectedRowModel().rows.length === 1 ? "project" : "projects"}.
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
            href="/cms/work/new"
            className="inline-flex h-10 items-center rounded-lg bg-ink px-4 text-sm font-medium text-paper transition hover:bg-ink/90"
          >
            New Project
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
                  No projects match these filters.
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
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
              try {
                localStorage.setItem(PAGE_SIZE_STORAGE_KEY, value);
              } catch {
                // Private browsing / blocked storage — the change still
                // applies for this session, it just won't be remembered.
              }
            }}
          >
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

      <WorkProjectDrawer project={editingProject} onClose={() => setEditingProject(null)} />
    </div>
  );
}
