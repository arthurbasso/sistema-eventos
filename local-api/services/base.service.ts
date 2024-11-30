import { Database } from "bun:sqlite"

export abstract class BaseService<T> {
  protected db: Database
  protected tableName: string

  constructor(tableName: string) {
    this.db = new Database('../databaseLocal.db')
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

  async getByUserId(userId: number): Promise<T | null> {
    const query = this.db.prepare(`SELECT * FROM ${this.tableName} WHERE user_id = ?`);
    return query.all(userId) as T;
  }

  async create(data: Partial<T>): Promise<number | bigint> {
    const keys = Object.keys(data)
    const placeholders = keys.map(() => '?').join(', ')
    const values = Object.values(data) as any[]

    const query = this.db.prepare(`INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders})`)
    let result = query.run(...values)

    return result.lastInsertRowid
  }

  async update(id: number, data: Partial<T>): Promise<boolean> {
    const updates = Object.keys(data).map(key => `${key} = ?`).join(', ')
    const values = [...Object.values(data) as any[], id]

    const query = this.db.prepare(`UPDATE ${this.tableName} SET ${updates} WHERE id = ?`)
    let result = query.run(...values)

    return !!result.changes
  }

  async delete(id: number): Promise<boolean> {
    const query = this.db.prepare(`DELETE FROM ${this.tableName} WHERE id = ?`)
    let result = query.run(id)

    if (!result.changes) {
      throw new Error('No record found')
    }

    return !!result.changes
  }
}
