'use client';
import Head from "next/head";
import { Inter } from "next/font/google";
import api from "../APIclient";
import { useState, useEffect } from "react";
import User from "@/app/interfaces/user";
import sample from "@/app/samples/user";
import Register from "@/app/util/serviceWorker";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

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
        document.location = '/shinyhunter/signin';
    }).catch((err: { message: string; }) => {
        console.log('Logout Failed - ' + err.message);
    })
    } catch (error: any) {
        throw new Error(error.message);
    }
}


let href = "/";

if (user !== undefined) {
  href = "/shinyhunter/profile/" + user.id;
}

function handleProfile() {
  document.location = `${href}`
}

  useEffect(() => {
    Register();
    if (user === undefined && document.location.pathname !== '/shinyhunter/signin' && document.location.pathname !== '/shinyhunter/signup') {
      try {
        Promise.all([api.getCurrentUser()]).then((res) => {
          const u = res[0];
          setUser(u);
        });
      }
      catch(error: any) {
        setUser(sample);
      }
      
    }
  }, [user]);



  // 
  return user !== undefined ?  (
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
        <body>
          <header className="flex justify-between items-center top-0 h-fit w-full shadow-md">
            <h1 className="flex flex-start basis-4/6 text-4xl sm:text-xl font-bold text-black">
              ShinyHunter
            </h1>
            <div className="p-2 items-center">
              <div className="flex flex-row">
                <div className="flex flex-col gap-2">
                  <span>{user.first_name}</span>
                  <span>{user.last_name}</span>
                  <form onSubmit={handleLogout}>
                    <button className="border-solid border-2 border-green mt-3 rounded-2xl p-2 bg-red hover:bg-buttonwhite">Logout</button>
                  </form>
                </div>
                <button className="newPage p-1" id="pfp" onClick={handleProfile}>
                    <Image 
                        className="h-24 w-24"
                        src={user.avatar}
                        height="96"
                        width="96"
                        alt="User PFP"/>
                </button>
              </div>
            </div>
          </header>
          {children}
        </body>
      </html>
  ) 
  : (
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
      <body>
        <header className="flex justify-center items-center top-0 w-full bg-grey shadow-md">
          <h1 className="flex flex-auto basis-4/6 text-xl md:text-4xl basis-4/6 text-4xl font-bold text-black">
            ShinyHunter
          </h1>
          <Image
            className="w-24 h-24"
            src="/next.svg"
            alt="User PFP"
            width="96"
            height="96"
          />
        </header>
        {children}
      </body>
    </html>
  );
}
