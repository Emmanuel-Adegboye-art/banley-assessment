import { BaseModel } from "./BaseModel";

export interface Restaurant {
  id?: number;
  name: string;
  tipPercentage: number;
  currency: string;
  city: string;
  state: string;
  createdAt: string;
  updatedAt: string;
}

export class RestaurantService extends BaseModel<Restaurant> {
  protected collectionName = "restaurants";

  // Find by name (exact match)
  async findByName(name: string): Promise<Restaurant[]> {
    return this.findWhere({ name });
  }

  // Find by city (exact match)
  async findByCity(city: string): Promise<Restaurant[]> {
    return this.findWhere({ city });
  }

  // Find by state (exact match)
  async findByState(state: string): Promise<Restaurant[]> {
    return this.findWhere({ state });
  }

  // Find by tip percentage (exact match)
  async findByTipPercentage(percentage: number): Promise<Restaurant[]> {
    return this.findWhere({ tipPercentage: percentage });
  }

  // Get latest restaurants
  async getLatest(limit: number = 10): Promise<Restaurant[]> {
    return this.findAll({
      sort: "createdAt",
      order: "desc",
      limit,
    });
  }

  // Update tip percentage only
  async updateTipPercentage(
    id: number,
    tipPercentage: number,
  ): Promise<number> {
    return this.update(id, {
      tipPercentage,
      updatedAt: new Date().toISOString(),
    });
  }

  // Update location only
  async updateLocation(
    id: number,
    city: string,
    state: string,
  ): Promise<number> {
    return this.update(id, {
      city,
      state,
      updatedAt: new Date().toISOString(),
    });
  }
}
