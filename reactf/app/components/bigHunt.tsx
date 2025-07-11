'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import api from "@/app/APIclient";
import convertTime from "@/app/util/convertTime";
import getSeconds from "@/app/util/getSeconds";
import BigButton from "@/app/components/bigButton";

import sample from "@/app/samples/completedHunt"

import Image from 'next/image';
// import User from "@/app/interfaces/user";
import Hunt from "@/app/interfaces/hunt";
import Timer from "easytimer.js";
import useTimer from 'easytimer-react-hook';

import storageUtil from "@/app/util/localStorage"

export default function HuntTile({
    h
} : {
    h:Hunt
}) {
    
    const [method, setMethod] = useState<string>('');
    const [timer, targetAchieved] = useTimer({countdown: false, startValues: {seconds: h.hunt_time}})
    const [interval, setInt] = useState<number>(0)
    const [hunting, setHunting] = useState<boolean>(true);
    const [count, setCount] = useState<number>(0);
    const [diff, setDiff] = useState<number>(0);
    const [timeDisplay, setTimeDisplay] = useState(convertTime(h.hunt_time));
    const [intervalDisplay, setIntervalDisplay] = useState(convertTime(0));
    const [stopwatchData, setStopwatchData] = useState<any>();
    const [counterData, setCounterData] = useState<any>();
    const [hunt, setHunt] = useState<Hunt>(h);
    // const [user, setUser] = useState<User>();

    const diffRef = useRef(diff);
    const intRef = useRef(interval);
    const huntingRef = useRef(hunting);


    const timerRef = useRef(timer);




    function saveTimeDataLocally() {
        const key = "stopwatchData";
        const data = {
            totalSeconds: getSeconds(timerRef.current),
            interval: interval,
            isRunning: hunting
        };

        storageUtil.saveDataToLocalStorage(key, data);
    }
    
    function incrementAndSave() {
        const key = "counterData";
        setCount(count+1);
        setDiff(diff+1);
        const data = {
            counter: count+1
        }
        storageUtil.saveDataToLocalStorage(key, data);
    }
    
    function decrementAndSave() {
        const key = "counterData";
        setCount(count-1);
        setDiff(diff-1);
        const data = {
            counter: count-1
        }
        storageUtil.saveDataToLocalStorage(key, data);
    }

    
    
    //Timer functions
    function pause() {
        setHunting(false);
        timer.pause();
        console.log('pausing, paused: ', !huntingRef.current);
    }
    
    function resume() {
        setHunting(true);
        timerRef.current.start();
        console.log('resuming, paused: ', !huntingRef.current);
    }


    function minus() {
        if (count > 0) {
            decrementAndSave();
            saveTimeDataLocally();
        }
    }

    function plus() {
        if (count < 999999) {
            incrementAndSave();
            saveTimeDataLocally();
            setInt(0);
        }
    }

    const saveCurrentHunt = useCallback(async (currentDiff: number) => {
        const currentInterval = intRef.current;
            if ((currentDiff != 0 || currentInterval > 3) && navigator.onLine) {
                console.log('getting data');
                const hunt = storageUtil.getDataFromLocalStorage('hunt');
                const stopwatch = storageUtil.getDataFromLocalStorage('stopwatchData');
                const counter = storageUtil.getDataFromLocalStorage('counterData');
                
                if (hunt && stopwatch && counter) {
                    console.log('hunt saving');
                    const newtime = stopwatch.totalSeconds;
                    const c = counter.counter;
    
                    console.log(hunt.id, newtime, c);
                    localStorage.removeItem('hunt');
                    localStorage.removeItem('stopwatchData');
                    localStorage.removeItem('counterData');
    
                    api.updateHunt(hunt.id, newtime, c).then(res => {
                        console.log(res);
                    }).catch(err => {
                        console.error('Error syncing data with server: ', err);
                    });
                }
            }
    }, []);

    //onClick functions
    function spriteClick() {
        if (hunting) {
            saveTimeDataLocally();
            saveCurrentHunt(diff)
            pause();
                
        }
        else {
            storageUtil.saveDataToLocalStorage('hunt', hunt);
            resume();
        }
    }

    // function testing() {
    //     console.log(interval);
    // }

    async function handleSettings() {
        saveCurrentHunt(diff)
        document.location = '/shinyhunter/hunt/' + hunt.id + '/settings';
    }

    async function handleCapture() {
        saveCurrentHunt(diff);
        Promise.all([api.completeHunt(hunt.id, new Date().toISOString())]).then( (res) => {
            const uh = res[0];
            setHunt(uh);
            // congratulations popup
        }).catch((err) => {
            console.log("couldn't connect to api - " + err);
            setHunt(sample);
        });
    }


    //set data variables and declare timer 
    if (stopwatchData === undefined) {
        saveTimeDataLocally();
        setStopwatchData(storageUtil.getDataFromLocalStorage('stopwatchData'));
    }
        
    if (counterData === undefined)
        setCounterData(storageUtil.getDataFromLocalStorage('counterData'));


    
    useEffect(() => {

        
        const u = storageUtil.getDataFromLocalStorage('user');
        
        const display = document.getElementById("main")
        if (display && u.id !== hunt.user) {
            display.style.pointerEvents = "none";
        }

        if (method.length < 1) {

            storageUtil.saveDataToLocalStorage('hunt', hunt);

            //save count state and to local storage
            setCount(hunt.count);
            storageUtil.saveDataToLocalStorage('counterData', {
                counter: hunt.count
            });

            //save time state and to local storage
            storageUtil.saveDataToLocalStorage('stopwatchData', {
                totalSeconds: hunt.hunt_time,
                isRunning: true
            });

            Promise.all([api.getMethodById(hunt.method)]).then((res) => {
                setMethod(res[0].name);
            }).catch((e) => {
                setMethod('random');
                console.log("couldn't connect to API", method);
            });


            diffRef.current = diff;
            intRef.current = interval;
            
            timer.start({countdown: false, startValues: {seconds: hunt.hunt_time}});
            timer.addEventListener('secondsUpdated', function () {
                if (hunting) {
                    const s = getSeconds(timer);
                    setTimeDisplay(convertTime(s));
                    setInt(prev => {
                        const newInt = prev + 1;
                        setIntervalDisplay(convertTime(newInt));
                        return newInt;
                    });
                }
            });

            const pfp_list = document.getElementsByClassName('pfp') as HTMLCollectionOf<HTMLImageElement>;
            for (let i = 0; i < pfp_list.length; i++)
            {
                const pfp = pfp_list[i];
                pfp.addEventListener('click', () => {
                    saveCurrentHunt(diffRef.current);
                    document.location = "/shinyhunter/profile/" + pfp.dataset.userId;
                })
            }
        }

    }, [hunt, saveCurrentHunt, timer, hunting, diff, interval]);

    const active = hunt.end_date_display == null;
    let main = (
        <div key="hm" className="flex flex-col w-full gap-4 p items-center">
            <span className="text-6xl">
                {hunt.nickname}
            </span>
            <span className="text-4xl" id="td">
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
        (<span key="h1" className="self-center">Tap Sprite to Resume Hunt</span>),
        (main),
        (<span key="h2" className="text-7xl m-8 self-center">{count}</span>)
        
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
            <button onClick={handleCapture} className="newPage flex place-self-center">
                <Image 
                    className="h-14 w-14"
                    src='/sparkles.png'
                    height="54"
                    width="54"
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
            <Image src={hunt.sprite} alt="Loading Icon" className="h-24 w-24 fill-green" width="96" height="96"/>
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
        <div className="flex flex-col items-center" id="main">
            <div className="rounded-2xl border-solid border-2 border-black flex flex-col w-fit md:w-[30rem] lg:w-[36rem] mb-1 md:mb-2 p-8 md:p-10">
                {settings}
                {activeContent}
                {/* <BigButton text={"test"} onClick={testing}></BigButton> */}
            </div>
            {capture}
        </div>
    ) : (
        <div className="flex flex-col items-center mt-10" id="main">
            <div className="rounded-2xl border-solid border-2 border-black flex flex-col w-fit md:w-[30rem] lg:w-[36rem] mb-1 md:mb-2 p-8 md:p-10">
                {completeContent}
            </div>
        </div>
    )
}