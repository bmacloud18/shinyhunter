'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from "@/app/APIclient";
import Timer from "easytimer.js";
import convertTime from "@/app/util/convertTime";
import BigButton from "@/app/components/bigButton";
export default function HuntTile({
    hunt
} : {
    hunt:any
}) {

    const router = useRouter();
    
    const [method, setMethod] = useState('');
    const [timer, setTimer] = useState<Timer>();
    const [hunting, setHunting] = useState<boolean>(true);
    const [count, setCount] = useState<number>(0);
    const [seconds, setSeconds] = useState<number>(0);
    const [diff, setDiff] = useState<number>(0);
    const [timeDisplay, setTimeDisplay] = useState(convertTime(hunt.hunt_time));
    const [stopwatchData, setStopwatchData] = useState<any>();
    const [counterData, setCounterData] = useState<any>();





    //local storage functions
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
            isRunning: hunting
        };

        saveDataToLocalStorage(key, data);
    }
    
    function saveDataLocallyAndIncrement(key: string) {
        setCount(count+1);
        setDiff(diff+1);
        const data = {
            counter: count+1
        }
        saveDataToLocalStorage(key, data);
    }
    
    function saveDataLocallyAndDecrement(key: string) {
        setCount(count-1);
        setDiff(diff-1);
        const data = {
            counter: count-1
        }
        saveDataToLocalStorage(key, data);
    }

    async function saveCurrentHunt() {
        console.log('hunt saving');
        await new Promise((resolve) => setTimeout(resolve, 500));
        if ((diff != 0 || seconds > 3) && navigator.onLine) {
            const hunt = getDataFromLocalStorage('hunt');
            const stopwatch = getDataFromLocalStorage('stopwatchData');
            const counter = getDataFromLocalStorage('counterData');

            console.log(hunt, stopwatch, counter);
    
            if (hunt && stopwatch && counter) {
                const newtime = hunt.hunt_time + stopwatch.elapsedTime;
                const count = counter.counter;
                console.log(newtime, count);
                api.updateHunt(hunt.id, newtime, count, hunt.increment, hunt.charm, hunt.nickname).then(res => {
                    console.log(res);
                    if (res.status != '404') {
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
    
    //Timer functions
    function pause(timer: Timer | undefined) {
        if (timer !== undefined) {
            setHunting(false);
            
            timer.pause();
        }
    };
    
    function resume(timer: Timer | undefined) {
        if (timer !== undefined) {
            if (!hunting) {
                setHunting(true);
                timer.start();
            }
        }
    };


    //onClick functions
    function spriteClick() {
        saveCurrentHunt();
        if (hunting) {
            saveTimeDataLocally('stopwatchData');
            pause(timer);
        }
        else {
            resume(timer);
            
        }
    }

    function minus() {
        if (count > 0) {
            saveDataLocallyAndDecrement('counterData');
            saveTimeDataLocally('stopwatchData');
        }
    }

    function plus() {
        if (count < 999999) {
            saveDataLocallyAndIncrement('counterData');
            saveTimeDataLocally('stopwatchData');
        }
    }

    async function handleSettings (event: any) {
        event.preventDefault();
        saveCurrentHunt();
        document.location = '/shinyhunter/hunt/' + hunt.id + '/settings';
    }

    //set data variables and declare timer 
    if (stopwatchData === undefined) {
        saveTimeDataLocally('stopwatchData');
        setStopwatchData(getDataFromLocalStorage('stopwatchData'));
    }
        
    if (counterData === undefined)
        setCounterData(getDataFromLocalStorage('counterData'));
    if (timer === undefined)
        setTimer(new Timer());


    useEffect(() => {
        if (method.length < 1) {
            saveDataToLocalStorage('hunt', hunt);
            
            document.onvisibilitychange = async () => {
                await saveCurrentHunt();
            }

            let hunt_time = hunt.hunt_time;
            if (stopwatchData) {
                hunt_time += stopwatchData.elapsedTime;
                if (stopwatchData.isRunning) {
                    resume(timer);
                }
                else {
                    pause(timer);
                }
            }
            if (timer) {
                timer.start({countdown: false, startValues: {seconds: hunt_time}});
                timer.addEventListener('secondsUpdated', function () {
                    if (!timer.isPaused()) {
                        const s = timer.getTimeValues().seconds + hunt_time;
                        setTimeDisplay(convertTime(s));
                        setSeconds(s);
                    }
                });
            }

            let count = hunt.count;
            if (counterData) {
                count = counterData.counter;
            }
            setCount(count);
            try {
                Promise.all([api.getMethodById(hunt.method)]).then((res) => {
                    setMethod(res[0].name);
                });
            } catch {
                console.error("couldn't connect to API");
                setMethod('random');
            }
        }
    });

    const active = hunt.end_date_display == null;
    let main = (
        <div className="flex flex-col w-full gap-8 items-center">
            <span className="font-sans text-6xl">
                {hunt.nickname}
            </span>
            <span className="font-sans text-4xl">
                {timeDisplay}
            </span>
            <a className="mt-4" onClick={spriteClick}>
                <img src={hunt.sprite} alt="Loading Icon" className="h-32 w-32 fill-green"/>
            </a>
        </div>
    )
    
    let activeContent = hunting ? [
        (<BigButton onClick={handleSettings} text="Hunt Settings"></BigButton>),
        (main),
        (<div className="flex flex-col items-center w-fit">
            <span className="font-mono text-7xl m-8">{count}</span>
            <div className="flex flex-row justify-end mt-8 gap-8 items-center">
                <button onClick={plus} className="text-6xl font-sans h-48 w-48 border-solid border-2 border-red rounded-2xl bg-green hover:bg-buttonwhite">+</button>
                <button onClick={minus} className="text-6xl font-sans h-24 w-24 border-solid border-2 border-red rounded-2xl bg-green hover:bg-buttonwhite">-</button>
            </div>
        </div>)
    ] : [
        (<span>Tap Sprite to Resume Hunt</span>),
        (main)
    ]

    let button = active ? (<BigButton onClick={handleSettings} text="Hunt Settings"></BigButton>) : (<span></span>)

    let completeContent = [
        (<div className="flex flex-col w-full">
            <span>
                {hunt.nickname}
            </span>
            <span>
                {hunt.hunt_time_display}
            </span>
            <img src={hunt.sprite} alt="Loading Icon" className="h-24 w-24 fill-green" />
        </div>),
        (<div className="flex flex-row justify-between w-full">
            <span className="justify-self-end self-end font-sans text-xl m-8">{hunt.count}</span>
        </div>),
        (<div>
            <div>
                <span>Game: {hunt.game}</span>
                <span>Method: {method}</span>
            </div>
            <div>
                <span>Start: {hunt.start_date_display}</span>
                <span>End: {hunt.end_date_display}</span>
            </div>
        </div>)
    ]
    let content = active ? activeContent : completeContent;
    return (
        <div>
            <div className="rounded-2xl border-solid border-2 border-black flex flex-col items-center w-fit gap-6 m-2 p-20">
                {content}
            </div>
            {button}
        </div>
    )
}