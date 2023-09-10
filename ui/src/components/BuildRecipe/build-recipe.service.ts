import { InternalRequest } from "../../services/internal-request";

export type FilterIngredient = {
  id: number;
  name: string,
  displayName: string;
}

export type FilterDiet = {
  id: number;
  name: string,
  displayName: string;
}

export type FilterAllergen = {
  id: number;
  name: string,
  displayName: string;
}

export class BuildRecipeService {
  public static async getFilterIngredients(input: { internalRequest: InternalRequest }): Promise<FilterIngredient[]> {
    const { internalRequest } = input;

    const response = await internalRequest({
      method: "GET",
      url: "/user/recipe-filters/ingredients",
    });

    const responseBody = await response.json() as FilterIngredient[];

    return responseBody;
  }

  public static async saveFilterIngredient(input: {
    internalRequest: InternalRequest,
    ingredientName: string,
  }): Promise<FilterIngredient> {
    const { ingredientName } = input;

    const response = await input.internalRequest({
      method: "POST",
      url: "/user/recipe-filters/ingredients",
      body: { ingredientName },
    });

    const responseBody = await response.json() as FilterIngredient;

    return responseBody;
  }

  public static async deleteFilterIngredient(input: {
    internalRequest: InternalRequest,
    ingredientId: number,
  }): Promise<void> {
    const { ingredientId } = input;

    await input.internalRequest({
      method: "DELETE",
      url: "/user/recipe-filters/ingredients",
      body: { ingredientId },
    });
  }

  public static async getFilterDiets(input: { internalRequest: InternalRequest }): Promise<FilterDiet[]> {
    const { internalRequest } = input;

    const response = await internalRequest({
      method: "GET",
      url: "/user/recipe-filters/diets",
    });

    const responseBody = await response.json() as FilterDiet[];

    return responseBody;
  }

  public static async saveFilterDiet(input: {
    internalRequest: InternalRequest,
    dietName: string,
  }): Promise<FilterDiet> {
    const { dietName } = input;

    const response = await input.internalRequest({
      method: "POST",
      url: "/user/recipe-filters/diets",
      body: { dietName },
    });

    const responseBody = await response.json() as FilterDiet;

    return responseBody;
  }

  public static async deleteFilterDiet(input: {
    internalRequest: InternalRequest,
    dietId: number,
  }): Promise<void> {
    const { dietId } = input;

    await input.internalRequest({
      method: "DELETE",
      url: "/user/recipe-filters/diets",
      body: { dietId },
    });
  }

  public static async getFilterAllergens(input: { internalRequest: InternalRequest }): Promise<FilterAllergen[]> {
    const { internalRequest } = input;

    const response = await internalRequest({
      method: "GET",
      url: "/user/recipe-filters/allergens",
    });

    const responseBody = await response.json() as FilterAllergen[];

    return responseBody;
  }

  public static async saveFilterAllergen(input: {
    internalRequest: InternalRequest,
    allergenName: string,
  }): Promise<FilterAllergen> {
    const { allergenName } = input;

    const response = await input.internalRequest({
      method: "POST",
      url: "/user/recipe-filters/allergens",
      body: { allergenName },
    });

    const responseBody = await response.json() as FilterAllergen;

    return responseBody;
  }

  public static async deleteFilterAllergen(input: {
    internalRequest: InternalRequest,
    allergenId: number,
  }): Promise<void> {
    const { allergenId } = input;

    await input.internalRequest({
      method: "DELETE",
      url: "/user/recipe-filters/allergens",
      body: { allergenId },
    });
  }
}