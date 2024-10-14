import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { Account, NextAuthOptions, User } from "next-auth";
import { jwtDecode } from "jwt-decode";
import { JWT } from "next-auth/jwt";
import axios from "axios";

import { TOKEN_EXPIRATION_TIME } from "@/config/constants";
import { LoginResponse } from "@/types/next-auth";
import { NEXT_PUBLIC_API_URL, NEXTAUTH_SECRET } from "@/config/env";
// import { logger } from "@/lib/logger";
import { refreshTokens } from "./refreshTokens";
import { handleAxiosError } from "@/lib/axiosErrorHandler";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Username or Email", type: "text", placeholder: "user@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await axios.post<LoginResponse>(`${NEXT_PUBLIC_API_URL}/auth/login`, {
            identifier: credentials?.identifier,
            password: credentials?.password,
          }, {
            headers: { 'Content-Type': 'application/json' },
          });
          const { accessToken, refreshToken } = res.data;

          const user = jwtDecode<User>(accessToken);

          user.provider = "credentials";
          user.iat_date = user.iat ? new Date(user.iat * 1000).toLocaleString() : undefined;
          user.exp_date = user.exp ? new Date(user.exp * 1000).toLocaleString() : undefined;

          return {
            ...user,
            accessToken: accessToken,
            refreshToken: refreshToken,
          };
        } catch (error) {
          if (axios.isAxiosError(error)) {
            // Axios specific error
            handleAxiosError(error);
          } else {
            // Other unknown error
            console.error('Unexpected Error', error);
          }
          throw new Error("Invalid credentials");
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60
  },
  jwt: {
    secret: NEXTAUTH_SECRET,
  },
  callbacks: {
    /**
     * 
     * @param token: JWT
     * @param user: User - first sign-in only
     * @param account: Account | null - first sign-in only
     * @returns JWT
     */
    async jwt({ token, user, account }: { token: JWT; user?: User, account: Account | null }) {
      // 1. Initial sign-in
      if (user) {
        token = {
          ...token,
          sub: user.id,
          name: user.name,
          email: user.email,
          roles: user.roles,
          isActive: user.isActive,
          provider: user.provider,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: user.exp ? user.exp * 1000 : undefined,
          accessTokenExpires_date: user.exp ? new Date(user.exp * 1000).toLocaleString() : undefined,
        };
        return token;
      }

      // 2. Handle tokens from Google sign-in
      if (account?.provider === "google" && account.access_token) {
        token.accessToken = account.access_token;
        token.accessTokenExpires = Date.now() + TOKEN_EXPIRATION_TIME * 1000;
        token.accessTokenExpires_date = new Date(Date.now() + TOKEN_EXPIRATION_TIME * 1000).toLocaleString();
      }

      // 3. Token is still valid (return it)
      if (token.accessTokenExpires && (Date.now() < token.accessTokenExpires)) {
        token.iat_date = new Date(token.iat as number * 1000).toLocaleString();
        token.exp_date = new Date(token.exp as number * 1000).toLocaleString();
        // logger("[INFO] route.ts - async jwt - (token not expired): ", { token });
        return token;
      }

      // 4. Token expired, attempt refresh (for 'credentials' provider)
      // logger("[INFO] route.ts - async jwt - (token expired).");
      if (token.provider === 'credentials') {
        const newToken = await refreshTokens(token);
        if (newToken?.accessToken && newToken?.refreshToken) {
          // logger("[INFO] route.ts - async jwt - (new generated tokens): ", { newToken });
          return newToken;
        }
        return { ...token, error: "RefreshFailed" };
      }

      // If no valid case is matched, return the token as-is
      return token
    },
    async session({ session, token }) {
      // logger("token: ", { token });
      session.user = {
        sub: token.sub,
        name: token.name,
        email: token.email,
        picture: token.picture,
        roles: token.roles,
        isActive: token.isActive,
      }
      // Pass errors to session, if any
      session.error = token.error;

      // The return type will match the one returned in `useSession()`
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};
