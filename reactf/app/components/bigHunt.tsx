'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import api from "@/app/APIclient";
import Timer from "easytimer.js";
import convertTime from "@/app/util/convertTime";
import getSeconds from "@/app/util/getSeconds";
import BigButton from "@/app/components/bigButton";

import Image from 'next/image';
// import User from "@/app/interfaces/user";

export default function HuntTile({
    hunt
} : {
    hunt:any
}) {
    
    const [method, setMethod] = useState('');
    const [timer, setTimer] = useState<Timer>();
    const [intervalTimer, setInterval] = useState<Timer>();
    const [hunting, setHunting] = useState<boolean>(true);
    const [count, setCount] = useState<number>(0);
    const [diff, setDiff] = useState<number>(0);
    const [timeDisplay, setTimeDisplay] = useState(convertTime(hunt.hunt_time));
    const [intervalDisplay, setIntervalDisplay] = useState(convertTime(0));
    const [stopwatchData, setStopwatchData] = useState<any>();
    const [counterData, setCounterData] = useState<any>();
    // const [user, setUser] = useState<User>();

    const diffRef = useRef(diff);


    //local storage functions
    function saveDataToLocalStorage(key: string, data: any) {
        localStorage.setItem(key, JSON.stringify(data));
    }
    
    function getDataFromLocalStorage(key: string) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }
    
    function saveTimeDataLocally() {
        if (timer && intervalTimer) {
            const key = "stopwatchData";
            const data = {
                totalSeconds: getSeconds(timer),
                interval: getSeconds(intervalTimer),
                isRunning: hunting
            };
    
            saveDataToLocalStorage(key, data);
        }
    }
    
    function incrementAndSave() {
        const key = "counterData";
        setCount(count+1);
        setDiff(diff+1);
        const data = {
            counter: count+1
        }
        saveDataToLocalStorage(key, data);
    }
    
    function decrementAndSave() {
        const key = "counterData";
        setCount(count-1);
        setDiff(diff-1);
        const data = {
            counter: count-1
        }
        saveDataToLocalStorage(key, data);
    }

    
    
    //Timer functions
    function pause(timer: Timer | undefined) {
        if (timer && intervalTimer) {
            setHunting(false);
            
            timer.pause();
            intervalTimer.pause();
        }
    };
    
    function resume(timer: Timer | undefined) {
        if (timer && intervalTimer) {
            if (!hunting) {
                setHunting(true);
                timer.start();
                intervalTimer.start();
            }
        }
    };


    function minus() {
        if (count > 0 && intervalTimer) {
            decrementAndSave();
            saveTimeDataLocally();
        }
    }

    function plus() {
        if (count < 999999 && intervalTimer) {
            setIntervalDisplay(convertTime(0));
            incrementAndSave();
            saveTimeDataLocally();
            intervalTimer.reset();
        }
    }

    useEffect(() => {
        diffRef.current = diff;
    }, [diff]);

    const saveCurrentHunt = useCallback(async (currentDiff: number) => {
        if (intervalTimer) {
            const currentInterval = getSeconds(intervalTimer);
            console.log(currentInterval);
            if ((currentDiff != 0 || currentInterval > 3) && navigator.onLine) {
                console.log('getting data');
                const hunt = getDataFromLocalStorage('hunt');
                const stopwatch = getDataFromLocalStorage('stopwatchData');
                const counter = getDataFromLocalStorage('counterData');
        
                if (hunt && stopwatch && counter) {
                    console.log('hunt saving');
                    const newtime = stopwatch.totalSeconds;
                    const count = counter.counter;
    
                    console.log(hunt.id, newtime, count);
                    localStorage.removeItem('hunt');
                    localStorage.removeItem('stopwatchData');
                    localStorage.removeItem('counterData');
    
                    api.updateHunt(hunt.id, newtime, count).then(res => {
                        console.log(res);
                    }).catch(err => {
                        console.error('Error syncing data with server: ', err);
                    });
                }
            }
        }
    }, [intervalTimer]);

    //onClick functions
    function spriteClick() {
        if (hunting) {
            saveTimeDataLocally();
            saveCurrentHunt(diff)
            pause(timer);
        }
        else {
            saveDataToLocalStorage('hunt', hunt);
            resume(timer);
        }
    }

    async function handleSettings () {
        saveCurrentHunt(diff)
        document.location = '/shinyhunter/hunt/' + hunt.id + '/settings';
    }


    //set data variables and declare timer 
    if (stopwatchData === undefined) {
        saveTimeDataLocally();
        setStopwatchData(getDataFromLocalStorage('stopwatchData'));
    }
        
    if (counterData === undefined)
        setCounterData(getDataFromLocalStorage('counterData'));
    if (timer === undefined)
        setTimer(new Timer());
    if (intervalTimer === undefined)
        setInterval(new Timer());



    
    useEffect(() => {

        const pfp = document.getElementById('pfp');
        const u = getDataFromLocalStorage('user');
        if (pfp) {
            pfp.addEventListener('click', () => {
                saveCurrentHunt(diffRef.current);
                document.location = "/shinyhunter/profile/" + u.id;
            });
        }
        

        if (method.length < 1) {

            saveDataToLocalStorage('hunt', hunt);

            //save count state and to local storage
            setCount(hunt.count);
            saveDataToLocalStorage('counterData', {
                counter: hunt.count
            });

            //save time state and to local storage
            saveDataToLocalStorage('stopwatchData', {
                totalSeconds: hunt.hunt_time,
                isRunning: true
            });


            if (timer && intervalTimer) {
                timer.start({countdown: false, startValues: {seconds: hunt.hunt_time}});
                timer.addEventListener('secondsUpdated', function () {
                    if (!timer.isPaused()) {
                        
                        const s = getSeconds(timer);
                        setTimeDisplay(convertTime(s));
                    }
                });

                intervalTimer.start({countdown: false, startValues: {seconds: 0}});
                intervalTimer.addEventListener('secondsUpdated', function () {
                    if (!intervalTimer.isPaused()) {
                        
                        const i = getSeconds(intervalTimer);
                        setIntervalDisplay(convertTime(i));
                    }
                });
            }

            Promise.all([api.getMethodById(hunt.method)]).then((res) => {
                setMethod(res[0].name);
            }).catch((e) => {
                setMethod('random');
                console.log("couldn't connect to API");
            });
        }
    }, [hunt, intervalTimer, method, saveCurrentHunt, timer]);

    const active = hunt.end_date_display == null;
    let main = (
        <div key="hm" className="flex flex-col w-full gap-4 p items-center">
            <span className="text-6xl">
                {hunt.nickname}
            </span>
            <span className="text-4xl">
                {timeDisplay}
            </span>
            <span className="text-2xl text-grey">
                {intervalDisplay}
            </span>
            <a className="mt-4" onClick={spriteClick}>
                <Image src={hunt.sprite} alt="Loading Icon" className="h-24 w-24 fill-green" height="24" width="24"/>
            </a>
        </div>
    )
    
    let activeContent = hunting ? [
        (main),
        (<div key="h1" className="flex flex-col self-center w-fit">
            <span className="text-6xl m-2 self-center">{count}</span>
            <div className="flex flex-row justify-end mt-2 gap-8 items-center">
                <button onClick={plus} className="text-6xl h-40 w-40 border-solid border-2 border-red rounded-2xl bg-green hover:bg-buttonwhite">+</button>
                <button onClick={minus} className="text-6xl h-20 w-20 border-solid border-2 border-red rounded-2xl bg-green hover:bg-buttonwhite">-</button>
            </div>
        </div>)
    ] : [
        (<span key="h1">Tap Sprite to Resume Hunt</span>),
        (main),
        (<span key="h2" className="text-7xl m-8">{count}</span>)
        
    ]

    let settings = 
        (<div key="s1" className="w-8 h-6 border-solid border-2 rounded-2xl border-black bg-red hover:bg-buttonwhite self-end place-content-center">
            <button onClick={handleSettings} className="newPage flex place-self-center">
                <Image 
                    className="h-4 w-4"
                    src='/settings.png'
                    height="24"
                    width="24"
                    alt="User PFP"/>
            </button>
        </div>)

    let capture = 
        (<div key="c1" className="w-20 h-20 border-solid border-2 rounded-3xl border-black bg-red hover:bg-buttonwhite place-content-center">
            <button onClick={handleSettings} className="newPage flex place-self-center">
                <Image 
                    className="h-14 w-14"
                    src='/sparkles.png'
                    alt="User PFP"/>
            </button>
        </div>)

    let completeContent = [
        (<div key="cc1" className="flex flex-col w-full items-center place-self-center gap-1">
            <span className="text-4xl">
                {hunt.nickname}
            </span>
            <span className="text-3xl">
                {hunt.hunt_time_display}
            </span>
            <Image src={hunt.sprite} alt="Loading Icon" className="h-24 w-24 fill-green" />
        </div>),
        (<div key="cc2" className="flex flex-col justify-between w-full justify-self-center self-center">
            <span className="text-6xl m-8 flex place-self-center">{hunt.count}</span>
        </div>),
        (<div key="cc3" className="flex flex-col w-full items-center place-self-center gap-2">
            <div className="flex flex-col w-full items-center place-self-center">
                <span>Game: {hunt.game}</span>
                <span>Method: {method}</span>
            </div>
            <div className="flex flex-col w-full items-center place-self-center">
                <span>Start: {hunt.start_date_display}</span>
                <span>End: {hunt.end_date_display}</span>
            </div>
        </div>)
    ]

    return active ? (
        <div className="flex flex-col items-center">
            <div className="rounded-2xl border-solid border-2 border-black flex flex-col w-fit md:w-[30rem] lg:w-[36rem] mb-1 md:mb-2 p-8 md:p-10">
                {settings}
                {activeContent}
            </div>
            {capture}
        </div>
    ) : (
        <div className="flex flex-col items-center mt-10">
            <div className="rounded-2xl border-solid border-2 border-black flex flex-col w-fit md:w-[30rem] lg:w-[36rem] mb-1 md:mb-2 p-8 md:p-10">
                {completeContent}
            </div>
        </div>
    )
}