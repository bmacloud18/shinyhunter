"use client"
import { useState, useEffect } from "react";
import BigButton from "@/app/components/bigButton";
import ProfilePicture from "@/app/components/profilePicture";
import HuntTile from "@/app/components/huntTile";
import Grid from "@/app/components/tileGrid";
import ProfileHeader from "@/app/components/profileHeader";
import api from "@/app/APIclient";

export default async function Profile() {
    const [hunts, setHunts] = useState([]);
    let currentUser;

    useEffect(() => {
        api.getCurrentUser().then(user => {
            currentUser = user;
            api.getHuntsByUser(user.id).then(res => {
                // let huntPromises = res.map((hunt: { pkm: any; }) => {
                //     const name = hunt.pkm;
                //     return api.getPokemonByName(name.toLowerCase()).then(pkm => {
                //         return {hunt, pkm};
                //     }).catch(err => {
                //         console.log('API error');
                //         throw new Error("couldn't find pokemon - " + err.message);
                //     });
                // });

                // Promise.all(huntPromises).then(results => {
                //     results.forEach(({hunt, pkm}) => {
                //         const isactive = hunt.end_date_string == null;
                //         const data = {
                //             hunt: hunt,
                //             pkm: pkm,
                //             active: isactive
                //         }
                //         if (isactive) {
                //             a.push(data)
                //         }
                //         else {
                //             c.push(data);
                //         }
                //     });
                // })

                setHunts(res);
            });
        });
    });

    const activeItems = hunts.filter((hunt: any) => hunt.end_date_display === null).map((hunt: any) => {
        return <HuntTile hunt={hunt}/>;
    });
    const completedItems = hunts.filter((hunt: any) => hunt.end_date_display !== null).map((hunt: any) => {
        return <HuntTile hunt={hunt}/>;
    });

    let content = (
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

    return (
        <main className="flex min-h-screen flex-col items-center justify-around p-24">
            <div className="border-solid border-2 border-black mt-8 w-full items-center justify-between font-mono text-sm lg:flex">
                <div className="fixed top-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
                    <a
                        className="pointer-events-none flex place-items-center gap-4 ml-2 p-8 lg:pointer-events-auto lg:p-0"
                        href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <ProfileHeader user={currentUser}></ProfileHeader>
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
