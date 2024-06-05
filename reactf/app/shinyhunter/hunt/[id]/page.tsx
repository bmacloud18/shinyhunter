"use client";
import React, { useState, useEffect } from "react";
import BigButton from "@/app/components/bigButton";
import BigHunt from "@/app/components/bigHunt";
import api from "@/app/APIclient";
import Hunt from "@/app/interfaces/hunt";
import sample from "@/app/samples/activeHunt";
import sample2 from "@/app/samples/completedHunt";

export default function HuntPage({params}: {params: {id: number}}) {
    const [hunt, setHunt] = useState<Hunt>();
    //fetch hunt data
    useEffect(() => {

        Promise.all([api.getHuntById(params.id)]).then( (res) => {
            const h = res[0];
            setHunt(h);
        }).catch((err) => {
            console.error(err);
            setHunt(sample2);
        });

    }, [params.id]);


    let handleSettings = async (event: any) => {
        event.preventDefault();
        document.location = '/shinyhunter/hunt/new';
    }


    //setup Hunt Display
    let content;
    let button;
    if (hunt !== undefined) {
        content = (
            <BigHunt hunt={hunt}/>
        );
        handleSettings = async (event: any) => {
            event.preventDefault();
            document.location = '/shinyhunter/hunt/' + hunt.id + '/settings';
        }
        button = hunt.end_date_display === null ? (
            <BigButton onClick={handleSettings} text="Hunt Settings"></BigButton>
        ) : (
            <span></span>
        )
    }

    //full page with Hunt
    return (
        <main className="flex min-h-screen flex-col items-center mt-48 p-10">
            <div className="flex flex-row justify-between gap-16 font-mono">
                {button}
            </div>

            <div>
                {content} 
            </div>
        </main>
    )
}