"use client";

import axiosInstance from "../plugins/axios";
import { useRouter } from "next/navigation";
import { IconEyeOff, IconEye } from "@tabler/icons-react";
import { useState } from "react";
import axios from "axios";

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
      if (axios.isAxiosError(error)) {
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
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="text-center h-screen flex items-center justify-center">
      <div className="w-2xl bg-gray-500/40 p-8 rounded-lg shadow-lg border border-gray-300/50">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Login</h1>
				<p className="text-gray-600 dark:text-gray-300">
					Masuk untuk melanjutkan.
				</p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 mt-6 width-full"
        >
          <div className="text-left">
            <span>Email/Username</span>
            <input
              name="identifier"
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.identifier ? "border-red-500" : "border-gray-300/50"
              }`}
              placeholder="Masukkan email atau username"
            />
            {errors.identifier && (
              <p className="text-red-500 text-sm">
                {errors.identifier}
              </p>
            )}
          </div>

          <div className="text-left">
            <span>Password</span>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.password ? "border-red-500" : "border-gray-300/50"
                }`}
                placeholder="Masukkan password"
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {passwordVisible ? <IconEye /> : <IconEyeOff />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white py-2 px-4 rounded disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}