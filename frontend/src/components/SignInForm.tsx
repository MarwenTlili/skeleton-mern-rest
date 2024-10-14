'use client';

import React, { FormEvent, useState } from "react";
import { useRouter } from 'next/navigation';
import { signIn, useSession } from "next-auth/react";
import Alert, { AlertLevel } from "../ui/Alert";
import { BASE_URL } from "@/config/env";
import FormInput from "@/ui/FormInput";
import { SigninFormSchema } from "@/lib/definitions";

type AlertType = { level: AlertLevel, message: string, show: boolean }

const SignInForm = () => {
  const { status } = useSession();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string | string[] }>({});
  const [alert, setAlert] = useState<AlertType>({ level: "info", message: "...", show: false })
  const router = useRouter();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setAlert({ ...alert, level: "warning", message: "...", show: false });
    setErrors({});

    const validation = SigninFormSchema.safeParse({ identifier, password });

    if (!validation.success) {
      setErrors(Object.fromEntries(
        Object.entries(validation.error.flatten().fieldErrors).map(
          ([key, value]) => [key, value]
        )
      ));
      return;
    }

    try {
      const res = await signIn("credentials", {
        redirect: false,
        identifier,
        password,
      });

      if (res?.ok) {
        router.push("/protected");
      } else {
        setAlert({ ...alert, level: "warning", message: "Failed to sign in!", show: true });
      }
    } catch (error) {
      console.error(error);
      setAlert({ ...alert, level: "error", message: "Failed to sign in!", show: true });
    }
  }

  if (status === "loading") return null;

  return (
    <>
      <p className="flex justify-center mb-8 font-bold text-2xl dark:text-white">
        Sign In Form
      </p>
      <form onSubmit={onSubmit} className="max-w-sm mx-auto">
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Username or Email
          </label>
          <FormInput id="identifier" name="identifier" type="text"
            value={identifier} onChange={(e) => setIdentifier(e.target.value)}
            error={errors?.identifier}
            autoFocus required
          />
        </div>
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
          <FormInput id="password" name="password" type="password"
            value={password} onChange={(e) => setPassword(e.target.value)}
            error={errors?.password}
            required
          />
        </div>
        {/* submit button */}
        <button className="text-white bg-blue-700 hover:bg-blue-800 
          focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg 
          text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          type="submit"
        >
          Sign In
        </button>

        <div className="inline-flex items-center justify-center w-full">
          <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
          <span className="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-800">
            or
          </span>
        </div>
      </form>

      <div className="flex justify-center">
        <button className="flex items-center 
          text-black bg-white border hover:border hover:border-black 
            focus:ring-4 focus:outline-none font-medium rounded-lg 
            text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          onClick={async () => {
            const signinResponse = await signIn("google", { callbackUrl: `${BASE_URL}/protected` });
            console.log("signinResponse: ", signinResponse);
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mr-4"
            viewBox="0 0 326667 333333" shapeRendering="geometricPrecision"
            textRendering="geometricPrecision" imageRendering="optimizeQuality"
            fillRule="evenodd" clipRule="evenodd"
          >
            <path d="M326667 170370c0-13704-1112-23704-3518-34074H166667v61851h91851c-1851 15371-11851 38519-34074 54074l-311 2071 49476 38329 3428 342c31481-29074 49630-71852 49630-122593m0 0z" fill="#4285f4" />
            <path d="M166667 333333c44999 0 82776-14815 110370-40370l-52593-40742c-14074 9815-32963 16667-57777 16667-44074 0-81481-29073-94816-69258l-1954 166-51447 39815-673 1870c27407 54444 83704 91852 148890 91852z" fill="#34a853" />
            <path d="M71851 199630c-3518-10370-5555-21482-5555-32963 0-11482 2036-22593 5370-32963l-93-2209-52091-40455-1704 811C6482 114444 1 139814 1 166666s6482 52221 17777 74814l54074-41851m0 0z" fill="#fbbc04" />
            <path d="M166667 64444c31296 0 52406 13519 64444 24816l47037-45926C249260 16482 211666 1 166667 1 101481 1 45185 37408 17777 91852l53889 41853c13520-40185 50927-69260 95001-69260m0 0z" fill="#ea4335" />
          </svg>
          <span>Sign in with Google</span>
        </button>
      </div>

      {alert.show && (
        <Alert
          level={alert.level}
          position="bottom-center"
          message={alert.message}
          onClose={() => {
            setAlert({ ...alert, level: "warning", message: "...", show: false })
          }}
        />
      )}
    </>
  )
}

export default SignInForm;
