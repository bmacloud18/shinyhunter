"use client";
import React, { useState, useEffect } from 'react';
import Select from 'react-select'
import Form from "@/app/components/form";
import api from "@/app/APIclient";
import User from "@/app/interfaces/user";
import Pokemon from "@/app/interfaces/pokemon";

import Image from "next/image";


export default function NewHunt() {
    //constants for input values
    const [user, setUser] = useState<User>();
    const [pokemonOptions, setPokemonOptions] = useState<Pokemon[]>([]);
    const [gameOptions, setGameOptions] = useState([]);
    const [methodOptions, setMethodOptions] = useState([]);
    const [pokemonValue, setPokemon] = useState<any>();
    const [gameValue, setGame] = useState<any>();
    const [methodValue, setMethod] = useState<any>();
    const [nicknameValue, setNickname] = useState('');
    const [incrementValue, setIncrement] = useState<number>();
    const [charmValue, setCharm] = useState('');
    const [countValue, setCount] = useState<number>();
    const [timeValue, setTime] = useState<number>();
    const [importValue, setImport] = useState('off');
    const [startValue, setStart] = useState<string>();
    const [endValue, setEnd] = useState<string | undefined>();


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
    const importChange = (event: any) => {
        if (importValue === undefined || importValue == 'off')
            setImport('on');
        else
            setImport('off');
    }
    const startChange = (event: any) => {
        setStart(event.target.value)
    }
    const endChange = (event: any) => {
        setEnd(event.target.value)
    }

    //handle hunt creation/form submission
    const handleSubmit = async (event: any) => {
        event.preventDefault();
        try {
            if (user && pokemonValue && gameValue && methodValue && nicknameValue && incrementValue && incrementValue > 0) {
                console.log(pokemonValue, gameValue, methodValue, nicknameValue);
                let start_date = new Date().toISOString();
                let end_date = null; 
                let time = 0;
                let count = 0;
                let pkm = pokemonOptions[Number(pokemonValue.value) - 1].name;
                let sprite = pokemonOptions[Number(pokemonValue.value) - 1].sprite

                if (importValue == 'on' && startValue && timeValue && countValue) {
                    start_date = startValue;
                    if (endValue) {
                        end_date = endValue;
                    }
                    time = timeValue;

                }

                api.createHunt(user.id, pkm, gameValue.value, methodValue.value, start_date, end_date, time, count, incrementValue, charmValue, nicknameValue, sprite).then(hunt => {
                    document.location = '/shinyhunter/hunt/' + hunt.id;
                }).catch((err) => {
                    console.log('Unable to create Hunt - ' + err.message);
                })
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    const useToday = (event: any) => {
        event.preventDefault();
        setStart(new Date().toISOString());
    }

    const notComplete = (event: any) => {
        event.preventDefault();
        setEnd(undefined);
    }

    //fetch relevant data
    useEffect(() => {
        if (user === undefined || gameOptions === undefined || methodOptions === undefined || pokemonOptions === undefined) {
            Promise.all([api.getCurrentUser(), api.getAllGames(), api.getAllMethods(), api.getAllMons()]).then((res) => {
                setUser(res[0]);
                setGameOptions(res[1]);
                setMethodOptions(res[2]);
                setPokemonOptions(res[3]);
            }).catch (e => {
                console.log("unable to communicate with api");
            });
        }
    });
    
    //format select option values
    let po: any[] = [];
    let go: any[] = [];
    let mo: any[] = [];
    if (pokemonOptions !== undefined) {
        po = pokemonOptions.map((pkm: Pokemon) => {
            return {
                value: pkm.id,
                label: pkm.name,
                image: pkm.sprite
            }
        });

        
    }
    if (gameOptions && gameOptions[0] !== 'no games') {
        go = gameOptions.map((game: String) => {
            return {
                value: game,
                label: game,
            }
        });
    }
    if (methodOptions !== undefined) {
        mo = methodOptions.map((method: any) => {
            return {
                value: method.id,
                label: method.name,
            }
        });
    }

    //define main content (when a normal hunt is being started)
    const main = [
        (<label key={'pkm'} className="flex flex-col items-center">
            <span>Select a Pokemon</span>
            <Select className="w-[10rem]" placeholder="Pokemon" onChange={setPokemon} value={pokemonValue} options={po} formatOptionLabel={(pkm: any) => (
                <div key={pkm.label} className="pkm-option">
                    <Image className="w-8 h-8" src={pkm.image} alt="pkm-image" height="32" width="32"/>
                    <span>{pkm.label}</span>
                </div>
            )}
            />
        </label>),
        (<div key={'gam-mtd'} className="flex flex-row gap-4"> 
            <label className="flex flex-col items-center">
                <span>Select a Game</span>
                <Select className="w-[10rem] sm:w-[7rem]" placeholder="Game" onChange={setGame} value={gameValue} options={go} formatOptionLabel={(game: any) => (
                    <div key={game.label} className="game-option">
                        <span>{game.label}</span>
                    </div>
                )}
                />
            </label>
            <label className="flex flex-col items-center">
                <span>Select a Method</span>
                <Select className="w-[10rem] sm:w-[7rem]" placeholder="Method" onChange={setMethod} value={methodValue} options={mo} formatOptionLabel={(mtd: any) => (
                    <div key={mtd.label} className="mtd-option">
                        <span>{mtd.label}</span>
                    </div>
                )}
                />
            </label>

        </div>),
        (<div key={'nn-inc'} className="flex flex-row gap-4">
            <input className="w-[12rem] sm:w-[8rem] border-solid border-2 border-green p-2 focus:outline-none rounded-xl" type="text" value={nicknameValue} placeholder="Nickname" required={true} onChange={nicknameChange}/>
            <input type="number" className="w-[12rem] sm:w-[8rem] border-solid border-2 border-green p-2 focus:outline-none rounded-xl" value={incrementValue} min="1" placeholder="Increment" required={true} onChange={incrementChange}></input>
        </div>),
        (<div key={'chrm-imp'} className="flex flex-col gap-4">
            <label className="flex flex-col items-center gap-2">
                Charm?
                <input type="checkbox" className="border-solid border-2 border-green p-2 focus:outline-none rounded-xl" placeholder="Charm" id="charm" required={false} onChange={charmChange}></input>
            </label>
            <label className="flex flex-col items-center gap-2">
                Importing Hunt?
                <input type="radio" className="border-solid border-2 border-green p-2 focus:outline-none rounded-xl" placeholder="Importing Hunt?" id="import" required={false} onChange={importChange} value={importValue}></input>
            </label>
        </div>)

    ]

    const importContent = [
        (<div key={'nums'} className="flex flex-row gap-4">
            <input type="number" className="w-[12rem] sm:w-[8rem] border-solid border-2 border-green p-1 focus:outline-none rounded-xl" min="0" value={countValue} placeholder="Count" required={true} onChange={countChange}></input>
            <input type="number" className="w-[12rem] sm:w-[8rem] border-solid border-2 border-green p-1 focus:outline-none rounded-xl" min="0" value={timeValue} placeholder="Time" required={true} onChange={timeChange}></input>
        </div>),
        ( <div key={'sta-end'} className="flex flex-row">
            <div className="flex flex-col gap-2">
                <input type="date" required={true} onChange={startChange}></input>
                <button onClick={useToday} className="border-solid border-2 border-green mr-2 rounded-xl p-1 bg-red hover:bg-buttonwhite">Use Today</button>
            </div>
            <div className="flex flex-col gap-2">
                <input type="date" value={endValue} onChange={endChange}></input>
                <button onClick={notComplete} className="border-solid border-2 border-green mr-2 rounded-xl p-1 bg-red hover:bg-buttonwhite">Not Complete</button>
            </div>
        </div>)
    ]

    //return page based on importing checkbox value
    return (importValue == 'off') ? (
        <Form formText="Enter Information for a New Hunt" buttonText="Create Hunt" handleSubmit={handleSubmit}>
           {main}
        </Form>
    ) : (
        <Form formText="Enter Information for a New Hunt" buttonText="Create Hunt" handleSubmit={handleSubmit}>
           {main}
           {importContent}
        </Form>
    );
}