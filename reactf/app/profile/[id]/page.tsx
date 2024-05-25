"use client";
import React, { useState, useEffect } from "react";
import BigButton from "@/app/components/bigButton";
import HuntTile from "@/app/components/huntTile";
import Grid from "@/app/components/tileGrid";
import ProfileHeader from "@/app/components/profileHeader";
import api from "@/app/APIclient";

export default function Profile({params}: {params: {id: number}}) {
    const [hunts, setHunts] = useState([]);
    let profileUser;
    console.log('profile', typeof window !== 'undefined');
    useEffect(() => {
        api.getUserById(params.id).then(res => {
            profileUser = res;
            api.getHuntsByUser(res.id).then(reshunts => {
                setHunts(reshunts);
            });
        }).catch((err) => {
            throw new Error('Error retrieving user' + err.message);
        });
    });

    // let url = `/api/users/${params.id}`;
    // fetch(url).then((user) => {
    //     profileUser = user;
    //     url = `/api/hunts/${params.id}`;
    //     fetch(url).then((res) => {
    //         return res.json();
    //     }).then((data) => {
    //         let n = data.length;
    //         if (n > 0) {
    //             setHunts(data);
    //         }
    //     }).catch((error) => {
    //         throw new Error('Error getting user' + error.message);
    //     });
    // })
    


    const activeItems = hunts.filter((hunt: any) => hunt.end_date_display === null).map((hunt: any) => {
        return <HuntTile hunt={hunt}/>;
    });
    const completedItems = hunts.filter((hunt: any) => hunt.end_date_display !== null).map((hunt: any) => {
        return <HuntTile hunt={hunt}/>;
    });

    let content;
    if (hunts != null && hunts.length != 0) {
        content = (
            <div className="flex flex-col gap-2">
                <div>
                    <p>Active</p>
                    <Grid>
                        {activeItems}
                    </Grid>
                </div>
                <div>
                <p>Complete</p>
                <Grid>
                    {completedItems}
                </Grid>
                </div>
            </div>
        );
    }
    else {
        content = (
            <div className="flex flex-col gap-2">
                <div>
                    <p>Active</p>
                    <Grid>
                        {activeItems}
                    </Grid>
                </div>
                <div>
                <p>Complete</p>
                <Grid>
                    {completedItems}
                </Grid>
                </div>
            </div>
        )
    }

    return profileUser != null ? (
        <main className="flex min-h-screen flex-col items-center justify-around p-24">
            <div className="border-solid border-2 border-black mt-8 w-full items-center justify-between font-mono text-sm lg:flex">
                <div className="fixed top-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
                    <a
                        className="pointer-events-none flex place-items-center gap-4 ml-2 p-8 lg:pointer-events-auto lg:p-0"
                        href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <ProfileHeader user={profileUser}></ProfileHeader>
                    </a>
                </div>
                <BigButton text="Edit Profile"></BigButton>
            </div>

            <div className="flex flex-row justify-between gap-16 font-mono">
                <BigButton text="New Hunt"></BigButton>
                <BigButton text="Import Hunt"></BigButton>
            </div>

            <div>
                {content} 
            </div>
        </main>
    ) : (
        <main className="flex min-h-screen flex-col items-center justify-around p-24">
            <div className="border-solid border-2 border-black mt-8 w-full items-center justify-between font-mono text-sm lg:flex">
                <div className="fixed top-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
                    <a
                        className="pointer-events-none flex place-items-center gap-4 ml-2 p-8 lg:pointer-events-auto lg:p-0"
                        href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {/* <ProfileHeader user={profileUser}></ProfileHeader> */}
                    </a>
                </div>
                <BigButton text="Edit Profile"></BigButton>
            </div>

            <div className="flex flex-row justify-between gap-16 font-mono">
                <BigButton text="New Hunt"></BigButton>
                <BigButton text="Import Hunt"></BigButton>
            </div>

            <div>
                {content} 
            </div>
        </main>
    );
}