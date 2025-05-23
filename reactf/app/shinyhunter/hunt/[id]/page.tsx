"use client";
import React, { useState, useEffect } from "react";
import BigButton from "@/app/components/bigButton";
import BigHunt from "@/app/components/bigHunt";
import api from "@/app/APIclient";
import Hunt from "@/app/interfaces/hunt";
import sample from "@/app/samples/activeHunt";
import sample2 from "@/app/samples/completedHunt";

export default function HuntPage({params}: {params: {id: number}}) {
    const [hunt, setHunt] = useState<Hunt | undefined>(undefined);
    //fetch hunt data
    useEffect(() => {

        Promise.all([api.getHuntById(params.id)]).then( (res) => {
            const h = res[0];
            setHunt(h);
        }).catch((err) => {
            console.log("couldn't connect to api - " + err);
            setHunt(sample);
        });

    }, [params.id]);

    //setup Hunt Display
    let content;
    if (hunt !== undefined) {
        content = (
            <BigHunt h={hunt}/>
        );
    }

    //full page with Hunt
    return (
        <main className="flex min-h-screen flex-col items-center mt-6">
            {content} 
        </main>
    )
}