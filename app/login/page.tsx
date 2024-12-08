"use client";

import React from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const Login = () => {
  const handleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <Button onClick={handleSignIn} className="flex items-center gap-2">
      <Image src="/GoogleLogo.svg" alt="Google logo" width={20} height={20} />
      Sign in with Google
    </Button>
  );
};

export default Login;
