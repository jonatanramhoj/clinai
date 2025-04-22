"use client";
import Link from "next/link";
import Chat from "@/icons/Chat";
import ChatFilled from "@/icons/ChatFilled";
import Star from "@/icons/Star";
import StarFilled from "@/icons/StarFilled";
import SettingsIcon from "@/icons/Settings";
import ArrowRightToBracket from "@/icons/ArrowRightToBracket";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import useAuth from "@/hooks/useAuth";
import Modal from "./Dialog";
import Settings from "./Settings";

const Nav = () => {
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuTriggerRef = useRef<HTMLButtonElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const { signOutUser, user } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        menuTriggerRef &&
        !menuRef.current.contains(event.target as Node) &&
        !menuTriggerRef.current?.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleShowSettings = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="w-full py-4 px-4 md:px-8 justify-between items-center flex">
        <Link href="/" className="font-bold text-xl md:text-2xl leading-none">
          ClinAI <span className="text-gray-600">BETA</span>
        </Link>
        <nav className="flex items-center">
          <Link className="pr-4 flex font-bold" href="/">
            <span className="mr-1">Checkup</span>
            {pathname === "/" ? <ChatFilled /> : <Chat />}
          </Link>
          <Link className="pr-4 flex font-bold" href="/history">
            <span className="mr-1">History</span>
            {pathname === "/history" ? <StarFilled /> : <Star />}
          </Link>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center justify-center rounded-full w-[45px] h-[45px] bg-none hover:bg-gray-200 dark:hover:bg-white/20 ease-in-out duration-250 cursor-pointer"
              ref={menuTriggerRef}
            >
              {user?.photoURL && (
                <Image
                  src={user.photoURL}
                  alt=""
                  width={35}
                  height={35}
                  className="rounded-full"
                />
              )}
            </button>
            {showMenu && (
              <div
                className="bg-white dark:bg-[#2f2f2f] p-2 rounded-2xl min-w-[200px] absolute right-0 border border-gray-200 shadow-lg dark:border-0"
                ref={menuRef}
              >
                <ul className="flex flex-col">
                  <li>
                    <button
                      onClick={handleShowSettings}
                      className="flex cursor-pointer p-3 bg-none hover:bg-gray-100 dark:hover:bg-white/10 w-full rounded-lg ease-in-out duration-250"
                    >
                      <SettingsIcon />
                      <span className="text-md ml-2">Settings</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={signOutUser}
                      className="flex cursor-pointer p-3 bg-none hover:bg-gray-100 dark:hover:bg-white/10 w-full rounded-lg ease-in-out duration-250"
                    >
                      <ArrowRightToBracket />
                      <span className="text-md ml-2">Log out</span>
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </nav>
      </div>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} content={<Settings />} />
    </>
  );
};

export default Nav;
