import { Metadata } from "@/ui/MetadataCard";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const fetchMetadata = async () => {
  const response = await fetch(`${BASE_URL}`);
  const metadata: Metadata = await response.json();

  if (!response.ok) return undefined;

  return metadata;
}
