import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";

import { Avatar, Divider } from "@mui/material";
import { RiLogoutCircleLine } from "react-icons/ri";

import Text from "@theme/Text";
import Transition from "@utils/Transition";
import useAuth from "@hooks/auth/useAuth";
import useLogout from "@hooks/auth/useLogout";
import { headerDropdownMenu } from "@config/headerDropdownMenu";

import UserMenuItem from "./UserMenuItem";

function UserMenu() {
  const logout = useLogout();
  const currentUser = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const router = useRouter();
  const trigger = useRef(null);
  const dropdown = useRef(null);

  const handleLogout = async () => {
    logout();
  };

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <div className="relative inline-flex z-10">
      <button
        ref={trigger}
        className="inline-flex justify-center items-center group"
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <div className="flex items-center space-x-2 truncate">
          <Avatar
            sx={{
              width: 30,
              height: 30,
            }}
          />
          <Text className="hidden md:block">
            {currentUser?.fullName || currentUser?.displayName || "User"}
          </Text>
          <svg
            className="hidden md:block w-3 h-3 shrink-0 ml-1 fill-current text-slate-400"
            viewBox="0 0 12 12"
          >
            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
          </svg>
        </div>
      </button>

      <Transition
        className="origin-top-right z-10 absolute top-full right-2 min-w-44 bg-backgroundContrast dark:bg-backgroundContrastDark border border-slate-200 dark:border-slate-600 rounded shadow-lg overflow-hidden mt-0.5"
        show={dropdownOpen}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div
          ref={dropdown}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
          className="flex flex-col w-[250px] max-w-[95vw]"
        >
          <div className="flex flex-col p-3">
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => {
                router.push(`/u/@${currentUser?.username}`);
              }}
            >
              <Avatar
                sx={{
                  width: 30,
                  height: 30,
                }}
              />
              <div className="flex flex-col justify-start">
                <Text>
                  {currentUser?.fullName || currentUser?.displayName || "User"}
                </Text>
                <Text type="info">
                  @
                  {currentUser?.username || currentUser?.userName || "username"}
                </Text>
              </div>
            </div>
          </div>
          <div className="main-menu">
            {headerDropdownMenu?.map((item) => (
              <UserMenuItem
                key={item.key}
                item={item}
                id={item.key}
                startBorder
              />
            ))}
            <Divider className="my-1" />
            <UserMenuItem
              item={{
                name: "Logout",
                href: null,
                icon: RiLogoutCircleLine,
              }}
              onClick={handleLogout}
            />
          </div>
        </div>
      </Transition>
    </div>
  );
}

export default UserMenu;
