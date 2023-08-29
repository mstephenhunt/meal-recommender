import { useAuthService } from "../components/Login/auth.context";

export type InternalRequest = (input: {
  method: string,
  url: string,
  body?: object,
}) => Promise<Response>;

export function useInternalRequest() {
  const authService = useAuthService();

  async function internalRequest(input: {
    method: string,
    url: string,
    body?: object,
  }): Promise<Response> {
    
    const { method, url, body } = input;
  
    /**
     * This should never happen, but just in case...
     */
    if (!authService.loggedIn) {
      throw new Error('Unauthorized');
    }
  
    const baseUrl = process.env.REACT_APP_API_URL;
  
    const headers = new Headers(
      Object.assign(
        {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authService.jwt}`
        },
      )
    );
  
    const response = await fetch(`${baseUrl}${url}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });
  
    // If the response is a 401, mark the user as logged out
    if (response.status === 401) {
      authService.logOut();
  
      throw new Error('Unauthorized');
    }
  
    return response;
  }

  return internalRequest;
}
