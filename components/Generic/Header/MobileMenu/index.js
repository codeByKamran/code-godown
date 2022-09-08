import { useRouter } from "next/router";
import { Fragment } from "react";
import { XIcon } from "@heroicons/react/outline";
import { Popover, Transition } from "@headlessui/react";

import useAuth from "../../../../hooks/auth/useAuth";
import useLogout from "../../../../hooks/auth/useLogout";

import Link from "../../Link";
import Button from "../../Button";
import { headerDropdownMenu } from "../../../../config/headerDropdownMenu";
import UserMenuItem from "../UserMenuItem";

const MobileMenu = () => {
  const router = useRouter();
  const currentUser = useAuth();
  const logout = useLogout();

  const handleLogout = () => {
    logout();
  };

  return (
    <Transition
      as={Fragment}
      enter="duration-200 ease-out"
      enterFrom="opacity-0 scale-95"
      enterTo="opacity-100 scale-100"
      leave="duration-100 ease-in"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-95"
    >
      <Popover.Panel
        focus
        className="absolute z-50 top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden"
      >
        <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-backgroundContrast dark:bg-backgroundContrastDark divide-y-2 divide-dividerColor dark:divide-dividerColorDark">
          <div className="pt-2 pb-6 px-5">
            <div className="flex items-center justify-between">
              <div>
                <img
                  className="h-8 w-auto"
                  src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                  alt="Workflow"
                />
              </div>
              <div className="-mr-2">
                <Popover.Button className="bg-backgroundV1 dark:bg-backgroundV1Dark rounded-md p-2 inline-flex items-center justify-center text-secondaryText hover:text-primaryText dark:text-secondaryTextDark hover:dark:text-primaryTextDark hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary">
                  <span className="sr-only">Close menu</span>
                  <XIcon className="h-6 w-6" aria-hidden="true" />
                </Popover.Button>
              </div>
            </div>
            <div className="mt-6">
              <nav className="flex flex-col space-y-1">
                {headerDropdownMenu.map((item) => (
                  <UserMenuItem key={item.key} item={item} id={item.key} />
                ))}
              </nav>
            </div>
          </div>
          <div className="py-6 px-5 space-y-6">
            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
              <Link bold href="#">
                Documentaion
              </Link>
              <Link bold href="#">
                Guides
              </Link>
              <Link bold href="#">
                Future
              </Link>
              <Link bold href="#">
                Wanna Contribute?
              </Link>
              <Link bold href="#">
                Buy me a coffee 🍵
              </Link>
            </div>
            {!currentUser && (
              <div className="mt-2">
                <Button
                  onClick={() => {
                    router.push("/auth/register");
                  }}
                  className="w-full justify-center"
                >
                  Sign up
                </Button>
                <p className="mt-6 text-center text-base font-medium text-gray-500">
                  Existing customer?{" "}
                  <Link
                    underline
                    href="/auth/login"
                    query={
                      router.asPath !== "/" && {
                        redirect: router.pathname,
                      }
                    }
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            )}

            {currentUser && (
              <div className="mt-2">
                <Button
                  onClick={handleLogout}
                  className="w-full justify-center"
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </Popover.Panel>
    </Transition>
  );
};

export default MobileMenu;
