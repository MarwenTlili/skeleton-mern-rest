import { Metadata } from "@/ui/MetadataCard";
import apiClient from "./apiClient";
import { logger } from "../logger";
import axios from "axios";

export const fetchMetadata = async () => {
  try {
    const response = await apiClient.get<Metadata>(``);

    if (response.status === 200 && response.data) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logger("users.ts - async fetchMetadata - Axios Error: ", { error_response_data: error.response?.data });
    } else {
      logger("users.ts - fetchMetadata - unknown Error: ", { error });
    }
    return null;
  }
}
