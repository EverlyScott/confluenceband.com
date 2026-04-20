"use client";

import db from "@/db";
import { useClerk } from "@clerk/nextjs";
import { useCallback, useEffect } from "react";
import type { IPBAuth } from "../api/pb-auth/route";

const PbAuth: React.FC = () => {
  const clerk = useClerk();

  const handleSignIn = useCallback(async () => {
    const token = await clerk.session?.getToken();

    if (!token)
      throw new Error("User signed in to clerk but could not fetch token!");

    try {
      const res = (await fetch("/api/pb-auth", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {
        if (res.status === 200) return res.json();
        throw new Error(`${res.status} (${res.statusText})`);
      })) as IPBAuth;

      db.authStore.save(res.token, res.user);
    } catch (err) {
      throw new Error(`Failed to login to PB: ${(err as Error).toString()}`);
    }
  }, [clerk.session]);

  useEffect(() => {
    if (!clerk.isSignedIn) return db.authStore.clear();

    if (db.authStore.isValid) return;

    handleSignIn();
  }, [clerk.isSignedIn, handleSignIn]);

  return <></>;
};

export default PbAuth;
