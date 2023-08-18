export class RecipeSuggestorService {
  public static async getRecipeNames(): Promise<string[]> {
    const baseUrl = process.env.REACT_APP_API_URL;

    console.log('Loaing...')

    const response = await fetch(`${baseUrl}/recommender/request-recipe-names`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
      },
    });

    const responseBody = await response.json();

    const recipeNames = responseBody.recipeNames;

    return recipeNames;
  }
}