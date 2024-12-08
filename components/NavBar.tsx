"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "./ui/button";
import ProfilePopover from "./ProfilePopover";
import ThemeSwitcher from "./ThemeSwitcher";
import { useSession } from "next-auth/react";
import Image from "next/image";

const NavBar = () => {
  const user = useSession().data?.user;
  const pathname = usePathname();

  // Hide the NavBar on login page
  if (pathname.startsWith("/login") || pathname.startsWith("/logout")) {
    return null;
  }

  return (
    <div className="flex h-24 w-full justify-between items-center px-4">
      <div className="flex items-center gap-4">
        <Link href={"/"}>
          <h1 className="text-2xl">Cartomania</h1>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        {user ? (
          // <ProfilePopover />
          <div className="flex flex-col items-center">
            {user.image && (
              <Image
                src={user.image}
                alt="profile-pic"
                width={40}
                height={40}
                className="rounded-full"
              />
            )}
            {user.name}
          </div>
        ) : (
          <Button asChild>
            <Link href={"/login"}>Login</Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default NavBar;
