"use client";
import React, { useState, useEffect } from "react";
import BigButton from "@/app/components/bigButton";
import HuntTile from "@/app/components/huntTile";
import TileGrid from "@/app/components/tileGrid";
import Grid from "@/app/components/fullGrid";
import ProfileHeader from "@/app/components/profileHeader";
import api from "@/app/APIclient";
import User from "@/app/interfaces/user";
import Hunt from "@/app/interfaces/hunt";
import sample from "@/app/samples/completedHunt"
import sample2 from "@/app/samples/activeHunt";
import sampleuser from "@/app/samples/user";

export default function Profile({params}: {params: {id: number}}) {
    const [activeItems, setActiveItems] = useState<React.ReactNode[]>([]);
    const [completedItems, setCompletedItems] = useState<React.ReactNode[]>([]);
    const [profileUser, setProfileUser] = useState<User>();
    const [user, setUser] = useState<User>();
    //fetch user and hunt data for profile display
    useEffect(() => {
        // const hunts = [sample, sample2, sample, sample2, sample, sample, sample, sample]
        // const activeHunts = hunts.filter((hunt: { end_date_display: String | null; }) => hunt.end_date_display !== null);
        // const completedHunts = hunts.filter((hunt: { end_date_display: String | null; }) => hunt.end_date_display === null);
        // const active = activeHunts.map((hunt: Hunt) => {
        //     return <HuntTile hunt={hunt}/>
        // });
        // const completed = completedHunts.map((hunt: Hunt) => {
        //     return <HuntTile hunt={hunt}/>
        // });

        // setActiveItems(completed);
        // setCompletedItems(active);

        // setProfileUser(sampleuser);
        // setUser(sampleuser);
        if (user === undefined || activeItems === undefined || completedItems === undefined) {
            Promise.all([api.getCurrentUser(), api.getUserById(params.id), api.getHuntsByUser(params.id)]).then( (res) => {
                setUser(res[0]);
                setProfileUser(res[1]);
    
                const hunts = res[2];
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
            });
        }
    }, [params.id]);


    const handleNew = async (event: any) => {
        event.preventDefault();
        document.location = '../hunt/new';
    }

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
                <div className="w-4/5 border-solid border-4 border-black">
                    <p>Active</p>
                    <span className="border-solid border-black border-2">Begin Hunting with the New Hunt Button ^</span>
                </div>
                <div className="w-4/5 border-solid border-4 border-black">
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
                <div className="w-fit border-solid border-4 border-black">
                    <p>Active</p>
                    <TileGrid>
                        {activeItems}
                    </TileGrid>
                </div>
                <div className="w-fit border-solid border-4 border-black">
                    <p>Complete</p>
                    <span className="border-solid border-black border-2">Keep Working on Those Hunts!</span>
                </div>
            </Grid>
        );
    }
    else {
        content = (
            <Grid>
                <div className="w-fit border-solid border-4 border-black">
                    <p>Active</p>
                    <span className="border-solid border-black border-2">Begin Hunting with the New Hunt Button ^</span>
                </div>
                <div className="w-fit border-solid border-4 border-black">
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

            <div className="mt-16 flex flex-row justify-between gap-16">
                <BigButton onClick={handleNew} text="New Hunt"></BigButton>
            </div>

            {content} 
            

        </main>
    ) : (
        <main className="flex min-h-screen flex-col items-center justify-around p-24">

            <div className="mt-16 flex flex-row justify-between gap-16">
                <BigButton onClick={handleNew} text="New Hunt"></BigButton>
            </div>

            {content} 

        </main>
    );
}