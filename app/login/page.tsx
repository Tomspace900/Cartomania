"use client";

import React from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

const Login = () => {
  const handleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return <Button onClick={handleSignIn}>Sign in with Google</Button>;
};

export default Login;
