export const appSchemas = {
  restaurants:
    "++id, name, tipPercentage, currency, city, state, createdAt, updatedAt",
  calculations:
    "++id, restaurantId, billAmount, tipPercentage, numberOfPeople, totalTip, totalBill, perPerson, notes, createdAt",
};
