import { InternalRequest } from "../../services/internal-request";

export class RecipeSuggestorService {
  public static async getRecipeNames(internalRequest: InternalRequest): Promise<string[]> {
    const response = await internalRequest({
      method: 'GET',
      url: '/me/recipes/request-recipe-names',
    });

    const responseBody = await response.json();

    const recipeNames = responseBody.recipeNames;

    return recipeNames;
  }
}