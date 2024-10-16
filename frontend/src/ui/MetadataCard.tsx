'use client';

import { useSession } from "next-auth/react";

type Contact = {
  email: string;
}

export type Metadata = {
  application: string;
  version: string;
  documentation: string;
  contact: Contact;
}

export default function MetadataCard({ metaData }: { metaData: Metadata | null }) {
  const { status } = useSession();
  
  if (status === 'loading') {
    return null;
  }
  
  if (!metaData) {
    return <>Couldn`t fetch metadata</>
  }

  return (
    <div className="block p-2 sm:p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-700 dark:hover:bg-gray-700">
      <h5 className="mb-2 text-1xl sm:text-2xl font-bold tracking-tight text-indigo-400 dark:text-white">
        {metaData.application}
      </h5>

      <div className="flex space-x-2">
        <span className="sm:text-1xl xl:text-2xl text-gray-900 dark:text-white">version:</span>
        <p className="font-normal xl:text-2xl text-gray-600 dark:text-gray-400">
          {metaData.version}
        </p>
      </div>

      <div className="flex space-x-2 mb-2">
        <span className="sm:text-1xl xl:text-2xl text-gray-900 dark:text-white">documentation:</span>
        <p className="font-normal xl:text-2xl text-gray-600 dark:text-gray-400">
          {metaData.documentation}
        </p>
      </div>

      <span className="sm:text-1xl xl:text-2xl text-gray-900 dark:text-white"><strong>contact</strong></span>
      <div className="flex space-x-2">
        <span className="sm:text-1xl xl:text-2xl text-gray-900 dark:text-white">email:</span>
        <p className="font-normal xl:text-2xl text-gray-600 dark:text-gray-400">
          {metaData.contact ? metaData.contact.email : ""}
        </p>
      </div>
    </div>
  )
}
