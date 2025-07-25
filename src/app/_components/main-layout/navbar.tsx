"use client";
import { useAuthStore } from "@/stores/useAuthStore";
import Link from "next/link";
import { useState } from "react";

export const Navbar = () => {
  const { isAuthenticated, loading, user } = useAuthStore((state) => state);
  const [toggleMenu, setToggleMenu] = useState(false);
  return (
    <div className="sticky top-0 flex items-center justify-between p-4 bg-gray-800 text-white m-4 rounded-md">
      <div>
        <h1>ToDo App</h1>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {isAuthenticated ? (
            <div className="relative">
              {" "}
              <div
                onClick={() => {
                  setToggleMenu((prev) => !prev);
                }}
                className="cursor-pointer h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center"
              >
                {user?.firstname[0]} {user?.lastname[0]}
              </div>
              {toggleMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg">
                  <ul className="py-2">
                    <li className="px-4 py-2 hover:bg-gray-200">
                      <Link href="/profile">Profile</Link>
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => useAuthStore.getState().logout()}
                    >
                      Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-4 items-center">
              <Link href="/register">Sign Up</Link>
              <Link href="/login">Sign In</Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Navbar;
