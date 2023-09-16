import { InternalRequest } from "../../services/internal-request";

export type Recipe = {
  id: number;
  name: string;
  ingredients: {
    id: number;
    name: string;
    quantity: number;
    unit: string;
  }[];
  instructions: string;
  dietFilters: {
    id: number;
    name: string;
    displayName: string;
  }[];
  allergenFilters: {
    id: number;
    name: string;
    displayName: string;
  }[];
  ingredientFilters: {
    id: number;
    name: string;
    displayName: string;
  }
}

export class FilteredRecipeService {
  public static async getRecipe(input: {
    internalRequest: InternalRequest,
    recipeName: string
  }): Promise<Recipe> {
    const { internalRequest, recipeName } = input;

    const response = await internalRequest({
      method: 'GET',
      url: `/me/filtered-recipe?recipeName=${recipeName}`,
    });

    return response.json();
  }
}