import Cookies from 'js-cookie';

export class RecipeSuggestorService {
  public static async getRecipeNames(): Promise<string[]> {
    const baseUrl = process.env.REACT_APP_API_URL;

    const response = await fetch(`${baseUrl}/recipe/request-recipe-names`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${Cookies.get('jwt')}`,
      },
    });

    const responseBody = await response.json();

    const recipeNames = responseBody.recipeNames;

    return recipeNames;
  }
}