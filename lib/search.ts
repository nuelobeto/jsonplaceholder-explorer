/**
 * Case-insensitive substring match across whichever fields a resource exposes
 * to search. An empty query matches everything.
 */
export const filterByQuery = <T>(
  items: T[],
  query: string,
  fields: (item: T) => Array<string | number | boolean>
): T[] => {
  const needle = query.trim().toLowerCase()
  if (!needle) return items

  return items.filter((item) =>
    fields(item).some((field) => String(field).toLowerCase().includes(needle))
  )
}
