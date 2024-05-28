"use client";
import React, { useState, useEffect } from "react";
import BigButton from "@/app/components/bigButton";
import HuntTile from "@/app/components/huntTile";
import TileGrid from "@/app/components/tileGrid";
import Grid from "@/app/components/fullGrid";
import ProfileHeader from "@/app/components/profileHeader";
import api from "@/app/APIclient";

interface Hunt {
    id: number;
    pkm: String;
    nickname: String;
    user: number;
    game: String;
    method: number;
    start_date_string: String;
    start_date_display: String;
    end_date_string: String | null;
    end_date_display: String | null;
    hunt_time: number;
    hunt_time_display: String;
    count: number;
    increment: number;
    charm: String;
    sprite: String;
}

export default function Profile({params}: {params: {id: number}}) {
    const [activeItems, setActiveItems] = useState<React.ReactNode[]>([]);
    const [completedItems, setCompletedItems] = useState<React.ReactNode[]>([]);
    const [profileUser, setProfileUser] = useState('');
    const sample: Hunt = {
        id: 66,
        pkm: "pikcahu",
        nickname: "sample",
        user: 1,
        game: "Pokemon Black",
        method: 1,
        start_date_string: "2020-05-11T00:00:00.000Z",
        start_date_display: "Tue May 11, 2020",
        end_date_string: "2020-05-15T00:00:00.000Z",
        end_date_display: "Sat May 15, 2020",
        hunt_time: 5,
        hunt_time_display: "5s",
        count: 5000,
        increment: 5,
        charm: "no",
        sprite: "/images/bleachg2.png"
    }    
    const sample2: Hunt = {
        id: 66,
        pkm: "pikcahu",
        nickname: "sample",
        user: 1,
        game: "Pokemon Black",
        method: 1,
        start_date_string: "2020-05-11T00:00:00.000Z",
        start_date_display: "Tue May 11, 2020",
        end_date_string:  null,
        end_date_display: null,
        hunt_time: 5,
        hunt_time_display: "5s",
        count: 5000,
        increment: 5,
        charm: "no",
        sprite: "/images/bleachg2.png"
    }
    //fetch user and hunt data for profile display
    useEffect(() => {
        const hunts = [sample, sample2, sample, sample2, sample, sample2, sample];
        const activeHunts = hunts.filter((hunt: { end_date_display: String | null; }) => hunt.end_date_display !== null);
        const completedHunts = hunts.filter((hunt: { end_date_display: String | null; }) => hunt.end_date_display === null);
        const active = activeHunts.map((hunt: Hunt) => {
            return <HuntTile hunt={hunt}/>
        });
        const completed = completedHunts.map((hunt: Hunt) => {
            return <HuntTile hunt={hunt}/>
        });

        setActiveItems(completed);
        setCompletedItems(active);

        // Promise.all([api.getUserById(params.id), api.getHuntsByUser(params.id)]).then( (res) => {
        //     // const user = res[0];
        //     // setProfileUser(user);

        //     const hunts = [sample];



        //     const active = activeHunts.map((hunt: Hunt) => {
        //         return <HuntTile hunt={hunt}/>
        //     });
        //     const completed = completedHunts.map((hunt: Hunt) => {
        //         return <HuntTile hunt={hunt}/>
        //     });


        //     setActiveItems(completed);
        //     setCompletedItems(active);
        // });

    }, [params.id]);


    //set hunt displays based on what hunts users have 
    let content;
    if (activeItems.length > 0 && completedItems.length > 0) {
        content = (
            <Grid>
                <div>
                    <p>Active</p>
                    <TileGrid>
                        {activeItems}
                    </TileGrid>
                </div>
                <div>
                    <p>Complete</p>
                    <TileGrid>
                        {completedItems}
                    </TileGrid>
                </div>
            </Grid>
        );
    }
    else if (activeItems.length == 0 && completedItems.length > 0) {
        content = (
            <Grid>
                <div className="w-64 border-solid border-4 border-black">
                    <p>Active</p>
                    <span className="border-solid border-black border-2">Begin Hunting with the New Hunt Button ^</span>
                </div>
                <div className="w-64 border-solid border-4 border-black">
                    <p>Complete</p>
                    <TileGrid>
                        {completedItems}
                    </TileGrid>
                </div>
            </Grid>
        );
    }
    else if (activeItems.length > 0 && completedItems.length == 0) {
        content = (
            <Grid>
                <div className="w-32 border-solid border-4 border-black">
                    <p>Active</p>
                    <TileGrid>
                        {activeItems}
                    </TileGrid>
                </div>
                <div className="w-32 border-solid border-4 border-black">
                    <p>Complete</p>
                    <span className="border-solid border-black border-2">Keep Working on Those Hunts!</span>
                </div>
            </Grid>
        );
    }
    else {
        content = (
            <Grid>
                <div className="w-32 border-solid border-4 border-black">
                    <p>Active</p>
                    <span className="border-solid border-black border-2">Begin Hunting with the New Hunt Button ^</span>
                </div>
                <div className="w-32 border-solid border-4 border-black">
                    <p>Complete</p>
                    <span className="border-solid border-black border-2">Begin Hunting with the New Hunt Button ^</span>
                </div>
            </Grid>
        );
    }

    //change to loading screen later
    return profileUser != null ? (
        <main className="flex min-h-screen flex-col items-center p-24">
            
            <ProfileHeader user={profileUser}></ProfileHeader>

            <div className="mt-16 flex flex-row justify-between gap-16 font-mono">
                <BigButton text="New Hunt"></BigButton>
                <BigButton text="Import Hunt"></BigButton>
            </div>

            {content} 
            

        </main>
    ) : (
        <main className="flex min-h-screen flex-col items-center justify-around p-24">

            <div className="mt-16 flex flex-row justify-between gap-16 font-mono">
                <BigButton text="New Hunt"></BigButton>
                <BigButton text="Import Hunt"></BigButton>
            </div>

            {content} 

        </main>
    );
}