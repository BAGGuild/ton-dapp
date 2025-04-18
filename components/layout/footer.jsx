"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AiOutlineTrophy, AiOutlineUser } from "react-icons/ai";
import { PiCoinsThin } from "react-icons/pi";
import { IoHomeOutline } from "react-icons/io5";
import { CiGift } from "react-icons/ci";

const menuItems = [
  { name: "Home", path: "/", icon: <IoHomeOutline size={24} /> },
  { name: "Leaders", path: "/leaderboard", icon: <AiOutlineTrophy size={24} /> },
  // { name: "Earn", path: "/tasks", icon: <PiCoinsThin size={24} /> },
  // { name: "Spin", path: "/Spin", icon: <CiGift size={24} /> },
  { name: "Profile", path: "/profile", icon: <AiOutlineUser size={24} /> },
];

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    window?.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="relative">
      <footer className="fixed left-1/2 transform -translate-x-1/2 bottom-0 w-[90%] bg-content1 border border-default-100 text-white text-center px-3 mb-3 rounded-lg shadow-md">
        <nav className="flex justify-around">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <div key={item.name} onClick={() => router.push(item.path)} className="group flex flex-col items-center px-3 py-2 rounded-full transition-colors duration-200 cursor-pointer">
                <span className={isActive ? "text-blue-500" : ""}>{item.icon}</span>

                <span className={`text-sm ${isActive ? "text-blue-500 " : ""}`}>{item.name}</span>
              </div>
            );
          })}
        </nav>
      </footer>
    </div>
  );
}
