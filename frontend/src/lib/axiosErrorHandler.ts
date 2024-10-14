import { AxiosError } from "axios";

export function handleAxiosError(error: AxiosError) {
  if (error.response) {
    // Server responded with a status code out of the range 2xx
    console.error('Response data:', error.response.data);
    console.error('Response status:', error.response.status);
    console.error('Response headers:', error.response.headers);
  } else if (error.request) {
    // No response received
    console.error('No response received:', error.cause);
  } else {
    // Error during setting up the request
    console.error('Axios error message:', error.message);
  }
  console.error('Axios config:', error.config);
}
