import { Database } from "bun:sqlite"

export abstract class BaseService<T> {
  protected db: Database
  protected tableName: string

  constructor(tableName: string) {
    this.db = new Database('database.db')
    this.tableName = tableName
  }

  async getAll(): Promise<T[]> {
    const query = this.db.prepare(`SELECT * FROM ${this.tableName}`)
    return query.all() as T[]
  }

  async getById(id: number): Promise<T | null> {
    const query = this.db.prepare(`SELECT * FROM ${this.tableName} WHERE id = ?`)
    return query.get(id) as T
  }

  async create(data: Partial<T>): Promise<void> {
    const keys = Object.keys(data)
    const placeholders = keys.map(() => '?').join(', ')
    const values = Object.values(data) as any[]

    const query = this.db.prepare(`INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders})`)
    query.run(...values)
  }

  async update(id: number, data: Partial<T>): Promise<void> {
    const updates = Object.keys(data).map(key => `${key} = ?`).join(', ')
    const values = [...Object.values(data) as any[], id]

    const query = this.db.prepare(`UPDATE ${this.tableName} SET ${updates} WHERE id = ?`)
    query.run(...values)
  }

  async delete(id: number): Promise<void> {
    const query = this.db.prepare(`DELETE FROM ${this.tableName} WHERE id = ?`)
    query.run(id)
  }
}
