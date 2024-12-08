import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { History, LogOut, Shield, User } from "lucide-react";
import Link from "next/link";
import { Badge } from "./ui/badge";

const ProfilePopover = () => {
  return (
    user && (
      <Popover>
        <Button asChild variant={"secondary"}>
          <PopoverTrigger>
            {user.firstname || user.username}
            <User className="ml-2 h-4 w-4" />
          </PopoverTrigger>
        </Button>
        <PopoverContent className="flex flex-col gap-4 mx-4 w-fit min-w-[220px]">
          <div className="flex flex-col gap-2 px-2">
            <div className="flex items-center gap-4">
              <span className="text-lg">{`@${user.username}`}</span>
              {isAdmin && (
                <Badge variant="accent" size="small">
                  Admin
                </Badge>
              )}
            </div>
            {user.firstname && (
              <span className="text-lg">{user.firstname}</span>
            )}
            {user.lastname && (
              <span className="text-lg">{user.lastname.toUpperCase()}</span>
            )}
            {scores && scores.length > 0 && (
              <div className="flex justify-between text-lg">
                <span>{`Games played:`}</span>
                <span>{scores.length}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            {isAdmin && (
              <Button
                asChild
                variant="accent"
                disabled={scores && scores.length > 0}
              >
                <Link href={"/admin/edit"}>
                  Admin
                  <Shield className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}

            <Button asChild disabled={scores && scores.length > 0}>
              {/** // TODO */}
              <Link href={"/history"}>
                History
                <History className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button asChild variant="destructive" onClick={() => logout()}>
              <Link href={"/"}>
                Logout
                <LogOut className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    )
  );
};

export default ProfilePopover;
