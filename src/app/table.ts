export class Table<TKeys extends string[]> {
  name: string
  keys: TKeys
  headers: string[]
  rows: { [key in TKeys[number]]: number }[]

  constructor(name: string, keys: TKeys, headers: string[], rows: Table<TKeys>["rows"]) {
    this.name = name
    this.keys = keys
    this.headers = headers
    this.rows = rows
  }

  merge<TOtherKeys extends string[]>(other: Table<TOtherKeys>): Table<[...TKeys, ...TOtherKeys]> {
    const rows = this.rows.flatMap((row) => {
      return other.rows.map((otherRow) => {
        return { ...row, ...otherRow }
      })
    })

    return new Table(
      this.name,
      [...this.keys, ...other.keys],
      [...this.headers, ...other.headers],
      rows as Table<[...TKeys, ...TOtherKeys]>["rows"],
    )
  }

  append<const TOtherKeys extends string[]>(
    keys: TOtherKeys,
    headers: string[],
    calculator: (row: Table<TKeys>["rows"][number]) => { [key in TOtherKeys[number]]: number },
  ): Table<[...TKeys, ...TOtherKeys]> {
    const rows = this.rows.map((row) => {
      return { ...row, ...calculator(row) }
    })

    return new Table(
      this.name,
      [...this.keys, ...keys],
      [...this.headers, ...headers],
      rows as Table<[...TKeys, ...TOtherKeys]>["rows"],
    )
  }

  find(matcher: (row: Table<TKeys>["rows"][number]) => boolean): Table<TKeys>["rows"][number] | undefined {
    return this.rows.find(matcher)
  }

  filter(matcher: (row: Table<TKeys>["rows"][number]) => boolean): Table<TKeys> {
    return new Table(this.name, this.keys, this.headers, this.rows.filter(matcher))
  }

  reverse(): Table<TKeys> {
    return new Table(this.name, this.keys, this.headers, this.rows.toReversed())
  }

  select<TOtherKeys extends string[]>(
    other: Table<TOtherKeys>,
    matcher: (row: Table<[...TKeys, ...TOtherKeys]>["rows"][number]) => boolean,
  ): Table<[...TKeys, ...TOtherKeys]> {
    const newRows = this.rows
      .map((row) => {
        const merged = new Table(
          this.name,
          [...this.keys, ...other.keys],
          [...this.headers, ...other.headers],
          other.rows.map((otherRow) => {
            return { ...row, ...otherRow }
          }) as Table<[...TKeys, ...TOtherKeys]>["rows"],
        ) as Table<[...TKeys, ...TOtherKeys]>

        const selected = merged.rows.find(matcher)
        if (selected) {
          return selected
        }
      })
      .filter((row) => row != null)

    return new Table(this.name, [...this.keys, ...other.keys], [...this.headers, ...other.headers], newRows)
  }

  selectAll<TOtherKeys extends string[]>(
    other: Table<TOtherKeys>,
    matcher: (row: Table<[...TKeys, ...TOtherKeys]>["rows"][number]) => boolean,
  ): Table<[...TKeys, ...TOtherKeys]> {
    const merged = this.merge(other)
    merged.rows = merged.rows.filter(matcher)
    return merged
  }
}

export function newTable<const TKeys extends string[]>(name: string, keys: TKeys, headers: string[], rows: number[][]) {
  return new Table<TKeys>(
    name,
    keys,
    headers,
    rows.map((row) => Object.fromEntries(row.map((value, index) => [keys[index], value]))) as Table<TKeys>["rows"],
  )
}
