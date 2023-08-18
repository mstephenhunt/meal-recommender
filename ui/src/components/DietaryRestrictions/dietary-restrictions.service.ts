export class DietaryRestrictionsService {
  private readonly baseUrl = process.env.REACT_APP_API_URL;

  constructor() {}

  public async saveDietaryRestriction(dietaryRestrictionName: string): Promise<void> {
    await fetch(`${this.baseUrl}/user-preferences/dietary-restriction`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`
      },
      body: JSON.stringify({ dietaryRestrictionName }),
    });
  }

  public async deleteDietaryRestriction(dietaryRestrictionName: string): Promise<void> {
    await fetch(`${this.baseUrl}/user-preferences/dietary-restriction`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`
      },
      body: JSON.stringify({ dietaryRestrictionName }),
    });
  }

  public async getCurrentDietaryRestrictions(): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}/user-preferences/dietary-restriction`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`
      },
    });

    const responseBody = await response.json();

    return responseBody.dietaryRestrictions;
  }
}