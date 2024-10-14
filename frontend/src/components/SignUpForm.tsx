'use client';

import React, { Reducer } from "react";
import { ChangeEvent, FormEvent, useReducer } from 'react';

import { SignupFormSchema } from '@/lib/definitions';
import { signup, SignupResult } from '@/actions/auth';
import { SubmitButton } from '@/ui/SubmitButton';
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import FormInput from "../ui/FormInput";
import Alert from '../ui/Alert';

interface SignupFormData {
  name?: string;
  email?: string;
  password?: string;
  passwordConfirm?: string;
}

interface State {
  formData?: SignupFormData;
  errors?: { [key: string]: string | string[] };
  signupResult?: SignupResult;
  showAlert?: boolean;
  isLoading?: boolean;
}

type Action =
  | { type: 'SET_FIELD'; field: keyof SignupFormData; value: string }
  | { type: 'SET_ERRORS'; errors: { [key: string]: string[] } }
  | { type: 'SET_SIGNUP_RESULT'; result: SignupResult }
  | { type: 'SET_LOADING'; isLoading: boolean }
  | { type: 'SET_SHOW_ALERT'; showAlert: boolean }
  | { type: 'RESET' };

const initialState = {
  formData: {
    name: '',
    email: '',
    password: '',
    passwordConfirm: ''
  },
  errors: {},
  signupResult: { success: false, message: undefined, errors: undefined },
  showAlert: false,
  isLoading: false,
};

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        formData: { ...state.formData, [action.field]: action.value }
      };
    case 'SET_ERRORS':
      return { ...state, errors: action.errors };
    case 'SET_SIGNUP_RESULT':
      return { ...state, signupResult: action.result };
    case 'SET_LOADING':
      return { ...state, isLoading: action.isLoading };
    case 'SET_SHOW_ALERT':
      return { ...state, showAlert: action.showAlert };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const SignUpForm = () => {
  const { status } = useSession();
  const [state, dispatch] = useReducer<Reducer<State, Action>>(reducer, initialState);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_FIELD', field: e.target.name as keyof SignupFormData, value: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    dispatch({ type: 'SET_LOADING', isLoading: true });
    dispatch({ type: 'SET_ERRORS', errors: {} });
    dispatch({ type: 'SET_SIGNUP_RESULT', result: { success: false, message: undefined, errors: undefined } });
    dispatch({ type: 'SET_SHOW_ALERT', showAlert: false });

    // Client-side validation
    const validation = SignupFormSchema.safeParse(state.formData);

    if (!validation.success) {
      dispatch({
        type: 'SET_ERRORS', errors: Object.fromEntries(
          Object.entries(validation.error.flatten().fieldErrors).map(
            // ([key, value]) => [key, value.join(', ')] // Join array into a string
            ([key, value]) => [key, value]
          )
        )
      });
      dispatch({ type: 'SET_LOADING', isLoading: false });
      return;
    }

    try {
      const result = await signup(new FormData(e.currentTarget as HTMLFormElement));
      dispatch({ type: 'SET_SIGNUP_RESULT', result });
      dispatch({ type: 'SET_SHOW_ALERT', showAlert: true });
      if (result.success) {
        setTimeout(() => {
          router.push('/auth/signin');
        }, 3000);
      }
    } catch (error) {
      console.error(error);
      dispatch({ type: 'SET_ERRORS', errors: { general: ['An unexpected error occurred. Please try again.'] } });
    } finally {
      dispatch({ type: 'SET_LOADING', isLoading: false });
    }
  }

  if (status === "loading") return null;

  return (
    <>
      <p className="flex justify-center mb-8 font-bold text-2xl dark:text-white">
        Registration Form
      </p>
      <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
        <label htmlFor="name"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Name
        </label>
        <FormInput id="name" name="name" type="text"
          value={state.formData?.name} onChange={handleChange}
          autoComplete={"on"} autoFocus={true}
          error={state.errors?.name}
          required
        />

        <label htmlFor="email"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Email
        </label>
        <FormInput id="email" name="email" type="email"
          value={state.formData?.email} onChange={handleChange}
          error={state.errors?.email} autoComplete={"on"}
          required
        />

        <label htmlFor="password"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Password
        </label>
        <FormInput id="password" name="password" type="password"
          value={state.formData?.password} onChange={handleChange}
          error={state.errors?.password}
          required
        />

        <label htmlFor="passwordConfirm"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Confirm Password
        </label>
        <FormInput id="passwordConfirm" name="passwordConfirm" type="password"
          value={state.formData?.passwordConfirm} onChange={handleChange}
          error={state.errors?.passwordConfirm}
          required
        />

        <div className="flex items-start mb-5">
          <div className="flex items-center h-5">
            <input id="terms" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" required />
          </div>
          <label htmlFor="terms" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">I agree with the <a href="#" className="text-blue-600 hover:underline dark:text-blue-500">terms and conditions</a></label>
        </div>

        <SubmitButton isLoading={state.isLoading || false} content="submit" />
      </form>

      {state.showAlert && state.signupResult && (
        <Alert
          level={(state.signupResult.success) ? "success" : "warning"}
          position="bottom-center"
          message={(state.signupResult.success) ? state.signupResult.message : state.signupResult.errors as string}
          onClose={() => {
            dispatch({ type: 'SET_SHOW_ALERT', showAlert: false })
          }}
        />
      )}
    </>
  );
}

export default SignUpForm;
