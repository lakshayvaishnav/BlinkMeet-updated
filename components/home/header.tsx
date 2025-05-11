import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import Logo from "../logo/Logo";
import TabAnimation from "./tabanimation";
import { getSession } from "@/lib/getSession";

const Header = async () => {
  const session = await getSession();
  const user = session?.user;

  return (
    <header className="w-full p-4 mx-auto">
      <div className="flex justify-between py-2 items-center uppercase text-sm">
        <div className="flex items-center gap-1">
          <Logo />
          <div className="px-2 mb-4 py-1 rounded-full bg-stone-100 border text-xs font-bold">
            Devnet
          </div>
          <TabAnimation />
        </div>

        {!user ? (
          <div className="flex items-center gap-4">
            <Link href="/auth/signin">Login</Link>
            <Link href="/auth/signin">
              <Button className="rounded-full uppercase font-medium text-sm">
                Sign up
              </Button>
            </Link>
          </div>
        ) : (
          <Link href="/dashboard">
            <Button className="rounded-full uppercase font-medium text-sm">
              Get Started
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
