import { InternalRequest } from "../../services/internal-request";

export class FilteredRecipeNameSuggestorService {
  public static async getFilteredRecipeNames(input: {
    internalRequest: InternalRequest
  }): Promise<string[]> {
    const { internalRequest } = input;

    const response = await internalRequest({
      method: 'GET',
      url: `/me/filtered-recipe/names`,
    });

    const body = await response.json();

    return body.recipeNames;
  }
}