import db from "@/lib/database";

export interface QueryOptions {
  sort?: string;
  order?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

export abstract class BaseModel<T> {
  protected abstract collectionName: string;

  protected get table() {
    return db.table(this.collectionName);
  }

  // Create - Fix: Cast the return type to number since we use auto-increment
  async create(data: Omit<T, "id">): Promise<number> {
    const result = await this.table.add(data);
    return result as number;
  }

  // Read
  async findById(id: number): Promise<T | undefined> {
    return await this.table.get(id);
  }

  async findAll(options?: QueryOptions): Promise<T[]> {
    let collection = this.table.toCollection();

    // Apply offset first if no sort
    if (options?.offset && !options?.sort) {
      collection = collection.offset(options.offset);
    }

    // Apply limit if no sort
    if (options?.limit && !options?.sort) {
      collection = collection.limit(options.limit);
    }

    // If sort is specified, we need to handle sorting differently
    if (options?.sort) {
      let results = (await collection.sortBy(options.sort)) as T[];

      // Apply order (asc/desc)
      if (options?.order === "desc") {
        results = results.slice().reverse();
      }

      // Apply offset
      if (options?.offset) {
        results = results.slice(options.offset);
      }

      // Apply limit
      if (options?.limit) {
        results = results.slice(0, options.limit);
      }

      return results;
    }

    // No sort - just return collection results
    const results = await collection.toArray();
    return results as T[];
  }

  async findWhere(conditions: Record<string, any>): Promise<T[]> {
    const collection = this.table.toCollection();

    // Build filter function
    const filterFn = (item: any) => {
      return Object.keys(conditions).every((key) => {
        const value = conditions[key];
        // Skip undefined or null values
        if (value === undefined || value === null) return true;
        return item[key] === value;
      });
    };

    const filtered = collection.filter(filterFn);
    const result = await filtered.toArray();
    return result as T[];
  }

  // Update
  async update(id: number, data: Partial<T>): Promise<number> {
    return await this.table.update(id, data);
  }

  // Delete
  async delete(id: number): Promise<void> {
    await this.table.delete(id);
  }

  // Utility
  async clear(): Promise<void> {
    await this.table.clear();
  }

  async count(): Promise<number> {
    return await this.table.count();
  }

  async exists(id: number): Promise<boolean> {
    const record = await this.findById(id);
    return record !== undefined;
  }
}
