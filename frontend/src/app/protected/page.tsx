"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Protected = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) console.log("session: ", session);
    if (status === "loading") return;
    
    if (!session?.user?.email) {
      signOut({ callbackUrl: "/auth/signin" })
    }
  }, [session, status, router]);

  if (status === "loading" || !session) {
    return <div className="dark:text-white">Loading...</div>;
  }

  return (
    <div className=" dark:text-white">
      <div className="flex justify-center">
        <h1>Protected Page</h1>
      </div>
      <div className="">
        <p>Welcome, {session?.user?.name || session?.user?.email}!</p>
      </div>
    </div>
  );
};

export default Protected;
