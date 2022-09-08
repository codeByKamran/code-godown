import Image from "next/image";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import { Popover } from "@headlessui/react";

import { MenuIcon } from "@heroicons/react/outline";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi";

import Button from "@theme/Button";
import IconButton from "@theme/IconButton";
import useAuth from "@hooks/auth/useAuth";
import {
  callsToAction,
  moreFromMe,
  features,
  moreFromMeActions,
} from "@config/headerNavigationData";

import MobileMenu from "./MobileMenu";
import MenuDropdown from "./MenuDropdown";
import UserMenu from "./UserMenu";

const Header = () => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const currentUser = useAuth();

  const handleLoginRedirect = () => {
    router.push({
      pathname: "/auth/login",
      query: router.asPath !== "/" && {
        redirect: router.asPath,
      },
    });
  };

  const handleRegisterRedirect = () => {
    router.push({
      pathname: "/auth/register",
      query: router.asPath !== "/" && {
        redirect: router.asPath,
      },
    });
  };

  const switchTheme = () => {
    setTheme(theme === "light" || theme === "system" ? "dark" : "light");
  };

  // themeswtich only if its not dashboard(only dark) or snippet view page(only dark)
  const showThemeSwitch =
    !String(router.asPath).includes("/dashboard") &&
    !String(router.route).includes("/u/[userName]/s/[snippetID]");

  return (
    <Popover className={`relative bg-white dark:bg-backgroundV1Dark`}>
      <div className="max-w-9xl mx-auto px-4 sm:px-6 border-b border-dividerColor shadow-sm dark:shadow-md">
        <div className="flex justify-between items-center py-3 md:justify-start md:space-x-10 z-40">
          <div
            className="flex justify-start lg:w-0 lg:flex-1 cursor-pointer"
            onClick={() => {
              router.push("/");
            }}
          >
            <span className="sr-only">Workflow</span>
            <Image
              src="/code-logo.svg"
              width={40}
              height={40}
              alt="Header logo"
            />
          </div>

          <Popover.Group as="nav" className="hidden md:flex space-x-10">
            <Popover className="relative">
              {({ open }) => (
                <MenuDropdown
                  label="Features"
                  links={features}
                  footerActions={callsToAction}
                  open={open}
                />
              )}
            </Popover>

            <Popover className="relative">
              {({ open }) => (
                <MenuDropdown
                  label="More from me"
                  links={moreFromMe}
                  footerActions={moreFromMeActions}
                  open={open}
                />
              )}
            </Popover>
            <a
              href="#"
              className="text-base font-medium text-secondaryText dark:text-secondaryTextDark cursor-pointer"
            >
              Docs
            </a>
          </Popover.Group>

          <div className="flex md:flex-1 lg:w-0 justify-end space-x-4">
            {showThemeSwitch && (
              <div className="cursor-pointer">
                <IconButton onClick={switchTheme}>
                  {theme === "dark" ? (
                    <HiOutlineSun className={`h-6 w-6`} />
                  ) : (
                    <HiOutlineMoon className="h-6 w-6" />
                  )}
                </IconButton>
              </div>
            )}

            <div className="hidden md:flex items-center justify-end">
              {currentUser ? (
                <UserMenu />
              ) : (
                <div className="flex items-center space-x-3">
                  <Button type="text" onClick={handleLoginRedirect}>
                    Sign in
                  </Button>
                  <Button onClick={handleRegisterRedirect}>Sign up</Button>
                </div>
              )}
            </div>
            <div className="-mr-2 -my-2 md:hidden">
              <Popover.Button className="bg-white dark:bg-backgroundV2Dark rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary">
                <span className="sr-only">Open menu</span>
                <MenuIcon className="h-6 w-6" aria-hidden="true" />
              </Popover.Button>
            </div>
          </div>
        </div>
      </div>
      <MobileMenu />
    </Popover>
  );
};

export default Header;
