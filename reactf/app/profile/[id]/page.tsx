"use client";
import React, { useState, useEffect } from "react";
import BigButton from "@/app/components/bigButton";
import HuntTile from "@/app/components/huntTile";
import Grid from "@/app/components/tileGrid";
import ProfileHeader from "@/app/components/profileHeader";
import api from "@/app/APIclient";

interface Hunt {
    id: number;
    pkm: String;
    nickname: String;
    user: number;
    game: number;
    method: number;
    start_date_string: String;
    start_date_display: String;
    end_date_string: String;
    end_date_display: String;
    hunt_time: number;
    hunt_time_display: String;
    count: number;
    increment: number;
    charm: boolean;
    sprite: String;
}

export default function Profile({params}: {params: {id: number}}) {
    const [hunts, setHunts] = useState<Hunt[]>([]);
    const [profileUser, setProfileUser] = useState('');
    let activeItems: React.ReactNode[] | undefined = [];
    let completedItems: React.ReactNode[] | undefined  = [];

    useEffect(() => {

        Promise.all([api.getUserById(params.id), api.getHuntsByUser(params.id)]).then( async (res) => {
            const user = await res[0];
            const hunts = await res[1];
            const data = {
                user: user,
                hunts: hunts
            }

            return data;
        }).then((data) => {
            setProfileUser(data.user);
            setHunts(data.hunts);
        }).catch((err) => {
            throw new Error("error setting metadata - " + err.message);
        });

    }, [params.id]);

    let sum = 0;

    if (hunts.length > 0) {
        for (let i = 0; i < hunts.length; i++)
        {
            // const hunt = hunts[i];
            // const sprite = "images/bleachg2.png";
            // const item = <HuntTile hunt={hunt} sprite={sprite}/>;
            // if (hunt.end_date_display !== null) {
            //     activeItems.push(item);
            // }
            // else {
            //     completedItems.push(item);
            // }
            sum+= 1;
        }
    }
    console.log(sum);
    let content;
    if (activeItems.length > 0 && completedItems.length > 0) {
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
    else if (activeItems.length == 0 && completedItems.length > 0) {
        content = (
            <div className="flex flex-col gap-2">
                <div>
                    <p>Active</p>
                    <span>Begin Hunting with the New Hunt Button ^</span>
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
    else if (activeItems.length > 0 && completedItems.length == 0) {
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
                    <span>Keep Working on Those Hunts!</span>
                </div>
            </div>
        );
    }
    else {
        content = (
            <div className="flex flex-col gap-2">
                <div>
                    <p>Active</p>
                    <span>Begin Hunting with the New Hunt Button ^</span>
                </div>
                <div>
                    <p>Complete</p>
                    <span>Begin Hunting with the New Hunt Button ^</span>
                </div>
            </div>
        );
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