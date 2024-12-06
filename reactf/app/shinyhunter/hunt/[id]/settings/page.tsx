"use client";
import React, { useState, useEffect } from 'react';
import api from "@/app/APIclient";
import Form from "@/app/components/form";
import User from "@/app/interfaces/user";
import Hunt from "@/app/interfaces/hunt";


export default function HuntSettings({params}: {params: {id: number}}) {
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
        if (charmValue === undefined || charmValue === 'off')
            setCharm('on');
        else
            setCharm('off');
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
            if ((user && hunt) && (nicknameValue.length > 1 && nicknameValue != hunt.nickname || incrementValue != hunt.increment || 
            (charmValue == 'on' && !hunt.charm || charmValue == 'off' && hunt.charm) || countValue != hunt.count || timeValue != hunt.hunt_time)) {
                api.updateHuntSettings(hunt.id, timeValue, countValue, incrementValue, charmValue == 'on', nicknameValue).then((h) => {
                    document.location = '/shinyhunter/hunt/' + hunt.id;
                }).catch((err) => {
                    console.log('Unable to update Hunt - ' + err.message);
                })
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    //fetch relevant data
    useEffect(() => {
        if (user === undefined || hunt === undefined) {
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
                });
            } catch (error: any) {
                console.log("unable to communicate with api");
            }
        }
    });

    //define settings content
    const main = [
        (<div className="flex flex-row gap-2">
            <label className="flex flex-col">
                Nickname
                <input className="border-solid border-2 border-green p-2 focus:outline-none rounded-xl w-[10rem]" type="text" value={nicknameValue} placeholder="Nickname" required={true} onChange={nicknameChange}/>
            </label>
            <label className="flex flex-col">
                Increment
                <input type="number" className="border-solid border-2 border-green p-2 focus:outline-none rounded-xl w-[10rem]" value={incrementValue} min="1" placeholder="Increment" required={true} onChange={incrementChange}></input>
            </label>
            
        </div>),
        (<div className="flex flex-row gap-2">
            <label className="flex flex-col">
                Count
                <input type="number" className="border-solid border-2 border-green p-2 focus:outline-none rounded-xl w-[10rem]" value={countValue} min="0" placeholder="Count" required={true} onChange={countChange}></input>
            </label>
            <label className="flex flex-col">
                Time
                <input type="number" className="border-solid border-2 border-green p-2 focus:outline-none rounded-xl w-[10rem]" value={timeValue} min="0" placeholder="Time" required={true} onChange={timeChange}></input>
            </label>
        </div>),
        (<label className="flex flex-col items-center">
            <span>Charm?</span>
            <input type="checkbox" className="border-solid border-2 border-green p-2 focus:outline-none rounded-xl w-[10rem]" placeholder="Charm" id="charm" required={false} onChange={charmChange}></input>
        </label>)
    ]

    //return page based on importing checkbox value
    return (
        <Form formText="Update Hunt Settings" buttonText="Update Hunt" handleSubmit={handleSubmit}>
            {main}
        </Form>
    )
}