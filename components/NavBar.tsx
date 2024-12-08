"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "./ui/button";
import ProfilePopover from "./ProfilePopover";
import ThemeSwitcher from "./ThemeSwitcher";
import { useSession } from "next-auth/react";
import { LoaderIcon } from "lucide-react";
import Image from "next/image";
import { useTheme } from "@/contexts/ThemeProvider";

const NavBar = () => {
  const { status, data } = useSession();
  const user = data?.user;
  const pathname = usePathname();
  const { theme } = useTheme();

  // Hide the NavBar on login & logout pages
  if (pathname.startsWith("/login") || pathname.startsWith("/logout")) {
    return null;
  }

  const logoPath = `/logos/${theme === "light" ? "LogoLight" : "LogoDark"}.png`;

  return (
    <div className="flex h-24 w-full justify-between items-center px-4">
      <div className="flex items-center gap-4">
        <Link href={"/"}>
          <div className="flex items-center gap-2">
            <Image
              src={logoPath}
              alt="Cartomania logo"
              width={40}
              height={40}
            />
            <h1 className="text-3xl text-primary dark:text-white font-mea-culpa">
              Cartomania
            </h1>
          </div>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        {status !== "loading" ? (
          user ? (
            <ProfilePopover />
          ) : (
            <Button asChild>
              <Link href={"/login"}>Login</Link>
            </Button>
          )
        ) : (
          <Button variant="secondary">
            <LoaderIcon className="h-4 w-4 animate-spin" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default NavBar;