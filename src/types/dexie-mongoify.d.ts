import "dexie";

declare module "dexie" {
  interface Dexie {
    collection(collectionName: string): {
      insert(data: any): Promise<{ id: number }>;
      find(query: any): {
        first(): Promise<any>;
        toArray(): Promise<any[]>;
        sort(sort: Record<string, 1 | -1>): any;
        skip(n: number): any;
        limit(n: number): any;
        count(): Promise<number>;
      };
      update(query: any, changes: any): Promise<number>;
      remove(query: any): Promise<number>;
      defineClass(schema: any): void;
    };
  }
}
