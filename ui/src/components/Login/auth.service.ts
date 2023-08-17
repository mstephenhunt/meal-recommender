export class AuthService {
  private refreshTimeout: NodeJS.Timeout | null = null;
  private setLoginState: (loggedIn: boolean) => void;

  constructor(setLoginState: (loggedIn: boolean) => void) {
    this.setLoginState = setLoginState;

    // Have to bind these functions to the class so they can be called from
    // setTimeout and clearTimeout
    this.refreshToken = this.refreshToken.bind(this);
    this.setJwt = this.setJwt.bind(this);
  }

  public async refreshToken(): Promise<void>{
    clearTimeout(this.refreshTimeout!);

    try {
      const baseUrl = process.env.REACT_APP_API_URL;

      const response = await fetch(`${baseUrl}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: localStorage.getItem("jwt") }),
      });

      await this.setJwt(response);

      // Once refreshed, schedule the next token refresh
      this.scheduleTokenRefresh();
    } catch (error) {
      console.error(error);

      // If there's any error, navigate back to the login page
      this.setLoginState(false);
    }
  }

  public async setJwt(response: Response): Promise<void> {
    const statusCode = response.status;
    const responseBody = await response.json();

    if (statusCode === 201) {
      // If the login was successful, save the JWT from the response into local storage
      const { jwt } = responseBody;
      localStorage.setItem("jwt", jwt);
    } else {
      throw new Error("An unknown error occurred. Please try again.");
    }
  }

  public scheduleTokenRefresh(): void {
    const refreshInterval = 60000; // 1 minute

    // Set the token refresh timeout
    const refreshTimeout = setTimeout(this.refreshToken, refreshInterval);

    // Save the timeout so we can clean it up later
    this.refreshTimeout = refreshTimeout;
  };

  public cancelTokenRefresh(): void {
    localStorage.removeItem("jwt");

    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }
  }
}