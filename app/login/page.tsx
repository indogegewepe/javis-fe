"use client";

import axios from "axios";
import axiosInstance from "../plugins/axios";
import { useRouter } from "next/navigation";
import { IconEyeOff, IconEye, IconSpiral } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import DarkModeToggle from "../component/darkModeToggle";

type LoginErrorResponse = {
  message?: string;
  attemptsRemaining?: number;
  resetTime?: string | number;
};

const INITIAL_NOW_MS = Date.now();

function toResetTimestamp(resetTime: string | number): number | null {
  if (typeof resetTime === "number") {
    return Date.now() + Math.max(resetTime, 0) * 1000;
  }

  const numeric = Number(resetTime);
  if (!Number.isNaN(numeric)) {
    return Date.now() + Math.max(numeric, 0) * 1000;
  }

  const parsed = new Date(resetTime).getTime();
  return Number.isNaN(parsed) ? null : parsed;
}

function formatDuration(ms: number) {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes > 0) {
    return `${minutes} menit ${seconds} detik`;
  }

  return `${seconds} detik`;
}

export default function LoginPage() {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    identifier?: string;
    password?: string;
  }>({});
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null);
  const [resetAt, setResetAt] = useState<number | null>(null);
  const [nowMs, setNowMs] = useState(INITIAL_NOW_MS);

  useEffect(() => {
    if (!resetAt) return;

    const timer = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resetAt]);

  const retryInMs = resetAt ? Math.max(resetAt - nowMs, 0) : 0;
  const isRateLimited = attemptsRemaining === 0 && retryInMs > 0;

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

    if (isRateLimited) {
      setErrors({
        identifier: `Percobaan login habis. Coba kembali dalam ${formatDuration(
          retryInMs
        )}.`,
        password: `Percobaan login habis. Coba kembali dalam ${formatDuration(
          retryInMs
        )}.`,
      });
      return;
    }

    const formData = new FormData(e.currentTarget);
    const identifier = formData.get("identifier") as string;
    const password = formData.get("password") as string;

    const validationErrors = validate(identifier, password);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    void login(identifier, password);
  }

  async function login(identifier: string, password: string) {
    setIsLoading(true);

    try {
      await axiosInstance.post("/api/login", { identifier, password });

      setAttemptsRemaining(null);
      setResetAt(null);
      router.push("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as LoginErrorResponse | undefined;
        const message = data?.message || "Email/Username atau password salah";

        const backendAttempts = data?.attemptsRemaining;
        const backendResetTime = data?.resetTime;

        if (typeof backendAttempts === "number") {
          setAttemptsRemaining(Math.max(backendAttempts, 0));
        } else {
          setAttemptsRemaining((previous) => (previous !== null ? Math.max(previous - 1, 0) : null));
        }

        if (backendResetTime !== undefined && backendResetTime !== null) {
          const resetTimestamp = toResetTimestamp(backendResetTime);
          setResetAt(resetTimestamp);
          setNowMs(Date.now());
        } else {
          setResetAt(null);
        }

        setErrors({
          identifier: message,
          password: message,
        });
        setIsLoading(false);
      } else {
        console.error("Unknown error", error);
        setErrors({
          identifier: "Terjadi kesalahan jaringan",
          password: "Terjadi kesalahan jaringan",
        });
        setIsLoading(false);
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
                className={`w-full px-4 py-3 mt-2 rounded-lg border text-gray-900 dark:text-stone-200 ${
                  errors.identifier ? "border-red-700 dark:border-red-600" : "dark:border-gray-300/50 border-gray-700/50"
                }`}
              />
              {errors.identifier && (
                <p className="text-red-700 dark:text-red-600 text-sm">
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
                  className={`w-full px-4 mt-2 py-3 rounded-lg border text-gray-900 dark:text-stone-200 ${
                    errors.password ? "border-red-700 dark:border-red-600" : "dark:border-gray-300/50 border-gray-700/50"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute right-3 mt-1 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-300"
                >
                  {passwordVisible ? <IconEye /> : <IconEyeOff />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-700 dark:text-red-600 text-sm">
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || isRateLimited}
              className="bg-blue-700 text-white dark:text-black dark:bg-blue-400 py-2 px-4 mt-4 rounded disabled:opacity-50"
            >
              {isLoading ? <span className="flex items-center justify-center gap-2"><IconSpiral className="animate-spin" />Loading...</span>: "Masuk"}
            </button>

            {isRateLimited && (
              <p className="text-sm text-red-700 dark:text-red-600">
                Coba kembali dalam {formatDuration(retryInMs)}
              </p>
            )}

            {attemptsRemaining !== null && attemptsRemaining > 0 && (
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Sisa percobaan: {attemptsRemaining}
              </p>
            )}
          </form>
        </div>
      </div>
    </>
  );
}