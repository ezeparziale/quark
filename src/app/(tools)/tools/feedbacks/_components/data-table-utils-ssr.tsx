import { SortingState } from "@tanstack/react-table"

export interface IDataTableSearchParamsSSR {
  q?: string
  page?: string
  per_page?: string
  sort?: string
}

export function getSearchParamsSSR(
  searchParams: IDataTableSearchParamsSSR,
  defaultSort: string,
) {
  // Search
  const search: string | undefined = searchParams?.q || undefined

  // Pages
  const defaultPerPage: number = 10
  const currentPage: number = Number(searchParams?.page) || 1
  const limit: number = Number(searchParams?.per_page) || defaultPerPage
  const offset: number = (currentPage - 1) * limit

  // Sort
  const sort: string = searchParams?.sort || defaultSort
  const sortState: SortingState = createSortingState(sort)
  const orderBy: {
    [x: string]: string
  }[] = sortState.map((sortObject) => ({
    [sortObject.id]: sortObject.desc ? "desc" : "asc",
  }))

  return { search, currentPage, limit, offset, sort, orderBy, sortState }
}

function createSortingState(sort: string): SortingState {
  const sortObjects: SortingState = sort.split(",").map((sortField) => {
    const desc: boolean = sortField.startsWith("-")
    const id: string = desc ? sortField.substring(1) : sortField
    return { id, desc }
  })
  return sortObjects
}
