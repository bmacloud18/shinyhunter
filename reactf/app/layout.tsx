import type { Metadata } from "next";
import Head from "next/head";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

interface User {
  id: number;
  avatar: String;
  username: String;
  first_name: String;
  last_name: String;
}

export const metadata: Metadata = {
  title: "ShinyHunter",
  description: "web application for shiny hunters",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <Head>
        <link
          rel="next"
          sizes="180x180"
          href="/next.svg"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <body className={inter.className}>
        {/* <header className="flex justify-center items-center top-0 w-full bg-grey shadow-md">
          <h1 className="flex-auto p-6 basis-4/6 text-4xl font-bold text-black">
            ShinyHunter
          </h1>
          <img
            className="max-h-16 max-w-24 px-4"
            src="/next.svg"
            alt="User PFP"
          />
        </header> */}
        {children}
      </body>
    </html>
  );
}
