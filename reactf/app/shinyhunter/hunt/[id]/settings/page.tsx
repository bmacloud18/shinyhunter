"use client";
import React, { useState, useEffect } from 'react';
import api from "@/app/APIclient";
import User from "@/app/interfaces/user";
import Hunt from "@/app/interfaces/hunt";


export default function NewHunt({params}: {params: {id: number}}) {
    //constants for input values
    const [user, setUser] = useState<User>();
    const [hunt, setHunt] = useState<Hunt>();
    const [nicknameValue, setNickname] = useState('');
    const [incrementValue, setIncrement] = useState<number>();
    const [charmValue, setCharm] = useState('');
    const [countValue, setCount] = useState<number>();
    const [timeValue, setTime] = useState<number>();

    //functions for input change
    const nicknameChange = (event: any) => {
        setNickname(event.target.value)
    }
    const incrementChange = (event: any) => {
        setIncrement(event.target.value)
    }
    const charmChange = (event: any) => {
        setCharm(event.target.value)
    }
    const countChange = (event: any) => {
        setCount(event.target.value)
    }
    const timeChange = (event: any) => {
        setTime(event.target.value)
    }
    //handle hunt creation/form submission
    const handleSubmit = async (event: any) => {
        event.preventDefault();
        try {
            //make update call if any setting has changed
            if ((user && hunt) && (nicknameValue != hunt.nickname || incrementValue != hunt.increment || (charmValue == 'on' && !hunt.charm || charmValue == 'off' && hunt.charm) || countValue != hunt.count || timeValue != hunt.hunt_time)) {
                api.updateHunt(user.id, timeValue, countValue, incrementValue, charmValue, nicknameValue).then(hunt => {
                    document.location = '/shinyhunter/hunt/' + hunt.id;
                }).catch((err) => {
                    console.log('Unable to create Hunt - ' + err.message);
                })
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    //fetch relevant data
    useEffect(() => {
        try {
            Promise.all([api.getCurrentUser(), api.getHuntById(params.id)]).then((res) => {
                setUser(res[0]);
                const h = res[1];
                setHunt(h);
                setNickname(h.nickname);
                setIncrement(h.increment);
                setCharm(h.charm ? 'on' : 'off');
                setCount(h.count);
                setTime(h.hunt_time);
            })
        } catch (error: any) {
            console.log("unable to communicate with api");
        }
    });

    //define main content (when a normal hunt is being started)
    let main = (
        <div className="border-solid border-2 border-black p-10 flex flex-col gap-2">
            <input className="border-solid border-2 border-green p-2 focus:outline-none rounded-xl" type="text" value={nicknameValue} placeholder="Nickname" required={true} onChange={nicknameChange}/>
            <div>
                <input type="number" className="border-solid border-2 border-green p-1 focus:outline-none rounded-xl" value={incrementValue} placeholder="Increment" required={true} onChange={incrementChange}></input>
                <label>
                    <input type="checkbox" className="border-solid border-2 border-green p-2 focus:outline-none rounded-xl" placeholder="Charm" id="charm" required={false} onChange={charmChange}></input>
                    Charm?
                </label>
            </div>
            <div>
                <input type="number" className="border-solid border-2 border-green p-1 focus:outline-none rounded-xl" value={countValue} placeholder="Count" required={true} onChange={countChange}></input>
                <input type="number" className="border-solid border-2 border-green p-1 focus:outline-none rounded-xl" value={timeValue} placeholder="Time" required={true} onChange={timeChange}></input>
            </div>
        </div>
    );

    //return page based on importing checkbox value
    return (
        <main className="mt-96 flex flex-col min-h-screen items-center m-auto">
            <h1 className="h5 mb-3 fw-normal text-center">Update Settings for {nicknameValue}</h1>
            <form className="w-96 h-48 mb-24 flex flex-col items-center justify-around gap-8" onSubmit={handleSubmit}>
                {main}
                <button className="border-solid border-2 border-green mr-2 rounded-2xl p-2 bg-red hover:bg-buttonwhite">Update</button>
            </form>
        </main>
    )
}