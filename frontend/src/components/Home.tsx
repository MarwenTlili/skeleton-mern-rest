'use client';

import { useSession } from "next-auth/react";

export default function Home() {
  const { status } = useSession();

  if (status === 'loading') {
    return null;
  }

  return (
    <div className="dark:text-white">
      <p className="text-2xl flex justify-center ">Home</p>
    </div>
  )
}
