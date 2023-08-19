import Cookie from "js-cookie";

export type Recipe = {
  name: string;
  ingredients: {
    name: string;
    quantity: number;
    unit: string;
  }[];
  instructions: string;
}

export class RecipeService {
  public static async getRecipe(recipeName: string): Promise<Recipe> {
    const baseUrl = process.env.REACT_APP_API_URL;

    const response = await fetch(`${baseUrl}/recommender/generate-recipe?recipeName=${recipeName}`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Cookie.get('jwt')}`
      },
    });

    return response.json();
  }
}