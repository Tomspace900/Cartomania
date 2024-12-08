"use client";

import { signOut } from "next-auth/react";
import React from "react";

const SignOut = () => {
  signOut({ callbackUrl: "/" });

  return <div>Signing out...</div>;
};

export default SignOut;
