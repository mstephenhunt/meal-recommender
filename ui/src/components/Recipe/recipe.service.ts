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
  dietaryRestrictions: {
    id: number;
    name: string;
  }[];
}

export class RecipeService {
  public static async getRecipe(input: {
    internalRequest: InternalRequest,
    recipeName: string
  }): Promise<Recipe> {
    const { internalRequest, recipeName } = input;

    const response = await internalRequest({
      method: 'GET',
      url: `/me/recipes/generate-recipe?recipeName=${recipeName}`,
    });

    return response.json();
  }
}