'use client';
import Link from "next/link";
import { useEffect, useState } from 'react';
import api from "@/app/APIclient";
import Timer from "easytimer.js";
import convertTime from "@/app/util/convertTime";

export default function HuntTile({
    hunt
} : {
    hunt:any
}) {
    
    const [method, setMethod] = useState('');
    const [timer, setTimer] = useState<Timer>();
    const [hunting, setHunting] = useState<boolean>(true);
    const [count, setCount] = useState<number>(0);
    const [seconds, setSeconds] = useState<number>(0);
    const [diff, setDiff] = useState<number>(0);
    const [timeDisplay, setTimeDisplay] = useState('');

    function saveDataToLocalStorage(key: string, data: any) {
        localStorage.setItem(key, JSON.stringify(data));
    }
    
    function getDataFromLocalStorage(key: string) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }
    
    function saveTimeDataLocally(key: string) {
        const data = {
            elapsedTime: seconds,
            isRunning: active
        };
        saveDataToLocalStorage(key, data);
    }
    
    function saveDataLocallyAndIncrement(key: string) {
        setCount(count+1);
        setDiff(diff+1);
        const data = {
            counter: count
        }
        saveDataToLocalStorage(key, data);
    }
    
    function saveDataLocallyAndDecrement(key: string) {
        setCount(count-1);
        setDiff(diff-1);
        const data = {
            counter: count
        }
        saveDataToLocalStorage(key, data);
    }

    function saveCurrentHunt() {
        if ((diff != 0 || seconds > 3) && navigator.onLine) {
            const hunt = getDataFromLocalStorage('hunt');
            const stopwatch = getDataFromLocalStorage('stopwatchData');
            const counter = getDataFromLocalStorage('counterData');
    
            if (hunt && stopwatch && counter) {
                const newtime = hunt.hunt_time + stopwatch.elapsedTime;
                const count = counter.counter;
                api.updateHunt(hunt.id, newtime, hunt.start_date_string, hunt.end_date_string, count, hunt.increment).then(res => {
                    if (res.status == '200') {
                        localStorage.removeItem('hunt');
                        localStorage.removeItem('stopwatchData');
                        localStorage.removeItem('counterData');
                        console.log('update sent');
                    }
                    else {
                        console.error('Failed to sync data with server: ', res.status);
                    }
                }).catch(err => {
                    console.error('Error syncing data with server: ', err);
                });
            }
        }
    }
    
    function pause(timer: Timer | undefined) {
        if (timer !== undefined) {
            setHunting(false);
            timer.pause();
            saveCurrentHunt();
        }
    };
    
    function resume(timer: Timer | undefined) {
        if (timer !== undefined) {
            if (!active) {
                setHunting(true);
                timer.start();
            }
        }
    };



    function spriteClick() {
        if (hunting) {
            pause(timer);
            saveTimeDataLocally('stopwatchData');
        }
        else {
            resume(timer);
            saveTimeDataLocally('stopwatchData');
        }
    }

    function minus() {
        saveDataLocallyAndDecrement('counterData');
        setCount(count-1);
    }

    function plus() {
        saveDataLocallyAndIncrement('counterData');
        setCount(count+1);
    }

    useEffect(() => {
        document.addEventListener('visibilitychange', e => {
            saveCurrentHunt();
            localStorage.removeItem('hunt');
            localStorage.removeItem('stopwatchData');
            localStorage.removeItem('counterData');
        });
        try {
            Promise.all([api.getMethodById(hunt.id)]).then((res) => {
                setMethod(res[0].name);
                const stopwatchData = getDataFromLocalStorage('stopwatchData');
                const counterData = getDataFromLocalStorage('counterData');
            
                let hunt_time = hunt.hunt_time;
                setTimer(new Timer({callback: function (e) {
                    setSeconds(seconds+1);
                    const newtime = hunt_time + seconds;
                    setTimeDisplay(convertTime(newtime));
                    saveTimeDataLocally('stopwatchData');
                }, precision: 'seconds'}));

                if (stopwatchData) {
                    hunt_time += stopwatchData.elapsedTime;
                    if (stopwatchData.isRunning) {
                        resume(timer);
                    }
                    else {
                        pause(timer);
                    }
                }

                let count = hunt.count;
                if (counterData) {
                    count = counterData.counter;
                }
            });
        } catch {
            console.error("couldn't connect to API");
        }
    });
    // const active = hunt.end_date_display == null;
    const active = true;
    let activeContent = hunting ? [
        (<div className="flex flex-col w-full">
            <span>
                {hunt.nickname}
            </span>
            <span>
                {timeDisplay}
            </span>
            <img src={hunt.sprite} alt="Loading Icon" className="h-24 w-24 fill-green" />
        </div>),
        (<div className="flex flex-row justify-between w-full">
        <span className="justify-self-end self-end font-sans text-xl m-8">{count}</span>
        <div className="border-solid border-2 border-red mr-2 rounded-2xl p-5 bg-green hover:bg-buttonwhite">
            <button onClick={minus} className="">{"+"}</button>
        </div>
        <div className="border-solid border-2 border-red mr-2 rounded-2xl p-5 bg-green hover:bg-buttonwhite">
            <button onClick={plus} className="">{"-"}</button>
        </div>
    </div>)
    ] : [
        (<span>Tap Sprite to Resume Hunt</span>),
        (<div className="flex flex-col w-full">
            <span>
                {hunt.nickname}
            </span>
            <span>
                {timeDisplay}
            </span>
            <img src={hunt.sprite} alt="Loading Icon" className="h-24 w-24 fill-green" />
        </div>)
    ]
    return active ? (
        <div className="border-solid border-2 border-black flex flex-col items-center w-full gap-6 m-2">
            {activeContent}
        </div>
    ) : (
        <div className="border-solid border-2 border-black flex flex-col items-center w-full gap-6 m-2">
            <div className="flex flex-col w-full">
                <span>
                    {hunt.nickname}
                </span>
                <span>
                    {hunt.hunt_time_display}
                </span>
                <img src={hunt.sprite} alt="Loading Icon" className="h-24 w-24 fill-green" />
            </div>
            <div className="flex flex-row justify-between w-full">
                <span className="justify-self-end self-end font-sans text-xl m-8">{hunt.count}</span>
            </div>
            <div>
                <div>
                    <span>Game: {hunt.game}</span>
                    <span>Method: {method}</span>
                </div>
                <div>
                    <span>Start: {hunt.start_date_display}</span>
                    <span>End: {hunt.end_date_display}</span>
                </div>
            </div>
        </div>
    );
}