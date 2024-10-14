import { JWT } from "next-auth/jwt";
import axios, { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";

import { Payload } from "@/types/next-auth";
import { NEXT_PUBLIC_API_URL } from "@/config/env";

let isRefreshing = false;

export const refreshTokens = async (token: JWT) => {
  if (isRefreshing) {
    return { ...token, error: "AlreadyRefreshing" };
  }

  isRefreshing = true;

  try {
    const res = await axios.post<{ accessToken: string, refreshToken: string }>(`${NEXT_PUBLIC_API_URL}/auth/refresh-tokens`, {
      refreshToken: token.refreshToken,
    }, {
      headers: { 'Content-Type': 'application/json' },
    });

    const { accessToken, refreshToken } = res.data;
    // Decode the new access token to get user info
    const decodedAccessToken = jwtDecode<Payload>(accessToken);

    return {
      ...token,
      accessToken: accessToken,
      refreshToken: refreshToken,
      accessTokenExpires: decodedAccessToken.exp ? decodedAccessToken.exp * 1000 : undefined,
      accessTokenExpires_date: decodedAccessToken.exp ? new Date(decodedAccessToken.exp * 1000).toLocaleString() : undefined,
    };

  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("[ERROR] refreshing tokens: ", error.response?.data);
    }
    return { ...token, error: "RefreshFailed" };
  } finally {
    isRefreshing = false;
  }
};
