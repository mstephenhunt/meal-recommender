import Cookie from "js-cookie";

export class DietaryRestrictionsService {
  public static async saveDietaryRestriction(dietaryRestrictionName: string): Promise<void> {
    const baseUrl = process.env.REACT_APP_API_URL;
   
    await fetch(`${baseUrl}/user-preferences/dietary-restriction`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Cookie.get('jwt')}`
      },
      body: JSON.stringify({ dietaryRestrictionName }),
    });
  }

  public static async deleteDietaryRestriction(dietaryRestrictionName: string): Promise<void> {
    const baseUrl = process.env.REACT_APP_API_URL;
   
    await fetch(`${baseUrl}/user-preferences/dietary-restriction`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Cookie.get('jwt')}`
      },
      body: JSON.stringify({ dietaryRestrictionName }),
    });
  }

  public static async getCurrentDietaryRestrictions(): Promise<string[]> {
    const baseUrl = process.env.REACT_APP_API_URL;

    const response = await fetch(`${baseUrl}/user-preferences/dietary-restriction`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Cookie.get('jwt')}`
      },
    });

    const responseBody = await response.json() as { displayName: string }[];
    
    if (response.ok) {
      return responseBody.map((dietaryRestriction) => dietaryRestriction.displayName);
    }

    return [];
  }
}