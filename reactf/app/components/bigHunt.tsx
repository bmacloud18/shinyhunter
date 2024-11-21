'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from "@/app/APIclient";
import Timer from "easytimer.js";
import convertTime from "@/app/util/convertTime";
import BigButton from "@/app/components/bigButton";
import User from "@/app/interfaces/user";

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
    const [user, setUser] = useState<User>();

    const [spriteClick, setSpriteClick] = useState(() => () => {
        console.log('default');
    });
    const [saveCurrentHunt, setSaveCurrentHunt] = useState(() => () => {
        console.log('default');
    });
    const [handleSettings, setHandleSettings] = useState(() => () => {
        console.log('default');
    });





    //local storage functions
    function saveDataToLocalStorage(key: string, data: any) {
        localStorage.setItem(key, JSON.stringify(data));
    }
    
    function getDataFromLocalStorage(key: string) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }
    
    function saveTimeDataLocally() {
        const key = "stopwatchData";
        const data = {
            elapsedTime: seconds,
            isRunning: hunting
        };

        saveDataToLocalStorage(key, data);
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
        }
    }

    

    // async function handleClick (event: any) {
        
    // }

    //set data variables and declare timer 
    if (stopwatchData === undefined) {
        saveTimeDataLocally();
        setStopwatchData(getDataFromLocalStorage('stopwatchData'));
    }
        
    if (counterData === undefined)
        setCounterData(getDataFromLocalStorage('counterData'));
    if (timer === undefined)
        setTimer(new Timer());

    
    useEffect(() => {
        async function saveCurrentHuntFunction() {
            console.log('function called');
            console.log('nav check', navigator.onLine);
            console.log('diff check', diff, seconds);
            if ((diff != 0 || seconds > 3) && navigator.onLine) {
                console.log('getting data');
                const hunt = getDataFromLocalStorage('hunt');
                const stopwatch = getDataFromLocalStorage('stopwatchData');
                const counter = getDataFromLocalStorage('counterData');
        
                if (hunt && stopwatch && counter) {
                    console.log('hunt saving');
                    const newtime = stopwatch.elapsedTime;
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

        setSaveCurrentHunt(() => {
            return () => {
                saveCurrentHuntFunction
            }
        });

        //onClick functions
        function spriteClickFunction() {
            if (hunting) {
                saveTimeDataLocally();
                saveCurrentHunt();
                pause(timer);
            }
            else {
                saveDataToLocalStorage('hunt', hunt);
                resume(timer);
            }
        }

        setSpriteClick(() => {
            return () => {
                spriteClickFunction();
            }
        });

        async function handleSettingsFunction () {
            saveCurrentHunt();
            document.location = '/shinyhunter/hunt/' + hunt.id + '/settings';
        }

        setHandleSettings(() => {
            return () => {
                handleSettingsFunction();
            }
        });

        const pfp = document.getElementById('pfp');
        console.log(pfp);
        if (pfp) {
            pfp.addEventListener('click', saveCurrentHunt);
        }
        

        if (method.length < 1) {

            //set user from local storage, save hunt to local storage
            const u = getDataFromLocalStorage('user')
            setUser(u);
            saveDataToLocalStorage('hunt', hunt);

            //save count state and to local storage
            setCount(hunt.count);
            saveDataToLocalStorage('counterData', {
                counter: hunt.count
            });

            //save time state and to local storage
            setSeconds(hunt.hunt_time);
            saveDataToLocalStorage('stopwatchData', {
                elapsedTime: hunt.hunt_time,
                isRunning: true
            });

            //add event listener for any buttons which change the page to save the hunt before change
            //update function uses navigator.sendBeacon
            // const movers = document.querySelectorAll("button.newPage");
            // movers.forEach((mover) => {
            //     mover.addEventListener('click', async () => {
            //         console.log('clicked mover');
            //         try {
            //             await saveCurrentHunt();
            //             // document.location = "/shinyhunter/profile/" + u.id;
            //         }
            //         catch (err) {
            //             console.error('Error saving hunt', err);
            //         }
            //     });
            // })
            // console.log(movers);



            

            // const links = document.querySelectorAll("a.name");
            // links.forEach((link) => {
            //     link.addEventListener('click', saveCurrentHunt);
            // });
            
            
            // if (stopwatchData) {
            //     hunt_time += stopwatchData.elapsedTime;
            //     if (stopwatchData.isRunning) {
            //         resume(timer);
            //     }
            //     else {
            //         pause(timer);
            //     }
            // }
            if (timer) {
                timer.start({countdown: false, startValues: {seconds: hunt.hunt_time}});
                timer.addEventListener('secondsUpdated', function () {
                    if (!timer.isPaused()) {
                        const s = timer.getTimeValues().seconds + (timer.getTimeValues().minutes * 60) + 
                            (timer.getTimeValues().hours * 3600) + (timer.getTimeValues().days * 86400);
                        setTimeDisplay(convertTime(s));
                        setSeconds(s);
                    }
                });
            }

            // let count = hunt.count;
            // if (counterData) {
            //     count = counterData.counter;
            // }
            
            try {
                Promise.all([api.getMethodById(hunt.method)]).then((res) => {
                    setMethod(res[0].name);
                });
            } catch {
                console.error("couldn't connect to API");
                setMethod('random');
            }
        }
    }, []);

    const active = hunt.end_date_display == null;
    let main = (
        <div className="flex flex-col w-full gap-8 items-center">
            <span className="text-6xl">
                {hunt.nickname}
            </span>
            <span className="text-4xl">
                {timeDisplay}
            </span>
            <a className="mt-4" onClick={spriteClick}>
                <img src={hunt.sprite} alt="Loading Icon" className="h-32 w-32 fill-green"/>
            </a>
        </div>
    )
    
    let activeContent = hunting ? [
        (main),
        (<div className="flex flex-col items-center w-fit">
            <span className="text-7xl m-8">{count}</span>
            <div className="flex flex-row justify-end mt-8 gap-8 items-center">
                <button onClick={plus} className="text-6xl h-48 w-48 border-solid border-2 border-red rounded-2xl bg-green hover:bg-buttonwhite">+</button>
                <button onClick={minus} className="text-6xl h-24 w-24 border-solid border-2 border-red rounded-2xl bg-green hover:bg-buttonwhite">-</button>
            </div>
        </div>)
    ] : [
        (<span>Tap Sprite to Resume Hunt</span>),
        (main),
        (<span className="text-7xl m-8">{count}</span>)
        
    ]

    let settings = active ? (<BigButton onClick={handleSettings} text="Hunt Settings"></BigButton>) : 
    (<button className="newPage max-w-fit border-solid border-2 border-green rounded-2xl p-2 bg-red hover:bg-buttonwhite"></button>)

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
            <span className="justify-self-end self-end text-xl m-8">{hunt.count}</span>
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
        <div className="flex flex-col items-center">
            <div className="rounded-2xl border-solid border-2 border-black flex flex-col items-center w-fit gap-6 m-2 p-20">
                {content}
            </div>
            {settings}
        </div>
    )
}