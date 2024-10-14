import { fetchMetadata } from "@/lib/api";
import MetadataCard from "@/ui/MetadataCard";

const AboutPage = async () => {
  const metaData = await fetchMetadata();

  return (
    <div className="flex justify-center">
      <MetadataCard metaData={metaData} />
    </div>
  )
}

export default AboutPage;
