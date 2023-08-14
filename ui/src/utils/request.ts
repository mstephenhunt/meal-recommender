/**
 * Used as a wrapper around fetch to add the JWT token to the request headers
 */
export const fetchWithToken = (url: string, options?: RequestInit) => {
  const token = localStorage.getItem('jwtToken');

  const headers = new Headers(options?.headers);
  headers.append('Authorization', `Bearer ${token}`);

  const baseUrl = process.env.REACT_APP_API_URL;

  const fullUrl = `${baseUrl}${url}`;

  return fetch(fullUrl, { ...options, headers });
};