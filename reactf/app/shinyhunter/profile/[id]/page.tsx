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
    const [loading, setLoading] = useState(true);
    const [activeItems, setActiveItems] = useState<React.ReactNode[]>([]);
    const [completedItems, setCompletedItems] = useState<React.ReactNode[]>([]);
    const [profileUser, setProfileUser] = useState<User>();
    const [user, setUser] = useState<User>();

    
    //fetch user and hunt data for profile display
    useEffect(() => {
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
            setLoading(false);
        }).catch(e => {
            console.log('unable to connect to api');
            const hunts = [sample2, sample]
            const activeHunts = hunts.filter((hunt: { end_date_display: String | null; }) => hunt.end_date_display !== null);
            const completedHunts = hunts.filter((hunt: { end_date_display: String | null; }) => hunt.end_date_display === null);
            const active = activeHunts.map((hunt: Hunt) => {
                return <HuntTile hunt={hunt} key={hunt.id}/>
            });
            const completed = completedHunts.map((hunt: Hunt) => {
                return <HuntTile hunt={hunt} key={hunt.id}/>
            });
        
            setActiveItems(completed);
            setCompletedItems(active);
        
            setProfileUser(sampleuser);
            setUser(sampleuser);
            setLoading(false);
        });

        
        
    }, [params.id]);
    

    const handleNew = async (event: any) => {
        event.preventDefault();
        document.location = '../hunt/new';
    }

    const handleGetImage = async (event: any) => {
        event.preventDefault();
        if (user)
            console.log(api.getImage(user.avatar));
    }
    

    //set hunt displays based on what hunts users have 
    let content;
    if (activeItems.length > 0 && completedItems.length > 0) {
        content = (
            <Grid>
                <div className="flex flex-col gap-2 lg:w-[24rem] md:w-[18rem] sm:w-[10rem] border-solid border-2 border-black border-r-1">
                    <p className="p-2 border-b-2 border-grey border-dashed">Active</p>
                    <TileGrid>
                        {activeItems}
                    </TileGrid>
                </div>
                <div className="flex flex-col gap-2 lg:w-[24rem] md:w-[18rem] sm:w-[10rem] border-solid border-2 border-black border-r-1">
                    <p className="p-2 border-b-2 border-grey border-dashed">Complete</p>
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
                <div className="lg:w-[24rem] md:w-[18rem] sm:w-[12rem] border-solid border-2 border-black border-r-1">
                    <p className="p-2 border-b-2 border-grey border-dashed" >Active</p>
                    <span className="m-16 p-5 border-solid border-black border-2 sm:max-md:text-sm flex place-self-center">Begin Hunting with the New Hunt Button ^</span>
                </div>
                <div className="flex flex-col gap-2 lg:w-[24rem] md:w-[20rem] sm:w-[16rem] border-solid border-2 border-black border-l-1">
                    <p className="p-2 border-b-2 border-grey border-dashed" >Complete</p>
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
                <div className="flex flex-col gap-2 lg:w-[24rem] md:w-[20rem] sm:w-fit border-solid border-2 border-black border-r-1">
                    <p className="p-2 border-b-2 border-grey border-dashed" >Active</p>
                    <TileGrid>
                        {activeItems}
                    </TileGrid>
                </div>
                <div className="lg:w-[24rem] md:w-[20rem] sm:w-[12rem] border-solid border-2 border-black border-l-1">
                    <p className="p-2 border-b-2 border-grey border-dashed" >Complete</p>
                    <div className="m-16 p-5 border-solid border-black border-2 sm:m-8 sm:p-2 sm:max-md:text-sm flex place-self-center">Keep Working on Those Hunts!</div>
                </div>
            </Grid>
        );
    }
    else {
        content = (
            <Grid>
                <div className="lg:w-[24rem] md:w-[20rem] sm:w-[16rem] border-solid border-2 border-black border-r-1">
                    <p className="p-2">Active</p>
                    <span className="m-16 p-5 border-solid border-black border-1 mr-2 sm:max-md:text-sm flex place-self-center">Begin Hunting with the New Hunt Button ^</span>
                </div>
                <div className="lg:w-[24rem] md:w-[20rem] sm:w-[16rem] border-solid border-2 border-black border-l-1">
                    <p className="p-2" >Complete</p>
                    <span className="m-16 p-5 border-solid border-black border-2 sm:max-md:text-sm flex place-self-center">Begin Hunting with the New Hunt Button ^</span>
                </div>
            </Grid>
        );
    }

    //change to loading screen later
    // 
    return (!loading && profileUser != undefined) ? (
        <main className="flex flex-col h-screen items-center gap-6 p-8">
            <ProfileHeader user={profileUser}></ProfileHeader>

            <div className="flex flex-row justify-between gap-16">
                <BigButton onClick={handleNew} text="New Hunt"></BigButton>
            </div>

            {content} 
        </main>
    ) 
    : (
        <main className="flex flex-col items-center gap-6 p-12">
            <div className="mt-16 flex flex-row justify-between gap-16">
                <BigButton onClick={handleNew} text="New Hunt"></BigButton>
            </div>

            {content} 
        </main>
    );
}