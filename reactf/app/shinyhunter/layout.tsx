'use client';
import Head from "next/head";
import { Inter } from "next/font/google";
import "../globals.css";
import api from "../APIclient";
import { useState, useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

interface User {
  id: number;
  avatar: String;
  username: String;
  first_name: String;
  last_name: String;
}

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  const [user, setUser] = useState<User>();

  const handleLogout = async (event: any) => {
    event.preventDefault();
    try {
      api.logout().then(() => {
        document.location = '/signin/';
    }).catch((err: { message: string; }) => {
        console.log('Logout Failed - ' + err.message);
    })
    } catch (error: any) {
        throw new Error(error.message);
    }
}

  useEffect(() => {
    Promise.all([api.getCurrentUser()]).then((res) => {
      const u = res[0];
      setUser(u);
    })
  });

  return user !== undefined ? (
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
          <header className="flex justify-center items-center top-0 w-full bg-grey shadow-md">
            <div>
              <h1 className="flex-auto p-6 basis-4/6 text-4xl font-bold text-black">
                ShinyHunter
              </h1>
            </div>
            <div>
              <div>
                <div className="flex flex-col gap-2">
                  <span>{user.first_name.toString()}</span>
                  <span>{user.last_name.toString()}</span>
                </div>
                <img
                  className="max-h-16 max-w-24 px-4"
                  src={user.avatar.toString()}
                  alt="User PFP"
                />
              </div>
              <form onSubmit={handleLogout}>
                <button className="border-solid border-2 border-green mr-2 rounded-2xl p-2 bg-red hover:bg-buttonwhite"></button>
              </form>
            </div>
          </header>
          {children}
        </body>
      </html>
  ) : (
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
        <header className="flex justify-center items-center top-0 w-full bg-grey shadow-md">
          <h1 className="flex-auto p-6 basis-4/6 text-4xl font-bold text-black">
            ShinyHunter
          </h1>
          <img
            className="max-h-16 max-w-24 px-4"
            src="/next.svg"
            alt="User PFP"
          />
        </header>
        {children}
      </body>
    </html>
  );
}
