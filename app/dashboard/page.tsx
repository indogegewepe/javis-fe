"use client";

import { useEffect, useState } from "react";
import axiosInstance from "../plugins/axios";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [res, setRes] = useState({});

  const handleLogout = async () => {
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
      }
    };

    getUser();
  }, []); 


  return (
    <div className="text-center h-screen flex items-center justify-center">
      <div className="bg-gray-500/40 p-8 rounded-lg shadow-lg border border-gray-300/50">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Selamat Datang {res.username}!
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Ini adalah halaman utama dashboard Anda.
        </p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}