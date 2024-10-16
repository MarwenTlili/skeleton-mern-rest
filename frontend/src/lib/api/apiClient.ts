import { NEXT_PUBLIC_API_URL } from "@/config/env";
import axios from "axios";

const apiClient = axios.create({
  baseURL: `${NEXT_PUBLIC_API_URL}`,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  },
  // 'Authorization': `Bearer ${yourToken}`,
});

export default apiClient;
