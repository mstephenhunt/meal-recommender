import { InternalRequest } from "../../services/internal-request";

export class DietaryRestrictionsService {
  public static async saveDietaryRestriction(input: {
    internalRequest: InternalRequest,
    dietaryRestrictionName: string
  }): Promise<void> {
    const { internalRequest, dietaryRestrictionName } = input;

    await internalRequest({
      method: "POST",
      url: "/user-preferences/dietary-restriction",
      body: { dietaryRestrictionName }
    });
  }

  public static async deleteDietaryRestriction(input: {
    internalRequest: InternalRequest,
    dietaryRestrictionName: string
  }): Promise<void> {
    const { internalRequest, dietaryRestrictionName } = input;

    await internalRequest({
      method: "DELETE",
      url: "/user-preferences/dietary-restriction",
      body: { dietaryRestrictionName }
    });
  }

  public static async getCurrentDietaryRestrictions(input: { internalRequest: InternalRequest }): Promise<string[]> {
    const { internalRequest } = input;

    const response = await internalRequest({
      method: "GET",
      url: "/user-preferences/dietary-restriction",
    });

    const responseBody = await response.json() as { displayName: string }[];
    
    if (response.ok) {
      return responseBody.map((dietaryRestriction) => dietaryRestriction.displayName);
    }

    return [];
  }
}