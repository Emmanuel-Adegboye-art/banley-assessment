import { BaseModel } from "./BaseModel";

export interface Restaurant {
  id?: number;
  name: string;
  tipPercentage: number;
  currency: string;
  location: {
    city: string;
    state: string;
  };
  createdAt: string;
  updatedAt: string;
}

export class RestaurantService extends BaseModel<Restaurant> {
  protected collectionName = "restaurants";

  // Find by name (partial match, case insensitive)
  async findByName(name: string): Promise<Restaurant[]> {
    return this.findWhere({
      name: { $regex: name, $options: "i" },
    });
  }

  // Find by city
  async findByCity(city: string): Promise<Restaurant[]> {
    return this.findWhere({
      "location.city": { $regex: city, $options: "i" },
    });
  }

  // Find by state
  async findByState(state: string): Promise<Restaurant[]> {
    return this.findWhere({
      "location.state": { $regex: state, $options: "i" },
    });
  }

  // Find by tip percentage
  async findByTipPercentage(percentage: number): Promise<Restaurant[]> {
    return this.findWhere({
      tipPercentage: percentage,
    });
  }

  // Get latest restaurants
  async getLatest(limit: number = 10): Promise<Restaurant[]> {
    return this.findAll({
      sort: { createdAt: -1 },
      limit,
    });
  }

  // Update tip percentage only
  async updateTipPercentage(
    id: number,
    tipPercentage: number,
  ): Promise<boolean> {
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
  ): Promise<boolean> {
    return this.update(id, {
      location: { city, state },
      updatedAt: new Date().toISOString(),
    });
  }
}
