import { NEXT_PUBLIC_API_URL } from "@/config/env";

/**
 * Define the response types for better type safety
 */
export type SignupErrors = {
  name?: string[];      // Array of error messages for 'name'
  email?: string[];     // Array of error messages for 'email'
  password?: string[];  // Array of error messages for 'password'
  passwordConfirm?: string[]; // Array of error messages for 'passwordConfirm'
};

export type SignupResult = {
  success?: boolean;     // Success flag
  message?: string;     // Success message or failure message
  errors?: SignupErrors | string;  // Field errors (for form display)
};

/**
 * `signup` function with typed result
 * 
 * @param formData: FormData
 * @returns Promise<SignupResult>
 */
export async function signup(formData: FormData): Promise<SignupResult> {
  const { name, email, password } = formDataToObject(formData);

  // 1. Send data to the backend (API call)
  try {
    const response = await fetch(`${NEXT_PUBLIC_API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    // 2. send response data to form
    if (response.ok) {
      return {
        success: true,
        message: data.message || 'Signup successful',
      };
    } else {
      return {
        success: false,
        errors: data.message || 'An error occurred during signup!',
      };
    }
  } catch (error) {
    // Handle network or unexpected errors
    console.error(error);
    return {
      success: false,
      errors: 'An unexpected error occurred. Please try again later.',
    };
  }
}

const formDataToObject = (formData: FormData) => {
  const formObject: Record<string, string> = {};

  formData.forEach((value, key) => {
    formObject[key] = value.toString();
  });

  return formObject;
};

interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    const response = await fetch(`${NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    console.log("response: ", response);


    return response.json();
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
}
