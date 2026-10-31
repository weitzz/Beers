"use client";

import { signOut } from "next-auth/react";

import Button from "@/components/forms/button";

export default function ProfileSignOutButton() {
  return (
    <Button variant="secondary" onClick={() => signOut({ callbackUrl: "/" })}>
      Sair da conta
    </Button>
  );
}
