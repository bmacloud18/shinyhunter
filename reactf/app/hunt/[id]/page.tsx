"use client";
import React, { useState, useEffect } from "react";
import BigButton from "@/app/components/bigButton";
import BigHunt from "@/app/components/bigHunt";
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
    end_date_string: String;
    end_date_display: String;
    hunt_time: number;
    hunt_time_display: String;
    count: number;
    increment: number;
    charm: String;
    sprite: String;
}

export default function Hunt({params}: {params: {id: number}}) {
    const [hunt, setHunt] = useState<Hunt>();
    //will need for display logic
    const [user, setUser] = useState('');
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
    //fetch hunt data
    useEffect(() => {

        Promise.all([api.getHuntById(params.id), api.getCurrentUser()]).then( (res) => {
            const h = res[0];
            const u = res[1].username;
            setHunt(h);
            setUser(u);
        });

    }, [params.id]);


    //setup Hunt Display
    let content;
    if (hunt != null) {
        content = (
            <BigHunt hunt={hunt}/>
        );
    }

    //full page with Hunt
    return (
        <main className="flex min-h-screen flex-col items-center justify-around p-24">
            <div className="flex flex-row justify-between gap-16 font-mono">
                <BigButton text="Home"></BigButton>
                <BigButton text="Hunt Settings"></BigButton>
            </div>

            <div>
                {content} 
            </div>
        </main>
    )
}