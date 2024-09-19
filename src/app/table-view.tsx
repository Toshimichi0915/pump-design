import { Table } from "@/app/table"
import tableViewStyles from "@/app/table-view.module.css"

function TableRow<TKeys extends string[]>({ table, row }: { table: Table<TKeys>; row: Table<TKeys>["rows"][number] }) {
  const columns = table.headers
    .map((header) => {
      const key = table.keys[table.headers.indexOf(header)]
      return [header, row[key as TKeys[number]]] as const
    })
    .filter(([header]) => !header.startsWith("_"))

  return (
    <div className={tableViewStyles.tableRow}>
      {columns.map(([header, value]) => (
        <div key={header} className={tableViewStyles.tableColumn}>
          <p className={tableViewStyles.tableHeader}>{header}</p>
          <p className={tableViewStyles.tableValue}>{value}</p>
        </div>
      ))}
    </div>
  )
}

export function TableView({ table }: { table: Table<string[]> }) {
  return (
    <div className={tableViewStyles.tableView}>
      {table.rows.map((row) => (
        <TableRow key={JSON.stringify(row)} table={table} row={row} />
      ))}
    </div>
  )
}
