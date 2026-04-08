"use client";

import axiosInstance from "../plugins/axios";
import { useRouter } from "next/navigation";
import { IconEyeOff, IconEye, IconSpiral } from "@tabler/icons-react";
import { useState } from "react";
import DarkModeToggle from "../component/darkModeToggle";

export default function LoginPage() {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    identifier?: string;
    password?: string;
  }>({});

  function validate(identifier: string, password: string) {
    const newErrors: typeof errors = {};

    if (!identifier) {
      newErrors.identifier = "Email/Username wajib diisi";
    }

    if (!password) {
      newErrors.password = "Password wajib diisi";
    } else if (password.length < 6) {
      newErrors.password = "Minimal 6 karakter";
    }

    return newErrors;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const identifier = formData.get("identifier") as string;
    const password = formData.get("password") as string;

    const validationErrors = validate(identifier, password);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    login(identifier, password);
  }

  async function login(identifier: string, password: string) {
    setIsLoading(true);

    try {
      const res = await axiosInstance.post("/api/auth/login", {
        identifier,
        password,
      });

      if (res.status === 200) {
        router.push("/dashboard");
      }
    } catch (error) {
      if (error) {
        const message =
          error.response?.data?.message ||
          "Email/Username atau password salah";

        setErrors({
          identifier: message,
          password: message,
        });
      } else {
        console.error("Unknown error", error);
      }
    }
  }

  return (
    <>
      <DarkModeToggle />
      <div className="text-center h-screen flex items-center justify-center mx-8">
        <div className="w-2xl bg-gray-200 dark:bg-gray-800 p-8 rounded-lg shadow-lg border dark:border-gray-300/50 border-gray-700/50">
          <h1 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-2">Login</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Masuk untuk melanjutkan.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 mt-6 width-full"
          >
            <div className="text-left">
              <span className="text-gray-900 dark:text-stone-200">Email/Username</span>
              <input
                name="identifier"
                className={`w-full px-4 py-3 rounded-lg border text-gray-900 dark:text-stone-200 ${
                  errors.identifier ? "border-red-500 dark:border-red-700" : "dark:border-gray-300/50 border-gray-700/50"
                }`}
              />
              {errors.identifier && (
                <p className="text-red-500 dark:text-red-700 text-sm">
                  {errors.identifier}
                </p>
              )}
            </div>

            <div className="text-left">
              <span className="text-gray-900 dark:text-stone-200">Password</span>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  className={`w-full px-4 py-3 rounded-lg border text-gray-900 dark:text-stone-200 ${
                    errors.password ? "border-red-500 dark:border-red-700" : "dark:border-gray-300/50 border-gray-700/50"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-900 dark:text-stone-200"
                >
                  {passwordVisible ? <IconEye /> : <IconEyeOff />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 dark:text-red-700 text-sm">
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-700 text-white dark:text-black dark:bg-blue-400 py-2 px-4 rounded disabled:opacity-50"
            >
              {isLoading ? <span className="flex items-center justify-center gap-2"><IconSpiral className="animate-spin" />Loading...</span>: "Masuk"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}