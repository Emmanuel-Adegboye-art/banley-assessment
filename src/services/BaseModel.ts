import db from "../lib/database";

export interface QueryOptions {
  sort?: Record<string, 1 | -1>;
  limit?: number;
  skip?: number;
}

export abstract class BaseModel<T> {
  protected abstract collectionName: string;

  protected get collection() {
    return db.collection(this.collectionName);
  }

  // Create
  async create(data: Omit<T, "id">): Promise<number> {
    const result = await this.collection.insert(data);
    return result.id;
  }

  // Read
  async findById(id: number): Promise<T | null> {
    const result = await this.collection.find({ id }).first();
    return result || null;
  }

  async findAll(options?: QueryOptions): Promise<T[]> {
    let query = this.collection.find({});

    if (options?.sort) {
      query = query.sort(options.sort);
    }
    if (options?.skip) {
      query = query.skip(options.skip);
    }
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    return query.toArray();
  }

  async findWhere(
    conditions: Record<string, any>,
    options?: QueryOptions,
  ): Promise<T[]> {
    let query = this.collection.find(conditions);

    if (options?.sort) {
      query = query.sort(options.sort);
    }
    if (options?.skip) {
      query = query.skip(options.skip);
    }
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    return query.toArray();
  }

  // Update
  async update(id: number, data: Partial<T>): Promise<boolean> {
    const result = await this.collection.update({ id }, { $set: data });
    return result > 0;
  }

  // Delete
  async delete(id: number): Promise<boolean> {
    const result = await this.collection.remove({ id });
    return result > 0;
  }

  // Utility
  async clear(): Promise<void> {
    await this.collection.remove({});
  }

  async count(): Promise<number> {
    return this.collection.find({}).count();
  }

  async exists(id: number): Promise<boolean> {
    const result = await this.findById(id);
    return result !== null;
  }
}
