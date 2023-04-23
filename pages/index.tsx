import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import {
  AcademicCapIcon,
  BanknotesIcon,
  CheckBadgeIcon,
  ClockIcon,
  ReceiptRefundIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useState } from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const inter = Inter({ subsets: ["latin"] });
interface Action {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconForeground: string;
  iconBackground: string;
}

const actions: Action[] = [
  {
    title: "Speed Math [MCQ]",
    description: "We have styled this in the format of 80 MCQs in 8 minutes.",
    href: "math/speedmcq/80in8",
    icon: ClockIcon,
    iconForeground: "text-teal-700",
    iconBackground: "bg-teal-50",
  },
  {
    title: "2 min speed integers",
    description: "Quick maffs",
    href: "math/speedmcq/20in2integer",
    icon: ClockIcon,
    iconForeground: "text-teal-700",
    iconBackground: "bg-teal-50",
  },
];

let showThemeToggle;

if (typeof window !== "undefined") {
  showThemeToggle = true;
}

export default function Home() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("theme") === "light") {
        setTheme("light");
      } else {
        setTheme("dark");
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log(theme, theme === "dark");
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        console.log("bruh");
        document.documentElement.classList.remove("dark");
      }
    }
  }, [theme]);

  return (
    <>
      <Head>
        <title>QuantWorld</title>
        <meta
          name="description"
          content="Made this site to get a brain workout."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="h-screen divide-y divide-gray-200 overflow-hidden bg-gray-200 dark:bg-slate-900 dark:text-slate-50 shadow sm:grid sm:grid-cols-2 sm:gap-px sm:divide-y-0">
          <button
            onClick={() => {
              if (theme === "dark") {
                localStorage.setItem("theme", "light");
                setTheme("light");
              } else {
                localStorage.setItem("theme", "dark");
                setTheme("dark");
              }
            }}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white dark:bg-slate-500 dark:text-slate-50 dark:hover:bg-slate-50 dark:hover:text-slate-500 font-bold py-2 px-4 rounded"
          >
            {theme === "light" ? "☀️" : "🌙"}
          </button>

          {actions.map((action, actionIdx) => (
            <div
              key={action.title}
              className={classNames(
                actionIdx === 0
                  ? "rounded-tl-lg rounded-tr-lg sm:rounded-tr-none"
                  : "",
                actionIdx === 1 ? "sm:rounded-tr-lg" : "",
                actionIdx === actions.length - 2 ? "sm:rounded-bl-lg" : "",
                actionIdx === actions.length - 1
                  ? "rounded-bl-lg rounded-br-lg sm:rounded-bl-none"
                  : "",
                "group relative bg-white dark:bg-slate-950 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500"
              )}
            >
              <div>
                <span
                  className={classNames(
                    "inline-flex rounded-lg p-3 ring-4 ring-white"
                  )}
                >
                  <action.icon className="h-6 w-6" aria-hidden="true" />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-base font-semibold leading-6">
                  <Link href={action.href} className="focus:outline-none">
                    {/* Extend touch target to entire panel */}
                    <span className="absolute inset-0" aria-hidden="true" />
                    {action.title}
                  </Link>
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {action.description}
                </p>
              </div>
              <span
                className="pointer-events-none absolute right-6 top-6 text-gray-300 group-hover:text-gray-400"
                aria-hidden="true"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                </svg>
              </span>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
