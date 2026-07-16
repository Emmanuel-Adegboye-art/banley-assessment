# Services Overview

This directory contains the data layer for the application.

## What's Here

- `BaseModel.ts` - Abstract class providing CRUD operations
- `restaurant.service.ts` - Restaurant model + service
- `calculation.service.ts` - Tip calculation model + service

## How It Works

Each service extends `BaseModel` and specifies a collection name.

```typescript
export class YourService extends BaseModel<YourInterface> {
  protected collectionName = 'your_collection_name'
}
```

## BaseModel Methods

The following methods are available on any service:

- `create(data)` - Insert a document
- `findById(id)` - Find by ID
- `findAll(options)` - Get all documents
- `findWhere(conditions, options)` - Query with conditions
- `update(id, data)` - Update a document
- `delete(id)` - Delete a document
- `clear()` - Delete all documents
- `count()` - Count documents
- `exists(id)` - Check if exists

## Query Conditions

Conditions use MongoDB-like operators:

- `{ field: value }` - Equal to
- `{ field: { $gt: value } }` - Greater than
- `{ field: { $regex: 'text' } }` - Contains text
- `{ field: { $regex: 'text', $options: 'i' } }` - Case insensitive

## Your Task

1. Explore the existing services
2. Understand how they work
3. Use them in your components
4. Add your own methods if needed

## Documentation

- Dexie.js: https://dexie.org
- dexie-mongoify: https://github.com/dexie/Dexie.js/wiki/dexie-mongoify

---

**Explore. Learn. Build.**