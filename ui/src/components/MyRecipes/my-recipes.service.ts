import { InternalRequest } from "../../services/internal-request";
import { Recipe } from "../FilteredRecipe/filtered-recipe.service";

export class MyRecipesService {
  public static async getMyRecipes(input: {
    internalRequest: InternalRequest;
  }): Promise<Recipe[]> {
    const response = await input.internalRequest({
      method: 'GET',
      url: '/me/recipes',
    });

    return response.json();
  }
}