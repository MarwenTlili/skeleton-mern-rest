import { z } from 'zod'

export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(4, { message: 'Name must be at least 4 characters long.' })
    .trim(),
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(4, { message: 'Be at least 4 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character.',
    })
    .trim(),
  passwordConfirm: z
    .string()
}).refine((values) => {
  return values.password === values.passwordConfirm;
},
  {
    message: "Passwords must match!",
    path: ["passwordConfirm"],
  }
);

export const SigninFormSchema = z.object({
  identifier: z.string()
    .min(4, { message: 'Name must be at least 4 characters long.' }),
  password: z
    .string()
    .min(4, { message: 'Be at least 4 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character.',
    })
    .trim()
});

export type LoginFormInputs = z.infer<typeof SigninFormSchema>;
