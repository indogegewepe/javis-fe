"use client";

import { useEffect, useState } from "react";
import axiosInstance from "../plugins/axios";
import { useRouter } from "next/navigation";
import { IconSpiral } from "@tabler/icons-react";
import DarkModeToggle from "../component/darkModeToggle";

export default function Home() {
  const router = useRouter();
  const [res, setRes] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await axiosInstance.post("/api/auth/logout");
      console.log("Logout successful");
      router.push("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axiosInstance.get("/api/auth/me");
        console.log(res.data.user);
        setRes(res.data.user);
      } catch (err) {
        console.error("User not authenticated", err);
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, []); 


  return (
    <>
      <DarkModeToggle />
      <div className="text-center h-screen flex items-center justify-center mx-8">
        <div className="w-2xl bg-gray-200 dark:bg-gray-800 p-8 rounded-lg shadow-lg border dark:border-gray-300/50 border-gray-700/50">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Selamat Datang {res.username}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Ini adalah halaman utama dashboard Anda.
          </p>
          <button
            className="bg-blue-700 text-white dark:text-black dark:bg-blue-400 px-4 py-2 mt-4 rounded disabled:opacity-50"
            onClick={handleLogout}
            disabled={isLoading}
          >
            {isLoading ? <span className="flex items-center justify-center gap-2"><IconSpiral className="animate-spin" />Loading...</span>: "Logout"}
          </button>
        </div>
      </div>
    </>
  );
}