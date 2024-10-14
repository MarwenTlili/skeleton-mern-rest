import { JwtPayload } from "jwt-decode";

interface Payload extends JwtPayload {
  sub?: string;
  name?: string | null;
  email?: string | null;
  picture?: string | null;
  roles?: string[] | null;
  isActive?: boolean;
  provider?: string | null;
  accessToken?: string;
  refreshToken?: string;
  error?: string;
}

declare module "next-auth" {
  interface Session {
    user?: Payload;
    expires?: number;
    error?: string;
  }

  interface User extends Payload {
    accessToken?: string;
    refreshToken?: string;
    iat_date?: string;
    exp_date?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends Payload {
    accessTokenExpires?: number;
    error?: string;
  }
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}
